// PiX Recorder — content script
//
// Stage 2: only manages the overlay iframe (the "red light"). Listens
// for OVERLAY_SHOW / OVERLAY_HIDE from the background and queries the
// current recorder state on script load to handle navigations and new
// tabs (RecordingSurvivesNavigationAndTabs).
//
// Click capture / screenshot / step append land in stage 3.

import { MSG } from '../lib/messages.js';

const OVERLAY_ID = 'pix-recorder-overlay-iframe';

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

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === MSG.OVERLAY_SHOW) showOverlay();
  else if (msg?.type === MSG.OVERLAY_HIDE) hideOverlay();
});

// On script load, sync overlay with the current recorder state.
chrome.runtime
  .sendMessage({ type: MSG.RECORDER_GET_STATE })
  .then((response) => {
    if (response?.state?.state === 'recording') showOverlay();
  })
  .catch(() => {});

console.log('[pix-recorder] content script ready on', window.location.href);
