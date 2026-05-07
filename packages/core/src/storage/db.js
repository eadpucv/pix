// IndexedDB wrapper for PiX score library

import { newId } from '../ids/index.js';
import { migrateScore, extractTrace } from '../migrations/migrate.js';

const DB_NAME = 'pix-library';
const DB_VERSION = 2;
const STORE_NAME = 'scores';
const TRACES_STORE = 'traces';

let dbInstance = null;

function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.createIndex('title', 'title', { unique: false });
      }
      if (!db.objectStoreNames.contains(TRACES_STORE)) {
        // Traces are 1:1 with scores. Keying by score_id makes the
        // relationship explicit and lookup trivial.
        db.createObjectStore(TRACES_STORE, { keyPath: 'score_id' });
      }
    };

    request.onsuccess = (e) => {
      dbInstance = e.target.result;
      // If a future bundle bumps the version, close this connection so
      // the upgrade isn't blocked by us.
      dbInstance.onversionchange = () => {
        try { dbInstance.close(); } catch {}
        dbInstance = null;
      };
      resolve(dbInstance);
    };

    request.onerror = (e) => {
      reject(new Error('Failed to open database: ' + e.target.error));
    };

    // Fired when the upgrade is blocked because another tab still
    // holds a v1 connection. Without a handler the open() request
    // hangs forever and the library appears empty.
    request.onblocked = () => {
      reject(new Error(
        'IndexedDB upgrade blocked. Close other PiX tabs and reload this page.'
      ));
    };
  });
}

// Score.id generator — delegates to nanoid via @pix/core/ids for
// consistency with the movement/step ids introduced in Phase C.
const generateId = newId;

// Lazy migration on read. extractTrace splits any embedded
// capture-derived fields out into a separate Trace; migrateScore
// then normalises the cleaned Score. The extracted Trace is
// persisted as a side effect so subsequent reads see clean data.
async function migrateOrNull(rawScore) {
  if (!rawScore) return null;
  const { score, trace } = extractTrace(rawScore);
  if (trace) {
    try { await saveTrace(trace); } catch { /* non-fatal — next read retries */ }
  }
  return migrateScore(score);
}

export async function getAllScores() {
  const db = await openDB();
  const raw = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
  const migrated = await Promise.all(raw.map(migrateOrNull));
  migrated.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return migrated;
}

export async function getScore(id) {
  const db = await openDB();
  const raw = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  return migrateOrNull(raw);
}

export async function saveScore(score) {
  const db = await openDB();
  const now = Date.now();

  if (!score.id) {
    score.id = generateId();
    score.createdAt = now;
  }
  score.updatedAt = now;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(score);
    request.onsuccess = () => resolve(score);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteScore(id) {
  const db = await openDB();
  // Cascade: drop the matching trace first (best-effort), then the score.
  await deleteTrace(id).catch(() => {});
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getCount() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function duplicateScore(id) {
  const original = await getScore(id);
  if (!original) return null;

  const copy = JSON.parse(JSON.stringify(original));
  delete copy.id;
  delete copy.createdAt;
  delete copy.updatedAt;
  copy.title = original.title + ' (copy)';

  // Regenerate movement and step ids so the duplicate doesn't share
  // identity with the original.
  if (Array.isArray(copy.movement_ids)) {
    copy.movement_ids = copy.movement_ids.map(() => newId());
  }
  if (Array.isArray(copy.scores)) {
    copy.scores = copy.scores.map(movement =>
      movement.map(step => ({ ...step, id: newId() }))
    );
  }

  return saveScore(copy);
  // Note: the trace is NOT duplicated. A copy is a fresh score that
  // has no recording history of its own — it's an authored derivative.
}

// ---- ScreenshotTrace API ----

export async function getTrace(scoreId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRACES_STORE, 'readonly');
    const store = tx.objectStore(TRACES_STORE);
    const request = store.get(scoreId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveTrace(trace) {
  if (!trace || !trace.score_id) {
    throw new Error('saveTrace: trace.score_id is required');
  }
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRACES_STORE, 'readwrite');
    const store = tx.objectStore(TRACES_STORE);
    const request = store.put(trace);
    request.onsuccess = () => resolve(trace);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteTrace(scoreId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRACES_STORE, 'readwrite');
    const store = tx.objectStore(TRACES_STORE);
    const request = store.delete(scoreId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Estimate storage usage percentage (0–100).
 * Returns null if the Storage API is not available.
 */
export async function getStorageUsage() {
  if (navigator.storage && navigator.storage.estimate) {
    const { usage, quota } = await navigator.storage.estimate();
    if (quota > 0) {
      return { usage, quota, percent: Math.round((usage / quota) * 100) };
    }
  }
  return null;
}
