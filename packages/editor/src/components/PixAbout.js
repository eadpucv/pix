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
          <p>${i18n.t('about.history.wiki')} <a href="https://wiki.ead.pucv.cl/PiX" target="_blank" rel="noopener">${i18n.t('about.history.wikiName')}</a>${i18n.lang !== 'es' ? ' ' + i18n.t('about.history.wikiLang') : ''}.</p>

          <h2>${i18n.t('about.opensource.title')}</h2>
          <p>${i18n.t('about.opensource.text')} <a href="https://github.com/eadpucv/pix" target="_blank" rel="noopener">GitHub</a>.</p>
        </article>
      </div>

    `;
  }
}

customElements.define('pix-about', PixAbout);
export default PixAbout;
