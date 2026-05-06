// PiX Recorder — popup
//
// Stage 3.5+: minimal score viewer with "Open in editor" handoff.
// Reads chrome.storage.local directly (popup is in extension context).
//
// "Open in editor" encodes the active/most-recent score via
// encodeScoreData (which strips capture-derived fields and ids — see
// @pix/core/migrations) and opens it in the canonical PiX editor at
// /#!/import/<base64>. The target editor URL is configurable in
// chrome.storage.local under the EDITOR_URL_KEY so users can point at
// a local dev server (http://localhost:5173/pix/) instead of prod.

import { MSG, STORAGE_KEY } from '../lib/messages.js';
import { hostOf } from '../lib/focus.js';
import { encodeScoreData } from '@pix/core/migrations';

const DEFAULT_EDITOR_URL = 'https://eadpucv.github.io/pix/';
const EDITOR_URL_KEY = 'pix.editor_url';

const startBtn   = document.getElementById('start');
const stopBtn    = document.getElementById('stop');
const statusEl   = document.getElementById('status');
const statusTxt  = document.getElementById('status-text');
const stepsTitle = document.getElementById('steps-title');
const stepsList  = document.getElementById('steps-list');
const stepsEmpty = document.getElementById('steps-empty');
const clearBtn   = document.getElementById('clear-btn');
const openBtn    = document.getElementById('open-btn');
const settingsToggle = document.getElementById('settings-toggle');
const settingsRow    = document.getElementById('settings-row');
const editorUrlInput = document.getElementById('editor-url-input');
const settingsSave   = document.getElementById('settings-save');

let lastState   = null;
let activeStats = null;
let viewedScore = null;
let editorUrl   = DEFAULT_EDITOR_URL;

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
  viewedScore = score;
  const hasSteps = !!(score?.scores?.[0]?.length);
  openBtn.hidden = !hasSteps;

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

  stepsList.querySelectorAll('.step').forEach((li, i) => {
    li.addEventListener('click', () => {
      const step = steps[i];
      if (step?.screenshot) chrome.tabs.create({ url: step.screenshot });
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

async function loadEditorUrl() {
  const data = await chrome.storage.local.get(EDITOR_URL_KEY);
  editorUrl = data[EDITOR_URL_KEY] || DEFAULT_EDITOR_URL;
  editorUrlInput.value = editorUrl;
}

async function saveEditorUrl(url) {
  editorUrl = url || DEFAULT_EDITOR_URL;
  await chrome.storage.local.set({ [EDITOR_URL_KEY]: editorUrl });
}

function buildEditorUrl(score) {
  const b64 = encodeScoreData(score);
  // Editor expects a hash route #!/import/<b64>. Trailing slash on
  // editorUrl is normalised so both 'https://x/pix' and 'https://x/pix/'
  // produce a valid URL.
  const base = editorUrl.replace(/\/+$/, '');
  return `${base}/#!/import/${b64}`;
}

// ---- event wiring ----

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

openBtn.addEventListener('click', () => {
  if (!viewedScore) return;
  chrome.tabs.create({ url: buildEditorUrl(viewedScore) });
});

settingsToggle.addEventListener('click', () => {
  settingsRow.hidden = !settingsRow.hidden;
});

settingsSave.addEventListener('click', async () => {
  await saveEditorUrl(editorUrlInput.value.trim());
  settingsRow.hidden = true;
});

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

loadEditorUrl();
refreshAll();
