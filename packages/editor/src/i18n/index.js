import en from './en.js';
import es from './es.js';

const locales = { en, es };

class I18n {
  constructor() {
    this._lang = this._detectLanguage();
    this._listeners = new Set();
  }

  _detectLanguage() {
    const saved = localStorage.getItem('pix-lang');
    if (saved && locales[saved]) return saved;
    const nav = navigator.language?.slice(0, 2);
    return locales[nav] ? nav : 'en';
  }

  get lang() {
    return this._lang;
  }

  set lang(value) {
    if (!locales[value]) return;
    this._lang = value;
    localStorage.setItem('pix-lang', value);
    this._notify();
  }

  t(key, params = {}) {
    let str = locales[this._lang]?.[key] || locales.en?.[key] || key;
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, v);
    }
    return str;
  }

  onChange(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _notify() {
    for (const fn of this._listeners) {
      try { fn(this._lang); } catch (e) { console.error(e); }
    }
  }
}

export const i18n = new I18n();
