// PiX — background service worker (MV3)
//
// Owns the Recorder state machine and the active Score buffer. State
// persists in chrome.storage.local so it survives service worker
// termination (MV3 SW gets killed when idle).
//
// Implements (per interaction-capture.allium):
//   - entity Recorder, entity Score, entity Movement, entity ScoreStep
//   - rule UserStartsRecording, UserStopsRecording, UserClickCapturesStep
//   - @invariant SingleActiveScore
//   - @invariant RecordingSurvivesNavigationAndTabs
//   - @invariant CaptureDerivedFieldsImmutable (append-only writes)
//   - invariant BoundaryReflectsHostChange     (via lib/focus hostOf)
//
// Stage 3: capture pipeline complete. Stage 4 swaps chrome.storage to
// IndexedDB via @pix/core/storage and exposes the score library in the popup.

import { newId } from '@pix/core/ids';
import { extractTrace } from '@pix/core/migrations';
import { MSG, STORAGE_KEY } from '../lib/messages.js';
import { reduce, initialRecorder } from '../lib/recorder.js';
import { hostOf } from '../lib/focus.js';

console.log('[pix] background service worker booted');

// ---------- recorder state ----------

async function getState() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  return data[STORAGE_KEY] || initialRecorder;
}

async function setState(next) {
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  syncBadge(next);
  refreshContextMenuVisibility();
  chrome.runtime
    .sendMessage({ type: MSG.RECORDER_STATE_CHANGED, state: next })
    .catch(() => {});
}

// Toolbar badge — belt-and-suspenders for RecordingStateAlwaysVisible
// in tabs where the overlay can't be injected (chrome://, internal pages).
function syncBadge(state) {
  if (state?.state === 'recording') {
    chrome.action.setBadgeText({ text: 'REC' });
    chrome.action.setBadgeBackgroundColor({ color: '#ff3b30' });
    chrome.action.setBadgeTextColor?.({ color: '#ffffff' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// On service-worker boot (cold start while idle, or wake-up while
// recording), rehydrate the badge from persisted state.
getState().then(syncBadge);

// ---------- right-click context menu ----------
//
// The action button is not pinned to the toolbar by default in Chrome,
// so right-clicking the page is the discovery surface for PiX. The
// labels switch between Start/Stop based on the current recorder state.

const MENU_IDS = {
  START:   'pix-start',
  STOP:    'pix-stop',
  LIBRARY: 'pix-library'
};

// Serialize buildContextMenus calls. The service worker can fire it
// from onInstalled, onStartup, and the unconditional boot path; without
// this, two interleaved runs each call create() after the same removeAll
// resolves and the second one collides on the still-registered ids.
let contextMenuBuildInFlight = null;

function buildContextMenus() {
  if (!chrome.contextMenus) return Promise.resolve();
  if (contextMenuBuildInFlight) return contextMenuBuildInFlight;
  contextMenuBuildInFlight = doBuildContextMenus()
    .finally(() => { contextMenuBuildInFlight = null; });
  return contextMenuBuildInFlight;
}

async function doBuildContextMenus() {
  await new Promise((resolve) => chrome.contextMenus.removeAll(resolve));
  const state = await getState();
  const recording = state?.state === 'recording';
  // 'page' covers the right-click on any page. We avoid 'action' here
  // because MV2 (Firefox) doesn't accept it, and 'page' is the surface
  // we care about anyway: the user wants the menu without having to
  // hunt for the toolbar icon.
  const baseContexts = ['page', 'selection', 'link', 'image'];
  chrome.contextMenus.create({
    id: MENU_IDS.START,
    title: 'PiX — Iniciar grabación',
    contexts: baseContexts,
    visible: !recording
  });
  chrome.contextMenus.create({
    id: MENU_IDS.STOP,
    title: 'PiX — Detener grabación',
    contexts: baseContexts,
    visible: recording
  });
  chrome.contextMenus.create({
    id: MENU_IDS.LIBRARY,
    title: 'PiX — Abrir biblioteca de grabaciones',
    contexts: baseContexts
  });
}

async function refreshContextMenuVisibility() {
  if (!chrome.contextMenus) return;
  const state = await getState();
  const recording = state?.state === 'recording';
  chrome.contextMenus.update(MENU_IDS.START, { visible: !recording });
  chrome.contextMenus.update(MENU_IDS.STOP,  { visible:  recording });
}

if (chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => { buildContextMenus(); });
}
if (chrome.runtime.onStartup) {
  chrome.runtime.onStartup.addListener(() => { buildContextMenus(); });
}
// Also rebuild on cold service-worker boot — the menu is owned by the
// browser process but onInstalled only fires once per install/update.
buildContextMenus();

if (chrome.contextMenus?.onClicked) {
  chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === MENU_IDS.START) {
      await applyEvent({ type: 'start', score_id: newId() });
      openManagerTab({ active: false }).catch(() => {});
    } else if (info.menuItemId === MENU_IDS.STOP) {
      await applyEvent({ type: 'stop' });
    } else if (info.menuItemId === MENU_IDS.LIBRARY) {
      await openManagerTab({ active: true });
    }
  });
}

// Open the manager (full-page library) tab. If one is already open we
// reuse it; otherwise we create a new one. `active` controls whether
// the new tab takes focus — the auto-open on RECORDER_START passes
// false so the user keeps recording on the page they were on.
async function openManagerTab({ active = true } = {}) {
  const url = chrome.runtime.getURL('manager/index.html');
  const tabs = await chrome.tabs.query({ url });
  if (tabs?.length) {
    const tab = tabs[0];
    if (active) {
      await chrome.tabs.update(tab.id, { active: true });
      if (tab.windowId != null) {
        await chrome.windows.update(tab.windowId, { focused: true });
      }
    }
    return tab;
  }
  return chrome.tabs.create({ url, active });
}

async function applyEvent(event) {
  const current = await getState();
  const { recorder, effects } = reduce(current, event);
  await setState(recorder);
  for (const effect of effects) {
    await applyEffect(effect);
  }
  return recorder;
}

async function applyEffect(effect) {
  switch (effect.kind) {
    case 'show_overlay':
      await broadcastToTabs({ type: MSG.OVERLAY_SHOW });
      break;
    case 'hide_overlay':
      await broadcastToTabs({ type: MSG.OVERLAY_HIDE });
      break;
    case 'persist_recorder':
      // already handled by setState
      break;
  }
}

async function broadcastToTabs(message) {
  const tabs = await chrome.tabs.query({});
  await Promise.all(
    tabs
      .filter(t => t.id != null && t.url && /^https?:/.test(t.url))
      .map(t => chrome.tabs.sendMessage(t.id, message).catch(() => {}))
  );
}

// Derive a human-readable section title from the captured page.
// Cadena: document.title → primer <h1> → último segmento del path.
// Used by appendStep when a section break is detected.
function deriveSectionTitle(payload) {
  const t = (payload.page_title || '').trim();
  if (t) return t.slice(0, 120);
  const h1 = (payload.page_h1 || '').trim();
  if (h1) return h1.slice(0, 120);
  try {
    const u = new URL(payload.page_url);
    const segs = u.pathname.split('/').filter(Boolean);
    if (segs.length) return humanize(segs[segs.length - 1]).slice(0, 120);
    return u.hostname;
  } catch {
    return '';
  }
}

function humanize(s) {
  return s
    .replace(/[_-]+/g, ' ')
    .replace(/\.[a-z0-9]{1,5}$/i, '') // strip .html / .php / etc
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ---------- score + trace buffer ----------
//
// Slice 1 split: chrome.storage holds two keys per recording:
//   pix.score:<id>  — clean Score (no capture-derived fields on steps)
//   pix.trace:<id>  — ScreenshotTrace { score_id, snapshots: [...] }
//
// Pre-Slice-1 entries had everything embedded in the Score's steps.
// getScore migrates lazily on read: any embedded capture-derived data
// is split out into a Trace and persisted separately, then the clean
// Score is returned.

const scoreKey = (id) => `pix.score:${id}`;
const traceKey = (id) => `pix.trace:${id}`;

async function getRawScore(scoreId) {
  const data = await chrome.storage.local.get(scoreKey(scoreId));
  return data[scoreKey(scoreId)] || null;
}

async function setRawScore(scoreId, score) {
  await chrome.storage.local.set({ [scoreKey(scoreId)]: score });
}

async function getTrace(scoreId) {
  const data = await chrome.storage.local.get(traceKey(scoreId));
  return data[traceKey(scoreId)] || null;
}

async function setTrace(scoreId, trace) {
  await chrome.storage.local.set({ [traceKey(scoreId)]: trace });
}

async function deleteTrace(scoreId) {
  await chrome.storage.local.remove(traceKey(scoreId));
}

// Read a Score, splitting any legacy embedded capture-derived data
// out into a Trace on the fly. The split Trace is persisted before
// returning so subsequent reads see clean data.
async function getScore(scoreId) {
  const raw = await getRawScore(scoreId);
  if (!raw) return null;

  const { score, trace } = extractTrace(raw);
  if (trace) {
    // Merge with any existing trace (new recordings start without
    // legacy data, but a partial migration could still be in flight).
    const existing = await getTrace(scoreId);
    if (existing && Array.isArray(existing.snapshots)) {
      // Dedup by step_id — keep existing entries, append new ones
      // for steps that lack a snapshot yet.
      const seen = new Set(existing.snapshots.map(s => s.step_id));
      for (const s of trace.snapshots) {
        if (!seen.has(s.step_id)) existing.snapshots.push(s);
      }
      await setTrace(scoreId, existing);
    } else {
      await setTrace(scoreId, trace);
    }
    // Persist the cleaned score so we don't re-extract on every read.
    if (score.state !== 'draft' && score.state !== 'final') score.state = 'draft';
    await setRawScore(scoreId, score);
    return score;
  }

  // Already-clean score; just normalise state if missing.
  if (raw.state !== 'draft' && raw.state !== 'final') {
    raw.state = 'draft';
    await setRawScore(scoreId, raw);
  }
  return raw;
}

async function getStats(scoreId) {
  const score = await getScore(scoreId);
  return { steps: score?.scores?.[0]?.length || 0 };
}

async function appendStep(scoreId, payload, screenshot) {
  let score = await getScore(scoreId);
  if (!score) {
    score = {
      id: scoreId,
      title: '',
      layout: 'pix',
      description: '',
      // Recordings start as drafts. The user promotes them to final
      // in the editor after refining the partitura by hand.
      state: 'draft',
      movement_ids: [newId()],
      scores: [[]],
      created_at: Date.now(),
      updated_at: Date.now()
    };
  }

  let trace = await getTrace(scoreId);
  if (!trace) {
    trace = {
      score_id: scoreId,
      id: newId(),
      snapshots: [],
      created_at: Date.now()
    };
  }

  const movement = score.scores[0];
  const prevSnapshot = trace.snapshots[trace.snapshots.length - 1];

  let boundary = 'none';
  if (prevSnapshot?.captured_from_url) {
    const prevHost = hostOf(prevSnapshot.captured_from_url);
    const newHost = hostOf(payload.page_url);
    if (prevHost && newHost && prevHost !== newHost) boundary = 'crossing';
  }

  // Section break detection — see @invariant SectionStartsOnScreenChange.
  // The first captured step always starts a section. After that, a new
  // section begins when the URL or document.title changes vs the previous
  // snapshot. step_title carries the new section's name and the editor
  // renders a divider on top of the column.
  const newPageTitle = payload.page_title || '';
  const isFirstStep = !prevSnapshot;
  const urlChanged = !!prevSnapshot && prevSnapshot.captured_from_url !== payload.page_url;
  const titleChanged = !!prevSnapshot && (prevSnapshot.captured_page_title || '') !== newPageTitle;
  const sectionBreak = isFirstStep || urlChanged || titleChanged;
  const stepTitle = sectionBreak ? deriveSectionTitle(payload) : '';

  // Navigation marker in the system cell when the URL changed. Same
  // condition as before; section break is independent of this — a
  // pure title change without URL change still creates a section but
  // doesn't add pix-page to the system cell.
  const navigationCell = urlChanged
    ? `pix-page ${payload.page_url}`
    : '';

  const dialogue = payload.icon
    ? `pix-${payload.icon}${payload.caption ? ' ' + payload.caption : ''}`
    : (payload.caption || '');

  // Clean ScoreStep — partitura content only.
  const step = {
    id: newId(),
    step_title: stepTitle,
    user: '',
    dialogue,
    system: navigationCell,
    note: ''
  };

  // TraceSnapshot — capture-derived fields, linked by step.id.
  const snapshot = {
    id: newId(),
    step_id: step.id,
    screenshot,
    focus: payload.focus || null,
    captured_at: Date.now(),
    captured_from_url: payload.page_url,
    captured_page_title: payload.page_title || null,
    captured_kind: payload.kind || null,
    captured_tab_id: payload.tab_id ?? null,
    captured_trigger: payload.trigger || 'click',
    boundary
  };

  movement.push(step);
  trace.snapshots.push(snapshot);
  score.updated_at = Date.now();

  await setRawScore(scoreId, score);
  await setTrace(scoreId, trace);

  chrome.runtime
    .sendMessage({
      type: MSG.SCORE_UPDATED,
      score_id: scoreId,
      stats: { steps: movement.length }
    })
    .catch(() => {});
}

// ---------- message routing ----------

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      switch (msg?.type) {
        case MSG.RECORDER_START: {
          const state = await applyEvent({ type: 'start', score_id: newId() });
          // Open the manager in the background so the user gets a
          // visible canvas of the steps as they pile up. Doesn't take
          // focus — the user is recording on another tab.
          openManagerTab({ active: false }).catch(() => {});
          sendResponse({ ok: true, state });
          break;
        }
        case MSG.RECORDER_STOP: {
          const state = await applyEvent({ type: 'stop' });
          sendResponse({ ok: true, state });
          break;
        }
        case MSG.RECORDER_GET_STATE: {
          const state = await getState();
          sendResponse({ ok: true, state });
          break;
        }
        case MSG.SCORE_GET_STATS: {
          const state = await getState();
          const stats = state.active_score_id
            ? await getStats(state.active_score_id)
            : { steps: 0 };
          sendResponse({ ok: true, stats });
          break;
        }
        case MSG.STEP_CAPTURE_REQUEST: {
          const state = await getState();
          if (state.state !== 'recording' || !state.active_score_id) {
            sendResponse({ ok: false, error: 'not recording' });
            break;
          }
          let screenshot = null;
          const windowId = sender?.tab?.windowId;
          const tabId    = sender?.tab?.id;
          if (windowId != null) {
            // Hide the dot, capture, then restore. Without this the red
            // recording indicator ends up baked into every screenshot.
            if (tabId != null) {
              await chrome.tabs
                .sendMessage(tabId, { type: MSG.OVERLAY_PRE_CAPTURE })
                .catch(() => {});
            }
            try {
              screenshot = await chrome.tabs.captureVisibleTab(windowId, {
                format: 'jpeg',
                quality: 70
              });
            } catch (err) {
              console.warn('[pix] captureVisibleTab failed', err);
            }
            if (tabId != null) {
              chrome.tabs
                .sendMessage(tabId, { type: MSG.OVERLAY_POST_CAPTURE })
                .catch(() => {});
            }
          }
          await appendStep(state.active_score_id, msg.payload, screenshot);
          sendResponse({ ok: true });
          break;
        }
        default:
          sendResponse({ ok: false, error: 'unknown message' });
      }
    } catch (err) {
      console.error('[pix] message handler failed', err);
      sendResponse({ ok: false, error: String(err) });
    }
  })();
  return true; // signal async sendResponse
});

// New tab finished loading: if recording, ensure overlay is shown there.
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status !== 'complete') return;
  if (!tab.url || !/^https?:/.test(tab.url)) return;
  getState().then(state => {
    if (state.state === 'recording') {
      chrome.tabs.sendMessage(tabId, { type: MSG.OVERLAY_SHOW }).catch(() => {});
    }
  });
});
