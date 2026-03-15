// <pix-icon-picker> — Icon autocomplete/grid picker

import { ALL_ICONS, getLayerIcons, loadIcon, getIconSync } from '../data/icons-meta.js';
import { i18n } from '../i18n/index.js';

class PixIconPicker extends HTMLElement {
  constructor() {
    super();
    this._visible = false;
    this._filter = '';
    this._layer = 'user';
    this._selectedIndex = -1;
    this._filteredIcons = [];
    this._onSelect = null;
    this._onClose = null;
    this._container = null;
    this._boundKeydown = this._handleKeydown.bind(this);
    this._boundClickOutside = this._handleClickOutside.bind(this);
  }

  connectedCallback() {
    this.innerHTML = '';
  }

  show({ x, y, layer, filter = '', cellText = '', onSelect, onClose }) {
    this._layer = layer || 'user';
    this._filter = filter;
    this._cellText = cellText; // full text from the cell, so user sees what they typed
    this._onSelect = onSelect;
    this._onClose = onClose;
    this._selectedIndex = -1;
    this._visible = true;

    this._render();
    this._position(x, y);

    document.addEventListener('keydown', this._boundKeydown);
    // Delay click listener to avoid immediate close
    setTimeout(() => {
      document.addEventListener('click', this._boundClickOutside);
    }, 50);
  }

  hide() {
    this._visible = false;
    this.innerHTML = '';
    document.removeEventListener('keydown', this._boundKeydown);
    document.removeEventListener('click', this._boundClickOutside);
    if (this._onClose) this._onClose();
  }

  updateFilter(filter) {
    this._filter = filter;
    this._selectedIndex = -1;
    this._render();
  }

  _position(x, y) {
    const container = this.querySelector('.pix-icon-picker');
    if (!container) return;

    // Adjust position to stay within viewport
    const rect = container.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let finalX = x;
    let finalY = y;

    if (finalX + 320 > vw) finalX = vw - 330;
    if (finalX < 10) finalX = 10;
    if (finalY + 400 > vh) finalY = Math.max(10, y - 400);

    container.style.left = finalX + 'px';
    container.style.top = finalY + 'px';
  }

  _getFilteredIcons() {
    const suggested = getLayerIcons(this._layer);
    const filter = this._filter.toLowerCase().replace('pix-', '');

    let suggestedFiltered, othersFiltered;

    if (filter) {
      suggestedFiltered = suggested.filter(n => n.includes(filter));
      othersFiltered = ALL_ICONS.filter(n => n.includes(filter) && !suggested.includes(n));
    } else {
      suggestedFiltered = [...suggested];
      othersFiltered = ALL_ICONS.filter(n => !suggested.includes(n));
    }

    return { suggested: suggestedFiltered, others: othersFiltered };
  }

  _render() {
    const { suggested, others } = this._getFilteredIcons();
    this._filteredIcons = [...suggested, ...others];

    // Show the pix- partial (what user is typing) in the search input
    const searchValue = this._filter.replace('pix-', '');

    this.innerHTML = `
      <div class="pix-icon-picker">
        <input type="text" class="pix-icon-picker-search"
               placeholder="${i18n.t('picker.search')}"
               value="${searchValue}">
        <div class="pix-icon-picker-grid">
          ${suggested.length > 0 ? `
            <div class="pix-icon-picker-separator">${i18n.t('picker.suggested')}</div>
            ${suggested.map((name, idx) => this._renderIconItem(name, idx)).join('')}
          ` : ''}
          ${others.length > 0 ? `
            <div class="pix-icon-picker-separator">${i18n.t('picker.all')}</div>
            ${others.map((name, idx) => this._renderIconItem(name, suggested.length + idx)).join('')}
          ` : ''}
          ${suggested.length === 0 && others.length === 0 ? `
            <div class="pix-icon-picker-separator">${i18n.t('picker.noResults')}</div>
          ` : ''}
        </div>
      </div>
    `;

    // Bind events
    const input = this.querySelector('.pix-icon-picker-search');
    if (input) {
      input.focus();
      // Place cursor at end of input value
      input.setSelectionRange(input.value.length, input.value.length);
      input.addEventListener('input', (e) => {
        this._filter = 'pix-' + e.target.value;
        this._selectedIndex = -1;
        this._renderGrid();
      });
    }

    this._bindItemClicks();
    this._loadVisibleIcons();
  }

  _renderIconItem(name, index) {
    const selected = index === this._selectedIndex ? ' selected' : '';
    const svgContent = getIconSync(name);
    return `
      <div class="pix-icon-picker-item${selected}" data-icon="${name}" data-index="${index}">
        <div class="picker-icon-svg">${svgContent || '<svg viewBox="0 0 256 256" width="32" height="32"></svg>'}</div>
        <span>${name}</span>
      </div>
    `;
  }

  _renderGrid() {
    const grid = this.querySelector('.pix-icon-picker-grid');
    if (!grid) return;

    const { suggested, others } = this._getFilteredIcons();
    this._filteredIcons = [...suggested, ...others];

    grid.innerHTML = `
      ${suggested.length > 0 ? `
        <div class="pix-icon-picker-separator">${i18n.t('picker.suggested')}</div>
        ${suggested.map((name, idx) => this._renderIconItem(name, idx)).join('')}
      ` : ''}
      ${others.length > 0 ? `
        <div class="pix-icon-picker-separator">${i18n.t('picker.all')}</div>
        ${others.map((name, idx) => this._renderIconItem(name, suggested.length + idx)).join('')}
      ` : ''}
      ${suggested.length === 0 && others.length === 0 ? `
        <div class="pix-icon-picker-separator">${i18n.t('picker.noResults')}</div>
      ` : ''}
    `;

    this._bindItemClicks();
    this._loadVisibleIcons();
  }

  _bindItemClicks() {
    this.querySelectorAll('.pix-icon-picker-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const iconName = item.dataset.icon;
        if (iconName && this._onSelect) {
          this._onSelect(iconName);
        }
        this.hide();
      });
    });
  }

  async _loadVisibleIcons() {
    const items = this.querySelectorAll('.pix-icon-picker-item');
    for (const item of items) {
      const name = item.dataset.icon;
      if (!getIconSync(name)) {
        const svg = await loadIcon(name);
        if (svg) {
          const iconDiv = item.querySelector('.picker-icon-svg');
          if (iconDiv) iconDiv.innerHTML = svg;
        }
      }
    }
  }

  _handleKeydown(e) {
    if (!this._visible) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._selectedIndex = Math.min(this._selectedIndex + 1, this._filteredIcons.length - 1);
        this._updateSelection();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._selectedIndex = Math.max(this._selectedIndex - 1, 0);
        this._updateSelection();
        break;
      case 'Enter':
        e.preventDefault();
        if (this._selectedIndex >= 0 && this._selectedIndex < this._filteredIcons.length) {
          const iconName = this._filteredIcons[this._selectedIndex];
          if (this._onSelect) this._onSelect(iconName);
          this.hide();
        } else if (this._filteredIcons.length === 1) {
          if (this._onSelect) this._onSelect(this._filteredIcons[0]);
          this.hide();
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.hide();
        break;
    }
  }

  _updateSelection() {
    this.querySelectorAll('.pix-icon-picker-item').forEach(item => {
      const idx = parseInt(item.dataset.index);
      item.classList.toggle('selected', idx === this._selectedIndex);
      if (idx === this._selectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  _handleClickOutside(e) {
    if (!this.contains(e.target)) {
      this.hide();
    }
  }
}

customElements.define('pix-icon-picker', PixIconPicker);
export default PixIconPicker;
