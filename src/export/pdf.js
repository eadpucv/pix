// PDF export — uses jsPDF + svg2pdf.js for true vector PDF

import { renderScoreToSVG } from './svg.js';
import { sanitizeFilename } from './json.js';

export async function exportPDF(score) {
  // Dynamic import for code-splitting
  const [{ jsPDF }, svg2pdfModule] = await Promise.all([
    import('jspdf'),
    import('svg2pdf.js')
  ]);

  const svgString = await renderScoreToSVG(score);

  // Parse SVG dimensions
  const widthMatch = svgString.match(/width="(\d+)"/);
  const heightMatch = svgString.match(/height="(\d+)"/);
  const svgWidth = parseInt(widthMatch?.[1] || '800');
  const svgHeight = parseInt(heightMatch?.[1] || '600');

  // Create PDF with appropriate orientation
  const orientation = svgWidth > svgHeight ? 'landscape' : 'portrait';
  const doc = new jsPDF({
    orientation,
    unit: 'pt',
    format: [svgWidth, svgHeight]
  });

  // Parse SVG string into DOM element
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;

  // Render SVG to PDF
  try {
    await doc.svg(svgElement, {
      x: 0,
      y: 0,
      width: svgWidth,
      height: svgHeight
    });
  } catch (e) {
    console.warn('svg2pdf rendering issue, falling back to basic PDF:', e);
    // Fallback: at least create a basic PDF with text
    doc.setFontSize(16);
    doc.text(score.title || 'PiX Score', 20, 30);
    doc.setFontSize(10);
    doc.text(score.description || '', 20, 50);
  }

  doc.save(sanitizeFilename(score.title || 'pix-score') + '.pdf');
}
