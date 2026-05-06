// PiX Recorder — popup
// Stage 3: shows recorder state + live step counter while recording.

import { MSG } from '../lib/messages.js';

const startBtn  = document.getElementById('start');
const stopBtn   = document.getElementById('stop');
const statusEl  = document.getElementById('status');
const statusTxt = document.getElementById('status-text');

let lastState = null;
let lastStats = null;

function render() {
  const recording = lastState?.state === 'recording';
  startBtn.disabled = recording;
  stopBtn.disabled  = !recording;
  statusEl.classList.toggle('recording', recording);

  if (recording) {
    const id = lastState.active_score_id || '';
    const steps = lastStats?.steps ?? 0;
    const noun = steps === 1 ? 'step' : 'steps';
    statusTxt.innerHTML = `Recording <code>${id.slice(0, 8)}</code> · ${steps} ${noun}`;
  } else {
    statusTxt.textContent = 'Idle';
  }
}

async function refresh() {
  try {
    const stateResp = await chrome.runtime.sendMessage({ type: MSG.RECORDER_GET_STATE });
    lastState = stateResp?.state || null;
    if (lastState?.state === 'recording') {
      const statsResp = await chrome.runtime.sendMessage({ type: MSG.SCORE_GET_STATS });
      lastStats = statsResp?.stats || { steps: 0 };
    } else {
      lastStats = null;
    }
    render();
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

// Live updates while popup is open.
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === MSG.RECORDER_STATE_CHANGED) {
    lastState = msg.state;
    if (lastState?.state !== 'recording') lastStats = null;
    render();
  } else if (msg?.type === MSG.SCORE_UPDATED) {
    lastStats = msg.stats;
    render();
  }
});

refresh();
