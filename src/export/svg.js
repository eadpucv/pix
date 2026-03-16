// SVG export — renders the score as a clean SVG document

import { getIconSync, loadIcon } from '../data/icons-meta.js';
import { downloadBlob, sanitizeFilename } from './json.js';

const CELL_WIDTH = 160;
const CELL_HEIGHT = 120;
const LABEL_WIDTH = 130;
const LABEL_ICON_SIZE = 48;
const HEADER_HEIGHT = 36;
const ICON_SIZE = 48;
const NOTE_HEIGHT = 28;
const PADDING = 16;
const FONT_SIZE = 11;
const TITLE_FONT_SIZE = 18;
const FONT_FAMILY = '"Helvetica Neue", Helvetica, Arial, sans-serif';

// Layer header pixogram icons (same as PixScore.js)
const LAYER_PIXOGRAM_ICONS = {
  user: 'person',
  dialogue: 'dialogue',
  system: 'system',
  environment: 'body',
  supporting: 'process'
};

// Border style between layers (bottom border of each layer row)
function getLayerBottomBorder(layer, layout, isLast) {
  if (isLast) return null; // no border on the last row
  if (layer === 'dialogue') return { width: 3, style: 'solid', color: '#9aa5a0' };
  return { width: 1, style: 'solid', color: '#b5bfba' };
}

function getLayersForLayout(layout) {
  if (layout === 'sb') {
    return ['environment', 'user', 'dialogue', 'system', 'supporting'];
  }
  return ['user', 'dialogue', 'system'];
}

function getLayerLabel(layer) {
  const labels = {
    user: 'User',
    dialogue: 'Dialogue',
    system: 'System',
    environment: 'Environment',
    supporting: 'Supporting\nProcesses'
  };
  return labels[layer] || layer;
}

function parseCellContent(content) {
  if (!content || content.trim() === '') return { icon: null, text: '' };
  const str = content.trim();
  const match = str.match(/^pix-([a-z0-9_]+)\s*(.*)/s);
  if (match) {
    return { icon: match[1], text: match[2].trim() };
  }
  return { icon: null, text: str };
}

function wrapText(text, maxChars = 20) {
  if (!text) return [];
  const words = text.replace(/\n/g, ' ').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    if (current.length + word.length + 1 > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Render inline SVG icon content (inner elements only, no outer <svg> tag)
 */
function renderIconInline(iconName, x, y, size, fill) {
  const iconSvg = getIconSync(iconName);
  if (!iconSvg) return '';
  const innerMatch = iconSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!innerMatch) return '';
  const scale = size / 256;
  const fillAttr = fill ? ` fill="${fill}" color="${fill}"` : '';
  return `<g transform="translate(${x}, ${y}) scale(${scale})"${fillAttr}>${innerMatch[1]}</g>`;
}

/**
 * Build SVG string for the score
 */
export async function renderScoreToSVG(score) {
  const layers = getLayersForLayout(score.layout);
  const steps = score.scores?.[0] || [];
  const numSteps = steps.length;

  // Calculate dimensions
  const gridWidth = LABEL_WIDTH + numSteps * CELL_WIDTH;
  const totalWidth = gridWidth + PADDING * 2;
  const titleBlockHeight = 50;
  const stepTitleHeight = HEADER_HEIGHT;
  const gridHeight = layers.length * CELL_HEIGHT;
  const totalHeight = titleBlockHeight + stepTitleHeight + gridHeight + NOTE_HEIGHT + PADDING * 2;

  // Preload all icons used (cells + layer headers)
  const iconNames = new Set();
  for (const layer of layers) {
    const headerIcon = LAYER_PIXOGRAM_ICONS[layer];
    if (headerIcon) iconNames.add(headerIcon);
  }
  for (const step of steps) {
    for (const layer of layers) {
      const key = layer === 'supporting' ? 'supporting_processes' : layer;
      const parsed = parseCellContent(step[key]);
      if (parsed.icon) iconNames.add(parsed.icon);
    }
  }
  await Promise.all([...iconNames].map(n => loadIcon(n)));

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`;

  // Define default font style
  svg += `<style>text { font-family: ${FONT_FAMILY}; }</style>`;

  // Background
  svg += `<rect width="${totalWidth}" height="${totalHeight}" fill="#FAFBFC"/>`;

  // Score title
  const startY = PADDING;
  svg += `<text x="${PADDING}" y="${startY + 22}" font-size="${TITLE_FONT_SIZE}" font-weight="700" fill="#2E1948">${escapeXml(score.title || 'Untitled Score')}</text>`;
  if (score.description) {
    svg += `<text x="${PADDING}" y="${startY + 40}" font-size="${FONT_SIZE}" fill="#7B8794">${escapeXml(score.description)}</text>`;
  }

  // Coordinates
  const titlesY = startY + titleBlockHeight;
  const gridY = titlesY + stepTitleHeight;

  // Step titles row — ABOVE the bordered grid
  for (let i = 0; i < numSteps; i++) {
    const x = PADDING + LABEL_WIDTH + i * CELL_WIDTH;
    const hasTitle = !!(steps[i].step_title && steps[i].step_title.trim());

    // Section divider: continuous line from title through grid+notes
    if (hasTitle) {
      svg += `<line x1="${x}" y1="${titlesY}" x2="${x}" y2="${gridY + gridHeight + NOTE_HEIGHT + 4}" stroke="#8a9490" stroke-width="1"/>`;
    }

    if (steps[i].step_title) {
      svg += `<text x="${x + 8}" y="${titlesY + stepTitleHeight - 8}" font-size="10" fill="#D94021" font-weight="700">${escapeXml(steps[i].step_title)}</text>`;
    }
  }

  // Bordered grid — clip inner content to rounded rect
  const clipId = 'grid-clip-' + Math.random().toString(36).slice(2, 8);
  svg += `<defs><clipPath id="${clipId}"><rect x="${PADDING}" y="${gridY}" width="${gridWidth}" height="${gridHeight}" rx="8" ry="8"/></clipPath></defs>`;
  svg += `<g clip-path="url(#${clipId})">`;

  // Layer rows — backgrounds and cell content first
  for (let r = 0; r < layers.length; r++) {
    const layer = layers[r];
    const rowY = gridY + r * CELL_HEIGHT;

    // Label background
    svg += `<rect x="${PADDING}" y="${rowY}" width="${LABEL_WIDTH}" height="${CELL_HEIGHT}" fill="#e0e5e3"/>`;

    // Cell backgrounds
    for (let i = 0; i < numSteps; i++) {
      const x = PADDING + LABEL_WIDTH + i * CELL_WIDTH;
      svg += `<rect x="${x}" y="${rowY}" width="${CELL_WIDTH}" height="${CELL_HEIGHT}" fill="#FFFFFF"/>`;
    }
  }

  // Dividers — drawn on top of backgrounds
  for (let r = 0; r < layers.length; r++) {
    const layer = layers[r];
    const rowY = gridY + r * CELL_HEIGHT;
    const isLast = r === layers.length - 1;
    const border = getLayerBottomBorder(layer, score.layout, isLast);

    // Label right border
    svg += `<line x1="${PADDING + LABEL_WIDTH}" y1="${rowY}" x2="${PADDING + LABEL_WIDTH}" y2="${rowY + CELL_HEIGHT}" stroke="#ccd4d1" stroke-width="1"/>`;

    // Row bottom separator (horizontal line across full width)
    if (border) {
      const lineY = rowY + CELL_HEIGHT;
      svg += `<line x1="${PADDING}" y1="${lineY}" x2="${PADDING + gridWidth}" y2="${lineY}" stroke="${border.color}" stroke-width="${border.width}"/>`;
    }

    // Vertical section dividers inside the grid
    for (let i = 0; i < numSteps; i++) {
      const hasTitle = !!(steps[i].step_title && steps[i].step_title.trim());
      if (hasTitle) {
        const x = PADDING + LABEL_WIDTH + i * CELL_WIDTH;
        svg += `<line x1="${x}" y1="${rowY}" x2="${x}" y2="${rowY + CELL_HEIGHT}" stroke="#8a9490" stroke-width="1"/>`;
      }
    }
  }

  // Icons and text — drawn on top of everything
  for (let r = 0; r < layers.length; r++) {
    const layer = layers[r];
    const rowY = gridY + r * CELL_HEIGHT;

    // Layer header icon + label (vertically centered)
    const headerIconName = LAYER_PIXOGRAM_ICONS[layer];
    const labelText = getLayerLabel(layer);
    const labelLines = labelText.split('\n');
    const labelLineHeight = 12;
    const labelGap = 6;

    let labelContentH = 0;
    if (headerIconName) labelContentH += LABEL_ICON_SIZE;
    if (headerIconName && labelLines.length) labelContentH += labelGap;
    labelContentH += labelLines.length * labelLineHeight;

    const labelTopY = rowY + (CELL_HEIGHT - labelContentH) / 2;
    let labelCursorY = labelTopY;

    if (headerIconName) {
      const iconX = PADDING + (LABEL_WIDTH - LABEL_ICON_SIZE) / 2;
      svg += renderIconInline(headerIconName, iconX, labelCursorY, LABEL_ICON_SIZE, '#D94021');
      labelCursorY += LABEL_ICON_SIZE + labelGap;
    }

    for (let l = 0; l < labelLines.length; l++) {
      svg += `<text x="${PADDING + LABEL_WIDTH / 2}" y="${labelCursorY + l * labelLineHeight}" font-size="9" fill="#D94021" text-anchor="middle" font-weight="600" dominant-baseline="hanging" letter-spacing="0.5">${escapeXml(labelLines[l].toUpperCase())}</text>`;
    }

    // Cell icons and text (vertically centered)
    for (let i = 0; i < numSteps; i++) {
      const x = PADDING + LABEL_WIDTH + i * CELL_WIDTH;
      const key = layer === 'supporting' ? 'supporting_processes' : layer;
      const parsed = parseCellContent(steps[i][key]);
      const textLines = parsed.text ? wrapText(parsed.text, 18).slice(0, 4) : [];
      const lineHeight = 14;
      const iconTextGap = 6;

      // Calculate total content height
      let contentHeight = 0;
      if (parsed.icon) contentHeight += ICON_SIZE;
      if (parsed.icon && textLines.length) contentHeight += iconTextGap;
      if (textLines.length) contentHeight += textLines.length * lineHeight;

      // Vertical offset to center the block
      const topY = rowY + (CELL_HEIGHT - contentHeight) / 2;
      let cursorY = topY;

      if (parsed.icon) {
        const iconX = x + (CELL_WIDTH - ICON_SIZE) / 2;
        svg += renderIconInline(parsed.icon, iconX, cursorY, ICON_SIZE, '#1F2933');
        cursorY += ICON_SIZE + iconTextGap;
      }

      for (let l = 0; l < textLines.length; l++) {
        // dominant-baseline for vertical text alignment
        svg += `<text x="${x + CELL_WIDTH / 2}" y="${cursorY + l * lineHeight}" font-size="${FONT_SIZE}" fill="#1F2933" text-anchor="middle" dominant-baseline="hanging">${escapeXml(textLines[l])}</text>`;
      }
    }
  }

  svg += `</g>`; // close clip group

  // Grid border (on top, after content)
  svg += `<rect x="${PADDING}" y="${gridY}" width="${gridWidth}" height="${gridHeight}" rx="8" ry="8" fill="none" stroke="#ccd4d1" stroke-width="4"/>`;

  // Notes row — BELOW the bordered grid
  const noteY = gridY + gridHeight + 4;
  for (let i = 0; i < numSteps; i++) {
    const x = PADDING + LABEL_WIDTH + i * CELL_WIDTH;
    if (steps[i].note) {
      svg += `<text x="${x + 8}" y="${noteY + NOTE_HEIGHT / 2 + 4}" font-size="9" fill="#52606D" font-style="italic">${escapeXml(steps[i].note)}</text>`;
    }
  }

  svg += `</svg>`;
  return svg;
}

export async function exportSVG(score) {
  const svgString = await renderScoreToSVG(score);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  downloadBlob(blob, sanitizeFilename(score.title || 'pix-score') + '.svg');
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
