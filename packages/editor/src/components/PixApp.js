// <pix-app> — Main shell, router, i18n

import { i18n } from '../i18n/index.js';
import { parseLegacyData, migrateScore } from '@pix/core/migrations';
import { preloadIcons } from '@pix/core/pixograms';
import { getScore, saveScore, saveTrace } from '@pix/core/storage';
import logoUrl from '@pix/core/icons/logo.svg?url';
import { VERSION } from '../version.js';
import './PixLibrary.js';
import './PixEditor.js';
import './PixViewer.js';
import './PixAbout.js';

class PixApp extends HTMLElement {
  constructor() {
    super();
    this._currentView = null;
    this._unsubI18n = null;
  }

  async connectedCallback() {
    // Start preloading icons in background
    preloadIcons();

    // Listen for language changes
    this._unsubI18n = i18n.onChange(() => this._renderNav());

    // Listen for hash changes
    window.addEventListener('hashchange', () => this._route());

    // Cross-origin trace handoff from @pix/extension. After the
    // extension opens this editor at #!/edit/<b64> for a recording,
    // it follows up with chrome.scripting.executeScript that calls
    // window.__pixReceiveTrace with the matching ScreenshotTrace.
    // Saving it to IDB makes the walkthrough viewer functional for
    // that score.
    window.__pixReceiveTrace = async (trace) => {
      if (!trace || !trace.score_id) return;
      try {
        await saveTrace(trace);
        console.log(
          '[pix-editor] received trace for', trace.score_id,
          'with', trace.snapshots?.length ?? 0, 'snapshots'
        );
      } catch (err) {
        console.error('[pix-editor] failed to save trace', err);
      }
    };
    // If the extension injected the trace before this listener was
    // ready, pick up the pending payload.
    if (window.__pixPendingTrace) {
      const pending = window.__pixPendingTrace;
      delete window.__pixPendingTrace;
      window.__pixReceiveTrace(pending);
    }

    // Initial render
    this._renderShell();
    this._route();
  }

  disconnectedCallback() {
    if (this._unsubI18n) this._unsubI18n();
  }

  _renderShell() {
    this.innerHTML = `
      <nav class="pix-nav">
        <a href="#/library" class="pix-nav-brand">
          <img src="${logoUrl}" alt="PiX" width="28" height="28">
          <span>PiX</span>
          <span class="pix-nav-version">v${VERSION}</span>
        </a>
        <div class="pix-nav-actions">
          <div class="pix-nav-links"></div>
          <a href="#/about" class="pix-btn pix-btn--ghost pix-nav-about" style="text-decoration:none;font-size:0.8rem;">${i18n.t('nav.about')}</a>
          <div class="pix-lang-switch">
            <button data-lang="en" class="${i18n.lang === 'en' ? 'active' : ''}">EN</button>
            <button data-lang="es" class="${i18n.lang === 'es' ? 'active' : ''}">ES</button>
          </div>
        </div>
      </nav>
      <main class="pix-main"></main>
      <footer class="pix-footer">
        <p><strong>${i18n.t('footer.tagline')}</strong></p>
        <p>${i18n.t('footer.developed')} <a href="https://ead.pucv.cl" target="_blank" rel="noopener">e[ad] ${i18n.t('footer.school')}</a></p>
        <p>${i18n.t('footer.university')}</p>
        <p><a href="https://github.com/eadpucv/pix" target="_blank" rel="noopener">${i18n.t('footer.opensource')}</a> · <a href="https://raw.githubusercontent.com/eadpucv/pix/refs/heads/main/LICENSE" target="_blank" rel="noopener">${i18n.t('footer.license')}</a> · v${VERSION}</p>
      </footer>
    `;

    // Language switcher
    this.querySelectorAll('.pix-lang-switch button').forEach(btn => {
      btn.addEventListener('click', () => {
        i18n.lang = btn.dataset.lang;
        this.querySelectorAll('.pix-lang-switch button').forEach(b => {
          b.classList.toggle('active', b.dataset.lang === i18n.lang);
        });
        // Re-render current view
        this._route();
      });
    });
  }

  _renderNav() {
    // Update nav link labels
    const linksEl = this.querySelector('.pix-nav-links');
    if (!linksEl) return;

    const hash = window.location.hash;
    if (hash.startsWith('#/editor')) {
      linksEl.innerHTML = `
        <a href="#/library" class="pix-btn pix-btn--ghost" style="text-decoration:none;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          ${i18n.t('nav.back')}
        </a>
      `;
    } else {
      linksEl.innerHTML = '';
    }
  }

  async _route() {
    const hash = window.location.hash || '#/library';
    const main = this.querySelector('.pix-main');
    if (!main) return;

    this._renderNav();

    // Legacy embed routes: #!/import/[base64] and #!/print/[base64]
    if (hash.startsWith('#!/import/')) {
      const b64 = hash.slice('#!/import/'.length);
      const score = parseLegacyData(b64);
      // Hide nav+footer for clean embed experience (iframe in MediaWiki etc.)
      const nav = this.querySelector('.pix-nav');
      const footer = this.querySelector('.pix-footer');
      if (nav) nav.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (score) {
        main.innerHTML = '';
        const viewer = document.createElement('pix-viewer');
        viewer.mode = 'view';
        viewer.score = score;
        main.appendChild(viewer);
      } else {
        main.innerHTML = '<p style="padding:40px;text-align:center;">Could not load score data.</p>';
      }
      return;
    }

    if (hash.startsWith('#!/print/')) {
      const b64 = hash.slice('#!/print/'.length);
      const score = parseLegacyData(b64);
      const nav = this.querySelector('.pix-nav');
      const footer2 = this.querySelector('.pix-footer');
      if (nav) nav.style.display = 'none';
      if (footer2) footer2.style.display = 'none';
      if (score) {
        main.innerHTML = '';
        const viewer = document.createElement('pix-viewer');
        viewer.mode = 'print';
        viewer.score = score;
        main.appendChild(viewer);
      } else {
        main.innerHTML = '<p style="padding:40px;text-align:center;">Could not load score data.</p>';
      }
      return;
    }

    // Handoff route used by @pix/extension's "Open in editor" button.
    // Decodes, persists to IndexedDB (preserving ids when present so a
    // second handoff updates the same record), then redirects to the
    // regular #/editor/<id> view.
    if (hash.startsWith('#!/edit/')) {
      const b64 = hash.slice('#!/edit/'.length);
      const score = parseLegacyData(b64);
      if (!score) {
        main.innerHTML = '<p style="padding:40px;text-align:center;">Could not parse score data.</p>';
        return;
      }
      try {
        const saved = await saveScore(score);
        window.location.hash = `#/editor/${saved.id}`;
      } catch (err) {
        console.error('Failed to import score from #!/edit/', err);
        main.innerHTML = `<p style="padding:40px;text-align:center;">Failed to import score: ${err.message}</p>`;
      }
      return;
    }

    // Editor route
    if (hash.startsWith('#/editor/')) {
      const id = hash.split('#/editor/')[1];
      if (id) {
        const score = await getScore(id);
        if (score) {
          main.innerHTML = '';
          const editor = document.createElement('pix-editor');
          editor.score = score;
          main.appendChild(editor);
        } else {
          main.innerHTML = '<p style="padding:40px;text-align:center;">Score not found.</p>';
        }
      }
      return;
    }

    if (hash === '#/editor') {
      // No ID — redirect to library
      window.location.hash = '#/library';
      return;
    }

    // About page
    if (hash === '#/about') {
      main.innerHTML = '';
      const about = document.createElement('pix-about');
      main.appendChild(about);
      return;
    }

    // Library (default)
    main.innerHTML = '';
    const library = document.createElement('pix-library');
    main.appendChild(library);
  }
}

customElements.define('pix-app', PixApp);
export default PixApp;
