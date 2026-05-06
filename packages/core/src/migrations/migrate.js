// Legacy data migration utilities

import { newId } from '../ids/index.js';

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
 * Strip stable ids from a score for embed URLs.
 * The base64 URL shape is frozen for backwards compatibility with Casiopea
 * embeds (wiki.ead.pucv.cl). Adding fields would expand existing live URLs.
 */
function stripIdsForEmbed(score) {
  return {
    title: score.title,
    layout: score.layout,
    description: score.description,
    scores: (score.scores || []).map(movement =>
      movement.map(({ id, ...rest }) => rest)
    )
  };
}

/**
 * Encode score data to base64 for embed URLs (UTF-8 safe).
 * Always emits the legacy shape — see stripIdsForEmbed above.
 */
export function encodeScoreData(score) {
  const payload = stripIdsForEmbed(score);
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}
