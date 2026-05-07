// PiX — manager (full-page library).
//
// Opened from the popup with chrome.tabs.create. Stays as a real tab
// that doesn't lose focus when the user clicks elsewhere — the popup's
// auto-close behavior is exactly what we wanted to escape.
//
// Reads chrome.storage.local directly. Lists every captured score and,
// on expansion, the steps with their thumbnails. Each score has its
// own "Open in editor" handoff and delete affordance.

import { MSG, STORAGE_KEY } from '../lib/messages.js';
import { hostOf } from '../lib/focus.js';
import { encodeScoreForEdit } from '@pix/core/migrations';

const DEFAULT_EDITOR_URL = 'https://eadpucv.github.io/pix/';
const EDITOR_URL_KEY = 'pix.editor_url';

const startBtn   = document.getElementById('start');
const stopBtn    = document.getElementById('stop');
const statusEl   = document.getElementById('status');
const statusTxt  = document.getElementById('status-text');
const scoresList = document.getElementById('scores-list');
const emptyEl    = document.getElementById('empty');
const editorUrlInput = document.getElementById('editor-url-input');
const settingsSave   = document.getElementById('settings-save');
const clearAllBtn    = document.getElementById('clear-all');

let lastState   = null;
let activeStats = null;
let editorUrl   = DEFAULT_EDITOR_URL;
let expanded    = new Set();

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
  const tracesById = new Map();
  for (const [k, v] of Object.entries(all)) {
    if (k.startsWith('pix.score:') && v?.scores) {
      // Anything stored in chrome.storage by this extension is a
      // recording — the extension is the only writer. Pre-Slice-0
      // scores have no state field; default to 'draft'.
      if (v.state !== 'draft' && v.state !== 'final') v.state = 'draft';
      scores.push(v);
    } else if (k.startsWith('pix.trace:') && v?.snapshots) {
      tracesById.set(v.score_id, v);
    }
  }
  scores.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
  return { scores, tracesById };
}

// Lookup helper: build a step_id → snapshot map for a given score.
// Falls back to legacy data on the step itself when no trace exists
// (transitional state during Slice 1 migration).
function snapshotsByStepId(score, trace) {
  const map = new Map();
  if (trace?.snapshots) {
    for (const s of trace.snapshots) {
      if (s.step_id) map.set(s.step_id, s);
    }
  }
  // Legacy fallback: if a step still has embedded screenshot/focus
  // (pre-migration data), synthesize a pseudo-snapshot so the UI
  // works while the next read finishes splitting it.
  for (const movement of (score.scores || [])) {
    for (const step of (movement || [])) {
      if (!map.has(step.id) && step.screenshot) {
        map.set(step.id, {
          screenshot: step.screenshot,
          focus: step.focus,
          captured_from_url: step.captured_from_url,
          captured_at: step.captured_at,
          captured_kind: step.captured_kind,
          boundary: step.boundary || 'none'
        });
      }
    }
  }
  return map;
}

function buildEditorUrl(score) {
  const b64 = encodeScoreForEdit(score);
  const base = editorUrl.replace(/\/+$/, '');
  return `${base}/#!/edit/${b64}`;
}

function renderScores(scores, tracesById) {
  if (!scores.length) {
    scoresList.innerHTML = '';
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  scoresList.innerHTML = scores.map(score => {
    const steps = score.scores?.[0] || [];
    const trace = tracesById.get(score.id);
    const stepSnapshot = snapshotsByStepId(score, trace);
    const recording = lastState?.active_score_id === score.id;
    const isExpanded = expanded.has(score.id);
    const idShort = score.id.slice(0, 8);
    const noun = steps.length === 1 ? 'step' : 'steps';
    const updated = score.updated_at ? new Date(score.updated_at).toLocaleString() : '';

    return `
      <div class="score-card ${isExpanded ? 'expanded' : ''}" data-score-id="${escHtml(score.id)}">
        <div class="score-header" data-action="toggle">
          ${recording ? '<span class="score-recording-dot" title="Currently recording"></span>' : ''}
          <span class="score-id">${escHtml(idShort)}</span>
          <span class="score-meta">${steps.length} ${noun}${updated ? ' · ' + escHtml(updated) : ''}</span>
          <div class="score-actions" data-stop-toggle>
            <button data-action="open">Open in editor ↗</button>
            <button class="danger" data-action="delete">Delete</button>
          </div>
          <span class="chevron">›</span>
        </div>
        <div class="score-body">
          ${steps.length === 0
            ? '<div class="empty" style="padding:24px;">No steps yet — click anything on a recorded tab.</div>'
            : `<div class="steps-grid">${steps.map((step, i) => stepCardHtml(step, stepSnapshot.get(step.id), i)).join('')}</div>`}
        </div>
      </div>
    `;
  }).join('');

  // Wire interactions.
  scoresList.querySelectorAll('.score-card').forEach(card => {
    const id = card.dataset.scoreId;
    const score = scores.find(s => s.id === id);
    if (!score) return;
    const trace = tracesById.get(score.id);
    const stepSnapshot = snapshotsByStepId(score, trace);

    card.querySelector('.score-header').addEventListener('click', (e) => {
      if (e.target.closest('[data-stop-toggle]')) return;
      if (expanded.has(id)) expanded.delete(id);
      else expanded.add(id);
      card.classList.toggle('expanded');
    });

    card.querySelector('[data-action="open"]').addEventListener('click', (e) => {
      e.stopPropagation();
      chrome.tabs.create({ url: buildEditorUrl(score) });
    });

    card.querySelector('[data-action="delete"]').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm(`Delete score ${id.slice(0, 8)}? This cannot be undone.`)) return;
      await chrome.storage.local.remove([`pix.score:${id}`, `pix.trace:${id}`]);
      expanded.delete(id);
      await refreshAll();
    });

    // Each step card → open the matching snapshot's screenshot.
    card.querySelectorAll('.step-card').forEach((stepCard, i) => {
      stepCard.addEventListener('click', () => {
        const step = score.scores?.[0]?.[i];
        const snap = step ? stepSnapshot.get(step.id) : null;
        const screenshot = snap?.screenshot || step?.screenshot;
        if (screenshot) chrome.tabs.create({ url: screenshot });
      });
    });
  });
}

function stepCardHtml(step, snapshot, index) {
  // snapshot may be undefined for manually-added steps or pre-migration
  // entries that haven't been split yet.
  const data = snapshot || {};
  const boundary = data.boundary || 'none';
  const cls = boundary === 'crossing' ? 'step-card crossing' : 'step-card';
  const thumb = data.screenshot
    ? `<img class="thumb" src="${escHtml(data.screenshot)}" alt="">`
    : '<div class="thumb"></div>';
  const host = hostOf(data.captured_from_url) || '';
  const crossing = boundary === 'crossing'
    ? '<span class="crossing-tag">↪ crossing</span>'
    : '';
  const captured = data.captured_at ? new Date(data.captured_at).toLocaleTimeString() : '';
  return `
    <div class="${cls}">
      ${thumb}
      <div class="info">
        <div class="step-index">${index + 1}</div>
        <div class="caption">${escHtml(step.dialogue || '(no caption)')}</div>
        <div class="meta">
          <span>${escHtml(host)} ${crossing}</span>
          <span>${escHtml(captured)}</span>
        </div>
      </div>
    </div>
  `;
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

    const { scores, tracesById } = await loadAllScores();
    renderScores(scores, tracesById);
  } catch (err) {
    console.error('Manager refresh failed', err);
    statusTxt.textContent = 'Error talking to background';
  }
}

async function loadEditorUrl() {
  const data = await chrome.storage.local.get(EDITOR_URL_KEY);
  editorUrl = data[EDITOR_URL_KEY] || DEFAULT_EDITOR_URL;
  editorUrlInput.value = editorUrl;
}

async function saveEditorUrl(url) {
  editorUrl = (url || DEFAULT_EDITOR_URL).trim();
  await chrome.storage.local.set({ [EDITOR_URL_KEY]: editorUrl });
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

settingsSave.addEventListener('click', async () => {
  await saveEditorUrl(editorUrlInput.value);
  settingsSave.textContent = 'Saved ✓';
  setTimeout(() => settingsSave.textContent = 'Save', 1500);
});

clearAllBtn.addEventListener('click', async () => {
  if (!confirm('Delete every captured score from storage?')) return;
  const all = await chrome.storage.local.get(null);
  const keys = Object.keys(all).filter(k => k.startsWith('pix.score:') || k.startsWith('pix.trace:'));
  if (keys.length) await chrome.storage.local.remove(keys);
  expanded.clear();
  await refreshAll();
});

// Live updates from the background.
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
