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

  // Inject font-family="helvetica" on every <text> element for svg2pdf.
  // svg2pdf.js does NOT inherit font-family from parent <g> elements —
  // it only reads the attribute directly on each <text>. Without it, Times (serif) is used.
  // Also strip layer header labels (letter-spacing causes svg2pdf rendering issues)
  const pdfSvg = svgString
    .replace(/<text[^>]*letter-spacing[^>]*>.*?<\/text>/g, '')
    .replaceAll('<text ', '<text font-family="helvetica" ');

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
