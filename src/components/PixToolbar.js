// <pix-toolbar> — Editor toolbar

import { i18n } from '../i18n/index.js';

class PixToolbar extends HTMLElement {
  constructor() {
    super();
    this._layout = 'ip';
    this._exportOpen = false;
  }

  set layout(val) {
    this._layout = val;
    this._updateLayoutButtons();
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <div class="pix-toolbar">
        <div class="pix-toolbar-group">
          <button class="pix-btn pix-btn--primary" data-action="add-step">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            ${i18n.t('toolbar.addStep')}
          </button>
        </div>

        <div class="pix-toolbar-separator"></div>

        <div class="pix-toolbar-group">
          <button class="pix-btn pix-btn--ghost layout-btn ${this._layout === 'ip' ? 'active' : ''}" data-layout="ip"
                  style="${this._layout === 'ip' ? 'background:var(--pix-black);color:var(--pix-white);' : ''}">
            ${i18n.t('toolbar.layoutIP')}
          </button>
          <button class="pix-btn pix-btn--ghost layout-btn ${this._layout === 'sb' ? 'active' : ''}" data-layout="sb"
                  style="${this._layout === 'sb' ? 'background:var(--pix-black);color:var(--pix-white);' : ''}">
            ${i18n.t('toolbar.layoutSB')}
          </button>
        </div>

        <div class="pix-toolbar-separator"></div>

        <div class="pix-toolbar-group" style="position:relative;">
          <button class="pix-btn pix-btn--ghost" data-action="export">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            ${i18n.t('toolbar.export')}
          </button>
        </div>
      </div>
    `;

    // Bind events
    this.querySelector('[data-action="add-step"]').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('toolbar-action', { bubbles: true, detail: { action: 'add-step' } }));
    });

    this.querySelectorAll('.layout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const layout = btn.dataset.layout;
        this._layout = layout;
        this._updateLayoutButtons();
        this.dispatchEvent(new CustomEvent('toolbar-action', {
          bubbles: true,
          detail: { action: 'switch-layout', layout }
        }));
      });
    });

    this.querySelector('[data-action="export"]').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('toolbar-action', { bubbles: true, detail: { action: 'export' } }));
    });
  }

  _updateLayoutButtons() {
    this.querySelectorAll('.layout-btn').forEach(btn => {
      const isActive = btn.dataset.layout === this._layout;
      btn.style.background = isActive ? 'var(--pix-black)' : '';
      btn.style.color = isActive ? 'var(--pix-white)' : '';
    });
  }
}

customElements.define('pix-toolbar', PixToolbar);
export default PixToolbar;
