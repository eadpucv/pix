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

const COL_WIDTH = 160; // fixed cell column width (px), also max-width
const LABEL_WIDTH = 120; // label column width (px)

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

    const colDef = `${LABEL_WIDTH}px repeat(${steps.length}, ${COL_WIDTH}px)`;

    // Structure: titles (above border) → body with border (layers) → notes (below border)
    this.innerHTML = `
      <div class="pix-score-wrapper">
        <div class="pix-score-inner">
          <div class="pix-score-titles" style="grid-template-columns: ${colDef};">
          </div>
          <div class="pix-score-body">
            <div class="pix-score-grid" data-layout="${this._layout}"
                 style="grid-template-columns: ${colDef};
                        grid-template-rows: repeat(${layers.length}, minmax(120px, auto));">
            </div>
          </div>
          <div class="pix-score-notes" style="grid-template-columns: ${colDef};">
          </div>
        </div>
      </div>
    `;

    const titlesGrid = this.querySelector('.pix-score-titles');
    const grid = this.querySelector('.pix-score-grid');
    const notesGrid = this.querySelector('.pix-score-notes');

    // === Title row (above the bordered area) ===
    const spacer = document.createElement('div');
    spacer.className = 'pix-title-label-spacer';
    titlesGrid.appendChild(spacer);

    for (let i = 0; i < steps.length; i++) {
      // Header wrapper (holds grip + title)
      const header = document.createElement('div');
      header.className = 'pix-step-header';
      header.setAttribute('data-step', i);

      // Grip zone (draggable strip above the title)
      const grip = document.createElement('div');
      grip.className = 'pix-step-grip';
      grip.setAttribute('draggable', 'true');
      header.appendChild(grip);

      // Title (contenteditable)
      const titleEl = document.createElement('div');
      titleEl.className = 'pix-step-title';
      titleEl.setAttribute('contenteditable', 'true');
      titleEl.setAttribute('data-placeholder', i18n.t('step.title'));
      titleEl.textContent = steps[i].step_title || '';
      titleEl.addEventListener('input', () => {
        steps[i].step_title = titleEl.textContent.trim();
        this._emitChange();
        requestAnimationFrame(() => this._addSectionDividers(steps));
      });
      titleEl.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const colCells = grid.querySelectorAll(`pix-cell[data-step="${i}"]`);
          if (colCells.length) colCells[0].focus();
        }
      });

      header.appendChild(titleEl);

      // Context menu on grip click or right-click anywhere on header
      grip.addEventListener('click', (e) => {
        e.stopPropagation();
        this._showStepMenu(header, i, steps);
      });
      header.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this._showStepMenu(header, i, steps);
      });

      // --- Drag & drop (from grip) ---
      grip.addEventListener('dragstart', (e) => {
        this._dragSourceIndex = i;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(i));
        header.classList.add('pix-step-dragging');
        // Mark all elements of this column
        requestAnimationFrame(() => {
          this.querySelectorAll(`[data-step="${i}"]`).forEach(el =>
            el.classList.add('pix-step-dragging')
          );
        });
      });

      header.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        // Show drop indicator on left or right half
        const rect = header.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const isLeft = e.clientX < midX;
        header.classList.toggle('pix-step-drop-before', isLeft);
        header.classList.toggle('pix-step-drop-after', !isLeft);
      });

      header.addEventListener('dragleave', () => {
        header.classList.remove('pix-step-drop-before', 'pix-step-drop-after');
      });

      header.addEventListener('drop', (e) => {
        e.preventDefault();
        header.classList.remove('pix-step-drop-before', 'pix-step-drop-after');
        const fromIndex = this._dragSourceIndex;
        if (fromIndex === undefined || fromIndex === null) return;
        const rect = header.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        let toIndex = e.clientX < midX ? i : i + 1;
        // Adjust if dragging to the right of its original position
        if (fromIndex < toIndex) toIndex--;
        if (fromIndex !== toIndex) {
          this.moveStep(fromIndex, toIndex);
        }
      });

      grip.addEventListener('dragend', () => {
        this._dragSourceIndex = null;
        this.querySelectorAll('.pix-step-dragging, .pix-step-drop-before, .pix-step-drop-after')
          .forEach(el => el.classList.remove('pix-step-dragging', 'pix-step-drop-before', 'pix-step-drop-after'));
      });

      titlesGrid.appendChild(header);
    }

    // === Layer rows (inside the bordered body) ===
    for (let r = 0; r < layers.length; r++) {
      const layer = layers[r];
      const key = layer === 'supporting' ? 'supporting_processes' : layer;

      // Label with pixogram icon
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

    // === Notes row (below the bordered area, no header) ===
    // Empty spacer to align with label column
    const noteSpacer = document.createElement('div');
    noteSpacer.className = 'pix-note-label-spacer';
    notesGrid.appendChild(noteSpacer);

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
      notesGrid.appendChild(noteEl);
    }

    // Section dividers (positioned after layout)
    requestAnimationFrame(() => this._addSectionDividers(steps));
  }

  _addSectionDividers(steps) {
    const inner = this.querySelector('.pix-score-inner');
    const titlesGrid = this.querySelector('.pix-score-titles');
    const notesGrid = this.querySelector('.pix-score-notes');
    const headers = this.querySelectorAll('.pix-step-header');
    if (!inner || !titlesGrid || !notesGrid || headers.length === 0) return;

    // Remove existing dividers
    inner.querySelectorAll('.pix-section-divider').forEach(el => el.remove());

    const innerRect = inner.getBoundingClientRect();
    const titlesRect = titlesGrid.getBoundingClientRect();
    const notesRect = notesGrid.getBoundingClientRect();

    headers.forEach((headerEl, i) => {
      if (steps[i]?.step_title?.trim()) {
        const headerRect = headerEl.getBoundingClientRect();
        const line = document.createElement('div');
        line.className = 'pix-section-divider';
        line.style.left = (headerRect.left - innerRect.left) + 'px';
        line.style.top = (titlesRect.top - innerRect.top) + 'px';
        line.style.height = (notesRect.bottom - titlesRect.top) + 'px';
        inner.appendChild(line);
      }
    });
  }

  _handleCellTab(grid, stepIdx, layerIdx, layers, steps, shift) {
    if (shift) {
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
      if (layerIdx < layers.length - 1) {
        const nextLayer = layers[layerIdx + 1];
        const cell = grid.querySelector(`pix-cell[data-step="${stepIdx}"][data-layer="${nextLayer}"]`);
        if (cell) cell.focus();
      } else if (stepIdx < steps.length - 1) {
        const firstLayer = layers[0];
        const cell = grid.querySelector(`pix-cell[data-step="${stepIdx + 1}"][data-layer="${firstLayer}"]`);
        if (cell) cell.focus();
      } else {
        this.addStep();
      }
    }
  }

  addStep() {
    if (!this._score?.scores?.[0]) return;
    const newStep = this._createEmptyStep();
    this._score.scores[0].push(newStep);
    this._emitChange();
    this._renderProper();

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

  moveStep(fromIndex, toIndex) {
    if (!this._score?.scores?.[0]) return;
    const steps = this._score.scores[0];
    if (fromIndex < 0 || fromIndex >= steps.length) return;
    if (toIndex < 0 || toIndex >= steps.length) return;
    if (fromIndex === toIndex) return;
    const [moved] = steps.splice(fromIndex, 1);
    steps.splice(toIndex, 0, moved);
    this._emitChange();
    this._renderProper();
  }

  _showStepMenu(anchorEl, index, steps) {
    this._closeStepMenu();
    const menu = document.createElement('div');
    menu.className = 'pix-step-menu';

    // "Add step" option
    const addBtn = document.createElement('button');
    addBtn.className = 'pix-step-menu-item';
    addBtn.textContent = i18n.t('step.add');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._closeStepMenu();
      this.addStepAt(index + 1);
    });
    menu.appendChild(addBtn);

    // "Remove step" option (with inline confirmation)
    if (steps.length > 1) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'pix-step-menu-item pix-step-menu-item--danger';
      removeBtn.textContent = i18n.t('step.remove');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (removeBtn.dataset.confirm) {
          this._closeStepMenu();
          this.removeStep(index);
        } else {
          removeBtn.dataset.confirm = '1';
          removeBtn.textContent = i18n.t('step.confirmDelete');
          setTimeout(() => {
            if (removeBtn.isConnected) {
              delete removeBtn.dataset.confirm;
              removeBtn.textContent = i18n.t('step.remove');
            }
          }, 2000);
        }
      });
      menu.appendChild(removeBtn);
    }

    anchorEl.appendChild(menu);

    // Close on click outside (delayed to avoid immediate close)
    setTimeout(() => {
      this._stepMenuCloseHandler = (e) => {
        if (!menu.contains(e.target)) this._closeStepMenu();
      };
      document.addEventListener('click', this._stepMenuCloseHandler, true);
    }, 50);
  }

  _closeStepMenu() {
    const existing = this.querySelector('.pix-step-menu');
    if (existing) existing.remove();
    if (this._stepMenuCloseHandler) {
      document.removeEventListener('click', this._stepMenuCloseHandler, true);
      this._stepMenuCloseHandler = null;
    }
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
