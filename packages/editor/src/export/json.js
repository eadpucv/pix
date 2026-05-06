// JSON export/import

export function exportJSON(score) {
  // Emit stable ids — required by the extension's round-trip re-import.
  // The base64 URL embed (encodeScoreData) is the place that strips them.
  const data = {
    id: score.id,
    title: score.title,
    layout: score.layout,
    description: score.description,
    movement_ids: score.movement_ids,
    scores: score.scores
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, sanitizeFilename(score.title || 'pix-score') + '.json');
}

export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-\s]/gi, '').replace(/\s+/g, '-').toLowerCase() || 'pix-score';
}

export { downloadBlob, sanitizeFilename };
