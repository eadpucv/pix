// classify.js — pure: (Element) → CapturedElementKind
//
// Implements `classify_element` from interaction-capture.allium and the
// element-kind enum used to seed the dialogue cell pixogram.
//
// Pure (no DOM mutations, no async). Testable in node by passing a
// minimal element-shape mock — the surface used here is small.

/** @typedef {'button'|'link'|'text_input'|'password_input'|'checkbox'|'radio'|'dropdown'|'text_area'|'generic'} CapturedElementKind */

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
