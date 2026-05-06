// focus.js — pure: (DOMRect, viewport) → FocusRegion
//
// Implements `focus_from_box` from interaction-capture.allium. The
// FocusRegion travels with each captured ScoreStep and lets the editor
// (and tutorial PDF) paint a highlight at the correct relative position
// even after the screenshot is rescaled.

/** @typedef {{ x_percent: number, y_percent: number, radius_percent: number }} FocusRegion */

/**
 * Compute a normalised focus region from an element's bounding rect.
 * Coordinates are percentages of viewport dimensions so the highlight
 * survives image resizing.
 * @param {{ x: number, y: number, width: number, height: number }} rect — element rect in viewport pixels
 * @param {{ width: number, height: number }} viewport
 * @returns {FocusRegion}
 */
export function focusFromRect(rect, viewport) {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const longestEdge = Math.max(viewport.width, viewport.height);
  const radius = Math.max(rect.width, rect.height) / 2;

  return {
    x_percent: clamp((cx / viewport.width) * 100, 0, 100),
    y_percent: clamp((cy / viewport.height) * 100, 0, 100),
    radius_percent: clamp((radius / (longestEdge / 2)) * 100, 0, 100)
  };
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Extract the eTLD+1 (or best-effort host) from a URL string.
 * Used by BoundaryReflectsHostChange to mark cross-site captures.
 * @param {string|null|undefined} url
 * @returns {string|null}
 */
export function hostOf(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}
