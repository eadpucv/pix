// IndexedDB wrapper for PiX score library

const DB_NAME = 'pix-library';
const DB_VERSION = 1;
const STORE_NAME = 'scores';
const MAX_SLOTS = 20;

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

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function getAllScores() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const scores = request.result || [];
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
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveScore(score) {
  const db = await openDB();
  const now = Date.now();

  if (!score.id) {
    // Check slot limit
    const count = await getCount();
    if (count >= MAX_SLOTS) {
      throw new Error('Library is full');
    }
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

  return saveScore(copy);
}

export async function seedExamples(examples) {
  const count = await getCount();
  if (count > 0) return; // Already seeded

  for (const example of examples) {
    await saveScore({ ...example });
  }
}

export { MAX_SLOTS };
