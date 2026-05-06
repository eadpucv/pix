// PiX Recorder — content script
//
// Stage 3: click capture + overlay management.
//
// Implements (per interaction-capture.allium):
//   - external entity InteractiveElement
//   - @invariant ElementInteractivityCriteria  (via lib/classify isInteractive)
//   - rule UserClickCapturesStep                (caught here, completed by bg)
//   - @guarantee RecordingStateAlwaysVisible    (via overlay iframe)
//
// The screenshot itself happens in the background — content scripts can't
// call chrome.tabs.captureVisibleTab. So this script sends the click
// payload (kind, focus, page url) to the background, which adds the
// screenshot and persists the ScoreStep.

import { MSG } from '../lib/messages.js';
import {
  classifyElement,
  pixogramForKind,
  findInteractiveAncestor,
  captionFor
} from '../lib/classify.js';
import { focusFromRect } from '../lib/focus.js';

const OVERLAY_ID = 'pix-recorder-overlay-iframe';
let isRecording = false;

function showOverlay() {
  if (document.getElementById(OVERLAY_ID)) return;
  const iframe = document.createElement('iframe');
  iframe.id = OVERLAY_ID;
  iframe.src = chrome.runtime.getURL('overlay/index.html');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = [
    'position: fixed',
    'top: 0',
    'right: 0',
    'width: 90px',
    'height: 36px',
    'border: 0',
    'background: transparent',
    'z-index: 2147483647',
    'pointer-events: none',
    'color-scheme: normal'
  ].join(';');
  (document.body || document.documentElement).appendChild(iframe);
}

function hideOverlay() {
  const el = document.getElementById(OVERLAY_ID);
  if (el) el.remove();
}

// Capture-phase click listener. Catches the event before page-level
// handlers; we don't preventDefault, so the page's behavior is intact.
window.addEventListener('click', (e) => {
  if (!isRecording) return;

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

console.log('[pix-recorder] content script ready on', window.location.href);
