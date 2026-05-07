// PiX — content script
//
// Stage 3+: click capture + on-page overlay widget (shadow DOM).
//
// Implements (per interaction-capture.allium):
//   - external entity InteractiveElement
//   - @invariant ElementInteractivityCriteria  (via lib/classify isInteractive)
//   - rule UserClickCapturesStep                (caught here, completed by bg)
//   - @guarantee RecordingStateAlwaysVisible    (via the floating widget)
//
// Screenshots happen in the background — content scripts can't call
// chrome.tabs.captureVisibleTab. So this script sends the click payload
// (kind, focus, page url) to the background, which adds the screenshot
// and persists the ScoreStep.

import { MSG } from '../lib/messages.js';
import {
  classifyElement,
  pixogramForKind,
  findInteractiveAncestor,
  captionFor
} from '../lib/classify.js';
import { focusFromRect } from '../lib/focus.js';
import { showOverlay, hideOverlay, refreshCount, isOverlayHost } from './overlay.js';

let isRecording = false;

// Capture-phase click listener. Runs before page handlers; we don't
// preventDefault, so the page's behavior is intact.
window.addEventListener('click', (e) => {
  if (!isRecording) return;

  // Skip clicks on our own widget. Closed shadow root re-targets the
  // event to the host element, so checking e.target is enough.
  if (isOverlayHost(e.target)) return;

  const el = findInteractiveAncestor(e.target);
  if (!el) return;

  const kind = classifyElement(el);
  const rect = el.getBoundingClientRect();
  const focus = focusFromRect(
    { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    { width: window.innerWidth, height: window.innerHeight }
  );

  chrome.runtime.sendMessage({
    type: MSG.STEP_CAPTURE_REQUEST,
    payload: {
      kind,
      icon: pixogramForKind(kind),
      caption: captionFor(el, kind),
      focus,
      page_url: window.location.href
    }
  }).catch(() => {});
}, { capture: true, passive: true });

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === MSG.OVERLAY_SHOW) {
    showOverlay();
    isRecording = true;
  } else if (msg?.type === MSG.OVERLAY_HIDE) {
    hideOverlay();
    isRecording = false;
  } else if (msg?.type === MSG.SCORE_UPDATED) {
    refreshCount();
  }
});

// On script load (every navigation injects a fresh content script),
// sync overlay + isRecording with the persisted recorder state.
chrome.runtime
  .sendMessage({ type: MSG.RECORDER_GET_STATE })
  .then((response) => {
    if (response?.state?.state === 'recording') {
      showOverlay();
      isRecording = true;
    }
  })
  .catch(() => {});

console.log('[pix] content script ready on', window.location.href);
