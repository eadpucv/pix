// Floating overlay widget rendered into the host page via shadow DOM.
// Replaces the previous iframe approach (which had the popup behavior
// problem: opening DevTools / clicking off the page made it harder to
// reach controls). Now it's a real on-page widget that survives focus
// changes, can be dragged, and expands on hover.
//
// Implements (per interaction-capture.allium):
//   - @guarantee RecordingStateAlwaysVisible (the dot is always present)
//   - the visible part of UserStopsRecording (Stop button in the pill)
//
// Public API: showOverlay(), hideOverlay(), refreshCount().

import { MSG } from '../lib/messages.js';

const HOST_ID = 'pix-recorder-host';
const POSITION_KEY = 'pix.overlay_position';
const DEFAULT_POSITION = { top: 12, right: 12 };
const COLLAPSE_DELAY_MS = 200;

let host = null;
let shadow = null;
let widget = null;
let countEl = null;
let collapseTimer = null;
let dragStart = null;
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
  host.style.zIndex = '2147483647';

  shadow = host.attachShadow({ mode: 'closed' });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .widget {
        /* No position here — the host element is fixed-positioned and
           the widget renders inside it. With its own position:fixed the
           widget would pin to the viewport, breaking drag. */
        font: 600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        user-select: none;
        cursor: grab;
        display: inline-flex;
        align-items: center;
        height: 24px;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        border-radius: 999px;
        padding: 0 4px;
        gap: 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: padding 140ms ease, gap 140ms ease, background 140ms ease;
      }
      .widget.expanded {
        padding: 0 12px 0 4px;
        gap: 8px;
        cursor: default;
      }
      .widget.dragging {
        cursor: grabbing;
        transition: none;
      }
      .dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #ff3b30;
        flex-shrink: 0;
        cursor: grab;
        animation: pix-pulse 1.4s ease-in-out infinite;
      }
      .widget.dragging .dot { cursor: grabbing; }
      @keyframes pix-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      .controls {
        display: none;
        align-items: center;
        gap: 10px;
      }
      .widget.expanded .controls { display: flex; }
      .count {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.7);
        white-space: nowrap;
      }
      .stop {
        background: transparent;
        border: 0;
        color: white;
        font: inherit;
        padding: 0;
        cursor: pointer;
        letter-spacing: 0.06em;
      }
      .stop:hover { color: #ff9b8a; }
    </style>
    <div class="widget" id="widget">
      <span class="dot" id="dot" title="Drag to reposition"></span>
      <div class="controls">
        <span class="count" id="count"></span>
        <button class="stop" id="stop" type="button">Stop</button>
      </div>
    </div>
  `;

  document.documentElement.appendChild(host);

  widget = shadow.getElementById('widget');
  countEl = shadow.getElementById('count');
  const dotEl = shadow.getElementById('dot');
  const stopBtn = shadow.getElementById('stop');

  // expand/collapse on hover
  widget.addEventListener('mouseenter', () => {
    clearTimeout(collapseTimer);
    widget.classList.add('expanded');
    refreshCount();
  });
  widget.addEventListener('mouseleave', () => {
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(() => widget?.classList.remove('expanded'), COLLAPSE_DELAY_MS);
  });

  // drag from the dot
  dotEl.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  });

  // stop
  stopBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ type: MSG.RECORDER_STOP }).catch(() => {});
  });

  refreshCount();
}

export function hideOverlay() {
  if (!host) return;
  host.remove();
  host = null;
  shadow = null;
  widget = null;
  countEl = null;
  clearTimeout(collapseTimer);
  collapseTimer = null;
}

// Refreshable from outside (e.g., on SCORE_UPDATED).
export async function refreshCount() {
  if (!countEl) return;
  try {
    const data = await chrome.storage.local.get(['pix.recorder']);
    const state = data['pix.recorder'];
    if (!state?.active_score_id) {
      countEl.textContent = '';
      return;
    }
    const scoreKey = `pix.score:${state.active_score_id}`;
    const scoreData = await chrome.storage.local.get(scoreKey);
    const score = scoreData[scoreKey];
    const steps = score?.scores?.[0]?.length || 0;
    countEl.textContent = `${steps} ${steps === 1 ? 'step' : 'steps'}`;
  } catch {
    // background may be sleeping; non-critical
  }
}

// ---- internals ----

function applyHostPosition() {
  // Reset all four sides; apply only the saved ones.
  host.style.cssText = 'position: fixed; z-index: 2147483647;';
  if (position.left != null) host.style.left = position.left + 'px';
  if (position.right != null) host.style.right = position.right + 'px';
  if (position.top != null) host.style.top = position.top + 'px';
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
    // ignore — fall back to default
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
    offsetY: clientY - rect.top
  };
  widget.classList.add('dragging');
  // While dragging, expand stays visible — but the cursor is the dot,
  // so the mouse is still over the widget anyway.
  document.addEventListener('mousemove', onDragMove, { capture: true });
  document.addEventListener('mouseup', endDrag, { capture: true, once: true });
}

function onDragMove(e) {
  if (!dragStart) return;
  const rect = host.getBoundingClientRect();
  const newLeft = clamp(e.clientX - dragStart.offsetX, 0, window.innerWidth  - rect.width);
  const newTop  = clamp(e.clientY - dragStart.offsetY, 0, window.innerHeight - rect.height);
  // Switch to top/left positioning during drag (regardless of original).
  host.style.left = newLeft + 'px';
  host.style.top  = newTop  + 'px';
  host.style.right = '';
  host.style.bottom = '';
}

function endDrag() {
  if (!dragStart) return;
  document.removeEventListener('mousemove', onDragMove, { capture: true });
  widget?.classList.remove('dragging');
  const rect = host.getBoundingClientRect();
  // Persist as top/left so subsequent loads land in the same pixel.
  position = { top: rect.top, left: rect.left };
  savePosition();
  dragStart = null;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
