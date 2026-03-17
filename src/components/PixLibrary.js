// <pix-library> — Score library manager

import { i18n } from '../i18n/index.js';
import { getAllScores, saveScore, deleteScore, duplicateScore, getStorageUsage } from '../storage/db.js';
import { migrateScore } from '../data/migrate.js';
import { importJSON } from '../export/json.js';
import { exportJSON } from '../export/json.js';

class PixLibrary extends HTMLElement {
  constructor() {
    super();
    this._scores = [];
  }

  connectedCallback() {
    this._loadAndRender();
  }

  async _loadAndRender() {
    this._scores = await getAllScores();
    this._storageInfo = await getStorageUsage();
    this._render();
  }

  _render() {
    const count = this._scores.length;
    const storageLabel = this._storageInfo
      ? i18n.t('library.storage', { percent: this._storageInfo.percent })
      : `${count} ${count === 1 ? 'score' : 'scores'}`;

    this.innerHTML = `
      <div class="pix-library-header">
        <div>
          <h2>${i18n.t('library.title')}</h2>
          <span class="pix-slot-counter">${storageLabel}</span>
        </div>
        <div class="pix-library-actions">
          <button class="pix-btn pix-btn--ghost" data-action="import">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
            ${i18n.t('library.import')}
          </button>
          ${count > 0 ? `
            <button class="pix-btn pix-btn--ghost" data-action="download-all">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              ${i18n.t('library.downloadAll')}
            </button>
          ` : ''}
        </div>
      </div>

      <div class="pix-library-grid">
        <div class="pix-card pix-card--new" data-action="new">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          <span>${i18n.t('library.new')}</span>
        </div>
        ${this._scores.map(score => this._renderCard(score)).join('')}
      </div>

      <!-- New score dialog (hidden) -->
      <div class="new-score-dialog" style="display:none;"></div>
    `;

    this._bindEvents();
  }

  _renderCard(score) {
    const date = score.updatedAt ? new Date(score.updatedAt).toLocaleDateString() : '';
    const layout = score.layout === 'ip' ? i18n.t('toolbar.layoutIP') : (score.layout === 'sb' ? i18n.t('toolbar.layoutSB') : i18n.t('toolbar.layoutIP'));
    const stepsCount = score.scores?.[0]?.length || 0;

    return `
      <div class="pix-card" data-id="${score.id}">
        <div class="pix-card-title">${this._esc(score.title || i18n.t('editor.untitled'))}</div>
        <div class="pix-card-desc">${this._esc(score.description || '')}</div>
        <div class="pix-card-meta">
          <div>
            <span class="pix-layout-badge">${layout}</span>
            <span style="margin-left:8px;">${i18n.t('library.steps', { count: stepsCount })}</span>
          </div>
          <span>${date}</span>
        </div>
        <div class="pix-card-actions" style="margin-top:8px;">
          <button data-action="edit" data-id="${score.id}">${i18n.t('library.edit')}</button>
          <button data-action="duplicate" data-id="${score.id}">${i18n.t('library.duplicate')}</button>
          <button data-action="export-json" data-id="${score.id}">${i18n.t('library.json')}</button>
          <button class="delete-btn" data-action="delete" data-id="${score.id}">${i18n.t('library.delete')}</button>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    // New score
    const newCard = this.querySelector('[data-action="new"]');
    if (newCard) {
      newCard.addEventListener('click', () => this._showNewScoreDialog());
    }

    // Card actions
    this.querySelectorAll('.pix-card[data-id]').forEach(card => {
      // Click on card body to edit
      card.addEventListener('click', (e) => {
        if (e.target.closest('.pix-card-actions')) return;
        const id = card.dataset.id;
        window.location.hash = `#/editor/${id}`;
      });
    });

    // Action buttons
    this.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.hash = `#/editor/${btn.dataset.id}`;
      });
    });

    this.querySelectorAll('[data-action="duplicate"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await duplicateScore(btn.dataset.id);
          await this._loadAndRender();
        } catch (err) {
          alert(err.message);
        }
      });
    });

    this.querySelectorAll('[data-action="export-json"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const score = this._scores.find(s => s.id === btn.dataset.id);
        if (score) exportJSON(score);
      });
    });

    this.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm(i18n.t('library.confirmDelete'))) {
          await deleteScore(btn.dataset.id);
          await this._loadAndRender();
        }
      });
    });

    // Import
    const importBtn = this.querySelector('[data-action="import"]');
    if (importBtn) {
      importBtn.addEventListener('click', () => this._importFile());
    }

    // Download all
    const downloadAllBtn = this.querySelector('[data-action="download-all"]');
    if (downloadAllBtn) {
      downloadAllBtn.addEventListener('click', () => {
        const allData = this._scores.map(s => ({
          title: s.title,
          layout: s.layout,
          description: s.description,
          scores: s.scores
        }));
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pix-library.json';
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  _showNewScoreDialog() {
    const dialog = this.querySelector('.new-score-dialog');
    dialog.style.display = '';
    dialog.innerHTML = `
      <div class="pix-overlay">
        <div class="pix-modal">
          <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:8px;">${i18n.t('new.title')}</h3>
          <div class="pix-new-score-options">
            <div class="pix-new-score-option" data-layout="ip">
              <h3>${i18n.t('new.ip')}</h3>
              <p>${i18n.t('new.ipDesc')}</p>
            </div>
            <div class="pix-new-score-option" data-layout="sb">
              <h3>${i18n.t('new.sb')}</h3>
              <p>${i18n.t('new.sbDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    dialog.querySelector('.pix-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('pix-overlay')) {
        dialog.style.display = 'none';
      }
    });

    dialog.querySelectorAll('.pix-new-score-option').forEach(opt => {
      opt.addEventListener('click', async () => {
        const layout = opt.dataset.layout;
        const newScore = {
          title: '',
          layout,
          description: '',
          scores: [[{
            step_title: '',
            user: '',
            dialogue: '',
            system: '',
            note: '',
            ...(layout === 'sb' ? { environment: '', supporting_processes: '' } : {})
          }]]
        };

        try {
          const saved = await saveScore(newScore);
          window.location.hash = `#/editor/${saved.id}`;
        } catch (err) {
          alert(err.message);
        }
      });
    });
  }

  async _importFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const data = await importJSON(file);

        // Handle array of scores
        const scores = Array.isArray(data) ? data : [data];

        for (const raw of scores) {
          const migrated = migrateScore(raw);
          if (migrated) {
            await saveScore(migrated);
          }
        }

        await this._loadAndRender();
      } catch (err) {
        alert(i18n.t('library.importError'));
        console.error(err);
      }
    });
    input.click();
  }

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

customElements.define('pix-library', PixLibrary);
export default PixLibrary;
