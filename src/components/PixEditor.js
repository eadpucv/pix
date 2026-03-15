// <pix-editor> — Score editor

import { i18n } from '../i18n/index.js';
import { saveScore, getScore } from '../storage/db.js';
import './PixToolbar.js';
import './PixScore.js';
import './PixIconPicker.js';
import './PixExportDialog.js';

class PixEditor extends HTMLElement {
  constructor() {
    super();
    this._score = null;
    this._saveTimer = null;
    this._saveStatus = '';
  }

  set score(val) {
    this._score = val;
    if (this.isConnected) this._render();
  }

  get score() {
    return this._score;
  }

  async loadScore(id) {
    const score = await getScore(id);
    if (score) {
      this._score = score;
      this._render();
    }
  }

  connectedCallback() {
    if (this._score) this._render();
  }

  disconnectedCallback() {
    if (this._saveTimer) clearTimeout(this._saveTimer);
  }

  _render() {
    if (!this._score) {
      this.innerHTML = '<p style="padding:40px;text-align:center;color:var(--pix-text-muted);">Loading...</p>';
      return;
    }

    this.innerHTML = `
      <div class="pix-editor-topbar">
        <pix-toolbar></pix-toolbar>
      </div>
      <div class="pix-score-header">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:0;">
          <input class="pix-score-title" type="text"
                 value="${this._escAttr(this._score.title || '')}"
                 placeholder="${i18n.t('editor.untitled')}">
          <span class="pix-layout-badge">${this._score.layout === 'ip' ? 'PiX' : 'SB'}</span>
          <span class="save-status" style="font-size:0.75rem;color:var(--pix-text-muted);"></span>
        </div>
        <textarea class="pix-score-description"
                  placeholder="${i18n.t('editor.descPlaceholder')}">${this._score.description || ''}</textarea>
      </div>
      <pix-score></pix-score>
      <pix-icon-picker></pix-icon-picker>
      <pix-export-dialog></pix-export-dialog>
    `;

    // Set toolbar layout
    const toolbar = this.querySelector('pix-toolbar');
    toolbar.layout = this._score.layout;

    // Set score
    const scoreEl = this.querySelector('pix-score');
    scoreEl.score = this._score;

    // Title input
    const titleInput = this.querySelector('.pix-score-title');
    titleInput.addEventListener('input', () => {
      this._score.title = titleInput.value;
      this._debounceSave();
    });

    // Description textarea
    const descEl = this.querySelector('.pix-score-description');
    descEl.addEventListener('input', () => {
      this._score.description = descEl.value;
      this._debounceSave();
    });

    // Score changes
    scoreEl.addEventListener('score-change', () => {
      this._debounceSave();
    });

    // Toolbar actions
    toolbar.addEventListener('toolbar-action', (e) => {
      const { action, layout } = e.detail;
      switch (action) {
        case 'add-step':
          scoreEl.addStep();
          break;
        case 'switch-layout':
          scoreEl.switchLayout(layout);
          toolbar.layout = layout;
          break;
        case 'export':
          this.querySelector('pix-export-dialog').show(this._score);
          break;
      }
    });
  }

  _debounceSave() {
    const statusEl = this.querySelector('.save-status');
    if (statusEl) statusEl.textContent = i18n.t('editor.saving');

    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(async () => {
      try {
        await saveScore(this._score);
        if (statusEl) {
          statusEl.textContent = i18n.t('editor.saved');
          setTimeout(() => {
            if (statusEl) statusEl.textContent = '';
          }, 2000);
        }
      } catch (err) {
        console.error('Save failed:', err);
        if (statusEl) statusEl.textContent = 'Save failed';
      }
    }, 500);
  }

  _escAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

customElements.define('pix-editor', PixEditor);
export default PixEditor;
