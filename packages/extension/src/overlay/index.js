// PiX Recorder — overlay
// Injected as iframe (web_accessible_resource) into every tab while
// recording. Acts as a persistent stop toggle: click anywhere on the
// pill stops the recording session.

import { MSG } from '../lib/messages.js';

const btn = document.getElementById('stop-btn');

async function stopRecording() {
  btn.style.pointerEvents = 'none';
  try {
    await chrome.runtime.sendMessage({ type: MSG.RECORDER_STOP });
  } catch (err) {
    console.error('[pix-recorder] stop failed', err);
    btn.style.pointerEvents = '';
  }
  // Background broadcasts OVERLAY_HIDE to all content scripts, which
  // remove this iframe — no manual cleanup needed here.
}

btn.addEventListener('click', stopRecording);
btn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    stopRecording();
  }
});
