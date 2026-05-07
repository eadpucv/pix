// classify.js — pure helpers: element classification, interactivity
// detection, and caption derivation.
//
// Implements (per interaction-capture.allium):
//   - classify_element / pixogram_for_kind
//   - @invariant ElementInteractivityCriteria  (via isInteractive)
//   - auto_caption                              (via captionFor + labelOf)
//
// All functions are pure — they read off the passed Element and return
// values without mutations, async, or I/O. labelOf and captionFor read
// from `document` to resolve <label for=ID> associations and
// aria-labelledby; that's idempotent DOM inspection, not mutation.

/** @typedef {'button'|'link'|'text_input'|'password_input'|'checkbox'|'radio'|'dropdown'|'text_area'|'generic'} CapturedElementKind */

const INTERACTIVE_TAGS = new Set(['button', 'a', 'input', 'select', 'textarea']);
const INTERACTIVE_ROLES = new Set([
  'button', 'link', 'checkbox', 'radio', 'menuitem', 'tab',
  'listbox', 'option', 'switch', 'searchbox', 'textbox', 'combobox'
]);

// ARIA role → CapturedElementKind. Tag-based classification still wins
// for native HTML; this only fires for custom widgets without a real tag.
const ROLE_TO_KIND = {
  button:    'button',
  link:      'link',
  menuitem:  'button',
  tab:       'button',
  option:    'button',
  checkbox:  'checkbox',
  switch:    'checkbox',
  radio:     'radio',
  listbox:   'dropdown',
  combobox:  'dropdown',
  textbox:   'text_input',
  searchbox: 'text_input'
};

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
 * closed shadow roots stay opaque.
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
 * Classify an interactive element into one of the kinds the recorder
 * uses to seed dialogue_cell.icon and the auto-caption.
 * @param {Element} el
 * @returns {CapturedElementKind}
 */
export function classifyElement(el) {
  if (!el) return 'generic';

  const tag = el.tagName?.toLowerCase?.();
  const type = el.type?.toLowerCase?.();
  const role = el.getAttribute?.('role')?.toLowerCase?.();

  // Native HTML semantics first — most reliable.
  if (tag === 'a') return 'link';
  if (tag === 'button') return 'button';
  if (tag === 'select') return 'dropdown';
  if (tag === 'textarea') return 'text_area';

  if (tag === 'input') {
    if (type === 'password') return 'password_input';
    if (type === 'checkbox') return 'checkbox';
    if (type === 'radio') return 'radio';
    if (type === 'submit' || type === 'button' || type === 'reset' || type === 'file') return 'button';
    // text, email, url, search, tel, number, date, datetime-local, month, week, time, color, range
    return 'text_input';
  }

  // contenteditable: treat as a text input.
  if (el.getAttribute?.('contenteditable') === 'true') return 'text_input';

  // ARIA role fallback for custom widgets.
  if (role && ROLE_TO_KIND[role]) return ROLE_TO_KIND[role];

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

/**
 * Best-effort label for an element. Mirrors the WCAG accessible name
 * computation chain so what the score says matches what assistive tech
 * would announce. Falls through to placeholder, title and finally the
 * `name` attribute (cleaned up) so unlabelled fields still get something.
 *
 * @param {Element} el
 * @returns {string}  short, normalized; never longer than 80 chars
 */
export function labelOf(el) {
  if (!el) return '';

  // 1. aria-labelledby — IDs of labelling elements
  const labelledBy = el.getAttribute?.('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy.split(/\s+/)
      .map(id => id && document.getElementById(id)?.textContent?.trim())
      .filter(Boolean)
      .join(' ');
    if (text) return clean(text);
  }

  // 2. aria-label
  const aria = el.getAttribute?.('aria-label')?.trim();
  if (aria) return clean(aria);

  // 3. <label for=ID>
  if (el.id) {
    try {
      const lbl = document.querySelector(`label[for="${cssEscape(el.id)}"]`);
      const t = lbl?.textContent?.trim();
      if (t) return clean(t);
    } catch {
      // invalid id selector — ignore
    }
  }

  // 4. enclosing <label> — text minus the input's own value
  const enclosing = el.closest?.('label');
  if (enclosing) {
    const labelText = (enclosing.textContent || '').trim();
    const elValue = (el.value || '').trim();
    const t = elValue ? labelText.replace(elValue, '').trim() : labelText;
    if (t) return clean(t);
  }

  // 5. visible text content (buttons, links, options)
  const txt = (el.textContent || '').trim();
  if (txt && txt.length <= 120) return clean(txt);

  // 6. placeholder (inputs, textareas)
  const ph = el.getAttribute?.('placeholder')?.trim();
  if (ph) return clean(ph);

  // 7. title attribute
  const title = el.getAttribute?.('title')?.trim();
  if (title) return clean(title);

  // 8. selected option (dropdowns)
  if (typeof el.selectedIndex === 'number') {
    const opt = el.options?.[el.selectedIndex]?.textContent?.trim();
    if (opt) return clean(opt);
  }

  // 9. name attribute, last resort. Camel/kebab/snake → spaces.
  const name = el.getAttribute?.('name');
  if (name) return clean(name.replace(/[_-]+/g, ' '));

  return '';
}

/**
 * Build the dialogue caption from the targeted element, its kind and
 * the trigger that fired the capture. Verb is chosen by (kind, trigger)
 * + navigator.language so partituras read natural. Per
 * @invariant DialogueValuePrivacy in interaction-capture.allium, the
 * raw value typed into a text/password/textarea is NEVER reproduced;
 * only the action is described. Selection-committed events (dropdown,
 * checkbox, radio) DO include the chosen option text, because that
 * is choice metadata, not free user input.
 *
 * @param {Element} el
 * @param {CapturedElementKind} kind
 * @param {{ trigger?: string, value?: string, checked?: boolean }} [opts]
 * @returns {string}
 */
export function captionFor(el, kind, opts = {}) {
  const trigger = opts.trigger || 'click';
  const verb = verbFor(kind, trigger, opts);
  const label = labelOf(el);

  // Selection events: the chosen value carries the meaning. Field
  // label is auxiliary — include only when distinct from the value.
  if (trigger === 'selection_committed') {
    if (kind === 'checkbox') {
      // "Marcar Acepto términos" / "Desmarcar Acepto términos"
      return label ? `${verb} ${label}` : verb;
    }
    if (kind === 'radio') {
      // The label of a radio is its own option text.
      return label ? `${verb} ${label}` : verb;
    }
    // dropdown: "Seleccionar Chile" or "Seleccionar Chile en País"
    const value = (opts.value || '').trim();
    if (value && label && value.toLowerCase() !== label.toLowerCase()) {
      return langPrep(value, label, kind);
    }
    return value ? `${verb} ${value}` : verb;
  }

  // file_attached: "Adjuntar archivo en {label}" or with file count
  if (trigger === 'file_attached') {
    return label ? `${verb} ${label}` : verb;
  }

  // text_committed, click, others: "{verb} {label}"
  return label ? `${verb} ${label}` : verb;
}

// ---- internals ----

function verbFor(kind, trigger, opts = {}) {
  const lang = (typeof navigator !== 'undefined' && navigator.language || '').toLowerCase();
  const isEs = lang.startsWith('es');
  const isPt = lang.startsWith('pt');

  if (trigger === 'text_committed') {
    if (kind === 'password_input') {
      return isEs ? 'Ingresar contraseña en' : isPt ? 'Inserir senha em' : 'Enter password in';
    }
    return isEs ? 'Escribir en' : isPt ? 'Escrever em' : 'Type in';
  }

  if (trigger === 'selection_committed') {
    if (kind === 'checkbox') {
      // 'checked' carries the post-event state. opts.checked === false
      // means the box was just unchecked.
      if (opts.checked === false) {
        return isEs ? 'Desmarcar' : isPt ? 'Desmarcar' : 'Uncheck';
      }
      return isEs ? 'Marcar' : isPt ? 'Marcar' : 'Check';
    }
    if (kind === 'radio') {
      return isEs ? 'Elegir' : isPt ? 'Escolher' : 'Choose';
    }
    return isEs ? 'Seleccionar' : isPt ? 'Selecionar' : 'Select';
  }

  if (trigger === 'file_attached') {
    return isEs ? 'Adjuntar archivo en' : isPt ? 'Anexar arquivo em' : 'Attach file in';
  }

  // click + everything else
  if (kind === 'link') {
    return isEs ? 'Ir a' : isPt ? 'Ir para' : 'Go to';
  }
  return isEs ? 'Click en' : isPt ? 'Click em' : 'Click on';
}

// "Seleccionar Chile en País" — joins value + field label with the
// right preposition for the locale. Today only used when the dropdown's
// label is distinct enough from the chosen value to be informative.
function langPrep(value, fieldLabel, kind) {
  const lang = (typeof navigator !== 'undefined' && navigator.language || '').toLowerCase();
  const isEs = lang.startsWith('es');
  const isPt = lang.startsWith('pt');
  const verb = isEs ? 'Seleccionar' : isPt ? 'Selecionar' : 'Select';
  const prep = isEs ? 'en' : isPt ? 'em' : 'in';
  return `${verb} ${value} ${prep} ${fieldLabel}`;
}

function clean(s) {
  return s.replace(/\s+/g, ' ').trim().slice(0, 80);
}

function cssEscape(s) {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(s);
  return String(s).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}
