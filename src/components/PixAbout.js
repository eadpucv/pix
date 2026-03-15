// <pix-about> — About page component

import { i18n } from '../i18n/index.js';

class PixAbout extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <div class="pix-about">
        <article class="pix-about-content">
          <h1>${i18n.t('about.title')}</h1>
          <p class="pix-about-lead">${i18n.t('about.lead')}</p>

          <h2>${i18n.t('about.notation.title')}</h2>
          <p>${i18n.t('about.notation.intro')}</p>
          <ul>
            <li><strong>${i18n.t('layer.user')}</strong>: ${i18n.t('about.notation.user')}</li>
            <li><strong>${i18n.t('layer.dialogue')}</strong>: ${i18n.t('about.notation.dialogue')}</li>
            <li><strong>${i18n.t('layer.system')}</strong>: ${i18n.t('about.notation.system')}</li>
          </ul>
          <p>${i18n.t('about.notation.visibility')}</p>
          <p>${i18n.t('about.notation.steps')}</p>

          <h2>${i18n.t('about.sb.title')}</h2>
          <p>${i18n.t('about.sb.intro')}</p>
          <ul>
            <li><strong>${i18n.t('layer.environment')}</strong>: ${i18n.t('about.sb.environment')}</li>
            <li><strong>${i18n.t('layer.supporting')}</strong>: ${i18n.t('about.sb.supporting')}</li>
          </ul>

          <h2>${i18n.t('about.history.title')}</h2>
          <p>${i18n.t('about.history.text')}</p>
          <p>${i18n.t('about.history.evolution')}</p>

          <h2>${i18n.t('about.opensource.title')}</h2>
          <p>${i18n.t('about.opensource.text')} <a href="https://github.com/eadpucv/pix" target="_blank" rel="noopener">GitHub</a>.</p>

          <hr>
          <p class="pix-about-version">v2 — Built with Web Components</p>
        </article>
      </div>

      <style>
        .pix-about {
          max-width: 720px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .pix-about-content h1 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--pix-text);
          margin-bottom: 12px;
        }
        .pix-about-lead {
          font-size: 1.1rem;
          color: var(--pix-text-muted);
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .pix-about-content h2 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--pix-text);
          margin-top: 32px;
          margin-bottom: 12px;
        }
        .pix-about-content p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--pix-text);
          margin-bottom: 12px;
        }
        .pix-about-content ul {
          list-style: disc;
          padding-left: 24px;
          margin-bottom: 16px;
        }
        .pix-about-content li {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--pix-text);
          margin-bottom: 6px;
        }
        .pix-about-content strong {
          font-weight: 600;
        }
        .pix-about-content a {
          color: var(--pix-brand);
          text-decoration: none;
        }
        .pix-about-content a:hover {
          text-decoration: underline;
        }
        .pix-about-content hr {
          border: none;
          border-top: 1px solid var(--pix-border);
          margin: 32px 0 16px;
        }
        .pix-about-version {
          font-size: 0.8rem;
          color: var(--pix-text-muted);
          font-style: italic;
          font-family: Georgia, 'Times New Roman', serif;
        }
      </style>
    `;
  }
}

customElements.define('pix-about', PixAbout);
export default PixAbout;
