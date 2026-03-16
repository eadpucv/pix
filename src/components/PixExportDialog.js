// <pix-export-dialog> — Export options modal

import { i18n } from '../i18n/index.js';
import { exportJSON } from '../export/json.js';
import { exportSVG } from '../export/svg.js';
import { exportPNG } from '../export/png.js';
import { exportPDF } from '../export/pdf.js';
import { encodeScoreData } from '../data/migrate.js';

class PixExportDialog extends HTMLElement {
  constructor() {
    super();
    this._score = null;
    this._visible = false;
  }

  show(score) {
    this._score = score;
    this._visible = true;
    this._render();
  }

  hide() {
    this._visible = false;
    this.innerHTML = '';
  }

  _render() {
    if (!this._visible || !this._score) return;

    // Calculate embed height based on layout
    // Matches SVG export dimensions: titleBlock(50) + stepTitles(36) + layers*120 + notes(28) + padding(32)
    const numLayers = this._score.layout === 'sb' ? 5 : 3;
    const embedHeight = 50 + 36 + numLayers * 120 + 28 + 32;

    // Generate embed URL
    const embedData = encodeScoreData({
      title: this._score.title,
      layout: this._score.layout,
      description: this._score.description,
      scores: this._score.scores
    });
    const baseUrl = window.location.origin + window.location.pathname;
    const embedUrl = `${baseUrl}#!/import/${embedData}`;
    const embedCode = `<iframe src="${embedUrl}" width="100%" height="${embedHeight}" frameborder="0"></iframe>`;

    this.innerHTML = `
      <div class="pix-overlay">
        <div class="pix-modal pix-modal--export">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="font-size:1.2rem;font-weight:700;">${i18n.t('export.title')}</h3>
            <button class="pix-btn pix-btn--ghost close-btn">${i18n.t('export.close')}</button>
          </div>

          <div class="pix-export-options">
            <button class="pix-export-option" data-format="svg">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/></svg>
              <span class="label">${i18n.t('export.svg')}</span>
              <span class="desc">${i18n.t('export.svgDesc')}</span>
            </button>
            <button class="pix-export-option" data-format="pdf">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>
              <span class="label">${i18n.t('export.pdf')}</span>
              <span class="desc">${i18n.t('export.pdfDesc')}</span>
            </button>
            <button class="pix-export-option" data-format="png">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              <span class="label">${i18n.t('export.png')}</span>
              <span class="desc">${i18n.t('export.pngDesc')}</span>
            </button>
            <button class="pix-export-option" data-format="json">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              <span class="label">${i18n.t('export.json')}</span>
              <span class="desc">${i18n.t('export.jsonDesc')}</span>
            </button>
          </div>

          <div class="pix-embed-section">
            <h4 style="font-size:0.9rem;font-weight:600;margin-bottom:8px;">${i18n.t('export.embed')}</h4>
            <p style="font-size:0.75rem;color:var(--pix-text-muted);margin-bottom:8px;">${i18n.t('export.embedDesc')}</p>
            <div class="pix-embed-row">
              <textarea class="pix-embed-code" readonly rows="3">${this._escapeHtml(embedCode)}</textarea>
              <button class="pix-btn pix-btn--ghost copy-embed-btn" style="align-self:stretch;white-space:nowrap;">${i18n.t('export.copy')}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind events
    this.querySelector('.close-btn').addEventListener('click', () => this.hide());
    this.querySelector('.pix-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('pix-overlay')) this.hide();
    });

    this.querySelectorAll('.pix-export-option').forEach(btn => {
      btn.addEventListener('click', async () => {
        const format = btn.dataset.format;
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
        try {
          switch (format) {
            case 'svg': await exportSVG(this._score); break;
            case 'pdf': await exportPDF(this._score); break;
            case 'png': await exportPNG(this._score); break;
            case 'json': exportJSON(this._score); break;
          }
        } catch (err) {
          console.error('Export error:', err);
          alert('Export failed: ' + err.message);
        }
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
      });
    });

    this.querySelector('.copy-embed-btn').addEventListener('click', () => {
      const textarea = this.querySelector('.pix-embed-code');
      textarea.select();
      navigator.clipboard.writeText(textarea.value).then(() => {
        const btn = this.querySelector('.copy-embed-btn');
        btn.textContent = i18n.t('export.copied');
        setTimeout(() => btn.textContent = i18n.t('export.copy'), 2000);
      });
    });
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

customElements.define('pix-export-dialog', PixExportDialog);
export default PixExportDialog;
