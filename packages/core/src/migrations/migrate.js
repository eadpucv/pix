// Legacy data migration utilities

import { newId } from '../ids/index.js';

// The set of capture-derived fields that historically lived embedded
// in ScoreStep but now belong to a separate ScreenshotTrace entity
// (see packages/extension/interaction-capture.allium). extractTrace
// uses this list to identify pre-migration data.
const CAPTURE_DERIVED_FIELDS = [
  'screenshot',
  'focus',
  'captured_at',
  'captured_from_url',
  'captured_page_title',
  'captured_kind',
  'captured_tab_id',
  'captured_trigger',
  'boundary'
];

/**
 * Migrate a score from legacy format to v2 format.
 * - Fixes the "enviroment" typo to "environment"
 * - Ensures scores is an array of arrays
 * - Adds missing fields with defaults
 * - Backfills stable ids (score.id, movement_ids[], step.id) — required by
 *   the extension's bidirectional re-import (interaction-capture.allium).
 *   Backfill is in-memory; persistence happens when the caller saves.
 */
export function migrateScore(data) {
  if (!data) return null;

  const score = { ...data };

  // Ensure layout
  if (!score.layout) score.layout = 'pix';
  score.layout = score.layout.toLowerCase();
  if (score.layout === 'ip') score.layout = 'pix';

  // Ensure title & description
  if (!score.title) score.title = '';
  if (!score.description) score.description = '';

  // Ensure scores structure
  if (!score.scores) {
    score.scores = [[]];
  } else if (!Array.isArray(score.scores)) {
    score.scores = [[]];
  } else if (score.scores.length > 0 && !Array.isArray(score.scores[0])) {
    // Single flat array of steps — wrap it
    score.scores = [score.scores];
  }

  // Migrate each step (and backfill step.id)
  score.scores = score.scores.map(movement =>
    movement.map(step => migrateStep(step, score.layout))
  );

  // Backfill movement_ids — sidecar parallel to score.scores[][]
  if (!Array.isArray(score.movement_ids) || score.movement_ids.length !== score.scores.length) {
    score.movement_ids = score.scores.map((_, i) => score.movement_ids?.[i] || newId());
  }

  // Backfill score.id (only when missing — preserves existing IndexedDB ids)
  if (!score.id) score.id = newId();

  // Backfill state. Pre-existing scores in user libraries have no state
  // field; treat them as final (authored). Recordings produced by the
  // extension set state='draft' explicitly at creation time.
  if (score.state !== 'draft' && score.state !== 'final') {
    score.state = 'final';
  }

  return score;
}

function migrateStep(step, layout) {
  const migrated = { ...step };

  // Fix enviroment typo
  if ('enviroment' in migrated) {
    migrated.environment = migrated.enviroment;
    delete migrated.enviroment;
  }

  // Ensure all fields exist
  if (migrated.step_title === undefined) migrated.step_title = '';
  if (migrated.user === undefined) migrated.user = '';
  if (migrated.dialogue === undefined) migrated.dialogue = '';
  if (migrated.system === undefined) migrated.system = '';
  if (migrated.note === undefined) migrated.note = '';

  // SB fields
  if (layout === 'sb') {
    if (migrated.environment === undefined) migrated.environment = '';
    if (migrated.supporting_processes === undefined) migrated.supporting_processes = '';
  }

  // Backfill stable id
  if (!migrated.id) migrated.id = newId();

  return migrated;
}

/**
 * Split a raw Score (possibly with capture-derived fields embedded
 * in its steps) into a clean Score and a separate ScreenshotTrace.
 * Returns { score, trace } where trace is null if no step had any
 * capture-derived data.
 *
 * The clean Score has none of: screenshot, focus, captured_*, boundary
 * on its steps. Those live in the Trace's snapshots, linked back to
 * each step by step_id.
 *
 * Idempotent: extracting from an already-clean Score returns
 * { score: <same>, trace: null }.
 */
export function extractTrace(rawScore) {
  if (!rawScore) return { score: null, trace: null };

  const score = { ...rawScore };
  const snapshots = [];
  let earliestCaptureAt = null;

  if (Array.isArray(score.scores)) {
    score.scores = score.scores.map(movement =>
      Array.isArray(movement)
        ? movement.map(step => splitStep(step, snapshots, ts => {
            if (ts != null && (earliestCaptureAt == null || ts < earliestCaptureAt)) {
              earliestCaptureAt = ts;
            }
          }))
        : movement
    );
  }

  if (snapshots.length === 0) return { score, trace: null };

  const trace = {
    score_id: score.id,
    id: newId(),
    snapshots,
    created_at: earliestCaptureAt || Date.now()
  };
  return { score, trace };
}

function splitStep(step, snapshotsAccum, recordCaptureAt) {
  if (!step || typeof step !== 'object') return step;

  const {
    screenshot,
    focus,
    captured_at,
    captured_from_url,
    captured_page_title,
    captured_kind,
    captured_tab_id,
    captured_trigger,
    boundary,
    ...cleanStep
  } = step;

  const hasCaptureData =
    screenshot != null ||
    focus != null ||
    captured_at != null ||
    captured_from_url != null ||
    captured_kind != null ||
    boundary != null;

  if (hasCaptureData) {
    snapshotsAccum.push({
      id: newId(),
      step_id: cleanStep.id,
      screenshot: screenshot ?? null,
      focus: focus ?? null,
      captured_at: captured_at ?? null,
      captured_from_url: captured_from_url ?? null,
      captured_page_title: captured_page_title ?? null,
      captured_kind: captured_kind ?? null,
      captured_tab_id: captured_tab_id ?? null,
      captured_trigger: captured_trigger ?? null,
      boundary: boundary ?? 'none'
    });
    recordCaptureAt(captured_at);
  }

  return cleanStep;
}

/**
 * Parse legacy base64 URL data
 */
export function parseLegacyData(base64String) {
  try {
    // Try UTF-8-aware decode first, fall back to plain atob for legacy data
    let json;
    try {
      json = new TextDecoder().decode(
        Uint8Array.from(atob(base64String), c => c.charCodeAt(0))
      );
    } catch {
      json = atob(base64String);
    }
    const data = JSON.parse(json);
    return migrateScore(data);
  } catch (e) {
    console.error('Failed to parse legacy data:', e);
    return null;
  }
}

/**
 * Strip a score down to the legacy Casiopea-embed shape:
 *   { title, layout, description, scores: [[ { step_title, user, dialogue,
 *     system, note, environment?, supporting_processes? } ]] }
 *
 * Drops everything else — stable ids (Phase C), capture-derived fields
 * from the extension (screenshot, focus, captured_*, boundary), and any
 * other extension-introduced metadata. Keeps the URL shape and size
 * stable for the live wiki.ead.pucv.cl embeds, and prevents 100-300KB
 * JPEG screenshots from blowing the URL up.
 */
function stripForEmbed(score) {
  return {
    title: score.title,
    layout: score.layout,
    description: score.description,
    scores: (score.scores || []).map(movement =>
      movement.map(step => {
        const out = {
          step_title: step.step_title || '',
          user:       step.user       || '',
          dialogue:   step.dialogue   || '',
          system:     step.system     || '',
          note:       step.note       || ''
        };
        if (step.environment !== undefined)          out.environment = step.environment;
        if (step.supporting_processes !== undefined) out.supporting_processes = step.supporting_processes;
        return out;
      })
    )
  };
}

/**
 * Strip a score down to the round-trip shape — like stripForEmbed but
 * keeps stable ids (score.id, movement_ids, step.id). Used by the
 * "open in editor" handoff: the editor picks the score up by its id,
 * so re-opening the same score updates the local copy instead of
 * duplicating it.
 *
 * Capture-derived fields (screenshot, focus, captured_*, boundary) are
 * still dropped — JPEG screenshots blow URL size up by 100-300KB each.
 */
function stripForRoundTrip(score) {
  const out = {
    id: score.id,
    title: score.title,
    layout: score.layout,
    description: score.description,
    movement_ids: score.movement_ids,
    scores: (score.scores || []).map(movement =>
      movement.map(step => {
        const stepOut = {
          id:         step.id,
          step_title: step.step_title || '',
          user:       step.user       || '',
          dialogue:   step.dialogue   || '',
          system:     step.system     || '',
          note:       step.note       || ''
        };
        if (step.environment !== undefined)          stepOut.environment = step.environment;
        if (step.supporting_processes !== undefined) stepOut.supporting_processes = step.supporting_processes;
        return stepOut;
      })
    )
  };
  // Preserve the workflow state (draft | final) through the handoff.
  // Without this, recordings exported by the extension lose their
  // 'draft' marker and land in the editor library's "finished" section
  // instead of "Grabaciones".
  if (score.state === 'draft' || score.state === 'final') {
    out.state = score.state;
  }
  return out;
}

/**
 * Encode score data to base64 for embed URLs (UTF-8 safe).
 * Always emits the legacy shape — see stripForEmbed above.
 */
export function encodeScoreData(score) {
  const payload = stripForEmbed(score);
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/**
 * Encode for the editor's #!/edit/<b64> handoff route.
 * Keeps stable ids so the editor's library can update an existing
 * score on a second handoff instead of creating a duplicate.
 */
export function encodeScoreForEdit(score) {
  const payload = stripForRoundTrip(score);
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}
