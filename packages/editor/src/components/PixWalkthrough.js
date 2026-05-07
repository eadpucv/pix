// <pix-walkthrough> — Visor de la ScreenshotTrace de una grabación.
//
// Implementa packages/editor/walkthrough-viewer.allium: lee Score+Trace
// del IDB, muestra side-by-side el screenshot con focus region marcado
// y la columna correspondiente del partitura PiX. Navegación step a
// step, deep-link via URL.

import { i18n } from '../i18n/index.js';
import { loadIcon, getIconSync, ALL_ICONS } from '@pix/core/pixograms';
import { exportWalkthroughPDF } from '../export/walkthrough-pdf.js';

const LAYER_ICONS = {
  user: 'person',
  dialogue: 'dialogue',
  system: 'system',
  environment: 'body',
  supporting: 'process'
};

class PixWalkthrough extends HTMLElement {
  constructor() {
    super();
    this._score = null;
    this._trace = null;
    this._initialStepId = null;
    this._currentIndex = 0;
    this._boundKeydown = this._onKeydown.bind(this);
  }

  set score(val) { this._score = val; }
  set trace(val) { this._trace = val; }
  set initialStepId(val) { this._initialStepId = val; }

  connectedCallback() {
    if (this._score && this._trace) {
      // Resolve initial step.
      if (this._initialStepId) {
        const idx = this._allSteps().findIndex(s => s.id === this._initialStepId);
        if (idx >= 0) this._currentIndex = idx;
      }
      this._render();
      window.addEventListener('keydown', this._boundKeydown);
    }
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this._boundKeydown);
  }

  _allSteps() {
    if (!this._score?.scores) return [];
    return this._score.scores.flat();
  }

  _snapshotForStep(step) {
    if (!step || !this._trace?.snapshots) return null;
    return this._trace.snapshots.find(s => s.step_id === step.id) || null;
  }

  _layers() {
    if (this._score?.layout === 'sb') {
      return ['environment', 'user', 'dialogue', 'system', 'supporting'];
    }
    return ['user', 'dialogue', 'system'];
  }

  _layerKey(layer) {
    return layer === 'supporting' ? 'supporting_processes' : layer;
  }

  async _render() {
    const steps = this._allSteps();
    if (steps.length === 0) {
      this.innerHTML = `<div class="pix-walkthrough-empty"><p>${i18n.t('walkthrough.empty')}</p></div>`;
      return;
    }

    const step = steps[this._currentIndex];
    const snap = this._snapshotForStep(step);
    const layers = this._layers();

    // Preload pixogram icons referenced in this step's cells.
    const iconNames = new Set(layers.map(l => LAYER_ICONS[l]).filter(Boolean));
    for (const layer of layers) {
      const val = step[this._layerKey(layer)] || '';
      const m = val.match(/^pix-([a-z0-9_]+)/);
      if (m && ALL_ICONS.includes(m[1])) iconNames.add(m[1]);
    }
    await Promise.all([...iconNames].map(n => loadIcon(n)));

    this.innerHTML = this._renderHtml(steps, step, snap, layers);
    this._wireEvents();
  }

  _renderHtml(steps, step, snap, layers) {
    const total = steps.length;
    const idx = this._currentIndex;
    const atFirst = idx === 0;
    const atLast = idx === total - 1;
    const title = this._esc(this._score.title || i18n.t('editor.untitled'));

    const visualPanel = snap?.screenshot
      ? `
        <div class="walkthrough-visual">
          <div class="walkthrough-screenshot-wrap">
            <img class="walkthrough-screenshot" src="${this._esc(snap.screenshot)}" alt="">
            ${snap.focus
              ? `<div class="walkthrough-focus" style="left:${snap.focus.x_percent}%;top:${snap.focus.y_percent}%"></div>`
              : ''}
          </div>
          <div class="walkthrough-visual-meta">
            ${snap.captured_from_url ? `<code class="walkthrough-url" title="${this._esc(snap.captured_from_url)}">${this._esc(snap.captured_from_url)}</code>` : ''}
            ${snap.captured_at ? `<span>${this._esc(new Date(snap.captured_at).toLocaleTimeString())}</span>` : ''}
            ${snap.boundary === 'crossing' ? `<span class="walkthrough-crossing">↪ ${i18n.t('walkthrough.crossing')}</span>` : ''}
          </div>
        </div>
      `
      : `
        <div class="walkthrough-visual walkthrough-visual--empty">
          <p>${i18n.t('walkthrough.noSnapshot')}</p>
        </div>
      `;

    return `
      <div class="pix-walkthrough">
        <header class="walkthrough-header">
          <a href="#/library" class="walkthrough-back">← ${i18n.t('walkthrough.backToLibrary')}</a>
          <div class="walkthrough-title-block">
            <h1>${title}</h1>
            <span class="walkthrough-stepcount">${i18n.t('walkthrough.stepOf', { current: idx + 1, total })}</span>
          </div>
          <div class="walkthrough-header-actions">
            <button type="button" class="pix-btn pix-btn--ghost" data-action="export-pdf">${i18n.t('walkthrough.exportPdf')}</button>
            <a class="pix-btn pix-btn--ghost" href="#/editor/${this._esc(this._score.id)}">${i18n.t('walkthrough.openInEditor')}</a>
          </div>
        </header>

        <div class="walkthrough-main">
          ${visualPanel}

          <aside class="walkthrough-partitura">
            ${step.step_title ? `<h2 class="walkthrough-step-title">${this._esc(step.step_title)}</h2>` : ''}
            <div class="walkthrough-cells">
              ${layers.map(layer => this._renderCell(step, layer)).join('')}
            </div>
            ${step.note ? `<p class="walkthrough-note">${this._esc(step.note)}</p>` : ''}
          </aside>
        </div>

        <nav class="walkthrough-nav">
          <button class="walkthrough-nav-btn" data-action="prev" ${atFirst ? 'disabled' : ''} title="${i18n.t('walkthrough.prev')}">←</button>
          <div class="walkthrough-strip" role="tablist">
            ${steps.map((s, i) => `
              <button class="walkthrough-strip-step ${i === idx ? 'is-current' : ''} ${this._snapshotForStep(s) ? '' : 'no-snap'}"
                      data-jump="${i}"
                      title="Step ${i + 1}${s.step_title ? ': ' + this._esc(s.step_title) : ''}">
                ${i + 1}
              </button>
            `).join('')}
          </div>
          <button class="walkthrough-nav-btn" data-action="next" ${atLast ? 'disabled' : ''} title="${i18n.t('walkthrough.next')}">→</button>
        </nav>
      </div>
    `;
  }

  _renderCell(step, layer) {
    const key = this._layerKey(layer);
    const val = step[key] || '';
    const layerLabel = i18n.t('layer.' + (layer === 'supporting' ? 'supporting' : layer));
    const layerIcon = getIconSync(LAYER_ICONS[layer]) || '';

    const m = val.match(/^pix-([a-z0-9_]+)\s*([\s\S]*)/);
    let cellInner = '';
    if (m && ALL_ICONS.includes(m[1])) {
      const svg = getIconSync(m[1]) || '';
      const text = (m[2] || '').trim();
      cellInner = `
        ${svg ? `<span class="walkthrough-cell-icon">${svg}</span>` : ''}
        ${text ? `<span class="walkthrough-cell-text">${this._esc(text)}</span>` : ''}
      `;
    } else if (val.trim()) {
      cellInner = `<span class="walkthrough-cell-text">${this._esc(val.trim())}</span>`;
    } else {
      cellInner = `<span class="walkthrough-cell-empty">—</span>`;
    }

    return `
      <div class="walkthrough-cell walkthrough-cell--${layer}">
        <div class="walkthrough-cell-header">
          ${layerIcon ? `<span class="walkthrough-cell-layer-icon">${layerIcon}</span>` : ''}
          <span class="walkthrough-cell-layer">${layerLabel}</span>
        </div>
        <div class="walkthrough-cell-content">${cellInner}</div>
      </div>
    `;
  }

  _wireEvents() {
    this.querySelector('[data-action="prev"]')?.addEventListener('click', () => this._goto(this._currentIndex - 1));
    this.querySelector('[data-action="next"]')?.addEventListener('click', () => this._goto(this._currentIndex + 1));
    this.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => this._goto(parseInt(btn.dataset.jump, 10)));
    });
    const exportBtn = this.querySelector('[data-action="export-pdf"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this._onExportPdf(exportBtn));
    }
  }

  async _onExportPdf(btn) {
    if (!this._score || !this._trace) return;
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = i18n.t('walkthrough.exporting');
    try {
      await exportWalkthroughPDF(this._score, this._trace);
    } catch (err) {
      console.error('walkthrough PDF export failed', err);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  }

  _onKeydown(e) {
    if (e.key === 'ArrowLeft') this._goto(this._currentIndex - 1);
    else if (e.key === 'ArrowRight') this._goto(this._currentIndex + 1);
    else if (e.key === 'Escape') window.location.hash = '#/library';
  }

  _goto(idx) {
    const steps = this._allSteps();
    if (idx < 0 || idx >= steps.length) return;
    this._currentIndex = idx;
    const step = steps[idx];
    // Update URL deep-link without triggering hashchange re-route.
    const newHash = `#/walkthrough/${this._score.id}/${step.id}`;
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
    this._render();
  }

  _esc(s) {
    const d = document.createElement('div');
    d.textContent = s ?? '';
    return d.innerHTML;
  }
}

customElements.define('pix-walkthrough', PixWalkthrough);
export default PixWalkthrough;
