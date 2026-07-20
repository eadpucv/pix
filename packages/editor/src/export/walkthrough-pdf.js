// Walkthrough PDF — multi-page export of a Score + ScreenshotTrace,
// one step per page. Top half: screenshot with focus marker. Bottom
// half: per-layer cells with the partitura content for that step.
//
// The output is meant to read like a step-by-step tutorial that pairs
// each captured frame with the symbolic notation it represents.

import { sanitizeFilename } from './json.js';
import { i18n } from '../i18n/index.js';

const PAGE = { w: 842, h: 595 };       // A4 landscape, points
const MARGIN = 28;
const HEADER_H = 28;
const FOOTER_H = 16;

const LAYER_LABEL_KEY = {
  user:        'layer.user',
  dialogue:    'layer.dialogue',
  system:      'layer.system',
  environment: 'layer.environment',
  supporting:  'layer.supporting'
};

function layerKeyOnStep(layer) {
  return layer === 'supporting' ? 'supporting_processes' : layer;
}

function layersForLayout(layout) {
  if (layout === 'sb') return ['environment', 'user', 'dialogue', 'system', 'supporting'];
  return ['user', 'dialogue', 'system'];
}

// Read the dimensions of a base-64 / data-url image without drawing it.
function imageSize(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('image decode failed'));
    img.src = dataUrl;
  });
}

// Strip the leading "pix-icon" token from a cell value if present;
// the PDF doesn't render the pixogram, just the readable caption.
function cellText(value) {
  if (!value) return '';
  const m = value.match(/^pix-[a-z0-9_]+\s*([\s\S]*)/);
  return (m ? m[1] : value).trim();
}

export async function exportWalkthroughPDF(score, trace) {
  const [{ jsPDF }, { registerPdfFonts }] = await Promise.all([
    import('jspdf'),
    import('./fonts.js')
  ]);

  const steps = (score?.scores || []).flat();
  if (steps.length === 0) return;

  const snapshotsByStep = new Map();
  for (const s of trace?.snapshots || []) snapshotsByStep.set(s.step_id, s);

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [PAGE.w, PAGE.h] });
  // IBM Plex Sans, so the tutorial reads in the same face as the app
  // rather than the PDF core Helvetica.
  registerPdfFonts(doc);
  const layers = layersForLayout(score.layout);
  const total  = steps.length;
  const title  = score.title || i18n.t('editor.untitled');

  for (let i = 0; i < steps.length; i++) {
    if (i > 0) doc.addPage();
    const step = steps[i];
    const snap = snapshotsByStep.get(step.id);
    await renderPage(doc, { score, title, total, step, snap, layers, index: i });
  }

  doc.save(sanitizeFilename(title || 'pix-walkthrough') + '-walkthrough.pdf');
}

async function renderPage(doc, ctx) {
  const { score, title, total, step, snap, layers, index } = ctx;

  // ---- Header: title + step counter
  doc.setFont('IBM Plex Sans', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 51);
  doc.text(title, MARGIN, MARGIN + 12);

  doc.setFont('IBM Plex Sans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(123, 135, 148);
  const counter = i18n.t('walkthrough.pdfStepHeader', { current: index + 1, total });
  const counterWidth = doc.getTextWidth(counter);
  doc.text(counter, PAGE.w - MARGIN - counterWidth, MARGIN + 12);

  // separator
  doc.setDrawColor(228, 231, 235);
  doc.line(MARGIN, MARGIN + HEADER_H, PAGE.w - MARGIN, MARGIN + HEADER_H);

  // Layout: left column (screenshot) + right column (partitura)
  const top = MARGIN + HEADER_H + 14;
  const bottom = PAGE.h - MARGIN - FOOTER_H;
  const innerW = PAGE.w - MARGIN * 2;
  const colGap = 16;
  const leftW  = Math.round(innerW * 0.6);
  const rightW = innerW - leftW - colGap;

  await renderScreenshotPanel(doc, snap, {
    x: MARGIN,
    y: top,
    w: leftW,
    h: bottom - top,
    step
  });

  renderPartituraPanel(doc, step, layers, {
    x: MARGIN + leftW + colGap,
    y: top,
    w: rightW,
    h: bottom - top
  });

  // Footer: captured timestamp + URL
  if (snap?.captured_at || snap?.captured_from_url) {
    doc.setFont('IBM Plex Sans', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 160, 170);
    const parts = [];
    if (snap.captured_at) {
      parts.push(`${i18n.t('walkthrough.pdfCapturedAt')}: ${new Date(snap.captured_at).toLocaleString()}`);
    }
    if (snap.captured_from_url) {
      parts.push(snap.captured_from_url);
    }
    const footerY = PAGE.h - MARGIN;
    // Wrap the footer line if too long.
    const lines = doc.splitTextToSize(parts.join('  ·  '), innerW);
    doc.text(lines.slice(0, 1), MARGIN, footerY);
  }
}

async function renderScreenshotPanel(doc, snap, box) {
  if (!snap?.screenshot) {
    doc.setDrawColor(228, 231, 235);
    doc.setFillColor(250, 251, 252);
    doc.roundedRect(box.x, box.y, box.w, box.h, 6, 6, 'FD');
    doc.setFont('IBM Plex Sans', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(150, 160, 170);
    const msg = i18n.t('walkthrough.noSnapshot');
    const lines = doc.splitTextToSize(msg, box.w - 32);
    doc.text(lines, box.x + box.w / 2, box.y + box.h / 2, { align: 'center' });
    return;
  }

  let dims;
  try {
    dims = await imageSize(snap.screenshot);
  } catch {
    dims = { width: 1280, height: 720 };
  }

  // Fit inside the box preserving aspect ratio.
  const scale = Math.min(box.w / dims.width, box.h / dims.height);
  const drawW = dims.width  * scale;
  const drawH = dims.height * scale;
  const drawX = box.x + (box.w - drawW) / 2;
  const drawY = box.y + (box.h - drawH) / 2;

  doc.addImage(snap.screenshot, 'JPEG', drawX, drawY, drawW, drawH);

  // Border
  doc.setDrawColor(228, 231, 235);
  doc.roundedRect(drawX, drawY, drawW, drawH, 4, 4, 'S');

  // Focus marker
  if (snap.focus && typeof snap.focus.x_percent === 'number' && typeof snap.focus.y_percent === 'number') {
    const fx = drawX + (snap.focus.x_percent / 100) * drawW;
    const fy = drawY + (snap.focus.y_percent / 100) * drawH;
    doc.setDrawColor(217, 64, 33);
    doc.setLineWidth(2);
    doc.circle(fx, fy, 14, 'S');
    doc.setLineWidth(1);
  }
}

function renderPartituraPanel(doc, step, layers, box) {
  let cursor = box.y;

  // step_title (section break heading)
  if (step.step_title) {
    doc.setFont('IBM Plex Sans', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(217, 64, 33);
    const lines = doc.splitTextToSize(step.step_title, box.w);
    doc.text(lines, box.x, cursor + 10);
    cursor += lines.length * 14 + 6;
  }

  // Layer cells
  const cellGap = 8;
  const innerPad = 8;

  for (const layer of layers) {
    const value = step[layerKeyOnStep(layer)] || '';
    const label = i18n.t(LAYER_LABEL_KEY[layer]);
    const text  = cellText(value);

    doc.setFont('IBM Plex Sans', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(123, 135, 148);
    doc.text(label.toUpperCase(), box.x + innerPad, cursor + innerPad + 6);

    doc.setFont('IBM Plex Sans', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 51);

    const bodyLines = text
      ? doc.splitTextToSize(text, box.w - innerPad * 2)
      : ['—'];
    if (!text) doc.setTextColor(180, 190, 200);

    const bodyY = cursor + innerPad + 18;
    doc.text(bodyLines, box.x + innerPad, bodyY);

    const blockH = innerPad + 16 + bodyLines.length * 12 + innerPad - 4;
    doc.setDrawColor(228, 231, 235);
    doc.roundedRect(box.x, cursor, box.w, blockH, 4, 4, 'S');

    cursor += blockH + cellGap;
    if (cursor > box.y + box.h - 30) break; // out of page
  }

  // Note
  if (step.note && cursor < box.y + box.h - 30) {
    doc.setFont('IBM Plex Sans', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(123, 135, 148);
    const lines = doc.splitTextToSize(step.note, box.w);
    doc.text(lines, box.x, cursor + 10);
  }
}
