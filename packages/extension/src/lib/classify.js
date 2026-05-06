// classify.js — pure helpers: element classification, interactivity
// detection, and caption derivation.
//
// Implements (per interaction-capture.allium):
//   - classify_element / pixogram_for_kind
//   - @invariant ElementInteractivityCriteria  (via isInteractive)
//   - auto_caption                              (via captionFor)
//
// All functions are pure — they read off the passed Element and return
// values without mutations, async, or I/O. Mockable in node tests.

/** @typedef {'button'|'link'|'text_input'|'password_input'|'checkbox'|'radio'|'dropdown'|'text_area'|'generic'} CapturedElementKind */

const INTERACTIVE_TAGS = new Set(['button', 'a', 'input', 'select', 'textarea']);
const INTERACTIVE_ROLES = new Set([
  'button', 'link', 'checkbox', 'radio', 'menuitem', 'tab',
  'listbox', 'option', 'switch', 'searchbox', 'textbox', 'combobox'
]);

/**
 * Does this element match @invariant ElementInteractivityCriteria?
 * @param {Element} el
 */
export function isInteractive(el) {
  if (!el || el.nodeType !== 1) return false;
  const tag = el.tagName?.toLowerCase?.();
  const role = el.getAttribute?.('role')?.toLowerCase?.();

  if (INTERACTIVE_TAGS.has(tag)) return true;
  if (role && INTERACTIVE_ROLES.has(role)) return true;
  if (el.hasAttribute?.('onclick')) return true;
  if (tag === 'a' && el.hasAttribute?.('href')) return true;
  const tabindex = el.getAttribute?.('tabindex');
  if (tabindex != null && tabindex !== '-1') return true;
  if (el.getAttribute?.('contenteditable') === 'true') return true;
  return false;
}

/**
 * Walk up from a click target until an interactive element is found.
 * Returns null if none up to <html>. Shadow DOM traversal: not yet —
 * stage 3 handles light DOM only; closed shadow roots stay opaque.
 * @param {Node} node
 */
export function findInteractiveAncestor(node) {
  let el = node?.nodeType === 1 ? node : node?.parentElement;
  while (el && el.nodeType === 1) {
    if (isInteractive(el)) return el;
    el = el.parentElement;
  }
  return null;
}

/**
 * Derive a short text caption for the dialogue cell from an element.
 * Priority: aria-label → visible text (if short) → placeholder → option text.
 * Truncated to 120 chars to keep score JSON readable.
 * @param {Element} el
 * @param {CapturedElementKind} kind
 */
export function captionFor(el, kind) {
  if (!el) return '';

  const aria = el.getAttribute?.('aria-label');
  if (aria?.trim()) return aria.trim().slice(0, 120);

  const raw = (el.textContent || '').trim().replace(/\s+/g, ' ');
  if (raw && raw.length <= 120) return raw;

  if (kind === 'text_input' || kind === 'password_input' || kind === 'text_area') {
    const ph = el.getAttribute?.('placeholder');
    if (ph?.trim()) return ph.trim().slice(0, 120);
  }

  if (kind === 'dropdown' && typeof el.selectedIndex === 'number') {
    const sel = el.options?.[el.selectedIndex];
    if (sel?.textContent?.trim()) return sel.textContent.trim().slice(0, 120);
  }

  return raw.slice(0, 120);
}

/**
 * Classify an interactive element into one of the kinds the recorder
 * uses to seed dialogue_cell.icon and the auto-caption.
 * @param {Element} el
 * @returns {CapturedElementKind}
 */
export function classifyElement(el) {
  if (!el) return 'generic';

  const tag = el.tagName?.toLowerCase();
  const type = el.type?.toLowerCase?.();
  const role = el.getAttribute?.('role')?.toLowerCase?.();

  if (tag === 'a') return 'link';
  if (tag === 'button' || role === 'button') return 'button';
  if (tag === 'select' || role === 'listbox' || role === 'combobox') return 'dropdown';
  if (tag === 'textarea') return 'text_area';

  if (tag === 'input') {
    if (type === 'password') return 'password_input';
    if (type === 'checkbox' || role === 'checkbox' || role === 'switch') return 'checkbox';
    if (type === 'radio' || role === 'radio') return 'radio';
    if (type === 'submit' || type === 'button') return 'button';
    return 'text_input';
  }

  if (role === 'checkbox' || role === 'switch') return 'checkbox';
  if (role === 'radio') return 'radio';
  if (role === 'link') return 'link';

  return 'generic';
}

/**
 * Map an element kind to the pixogram name to seed dialogue_cell.icon.
 * Mirrors the config block in interaction-capture.allium.
 * @param {CapturedElementKind} kind
 * @returns {string}
 */
export function pixogramForKind(kind) {
  switch (kind) {
    case 'button':         return 'button';
    case 'link':           return 'link';
    case 'text_input':     return 'input';
    case 'password_input': return 'password';
    case 'checkbox':       return 'checkbox';
    case 'radio':          return 'radioselect';
    case 'dropdown':       return 'select';
    case 'text_area':      return 'text';
    default:               return 'click';
  }
}
