// <pix-cell> — Editable cell with icon support

import { ALL_ICONS, loadIcon, getIconSync } from '../data/icons-meta.js';
import { i18n } from '../i18n/index.js';

class PixCell extends HTMLElement {
  constructor() {
    super();
    this._layer = 'user';
    this._value = '';
    this._iconName = null;
    this._text = '';
    this._contentEl = null;
    this._openingPicker = false;
  }

  static get observedAttributes() {
    return ['layer', 'value'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'layer') this._layer = newVal;
    if (name === 'value' && oldVal !== newVal) {
      this._value = newVal || '';
      this._parseValue();
      if (this._contentEl) this._renderContent();
    }
  }

  connectedCallback() {
    this._layer = this.getAttribute('layer') || 'user';
    this._value = this.getAttribute('value') || '';
    this._parseValue();

    this.className = `pix-cell pix-cell--${this._layer}`;

    this._contentEl = document.createElement('div');
    this._contentEl.className = 'pix-cell-content';
    this._contentEl.setAttribute('contenteditable', 'true');
    this._contentEl.setAttribute('data-placeholder', i18n.t('cell.placeholder'));
    this._contentEl.setAttribute('spellcheck', 'false');
    this.appendChild(this._contentEl);

    // Add icon picker button (orange circle with +)
    this._addBtn = document.createElement('button');
    this._addBtn.className = 'pix-cell-add-icon';
    this._addBtn.type = 'button';
    this._addBtn.title = i18n.t('cell.addIcon') || 'Add pictogram';
    this._addBtn.innerHTML = '+';
    this.appendChild(this._addBtn);

    this._renderContent();
    this._bindEvents();
  }

  _parseValue() {
    const val = this._value.trim();
    if (!val) {
      this._iconName = null;
      this._text = '';
      return;
    }

    const match = val.match(/^pix-([a-z0-9_]+)\s*([\s\S]*)/);
    if (match && ALL_ICONS.includes(match[1])) {
      this._iconName = match[1];
      this._text = match[2]?.trim() || '';
    } else {
      this._iconName = null;
      this._text = val;
    }
  }

  async _renderContent() {
    if (!this._contentEl) return;

    if (this._iconName) {
      let svgHtml = getIconSync(this._iconName);
      if (!svgHtml) {
        svgHtml = await loadIcon(this._iconName);
      }

      if (svgHtml) {
        this._contentEl.innerHTML =
          `<span class="pix-icon" data-icon="${this._iconName}" contenteditable="false">${svgHtml}</span><br>` +
          (this._text ? this._escapeHtml(this._text) : '');
      } else {
        this._contentEl.textContent = this._value;
      }
    } else if (this._text) {
      this._contentEl.textContent = this._text;
    } else {
      this._contentEl.innerHTML = '';
    }
  }

  _bindEvents() {
    let autocompleteTimeout = null;

    this._contentEl.addEventListener('input', () => {
      clearTimeout(autocompleteTimeout);
      autocompleteTimeout = setTimeout(() => {
        this._handleInput();
      }, 150);
    });

    this._contentEl.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        this._commitValue();
        this.dispatchEvent(new CustomEvent('cell-tab', { bubbles: true, detail: { shift: e.shiftKey } }));
      }
    });

    this._contentEl.addEventListener('blur', () => {
      this._commitValue();
      // Don't close picker if the add-icon button was just clicked
      if (!this._openingPicker) {
        this._closePicker();
      }
    });

    this._addBtn.addEventListener('mousedown', (e) => {
      e.preventDefault(); // prevent contenteditable from losing focus
      this._openingPicker = true;
    });

    this._addBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent click-outside from closing picker
      this._openFullPicker();
      setTimeout(() => { this._openingPicker = false; }, 300);
    });
  }

  _handleInput() {
    // If cell already has a pictogram, don't trigger autocomplete
    // (each cell can have only 1 pictogram; text after it is just text)
    if (this._contentEl.querySelector('.pix-icon')) {
      this._closePicker();
      return;
    }

    const text = this._getPlainText();

    // Check for pix- prefix to trigger autocomplete
    const match = text.match(/pix-([a-z0-9_]*)$/i);
    if (match) {
      const partial = match[1];
      const fullPrefix = 'pix-' + partial;

      // Check for exact match
      if (ALL_ICONS.includes(partial)) {
        // Auto-replace with icon
        this._iconName = partial;
        this._text = '';
        this._value = fullPrefix;
        this._renderContent();
        this._commitValue();
        // Place cursor after icon
        setTimeout(() => this._placeCursorAtEnd(), 10);
        return;
      }

      // Show autocomplete picker
      if (partial.length >= 1) {
        this._showAutocompletePicker(fullPrefix);
      }
    } else {
      this._closePicker();
    }
  }

  _showAutocompletePicker(filter) {
    const picker = document.querySelector('pix-icon-picker');
    if (!picker) return;

    // Capture the full text the user has typed so far in the cell
    const fullCellText = this._getPlainText();

    const rect = this.getBoundingClientRect();
    picker.show({
      x: rect.left,
      y: rect.bottom + 4,
      layer: this._layer,
      filter,
      cellText: fullCellText, // pass full cell text so picker search input gets it
      onSelect: (iconName) => {
        // Extract text that was NOT part of the pix- prefix
        const prefixMatch = fullCellText.match(/^(.*?)pix-[a-z0-9_]*(.*)$/i);
        const beforeText = prefixMatch?.[1]?.trim() || '';
        const afterText = prefixMatch?.[2]?.trim() || '';

        this._iconName = iconName;
        this._text = [beforeText, afterText].filter(Boolean).join(' ');
        this._value = `pix-${iconName}${this._text ? ' ' + this._text : ''}`;
        this._renderContent();
        this._commitValue();
        setTimeout(() => {
          this._contentEl.focus();
          this._placeCursorAtEnd();
        }, 10);
      },
      onClose: () => {
        // Return focus to the cell when picker closes without selection
        this._contentEl.focus();
      }
    });
  }

  _openFullPicker() {
    const picker = document.querySelector('pix-icon-picker');
    if (!picker) return;

    const rect = this.getBoundingClientRect();
    picker.show({
      x: rect.left,
      y: rect.bottom + 4,
      layer: this._layer,
      filter: '',
      onSelect: (iconName) => {
        // Keep existing text
        const currentText = this._text || '';
        this._iconName = iconName;
        this._value = `pix-${iconName}${currentText ? ' ' + currentText : ''}`;
        this._renderContent();
        this._commitValue();
        setTimeout(() => {
          this._contentEl.focus();
          this._placeCursorAtEnd();
        }, 10);
      },
      onClose: () => {}
    });
  }

  _closePicker() {
    const picker = document.querySelector('pix-icon-picker');
    if (picker) picker.hide();
  }

  _commitValue() {
    const plainText = this._getPlainText();
    const iconEl = this._contentEl.querySelector('.pix-icon');

    if (iconEl) {
      const iconName = iconEl.dataset.icon;
      // Get text after the icon
      const allText = this._contentEl.textContent || '';
      // The icon doesn't contribute text, so allText should be the text part
      const textPart = allText.trim();
      this._value = `pix-${iconName}${textPart ? ' ' + textPart : ''}`;
      this._iconName = iconName;
      this._text = textPart;
    } else {
      this._value = plainText;
      this._parseValue();
    }

    this.dispatchEvent(new CustomEvent('cell-change', {
      bubbles: true,
      detail: { value: this._value, layer: this._layer }
    }));
  }

  _getPlainText() {
    if (!this._contentEl) return '';
    // Get text content, but for icon elements use their data-icon attribute
    let text = '';
    for (const node of this._contentEl.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList?.contains('pix-icon')) {
          text += 'pix-' + (node.dataset.icon || '');
        } else if (node.tagName === 'BR') {
          text += ' ';
        } else {
          text += node.textContent;
        }
      }
    }
    return text.trim();
  }

  _placeCursorAtEnd() {
    if (!this._contentEl) return;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(this._contentEl);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  getValue() {
    return this._value;
  }

  setValue(val) {
    this._value = val || '';
    this._parseValue();
    this._renderContent();
  }

  focus() {
    if (this._contentEl) {
      this._contentEl.focus();
      this._placeCursorAtEnd();
    }
  }
}

customElements.define('pix-cell', PixCell);
export default PixCell;
