// Floating recording indicator rendered into the host page via shadow
// DOM. Just the red dot — no expanding pill, no Stop button.
// Click  → stop recording (sent to background)
// Drag   → reposition (persisted in chrome.storage)
//
// Implements (per interaction-capture.allium):
//   - @guarantee RecordingStateAlwaysVisible (the dot is always present)
//
// Public API: showOverlay(), hideOverlay(), refreshCount(),
// preCapture(), postCapture(), isOverlayHost().

import { MSG } from '../lib/messages.js';

const HOST_ID = 'pix-host';
const POSITION_KEY = 'pix.overlay_position';
const DEFAULT_POSITION = { top: 12, right: 12 };
const DRAG_THRESHOLD_PX = 4;

let host = null;
let shadow = null;
let dotEl = null;
let dragStart = null;
let dragMoved = false;
let position = { ...DEFAULT_POSITION };

export function isOverlayHost(target) {
  return target?.id === HOST_ID;
}

export async function showOverlay() {
  if (host) return;
  await loadPosition();

  host = document.createElement('div');
  host.id = HOST_ID;
  applyHostPosition();

  shadow = host.attachShadow({ mode: 'closed' });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #ff3b30;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        cursor: grab;
        user-select: none;
        animation: pix-pulse 1.4s ease-in-out infinite;
      }
      .dot.dragging {
        cursor: grabbing;
        animation: none;
      }
      @keyframes pix-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.35; }
      }
    </style>
    <div class="dot" id="dot" title="PiX está grabando — clic para detener, arrastrar para mover"></div>
  `;

  document.documentElement.appendChild(host);

  dotEl = shadow.getElementById('dot');

  dotEl.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  });
}

export function hideOverlay() {
  if (!host) return;
  host.remove();
  host = null;
  shadow = null;
  dotEl = null;
}

// Kept exported for backwards compatibility with content/index.js;
// the dot no longer shows a step count, so this is a no-op.
export function refreshCount() {}

// Hide the dot for the duration of a screenshot capture. visibility:hidden
// removes paint without disturbing layout, which is what captureVisibleTab
// reads. The caller should await preCapture() to be sure the next paint
// has flushed before calling chrome.tabs.captureVisibleTab.
export function preCapture() {
  return new Promise((resolve) => {
    if (!host) { resolve(); return; }
    host.style.visibility = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

export function postCapture() {
  if (!host) return;
  host.style.visibility = '';
}

// ---- internals ----

function applyHostPosition() {
  host.style.cssText = 'position: fixed; z-index: 2147483647;';
  if (position.left   != null) host.style.left   = position.left   + 'px';
  if (position.right  != null) host.style.right  = position.right  + 'px';
  if (position.top    != null) host.style.top    = position.top    + 'px';
  if (position.bottom != null) host.style.bottom = position.bottom + 'px';
}

async function loadPosition() {
  try {
    const data = await chrome.storage.local.get(POSITION_KEY);
    const saved = data[POSITION_KEY];
    if (saved && (saved.top != null || saved.bottom != null)) {
      position = saved;
      return;
    }
  } catch {
    // ignore
  }
  position = { ...DEFAULT_POSITION };
}

async function savePosition() {
  try {
    await chrome.storage.local.set({ [POSITION_KEY]: position });
  } catch {
    // non-critical
  }
}

function startDrag(clientX, clientY) {
  const rect = host.getBoundingClientRect();
  dragStart = {
    offsetX: clientX - rect.left,
    offsetY: clientY - rect.top,
    startX:  clientX,
    startY:  clientY
  };
  dragMoved = false;
  document.addEventListener('mousemove', onDragMove, { capture: true });
  document.addEventListener('mouseup',   endDrag,    { capture: true, once: true });
}

function onDragMove(e) {
  if (!dragStart) return;
  const dx = Math.abs(e.clientX - dragStart.startX);
  const dy = Math.abs(e.clientY - dragStart.startY);
  if (!dragMoved && (dx + dy) < DRAG_THRESHOLD_PX) return;
  if (!dragMoved) {
    dragMoved = true;
    dotEl?.classList.add('dragging');
  }
  const rect = host.getBoundingClientRect();
  const newLeft = clamp(e.clientX - dragStart.offsetX, 0, window.innerWidth  - rect.width);
  const newTop  = clamp(e.clientY - dragStart.offsetY, 0, window.innerHeight - rect.height);
  host.style.left   = newLeft + 'px';
  host.style.top    = newTop  + 'px';
  host.style.right  = '';
  host.style.bottom = '';
}

function endDrag() {
  if (!dragStart) return;
  document.removeEventListener('mousemove', onDragMove, { capture: true });
  dotEl?.classList.remove('dragging');
  if (dragMoved) {
    const rect = host.getBoundingClientRect();
    position = { top: rect.top, left: rect.left };
    savePosition();
  } else {
    // No drag — treat as a click on the dot. Stop the recording.
    chrome.runtime.sendMessage({ type: MSG.RECORDER_STOP }).catch(() => {});
  }
  dragStart = null;
  dragMoved = false;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
