// PiX Recorder — popup
//
// Stage 3.5: minimal score viewer. Reads chrome.storage.local directly
// (popup is in extension context). Shows the active or most recent
// score's steps with a thumbnail + dialogue caption + crossing marker.
// Click a step to open its full-resolution screenshot in a new tab.

import { MSG, STORAGE_KEY } from '../lib/messages.js';
import { hostOf } from '../lib/focus.js';

const startBtn   = document.getElementById('start');
const stopBtn    = document.getElementById('stop');
const statusEl   = document.getElementById('status');
const statusTxt  = document.getElementById('status-text');
const stepsTitle = document.getElementById('steps-title');
const stepsList  = document.getElementById('steps-list');
const stepsEmpty = document.getElementById('steps-empty');
const clearBtn   = document.getElementById('clear-btn');

let lastState  = null;
let activeStats = null;

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s ?? '';
  return d.innerHTML;
}

function renderHeader() {
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

async function loadAllScores() {
  const all = await chrome.storage.local.get(null);
  const scores = [];
  for (const [k, v] of Object.entries(all)) {
    if (k.startsWith('pix.score:') && v?.scores) scores.push(v);
  }
  scores.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
  return scores;
}

function pickViewedScore(scores) {
  if (lastState?.active_score_id) {
    const active = scores.find(s => s.id === lastState.active_score_id);
    if (active) return active;
  }
  return scores[0] || null;
}

function renderSteps(score) {
  if (!score) {
    stepsTitle.textContent = 'No score yet';
    stepsList.innerHTML = '';
    stepsEmpty.hidden = true;
    return;
  }

  const steps = score.scores?.[0] || [];
  const recording = lastState?.active_score_id === score.id;
  const idShort = score.id.slice(0, 8);
  const noun = steps.length === 1 ? 'step' : 'steps';
  stepsTitle.textContent = `${recording ? 'Recording ' : ''}${idShort} · ${steps.length} ${noun}`;

  if (steps.length === 0) {
    stepsList.innerHTML = '';
    stepsEmpty.hidden = false;
    return;
  }

  stepsEmpty.hidden = true;
  stepsList.innerHTML = steps.map((step, i) => {
    const cls = step.boundary === 'crossing' ? 'step crossing' : 'step';
    const thumb = step.screenshot || '';
    const host = hostOf(step.captured_from_url) || '';
    const crossingTag = step.boundary === 'crossing'
      ? '<span class="crossing-tag">↪ crossing</span>'
      : '';
    return `
      <li class="${cls}" data-step-id="${escHtml(step.id)}">
        <span class="index">${i + 1}</span>
        ${thumb ? `<img class="thumb" src="${escHtml(thumb)}" alt="">` : '<span class="thumb"></span>'}
        <div class="body">
          <div class="caption">${escHtml(step.dialogue || '(no caption)')}</div>
          <div class="meta">${escHtml(host)}${crossingTag}</div>
        </div>
      </li>
    `;
  }).join('');

  // Click a step → open its screenshot in a new tab.
  stepsList.querySelectorAll('.step').forEach((li, i) => {
    li.addEventListener('click', () => {
      const step = steps[i];
      if (step?.screenshot) {
        chrome.tabs.create({ url: step.screenshot });
      }
    });
  });
}

async function refreshAll() {
  try {
    const stateResp = await chrome.runtime.sendMessage({ type: MSG.RECORDER_GET_STATE });
    lastState = stateResp?.state || null;
    if (lastState?.state === 'recording') {
      const statsResp = await chrome.runtime.sendMessage({ type: MSG.SCORE_GET_STATS });
      activeStats = statsResp?.stats || { steps: 0 };
    } else {
      activeStats = null;
    }
    renderHeader();

    const scores = await loadAllScores();
    renderSteps(pickViewedScore(scores));
  } catch (err) {
    statusTxt.textContent = 'Error talking to background';
    console.error(err);
  }
}

startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;
  await chrome.runtime.sendMessage({ type: MSG.RECORDER_START });
  await refreshAll();
});

stopBtn.addEventListener('click', async () => {
  stopBtn.disabled = true;
  await chrome.runtime.sendMessage({ type: MSG.RECORDER_STOP });
  await refreshAll();
});

clearBtn.addEventListener('click', async () => {
  if (!confirm('Delete every captured score from storage?')) return;
  const all = await chrome.storage.local.get(null);
  const keys = Object.keys(all).filter(k => k.startsWith('pix.score:'));
  if (keys.length) await chrome.storage.local.remove(keys);
  await refreshAll();
});

// Live updates while popup is open.
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === MSG.RECORDER_STATE_CHANGED) {
    lastState = msg.state;
    if (lastState?.state !== 'recording') activeStats = null;
    renderHeader();
    refreshAll();
  } else if (msg?.type === MSG.SCORE_UPDATED) {
    activeStats = msg.stats;
    renderHeader();
    refreshAll();
  }
});

refreshAll();
