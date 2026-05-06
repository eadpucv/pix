// PiX Recorder — popup
// Stage 2: shows recorder state, drives Start / Stop. The full score
// library + editor lands in stage 4 once stage 3 actually captures clicks.

import { MSG } from '../lib/messages.js';

const startBtn  = document.getElementById('start');
const stopBtn   = document.getElementById('stop');
const statusEl  = document.getElementById('status');
const statusTxt = document.getElementById('status-text');

function render(state) {
  const recording = state?.state === 'recording';
  startBtn.disabled = recording;
  stopBtn.disabled  = !recording;
  statusEl.classList.toggle('recording', recording);
  if (recording) {
    const id = state.active_score_id || '';
    statusTxt.innerHTML = `Recording — score <code>${id.slice(0, 8)}</code>`;
  } else {
    statusTxt.textContent = 'Idle';
  }
}

async function refresh() {
  try {
    const response = await chrome.runtime.sendMessage({ type: MSG.RECORDER_GET_STATE });
    render(response?.state);
  } catch (err) {
    statusTxt.textContent = 'Error talking to background';
    console.error(err);
  }
}

startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;
  await chrome.runtime.sendMessage({ type: MSG.RECORDER_START });
  await refresh();
});

stopBtn.addEventListener('click', async () => {
  stopBtn.disabled = true;
  await chrome.runtime.sendMessage({ type: MSG.RECORDER_STOP });
  await refresh();
});

// Live updates if the background changes state while popup is open.
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === MSG.RECORDER_STATE_CHANGED) render(msg.state);
});

refresh();
