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

// ---------- score buffer ----------

const scoreKey = (id) => `pix.score:${id}`;

async function getScore(scoreId) {
  const data = await chrome.storage.local.get(scoreKey(scoreId));
  return data[scoreKey(scoreId)] || null;
}

async function setScore(scoreId, score) {
  await chrome.storage.local.set({ [scoreKey(scoreId)]: score });
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
  } else if (score.state !== 'draft' && score.state !== 'final') {
    // Pre-Slice-0 score in chrome.storage. By construction every
    // score the extension wrote is a recording, so 'draft' is the
    // correct default.
    score.state = 'draft';
  }

  const movement = score.scores[0];
  const prev = movement[movement.length - 1];

  let boundary = 'none';
  if (prev?.captured_from_url) {
    const prevHost = hostOf(prev.captured_from_url);
    const newHost = hostOf(payload.page_url);
    if (prevHost && newHost && prevHost !== newHost) boundary = 'crossing';
  }

  const dialogue = payload.icon
    ? `pix-${payload.icon}${payload.caption ? ' ' + payload.caption : ''}`
    : (payload.caption || '');

  const step = {
    id: newId(),
    step_title: '',
    user: '',
    dialogue,
    system: '',
    note: '',
    captured_at: Date.now(),
    captured_from_url: payload.page_url,
    screenshot,
    focus: payload.focus,
    captured_kind: payload.kind,
    boundary
  };

  movement.push(step);
  score.updated_at = Date.now();
  await setScore(scoreId, score);

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
          if (windowId != null) {
            try {
              screenshot = await chrome.tabs.captureVisibleTab(windowId, {
                format: 'jpeg',
                quality: 70
              });
            } catch (err) {
              console.warn('[pix] captureVisibleTab failed', err);
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
