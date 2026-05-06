// <pix-export-dialog> — Export options modal

import { i18n } from '../i18n/index.js';
import { exportJSON } from '../export/json.js';
import { exportSVG } from '../export/svg.js';
import { exportPNG } from '../export/png.js';
import { exportPDF } from '../export/pdf.js';
import { encodeScoreData } from '../data/migrate.js';

// Viewer layout constants (must match PixViewer.js + score.css)
const COL_WIDTH = 160;
const CELL_MIN_HEIGHT = 120;       // .pix-cell min-height
const CELL_PADDING = 12;           // .pix-cell padding
const ICON_HEIGHT = 64;            // .pix-icon 4em at base 16px
const CELL_FONT_SIZE = 12.8;       // 0.8rem
const CELL_LINE_HEIGHT = 18;       // ~1.4 line-height
const STEP_TITLE_MIN_HEIGHT = 28;
const NOTE_MIN_HEIGHT = 24;

/**
 * Estimate the number of wrapped text lines for a given string
 * at a given font size within a given container width.
 */
function estimateLines(text, fontSize, containerWidth) {
  if (!text || !text.trim()) return 0;
  // Strip icon prefix (pix-xxx) to get only the display text
  const displayText = text.replace(/^pix-[a-z0-9_]+\s*/, '').trim();
  if (!displayText) return 0;
  const avgCharWidth = fontSize * 0.55; // reasonable estimate for proportional fonts
  const charsPerLine = Math.floor(containerWidth / avgCharWidth) || 1;
  return Math.ceil(displayText.length / charsPerLine);
}

/**
 * Estimate the rendered height (px) of the pix-viewer embed.
 * Accounts for title, description, step-title row, per-row cell content growth, and notes.
 */
function calcEmbedHeight(score) {
  const layers = score.layout === 'sb'
    ? ['environment', 'user', 'dialogue', 'system', 'supporting']
    : ['user', 'dialogue', 'system'];
  const steps = score.scores?.[0] || [];

  // 1. Title block: h2 (1.5rem ≈ 24px + 4px mb) + description (0.9rem + 16px mb) + 12px wrapper mb
  const hasTitle = !!(score.title && score.title.trim());
  const hasDesc = !!(score.description && score.description.trim());
  const titleBlockHeight = hasTitle && hasDesc ? 74 : hasTitle ? 40 : 0;

  // 2. Step-title row
  const titleCharWidth = 12 * 0.55; // 0.75rem font
  const titleCharsPerLine = Math.floor((COL_WIDTH - 16) / titleCharWidth) || 1;
  let maxTitleLines = 1;
  for (const step of steps) {
    if (step.step_title) {
      const lines = Math.ceil(step.step_title.length / titleCharsPerLine) || 1;
      if (lines > maxTitleLines) maxTitleLines = lines;
    }
  }
  const stepTitleHeight = Math.max(STEP_TITLE_MIN_HEIGHT, maxTitleLines * 16 + 8);

  // 3. Grid rows — each row grows with its tallest cell content
  const cellContentWidth = COL_WIDTH - CELL_PADDING * 2; // available text width inside cell
  let gridHeight = 0;
  for (const layer of layers) {
    const key = layer === 'supporting' ? 'supporting_processes' : layer;
    let maxCellHeight = CELL_MIN_HEIGHT;
    for (const step of steps) {
      const val = step[key] || '';
      const hasIcon = /^pix-[a-z0-9_]+/.test(val);
      const textLines = estimateLines(val, CELL_FONT_SIZE, cellContentWidth);
      // Cell content: icon (64px) + gap (4px) + text lines
      const contentHeight = (hasIcon ? ICON_HEIGHT + 4 : 0) + textLines * CELL_LINE_HEIGHT;
      const cellHeight = Math.max(CELL_MIN_HEIGHT, contentHeight + CELL_PADDING * 2);
      if (cellHeight > maxCellHeight) maxCellHeight = cellHeight;
    }
    gridHeight += maxCellHeight;
  }

  // 4. Grid border (score-body: 4px solid)
  const gridBorder = 8;

  // 5. Wrapper padding (16px top + 16px bottom)
  const wrapperPadding = 32;

  // 6. Note row
  let maxNoteLines = 0;
  for (const step of steps) {
    if (step.note) {
      const lines = Math.ceil(step.note.length / titleCharsPerLine) || 1;
      if (lines > maxNoteLines) maxNoteLines = lines;
    }
  }
  const noteRowHeight = maxNoteLines > 0
    ? Math.max(NOTE_MIN_HEIGHT, maxNoteLines * 16 + 8)
    : 0;

  return titleBlockHeight + wrapperPadding + stepTitleHeight + gridHeight + gridBorder + noteRowHeight;
}

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

    const embedHeight = calcEmbedHeight(this._score);

    // Encode score data for embed URLs
    const scorePayload = {
      title: this._score.title,
      layout: this._score.layout,
      description: this._score.description,
      scores: this._score.scores
    };
    const embedData = encodeScoreData(scorePayload);

    // Embed codes
    const baseUrl = window.location.origin + window.location.pathname;
    const iframeCode = `<iframe src="${baseUrl}#!/import/${embedData}" width="100%" height="${embedHeight}" frameborder="0"></iframe>`;
    const casiopeaCode = `{{#widget:PiX\n|data = ${embedData}\n|height = ${embedHeight}\n}}`;

    this.innerHTML = `
      <div class="pix-overlay">
        <div class="pix-modal pix-modal--export">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="font-size:1.2rem;font-weight:700;">${i18n.t('export.title')}</h3>
            <button class="pix-btn pix-btn--ghost close-btn">${i18n.t('export.close')}</button>
          </div>

          <h4 class="pix-export-section-title">${i18n.t('export.downloadSection')}</h4>
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

          <h4 class="pix-export-section-title" style="margin-top:20px;">${i18n.t('export.embedSection')}</h4>
          <div class="pix-export-options">
            <button class="pix-export-option pix-copy-btn" data-copy="iframe">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
              <span class="label">${i18n.t('export.iframe')}</span>
              <span class="desc">${i18n.t('export.iframeDesc')}</span>
            </button>
            <button class="pix-export-option pix-copy-btn" data-copy="casiopea">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>
              <span class="label">${i18n.t('export.casiopea')}</span>
              <span class="desc">${i18n.t('export.casiopeaDesc')}</span>
            </button>
            <button class="pix-export-option pix-copy-btn" data-copy="base64">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              <span class="label">${i18n.t('export.base64')}</span>
              <span class="desc">${i18n.t('export.base64Desc')}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Close events
    this.querySelector('.close-btn').addEventListener('click', () => this.hide());
    this.querySelector('.pix-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('pix-overlay')) this.hide();
    });

    // Download buttons
    this.querySelectorAll('.pix-export-option[data-format]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
        try {
          switch (btn.dataset.format) {
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

    // Copy-to-clipboard buttons
    const copyData = { iframe: iframeCode, casiopea: casiopeaCode, base64: embedData };
    this.querySelectorAll('.pix-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = copyData[btn.dataset.copy];
        navigator.clipboard.writeText(text).then(() => {
          const desc = btn.querySelector('.desc');
          const original = desc.textContent;
          desc.textContent = i18n.t('export.copied');
          setTimeout(() => desc.textContent = original, 2000);
        });
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
