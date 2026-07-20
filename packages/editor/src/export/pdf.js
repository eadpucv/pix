// PDF export — uses jsPDF + svg2pdf.js for true vector PDF

import { renderScoreToSVG } from './svg.js';
import { sanitizeFilename } from './json.js';

export async function exportPDF(score) {
  // Dynamic import for code-splitting
  const [{ jsPDF }, svg2pdfModule, { registerPdfFonts }] = await Promise.all([
    import('jspdf'),
    import('svg2pdf.js'),
    import('./fonts.js')
  ]);

  const svgString = await renderScoreToSVG(score);

  // svg2pdf reads the fonts from the jsPDF VFS by name, not from the
  // SVG's @font-face — so drop the (large) embedded <style> block, and
  // collapse each <text>'s font-family fallback list down to the single
  // registered name svg2pdf will match (svg2pdf does not resolve a
  // comma-separated stack). Cells map to the condensed face, everything
  // else to the normal one. Labels use letter-spacing, which svg2pdf
  // mishandles, so they are stripped as before.
  const pdfSvg = svgString
    .replace(/<style>[\s\S]*?<\/style>/, '')
    .replace(/<text[^>]*letter-spacing[^>]*>.*?<\/text>/g, '')
    .replace(/font-family="[^"]*"/g, m =>
      m.includes('Cond') ? 'font-family="IBM Plex Sans Cond"' : 'font-family="IBM Plex Sans"');

  // Parse SVG dimensions
  const widthMatch = pdfSvg.match(/width="(\d+)"/);
  const heightMatch = pdfSvg.match(/height="(\d+)"/);
  const svgWidth = parseInt(widthMatch?.[1] || '800');
  const svgHeight = parseInt(heightMatch?.[1] || '600');

  // Create PDF with appropriate orientation
  const orientation = svgWidth > svgHeight ? 'landscape' : 'portrait';
  const doc = new jsPDF({
    orientation,
    unit: 'pt',
    format: [svgWidth, svgHeight]
  });

  // Embed IBM Plex Sans so the PDF matches the screen instead of
  // falling back to the core Helvetica.
  registerPdfFonts(doc);
  doc.setFont('IBM Plex Sans', 'normal');

  // Parse SVG string into DOM element
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(pdfSvg, 'image/svg+xml');
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
    let fallbackY = 30;
    if (score.title && score.title.trim()) {
      doc.setFontSize(16);
      doc.text(score.title, 20, fallbackY);
      fallbackY += 20;
    }
    if (score.description && score.description.trim()) {
      doc.setFontSize(10);
      doc.text(score.description, 20, fallbackY);
    }
  }

  doc.save(sanitizeFilename(score.title || 'pix-score') + '.pdf');
}
