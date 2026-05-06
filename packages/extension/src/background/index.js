// PiX Recorder — background service worker (MV3)
//
// Owns the Recorder state machine. State persists in chrome.storage.local
// so it survives service worker termination (MV3 SW gets killed when idle).
//
// Implements (per interaction-capture.allium):
//   - entity Recorder
//   - rule UserStartsRecording, UserStopsRecording
//   - @invariant SingleActiveScore
//   - @invariant RecordingSurvivesNavigationAndTabs
//
// Stage 2: lifecycle only — start, stop, persist, broadcast overlay.
// Click capture and ScoreStep persistence land in stage 3.

import { newId } from '@pix/core/ids';
import { MSG, STORAGE_KEY } from '../lib/messages.js';
import { reduce, initialRecorder } from '../lib/recorder.js';

console.log('[pix-recorder] background service worker booted');

async function getState() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  return data[STORAGE_KEY] || initialRecorder;
}

async function setState(next) {
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  // Best-effort broadcast to popup if open. Errors when no listeners.
  chrome.runtime
    .sendMessage({ type: MSG.RECORDER_STATE_CHANGED, state: next })
    .catch(() => {});
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

// Popup or content scripts asking us to do something.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      switch (msg?.type) {
        case MSG.RECORDER_START: {
          // Stage 2: spin up an ad-hoc Score id. Real Score creation
          // (with title, layout, IndexedDB persistence) lands in stage 4
          // when the popup grows a library.
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
        default:
          sendResponse({ ok: false, error: 'unknown message' });
      }
    } catch (err) {
      console.error('[pix-recorder] message handler failed', err);
      sendResponse({ ok: false, error: String(err) });
    }
  })();
  return true; // signal async sendResponse
});

// New tab finished loading: if recording, ask its content script to show
// the overlay. Same logic for top-level navigations within an existing
// tab — the content script is re-injected on document_idle and its own
// boot path also queries getState, so this is belt-and-suspenders.
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status !== 'complete') return;
  if (!tab.url || !/^https?:/.test(tab.url)) return;
  getState().then(state => {
    if (state.state === 'recording') {
      chrome.tabs.sendMessage(tabId, { type: MSG.OVERLAY_SHOW }).catch(() => {});
    }
  });
});
