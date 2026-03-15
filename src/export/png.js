// PNG export — renders SVG to canvas then downloads as PNG

import { renderScoreToSVG } from './svg.js';
import { downloadBlob, sanitizeFilename } from './json.js';

export async function exportPNG(score, scale = 2) {
  const svgString = await renderScoreToSVG(score);

  // Parse SVG dimensions
  const widthMatch = svgString.match(/width="(\d+)"/);
  const heightMatch = svgString.match(/height="(\d+)"/);
  const width = parseInt(widthMatch?.[1] || '800') * scale;
  const height = parseInt(heightMatch?.[1] || '600') * scale;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#FAFBFC';
  ctx.fillRect(0, 0, width, height);

  // Render SVG to image
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, sanitizeFilename(score.title || 'pix-score') + '.png');
          resolve();
        } else {
          reject(new Error('Failed to create PNG'));
        }
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to render SVG to image'));
    };
    img.src = url;
  });
}
