// <pix-step> — Single step column

import { i18n } from '../i18n/index.js';
import './PixCell.js';

class PixStep extends HTMLElement {
  constructor() {
    super();
    this._data = null;
    this._layout = 'pix';
    this._index = 0;
    this._showNote = false;
  }

  set data(val) {
    this._data = val;
    if (this.isConnected) this._render();
  }

  get data() {
    return this._data;
  }

  set layout(val) {
    this._layout = val;
    if (this.isConnected) this._render();
  }

  set index(val) {
    this._index = val;
  }

  connectedCallback() {
    this.style.display = 'contents';
    if (this._data) this._render();
  }

  _getLayers() {
    if (this._layout === 'sb') {
      return ['environment', 'user', 'dialogue', 'system', 'supporting'];
    }
    return ['user', 'dialogue', 'system'];
  }

  _getDataKey(layer) {
    if (layer === 'supporting') return 'supporting_processes';
    return layer;
  }

  _render() {
    if (!this._data) return;
    this.innerHTML = '';
    const layers = this._getLayers();

    // Step title cell
    const titleEl = document.createElement('div');
    titleEl.className = 'pix-step-title';
    titleEl.setAttribute('contenteditable', 'true');
    titleEl.setAttribute('data-placeholder', i18n.t('step.title'));
    titleEl.textContent = this._data.step_title || '';
    titleEl.addEventListener('input', () => {
      this._data.step_title = titleEl.textContent.trim();
      this._emitChange();
    });
    titleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Move focus to first cell
        const firstCell = this.querySelector('pix-cell');
        if (firstCell) firstCell.focus();
      }
    });
    this.appendChild(titleEl);

    // Cells for each layer
    for (const layer of layers) {
      const key = this._getDataKey(layer);
      const cell = document.createElement('pix-cell');
      cell.setAttribute('layer', layer);
      cell.setAttribute('value', this._data[key] || '');
      cell.addEventListener('cell-change', (e) => {
        this._data[key] = e.detail.value;
        this._emitChange();
      });
      cell.addEventListener('cell-tab', (e) => {
        if (e.detail.shift) {
          // Move to previous cell in this step or previous step
          this._focusPrevCell(cell, layers);
        } else {
          // Move to next cell or next step
          this._focusNextCell(cell, layers);
        }
      });
      this.appendChild(cell);
    }

    // Note cell (always rendered but can be empty)
    const noteEl = document.createElement('div');
    noteEl.className = 'pix-step-note';
    noteEl.setAttribute('contenteditable', 'true');
    noteEl.setAttribute('data-placeholder', i18n.t('step.note'));
    noteEl.textContent = this._data.note || '';
    noteEl.addEventListener('input', () => {
      this._data.note = noteEl.textContent.trim();
      this._emitChange();
    });
    this.appendChild(noteEl);
  }

  _focusNextCell(currentCell, layers) {
    const cells = Array.from(this.querySelectorAll('pix-cell'));
    const idx = cells.indexOf(currentCell);
    if (idx < cells.length - 1) {
      cells[idx + 1].focus();
    } else {
      // Tab to next step — dispatch event
      this.dispatchEvent(new CustomEvent('step-tab-next', {
        bubbles: true,
        detail: { stepIndex: this._index }
      }));
    }
  }

  _focusPrevCell(currentCell, layers) {
    const cells = Array.from(this.querySelectorAll('pix-cell'));
    const idx = cells.indexOf(currentCell);
    if (idx > 0) {
      cells[idx - 1].focus();
    } else {
      // Tab to previous step
      this.dispatchEvent(new CustomEvent('step-tab-prev', {
        bubbles: true,
        detail: { stepIndex: this._index }
      }));
    }
  }

  _emitChange() {
    this.dispatchEvent(new CustomEvent('step-change', {
      bubbles: true,
      detail: { index: this._index, data: this._data }
    }));
  }

  focusFirstCell() {
    const cell = this.querySelector('pix-cell');
    if (cell) cell.focus();
  }

  focusLastCell() {
    const cells = this.querySelectorAll('pix-cell');
    if (cells.length) cells[cells.length - 1].focus();
  }
}

customElements.define('pix-step', PixStep);
export default PixStep;
