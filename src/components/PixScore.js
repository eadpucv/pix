// <pix-score> — Score renderer (visual grid)

import { i18n } from '../i18n/index.js';
import { loadIcon, getIconSync } from '../data/icons-meta.js';
import './PixCell.js';

// Map layer names to their pixogram icon names
const LAYER_PIXOGRAM_ICONS = {
  user: 'person',
  dialogue: 'dialogue',
  system: 'system',
  environment: 'body',
  supporting: 'process'
};

class PixScore extends HTMLElement {
  constructor() {
    super();
    this._score = null;
    this._layout = 'ip';
  }

  set score(val) {
    this._score = val;
    if (val) this._layout = val.layout || 'ip';
    if (this.isConnected) this._render();
  }

  get score() {
    return this._score;
  }

  connectedCallback() {
    if (this._score) this._render();
  }

  _getLayers() {
    if (this._layout === 'sb') {
      return ['environment', 'user', 'dialogue', 'system', 'supporting'];
    }
    return ['user', 'dialogue', 'system'];
  }

  _render() {
    if (!this._score) {
      this.innerHTML = '<p style="padding:20px;color:var(--pix-text-muted);">No score loaded.</p>';
      return;
    }

    this._renderProper();
  }

  async _renderProper() {
    const layers = this._getLayers();
    const steps = this._score.scores?.[0] || [];

    // Preload layer pixogram icons
    const iconNames = layers.map(l => LAYER_PIXOGRAM_ICONS[l]).filter(Boolean);
    await Promise.all(iconNames.map(n => loadIcon(n)));

    // Build grid: rows = header + layers + notes, cols = label + steps
    const numRows = 1 + layers.length + 1; // header + layers + notes
    const numCols = 1 + steps.length; // label + steps

    this.innerHTML = `
      <div class="pix-score-wrapper">
        <div class="pix-score-grid" data-layout="${this._layout}"
             style="grid-template-columns: 120px repeat(${steps.length}, minmax(100px, 1fr));
                    grid-template-rows: auto repeat(${layers.length}, minmax(120px, auto)) auto;">
        </div>
      </div>
    `;

    const grid = this.querySelector('.pix-score-grid');

    // Row 1: Header
    const headerLabel = document.createElement('div');
    headerLabel.className = 'pix-layer-label pix-layer-label--header';
    headerLabel.innerHTML = '<span>PiX</span>';
    grid.appendChild(headerLabel);

    // Step titles
    for (let i = 0; i < steps.length; i++) {
      const titleEl = document.createElement('div');
      titleEl.className = 'pix-step-title';
      titleEl.setAttribute('contenteditable', 'true');
      titleEl.setAttribute('data-placeholder', i18n.t('step.title'));
      titleEl.textContent = steps[i].step_title || '';
      titleEl.addEventListener('input', () => {
        steps[i].step_title = titleEl.textContent.trim();
        this._emitChange();
      });
      titleEl.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          // Focus first cell of this step
          const colCells = grid.querySelectorAll(`pix-cell[data-step="${i}"]`);
          if (colCells.length) colCells[0].focus();
        }
      });

      // Wrap in a container for hover actions
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'contents';

      grid.appendChild(titleEl);
    }

    // Layer rows
    for (let r = 0; r < layers.length; r++) {
      const layer = layers[r];
      const key = layer === 'supporting' ? 'supporting_processes' : layer;

      // Label with pixogram icon (icon on top, label text below)
      const label = document.createElement('div');
      label.className = `pix-layer-label pix-layer-label--${layer}`;
      const pixIconName = LAYER_PIXOGRAM_ICONS[layer];
      const pixIconSvg = pixIconName ? getIconSync(pixIconName) : '';
      const iconHtml = pixIconSvg ? `<span class="pix-layer-icon">${pixIconSvg}</span>` : '';
      const labelText = i18n.t('layer.' + (layer === 'supporting' ? 'supporting' : layer));
      label.innerHTML = `${iconHtml}<label>${labelText}</label>`;
      grid.appendChild(label);

      // Cells
      for (let i = 0; i < steps.length; i++) {
        const cell = document.createElement('pix-cell');
        cell.setAttribute('layer', layer);
        cell.setAttribute('value', steps[i][key] || '');
        cell.setAttribute('data-step', i);
        cell.setAttribute('data-layer', layer);

        cell.addEventListener('cell-change', (e) => {
          steps[i][key] = e.detail.value;
          this._emitChange();
        });

        cell.addEventListener('cell-tab', (e) => {
          this._handleCellTab(grid, i, r, layers, steps, e.detail.shift);
        });

        grid.appendChild(cell);
      }
    }

    // Note row
    const noteLabel = document.createElement('div');
    noteLabel.className = 'pix-layer-label pix-layer-label--notes';
    noteLabel.innerHTML = `<span>${i18n.t('step.note')}</span>`;
    grid.appendChild(noteLabel);

    for (let i = 0; i < steps.length; i++) {
      const noteEl = document.createElement('div');
      noteEl.className = 'pix-step-note';
      noteEl.setAttribute('contenteditable', 'true');
      noteEl.setAttribute('data-placeholder', i18n.t('step.note'));
      noteEl.textContent = steps[i].note || '';
      noteEl.addEventListener('input', () => {
        steps[i].note = noteEl.textContent.trim();
        this._emitChange();
      });
      grid.appendChild(noteEl);
    }

    // Add step hover buttons overlay
    this._addStepActionOverlays(grid, steps);
  }

  _handleCellTab(grid, stepIdx, layerIdx, layers, steps, shift) {
    if (shift) {
      // Move up in same step, or to previous step's last layer
      if (layerIdx > 0) {
        const prevLayer = layers[layerIdx - 1];
        const cell = grid.querySelector(`pix-cell[data-step="${stepIdx}"][data-layer="${prevLayer}"]`);
        if (cell) cell.focus();
      } else if (stepIdx > 0) {
        const lastLayer = layers[layers.length - 1];
        const cell = grid.querySelector(`pix-cell[data-step="${stepIdx - 1}"][data-layer="${lastLayer}"]`);
        if (cell) cell.focus();
      }
    } else {
      // Move down in same step, or to next step's first layer
      if (layerIdx < layers.length - 1) {
        const nextLayer = layers[layerIdx + 1];
        const cell = grid.querySelector(`pix-cell[data-step="${stepIdx}"][data-layer="${nextLayer}"]`);
        if (cell) cell.focus();
      } else if (stepIdx < steps.length - 1) {
        const firstLayer = layers[0];
        const cell = grid.querySelector(`pix-cell[data-step="${stepIdx + 1}"][data-layer="${firstLayer}"]`);
        if (cell) cell.focus();
      } else {
        // At end — create new step
        this.addStep();
      }
    }
  }

  _addStepActionOverlays(grid, steps) {
    // Create an overlay container for step actions that appears on hover
    const titles = grid.querySelectorAll('.pix-step-title');
    titles.forEach((titleEl, i) => {
      titleEl.style.position = 'relative';

      const actions = document.createElement('div');
      actions.className = 'pix-step-actions';
      actions.innerHTML = `
        <button title="${i18n.t('step.addBefore')}" data-action="add-before">+</button>
        <button title="${i18n.t('step.remove')}" data-action="remove" style="color:var(--pix-orange);">&times;</button>
        <button title="${i18n.t('step.add')}" data-action="add-after">+</button>
      `;

      actions.querySelector('[data-action="add-before"]').addEventListener('click', (e) => {
        e.stopPropagation();
        this.addStepAt(i);
      });
      actions.querySelector('[data-action="remove"]').addEventListener('click', (e) => {
        e.stopPropagation();
        if (steps.length > 1) {
          this.removeStep(i);
        }
      });
      actions.querySelector('[data-action="add-after"]').addEventListener('click', (e) => {
        e.stopPropagation();
        this.addStepAt(i + 1);
      });

      titleEl.appendChild(actions);
    });
  }

  addStep() {
    if (!this._score?.scores?.[0]) return;
    const newStep = this._createEmptyStep();
    this._score.scores[0].push(newStep);
    this._emitChange();
    this._renderProper();

    // Focus the first cell of the new step
    requestAnimationFrame(() => {
      const layers = this._getLayers();
      const lastIdx = this._score.scores[0].length - 1;
      const cell = this.querySelector(`pix-cell[data-step="${lastIdx}"][data-layer="${layers[0]}"]`);
      if (cell) cell.focus();
    });
  }

  addStepAt(index) {
    if (!this._score?.scores?.[0]) return;
    const newStep = this._createEmptyStep();
    this._score.scores[0].splice(index, 0, newStep);
    this._emitChange();
    this._renderProper();
  }

  removeStep(index) {
    if (!this._score?.scores?.[0]) return;
    if (this._score.scores[0].length <= 1) return;
    this._score.scores[0].splice(index, 1);
    this._emitChange();
    this._renderProper();
  }

  _createEmptyStep() {
    const step = {
      step_title: '',
      user: '',
      dialogue: '',
      system: '',
      note: ''
    };
    if (this._layout === 'sb') {
      step.environment = '';
      step.supporting_processes = '';
    }
    return step;
  }

  _emitChange() {
    this.dispatchEvent(new CustomEvent('score-change', {
      bubbles: true,
      detail: { score: this._score }
    }));
  }

  switchLayout(layout) {
    this._layout = layout;
    this._score.layout = layout;

    // Ensure SB fields exist on all steps
    if (layout === 'sb') {
      for (const step of (this._score.scores?.[0] || [])) {
        if (step.environment === undefined) step.environment = '';
        if (step.supporting_processes === undefined) step.supporting_processes = '';
      }
    }

    this._emitChange();
    this._renderProper();
  }
}

customElements.define('pix-score', PixScore);
export default PixScore;
