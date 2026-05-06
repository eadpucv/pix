// PiX Recorder — popup
//
// Minimal: status + Start/Stop + a link to the full-page library.
// The score list, step thumbnails, settings and "open in editor"
// handoff live in the manager page (src/manager/index.html).
// Browser action popups close on focus loss; the manager doesn't.

import { MSG } from '../lib/messages.js';

const startBtn  = document.getElementById('start');
const stopBtn   = document.getElementById('stop');
const statusEl  = document.getElementById('status');
const statusTxt = document.getElementById('status-text');
const libraryBtn = document.getElementById('open-library');

let lastState   = null;
let activeStats = null;

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s ?? '';
  return d.innerHTML;
}

function render() {
  const recording = lastState?.state === 'recording';
  startBtn.disabled = recording;
  stopBtn.disabled  = !recording;
  statusEl.classList.toggle('recording', recording);
  if (recording) {
    const id = lastState.active_score_id || '';
    const steps = activeStats?.steps ?? 0;
    const noun  = steps === 1 ? 'step' : 'steps';
    statusTxt.innerHTML = `Recording <code>${escHtml(id.slice(0, 8))}</code> · ${steps} ${noun}`;
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
      activeStats = statsResp?.stats || { steps: 0 };
    } else {
      activeStats = null;
    }
    render();
  } catch (err) {
    statusTxt.textContent = 'Error talking to background';
    console.error(err);
  }
}

async function openLibrary() {
  const url = chrome.runtime.getURL('manager/index.html');
  // Reuse an existing manager tab if one is already open; otherwise
  // create a new one. Avoids stacking duplicates on each click.
  const tabs = await chrome.tabs.query({ url });
  if (tabs?.length) {
    const tab = tabs[0];
    await chrome.tabs.update(tab.id, { active: true });
    if (tab.windowId != null) await chrome.windows.update(tab.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url });
  }
  window.close();
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

libraryBtn.addEventListener('click', openLibrary);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === MSG.RECORDER_STATE_CHANGED) {
    lastState = msg.state;
    if (lastState?.state !== 'recording') activeStats = null;
    render();
  } else if (msg?.type === MSG.SCORE_UPDATED) {
    activeStats = msg.stats;
    render();
  }
});

refresh();
