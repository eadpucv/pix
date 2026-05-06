// <pix-viewer> — Read-only view for embed/print modes

import { i18n } from '../i18n/index.js';
import { loadIcon, getIconSync, ALL_ICONS } from '../data/icons-meta.js';

// Map layer names to their pixogram icon names
const LAYER_PIXOGRAM_ICONS = {
  user: 'person',
  dialogue: 'dialogue',
  system: 'system',
  environment: 'body',
  supporting: 'process'
};

const COL_WIDTH = 160;
const LABEL_WIDTH = 120;

class PixViewer extends HTMLElement {
  constructor() {
    super();
    this._score = null;
    this._mode = 'view'; // 'view' or 'print'
  }

  set score(val) {
    this._score = val;
    if (this.isConnected) this._render();
  }

  set mode(val) {
    this._mode = val;
  }

  connectedCallback() {
    if (this._score) this._render();
  }

  _getLayers() {
    if (this._score?.layout === 'sb') {
      return ['environment', 'user', 'dialogue', 'system', 'supporting'];
    }
    return ['user', 'dialogue', 'system'];
  }

  _getLayerLabel(layer) {
    return i18n.t('layer.' + (layer === 'supporting' ? 'supporting' : layer));
  }

  _getDataKey(layer) {
    if (layer === 'supporting') return 'supporting_processes';
    return layer;
  }

  async _render() {
    if (!this._score) {
      this.innerHTML = '<p>No score data.</p>';
      return;
    }

    const layers = this._getLayers();
    const steps = this._score.scores?.[0] || [];
    const isPrint = this._mode === 'print';

    // Preload all icons in the score + layer pixogram icons
    const iconNames = new Set();
    for (const layer of layers) {
      const pixIcon = LAYER_PIXOGRAM_ICONS[layer];
      if (pixIcon) iconNames.add(pixIcon);
    }
    for (const step of steps) {
      for (const layer of layers) {
        const key = this._getDataKey(layer);
        const val = step[key] || '';
        const match = val.match(/^pix-([a-z0-9_]+)/);
        if (match && ALL_ICONS.includes(match[1])) iconNames.add(match[1]);
      }
    }
    await Promise.all([...iconNames].map(n => loadIcon(n)));

    const colDef = `${LABEL_WIDTH}px repeat(${steps.length}, ${COL_WIDTH}px)`;

    this.innerHTML = `
      ${!isPrint ? `
        <div style="margin-bottom:12px;">
          <h2 class="pix-viewer-title">${this._esc(this._score.title || i18n.t('editor.untitled'))}</h2>
          ${this._score.description ? `<p class="pix-viewer-description">${this._esc(this._score.description)}</p>` : ''}
        </div>
      ` : `
        <h2 style="margin-bottom:4px;">${this._esc(this._score.title || i18n.t('editor.untitled'))}</h2>
        ${this._score.description ? `<p style="color:var(--pix-text-muted);margin-bottom:12px;">${this._esc(this._score.description)}</p>` : ''}
      `}

      <div class="pix-score-wrapper">
        <div class="pix-score-inner">
          <div class="pix-score-titles" style="grid-template-columns: ${colDef};">
          </div>
          <div class="pix-score-body">
            <div class="pix-score-grid" data-layout="${this._score.layout}"
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

    // === Title row (above bordered area) ===
    const spacer = document.createElement('div');
    spacer.className = 'pix-title-label-spacer';
    titlesGrid.appendChild(spacer);

    for (const step of steps) {
      const titleEl = document.createElement('div');
      titleEl.className = 'pix-step-title';
      titleEl.textContent = step.step_title || '';
      titlesGrid.appendChild(titleEl);
    }

    // === Layer rows (inside bordered body) ===
    for (const layer of layers) {
      const key = this._getDataKey(layer);

      const label = document.createElement('div');
      label.className = `pix-layer-label pix-layer-label--${layer}`;
      const pixIconName = LAYER_PIXOGRAM_ICONS[layer];
      const pixIconSvg = pixIconName ? getIconSync(pixIconName) : '';
      const iconHtml = pixIconSvg ? `<span class="pix-layer-icon">${pixIconSvg}</span>` : '';
      label.innerHTML = `${iconHtml}<span>${this._getLayerLabel(layer)}</span>`;
      grid.appendChild(label);

      for (const step of steps) {
        const cellEl = document.createElement('div');
        cellEl.className = `pix-cell pix-cell--${layer}`;

        const val = step[key] || '';
        const match = val.match(/^pix-([a-z0-9_]+)\s*([\s\S]*)/);

        if (match && ALL_ICONS.includes(match[1])) {
          const svgHtml = getIconSync(match[1]);
          const text = match[2]?.trim() || '';
          cellEl.innerHTML = `
            ${svgHtml ? `<span class="pix-icon">${svgHtml}</span>` : ''}
            ${text ? `<span style="font-size:0.8rem;">${this._esc(text)}</span>` : ''}
          `;
        } else if (val.trim()) {
          cellEl.innerHTML = `<span style="font-size:0.8rem;">${this._esc(val.trim())}</span>`;
        }

        grid.appendChild(cellEl);
      }
    }

    // === Notes row (below bordered area, no header) ===
    const noteSpacer = document.createElement('div');
    noteSpacer.className = 'pix-note-label-spacer';
    notesGrid.appendChild(noteSpacer);

    for (const step of steps) {
      const noteEl = document.createElement('div');
      noteEl.className = 'pix-step-note';
      noteEl.textContent = step.note || '';
      notesGrid.appendChild(noteEl);
    }

    // Add section dividers
    requestAnimationFrame(() => this._addSectionDividers(steps));

    // Auto-print if in print mode
    if (isPrint) {
      setTimeout(() => window.print(), 500);
    }
  }

  _addSectionDividers(steps) {
    const inner = this.querySelector('.pix-score-inner');
    const titlesGrid = this.querySelector('.pix-score-titles');
    const body = this.querySelector('.pix-score-body');
    const titles = this.querySelectorAll('.pix-step-title');
    if (!inner || !titlesGrid || !body || titles.length === 0) return;

    inner.querySelectorAll('.pix-section-divider').forEach(el => el.remove());

    const innerRect = inner.getBoundingClientRect();
    const titlesRect = titlesGrid.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const bodyBorderLeft = parseFloat(getComputedStyle(body).borderLeftWidth) || 0;

    titles.forEach((titleEl, i) => {
      if (steps[i]?.step_title?.trim()) {
        const titleRect = titleEl.getBoundingClientRect();
        const line = document.createElement('div');
        line.className = 'pix-section-divider';
        line.style.left = (titleRect.left - innerRect.left + bodyBorderLeft) + 'px';
        line.style.top = (titlesRect.top - innerRect.top) + 'px';
        line.style.height = (bodyRect.bottom - titlesRect.top) + 'px';
        inner.appendChild(line);
      }
    });
  }

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

customElements.define('pix-viewer', PixViewer);
export default PixViewer;
