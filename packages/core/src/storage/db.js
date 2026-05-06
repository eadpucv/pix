// IndexedDB wrapper for PiX score library

import { newId } from '../ids/index.js';
import { migrateScore } from '../migrations/migrate.js';

const DB_NAME = 'pix-library';
const DB_VERSION = 1;
const STORE_NAME = 'scores';

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
    };

    request.onsuccess = (e) => {
      dbInstance = e.target.result;
      resolve(dbInstance);
    };

    request.onerror = (e) => {
      reject(new Error('Failed to open database: ' + e.target.error));
    };
  });
}

// Score.id generator — delegates to nanoid via @pix/core/ids for
// consistency with the movement/step ids introduced in Phase C.
// Existing Date-based ids in IndexedDB remain valid.
const generateId = newId;

// Lazy backfill — migrateScore is idempotent, so calling it on every
// read costs nothing for scores that already carry stable ids and rescues
// pre-Phase-C scores that don't. Persistence happens on the next save.
function migrateOrNull(score) {
  return score ? migrateScore(score) : null;
}

export async function getAllScores() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const scores = (request.result || []).map(migrateOrNull);
      scores.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      resolve(scores);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getScore(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(migrateOrNull(request.result || null));
    request.onerror = () => reject(request.error);
  });
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
  // identity with the original — each ScoreStep id must map to exactly
  // one local entity for the extension's re-import contract.
  if (Array.isArray(copy.movement_ids)) {
    copy.movement_ids = copy.movement_ids.map(() => newId());
  }
  if (Array.isArray(copy.scores)) {
    copy.scores = copy.scores.map(movement =>
      movement.map(step => ({ ...step, id: newId() }))
    );
  }

  return saveScore(copy);
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
