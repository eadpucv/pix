// PiX — content script
//
// Stage 3+: click capture + on-page overlay widget (shadow DOM) +
// Slice 2: multi-trigger capture.
//
// Implements (per interaction-capture.allium):
//   - external entity InteractiveElement
//   - @invariant ElementInteractivityCriteria  (via lib/classify isInteractive)
//   - rule UserClickCapturesStep                (button / link / generic)
//   - rule UserTextInputCapturesStep            (blur with text changed)
//   - rule UserSelectionCapturesStep            (change on dropdown / checkbox / radio)
//   - rule UserFileAttachmentCapturesStep       (change on <input type=file>)
//   - @invariant TriggerMatchesKind             (kind ↔ trigger pairing)
//   - @invariant DialogueValuePrivacy           (typed text never travels)
//   - @guarantee RecordingStateAlwaysVisible    (overlay)
//
// Screenshots happen in the background (chrome.tabs.captureVisibleTab is
// not available to content scripts). Each capture rule sends a payload
// to the background, which produces ScoreStep + TraceSnapshot.

import { MSG } from '../lib/messages.js';
import {
  classifyElement,
  pixogramForKind,
  findInteractiveAncestor,
  captionFor
} from '../lib/classify.js';
import { focusFromRect } from '../lib/focus.js';
import { showOverlay, hideOverlay, refreshCount, isOverlayHost } from './overlay.js';

let isRecording = false;

// Track the value an input had when it received focus. On blur we
// compare with the current value; capture only fires if the value
// changed during the focus session. Keys are weakly held so detached
// elements get garbage-collected.
const focusedValues = new WeakMap();

// Element kinds whose meaningful capture fires on a non-click event.
// click on these elements is just focusing or opening a native UI;
// the actual user intent commits later (blur for text, change for
// selection, change for file). Capturing on click would emit a step
// for "I focused this field" which is noise.
const SKIP_CLICK_FOR_KIND = new Set([
  'text_input',
  'password_input',
  'text_area',
  'dropdown',
  'checkbox',
  'radio',
  'file_input'
]);

function buildPayload(el, trigger, extra = {}) {
  const kind = classifyElement(el);
  const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : { x: 0, y: 0, width: 0, height: 0 };
  const focus = focusFromRect(
    { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    { width: window.innerWidth, height: window.innerHeight }
  );
  const opts = { trigger, value: extra.value, checked: extra.checked };
  return {
    kind,
    icon: pixogramForKind(kind),
    caption: captionFor(el, kind, opts),
    focus,
    page_url: window.location.href,
    page_title: document.title || '',
    page_h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 120),
    trigger,
    // Privacy: never include opts.value when trigger is text_committed.
    // For selection_committed / file_attached, the value or file metadata
    // is the meaning of the action and is included.
    value: trigger === 'text_committed' ? null : (extra.value ?? null),
    file_count: extra.file_count ?? null,
    file_names: extra.file_names ?? null
  };
}

function send(payload) {
  chrome.runtime.sendMessage({
    type: MSG.STEP_CAPTURE_REQUEST,
    payload
  }).catch(() => {});
}

function getValue(el) {
  if (el?.isContentEditable) return el.textContent || '';
  return el?.value ?? '';
}

// ---- click: button / link / generic / drag_source ----

window.addEventListener('click', (e) => {
  if (!isRecording) return;
  if (isOverlayHost(e.target)) return;

  const el = findInteractiveAncestor(e.target);
  if (!el) return;

  const kind = classifyElement(el);
  if (SKIP_CLICK_FOR_KIND.has(kind)) return; // dedicated trigger handles it

  send(buildPayload(el, 'click'));
}, { capture: true, passive: true });

// ---- focusin / focusout: text inputs commit on blur (with change) ----

window.addEventListener('focusin', (e) => {
  if (!isRecording) return;
  const el = e.target;
  if (!el) return;
  const kind = classifyElement(el);
  const isTextish =
    kind === 'text_input' || kind === 'password_input' || kind === 'text_area' ||
    el.isContentEditable;
  if (!isTextish) return;
  focusedValues.set(el, getValue(el));
}, { capture: true, passive: true });

window.addEventListener('focusout', (e) => {
  if (!isRecording) return;
  const el = e.target;
  if (!el) return;
  const kind = classifyElement(el);
  const isTextish =
    kind === 'text_input' || kind === 'password_input' || kind === 'text_area' ||
    el.isContentEditable;
  if (!isTextish) return;

  const prevValue = focusedValues.get(el);
  focusedValues.delete(el);
  const currentValue = getValue(el);
  if (prevValue === currentValue) return;     // no change — nothing committed
  if (currentValue === '' && (prevValue == null || prevValue === '')) return;

  send(buildPayload(el, 'text_committed'));
}, { capture: true, passive: true });

// ---- change: dropdown / checkbox / radio / file ----

window.addEventListener('change', (e) => {
  if (!isRecording) return;
  const el = e.target;
  if (!el) return;
  const kind = classifyElement(el);

  if (kind === 'dropdown') {
    const sel = el.options?.[el.selectedIndex];
    const value = sel?.textContent?.trim() || el.value || '';
    send(buildPayload(el, 'selection_committed', { value }));
    return;
  }

  if (kind === 'checkbox') {
    send(buildPayload(el, 'selection_committed', { checked: !!el.checked }));
    return;
  }

  if (kind === 'radio') {
    if (!el.checked) return;     // radios fire change for both off and on; only capture the on
    send(buildPayload(el, 'selection_committed'));
    return;
  }

  if (kind === 'file_input') {
    const files = el.files ? Array.from(el.files) : [];
    const file_count = files.length;
    const file_names = files.map(f => f.name).slice(0, 5);
    if (file_count === 0) return;
    send(buildPayload(el, 'file_attached', { file_count, file_names }));
    return;
  }
}, { capture: true, passive: true });

// ---- overlay sync ----

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === MSG.OVERLAY_SHOW) {
    showOverlay();
    isRecording = true;
  } else if (msg?.type === MSG.OVERLAY_HIDE) {
    hideOverlay();
    isRecording = false;
  } else if (msg?.type === MSG.SCORE_UPDATED) {
    refreshCount();
  }
});

chrome.runtime
  .sendMessage({ type: MSG.RECORDER_GET_STATE })
  .then((response) => {
    if (response?.state?.state === 'recording') {
      showOverlay();
      isRecording = true;
    }
  })
  .catch(() => {});

console.log('[pix] content script ready on', window.location.href);
