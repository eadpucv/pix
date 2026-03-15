// SVG export — renders the score as a clean SVG document

import { getIconSync, loadIcon } from '../data/icons-meta.js';
import { downloadBlob, sanitizeFilename } from './json.js';

const CELL_WIDTH = 160;
const CELL_HEIGHT = 120;
const LABEL_WIDTH = 130;
const HEADER_HEIGHT = 36;
const ICON_SIZE = 48;
const NOTE_HEIGHT = 28;
const PADDING = 16;
const FONT_SIZE = 11;
const TITLE_FONT_SIZE = 18;

const LAYER_COLORS = {
  user: { label: '#F4845F' },
  dialogue: { label: '#7B8794' },
  system: { label: '#47B881' },
  environment: { label: '#E8A838' },
  supporting: { label: '#52606D' }
};

// Border style between layers (bottom border of each layer row)
function getLayerBottomBorder(layer, layout) {
  // Dialogue -> System: 3px solid (visibility line)
  if (layer === 'dialogue') return { width: 3, style: 'solid', color: '#ccd4d1' };
  // Between environment and user (SB): dotted
  if (layer === 'environment') return { width: 1, style: 'dotted', color: '#ccd4d1' };
  // Between user and dialogue: dotted
  if (layer === 'user') return { width: 1, style: 'dotted', color: '#ccd4d1' };
  // Between system and supporting (SB): dotted
  if (layer === 'system' && layout === 'sb') return { width: 1, style: 'dotted', color: '#ccd4d1' };
  return { width: 1, style: 'solid', color: '#ccd4d1' };
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
    supporting: 'Supporting Processes'
  };
  return labels[layer] || layer;
}

/**
 * Parse cell content: extract icon name and text
 */
function parseCellContent(content) {
  if (!content || content.trim() === '') return { icon: null, text: '' };
  const str = content.trim();
  const match = str.match(/^pix-([a-z0-9_]+)\s*(.*)/s);
  if (match) {
    return { icon: match[1], text: match[2].trim() };
  }
  return { icon: null, text: str };
}

/**
 * Wrap text into lines that fit within maxWidth (approximate)
 */
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
 * Build SVG string for the score
 */
export async function renderScoreToSVG(score) {
  const layers = getLayersForLayout(score.layout);
  const steps = score.scores?.[0] || [];
  const numSteps = steps.length;

  // Calculate dimensions
  const totalWidth = LABEL_WIDTH + numSteps * CELL_WIDTH + PADDING * 2;
  const titleBlockHeight = 50;
  const stepTitleHeight = HEADER_HEIGHT; // step titles above grid
  const totalHeight = titleBlockHeight + stepTitleHeight + layers.length * CELL_HEIGHT + NOTE_HEIGHT + PADDING * 2;

  // Preload all icons used
  const iconNames = new Set();
  for (const step of steps) {
    for (const layer of layers) {
      const key = layer === 'supporting' ? 'supporting_processes' : layer;
      const parsed = parseCellContent(step[key]);
      if (parsed.icon) iconNames.add(parsed.icon);
    }
  }
  await Promise.all([...iconNames].map(n => loadIcon(n)));

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">`;

  // Background
  svg += `<rect width="${totalWidth}" height="${totalHeight}" fill="#FAFBFC"/>`;

  // Score title
  const startY = PADDING;
  svg += `<text x="${PADDING}" y="${startY + 22}" font-size="${TITLE_FONT_SIZE}" font-weight="700" fill="#2E1948">${escapeXml(score.title || 'Untitled Score')}</text>`;
  if (score.description) {
    svg += `<text x="${PADDING}" y="${startY + 40}" font-size="${FONT_SIZE}" fill="#7B8794">${escapeXml(score.description)}</text>`;
  }

  // Step titles row — ABOVE the bordered grid
  const titlesY = startY + titleBlockHeight;
  const gridY = titlesY + stepTitleHeight;
  const gridHeight = layers.length * CELL_HEIGHT;

  for (let i = 0; i < numSteps; i++) {
    const x = PADDING + LABEL_WIDTH + i * CELL_WIDTH;
    const hasTitle = !!(steps[i].step_title && steps[i].step_title.trim());

    // Section start: continuous divider from title through entire grid
    if (hasTitle) {
      svg += `<line x1="${x}" y1="${titlesY}" x2="${x}" y2="${gridY + gridHeight}" stroke="#a8b2ad" stroke-width="2"/>`;
    }

    if (steps[i].step_title) {
      svg += `<text x="${x + 8}" y="${titlesY + stepTitleHeight - 8}" font-size="10" fill="#D94021" font-weight="700">${escapeXml(steps[i].step_title)}</text>`;
    }
  }

  // Bordered grid — only layer rows
  const gridWidth = LABEL_WIDTH + numSteps * CELL_WIDTH;
  svg += `<rect x="${PADDING}" y="${gridY}" width="${gridWidth}" height="${gridHeight}" rx="8" ry="8" fill="none" stroke="#ccd4d1" stroke-width="4"/>`;

  // Layer rows
  for (let r = 0; r < layers.length; r++) {
    const layer = layers[r];
    const rowY = gridY + r * CELL_HEIGHT;
    const border = getLayerBottomBorder(layer, score.layout);

    // Label background
    svg += `<rect x="${PADDING}" y="${rowY}" width="${LABEL_WIDTH}" height="${CELL_HEIGHT}" fill="#e0e5e3"/>`;
    // Left accent border
    svg += `<rect x="${PADDING}" y="${rowY}" width="4" height="${CELL_HEIGHT}" fill="#ccd4d1"/>`;
    svg += `<text x="${PADDING + LABEL_WIDTH / 2}" y="${rowY + CELL_HEIGHT / 2 + 4}" font-size="10" fill="#D94021" text-anchor="middle" font-weight="600" text-transform="uppercase">${escapeXml(getLayerLabel(layer))}</text>`;

    // Row bottom separator
    if (r < layers.length - 1) {
      if (border.style === 'dotted') {
        svg += `<line x1="${PADDING}" y1="${rowY + CELL_HEIGHT}" x2="${PADDING + LABEL_WIDTH + numSteps * CELL_WIDTH}" y2="${rowY + CELL_HEIGHT}" stroke="${border.color}" stroke-width="${border.width}" stroke-dasharray="4,3"/>`;
      } else {
        svg += `<line x1="${PADDING}" y1="${rowY + CELL_HEIGHT}" x2="${PADDING + LABEL_WIDTH + numSteps * CELL_WIDTH}" y2="${rowY + CELL_HEIGHT}" stroke="${border.color}" stroke-width="${border.width}"/>`;
      }
    }

    // Cells
    for (let i = 0; i < numSteps; i++) {
      const x = PADDING + LABEL_WIDTH + i * CELL_WIDTH;
      const key = layer === 'supporting' ? 'supporting_processes' : layer;
      const parsed = parseCellContent(steps[i][key]);
      const hasTitle = !!(steps[i].step_title && steps[i].step_title.trim());

      // Cell background — white
      svg += `<rect x="${x}" y="${rowY}" width="${CELL_WIDTH}" height="${CELL_HEIGHT}" fill="#FFFFFF"/>`;

      // Section start: thicker left border
      if (hasTitle) {
        svg += `<line x1="${x}" y1="${rowY}" x2="${x}" y2="${rowY + CELL_HEIGHT}" stroke="#ccd4d1" stroke-width="3"/>`;
      } else if (i > 0) {
        // Subtle cell right border
        svg += `<line x1="${x}" y1="${rowY}" x2="${x}" y2="${rowY + CELL_HEIGHT}" stroke="#ccd4d1" stroke-width="0.5"/>`;
      }

      // Icon
      if (parsed.icon) {
        const iconSvg = getIconSync(parsed.icon);
        if (iconSvg) {
          const innerMatch = iconSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
          if (innerMatch) {
            const iconX = x + (CELL_WIDTH - ICON_SIZE) / 2;
            const iconY = rowY + 8;
            svg += `<g transform="translate(${iconX}, ${iconY}) scale(${ICON_SIZE / 256})">${innerMatch[1]}</g>`;
          }
        }
      }

      // Text
      if (parsed.text) {
        const textLines = wrapText(parsed.text, 18);
        const textStartY = parsed.icon ? rowY + ICON_SIZE + 16 : rowY + CELL_HEIGHT / 2;
        for (let l = 0; l < textLines.length && l < 3; l++) {
          svg += `<text x="${x + CELL_WIDTH / 2}" y="${textStartY + l * 13}" font-size="${FONT_SIZE}" fill="#1F2933" text-anchor="middle">${escapeXml(textLines[l])}</text>`;
        }
      }
    }
  }

  // Notes row — BELOW the bordered grid (no header label)
  const noteY = gridY + gridHeight + 4;

  for (let i = 0; i < numSteps; i++) {
    const x = PADDING + LABEL_WIDTH + i * CELL_WIDTH;
    if (i > 0) {
      svg += `<line x1="${x}" y1="${noteY + 2}" x2="${x}" y2="${noteY + NOTE_HEIGHT - 2}" stroke="#ccd4d1" stroke-width="0.5" opacity="0.3"/>`;
    }
    if (steps[i].note) {
      svg += `<text x="${x + 8}" y="${noteY + NOTE_HEIGHT / 2 + 4}" font-size="9" fill="#7B8794" font-style="italic">${escapeXml(steps[i].note)}</text>`;
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
