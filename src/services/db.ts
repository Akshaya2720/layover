import { PhotoMemory, UserProgress, UserProfile } from '../../shared/types.js';

const DB_NAME = 'wanderlore_db';
const DB_VERSION = 1;
const STORE_PHOTOS = 'photo_memories';
const STORE_PROGRESS = 'quest_progress';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        db.createObjectStore(STORE_PROGRESS, { keyPath: 'questId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Photo Memories Storage
export async function savePhotoMemory(photo: PhotoMemory): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_PHOTOS, 'readwrite');
    tx.objectStore(STORE_PHOTOS).put(photo);
    await new Promise((res, rej) => {
      tx.oncomplete = res;
      tx.onerror = rej;
    });
  } catch (err) {
    console.warn('[DB] Failed to save photo to IndexedDB, fallback to LocalStorage:', err);
    // LocalStorage fallback
    const key = `wanderlore_photos_${photo.checkpointId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(photo);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

export async function getPhotosForCheckpoint(checkpointId: string): Promise<PhotoMemory[]> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_PHOTOS, 'readonly');
    const store = tx.objectStore(STORE_PHOTOS);
    const all = await new Promise<PhotoMemory[]>((res, rej) => {
      const req = store.getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror = rej;
    });
    return all.filter((p) => p.checkpointId === checkpointId);
  } catch {
    const key = `wanderlore_photos_${checkpointId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
}

export async function getAllPhotos(): Promise<PhotoMemory[]> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_PHOTOS, 'readonly');
    const store = tx.objectStore(STORE_PHOTOS);
    return await new Promise<PhotoMemory[]>((res, rej) => {
      const req = store.getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror = rej;
    });
  } catch {
    return [];
  }
}

// User Progress & Quest State Storage
export async function saveQuestProgress(progress: UserProgress): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_PROGRESS, 'readwrite');
    tx.objectStore(STORE_PROGRESS).put(progress);
    await new Promise((res, rej) => {
      tx.oncomplete = res;
      tx.onerror = rej;
    });
  } catch {
    localStorage.setItem(`wanderlore_prog_${progress.questId}`, JSON.stringify(progress));
  }
  // Also keep active quest pointer in LocalStorage for instant resume
  localStorage.setItem('wanderlore_active_quest_id', progress.questId);
}

export async function loadQuestProgress(questId: string): Promise<UserProgress | null> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_PROGRESS, 'readonly');
    const store = tx.objectStore(STORE_PROGRESS);
    const prog = await new Promise<UserProgress | null>((res, rej) => {
      const req = store.get(questId);
      req.onsuccess = () => res(req.result || null);
      req.onerror = rej;
    });
    if (prog) return prog;
  } catch {
    // fallback
  }

  const saved = localStorage.getItem(`wanderlore_prog_${questId}`);
  return saved ? JSON.parse(saved) : null;
}

// User Profile Storage (Guests / Registered)
export function getUserProfile(): UserProfile {
  const saved = localStorage.getItem('wanderlore_user_profile');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  const guest: UserProfile = {
    id: `guest_${Date.now()}`,
    username: 'Guest Explorer',
    isGuest: true,
    avatarIcon: '🧭',
    totalScore: 0,
    badges: [],
    savedQuests: [],
  };
  localStorage.setItem('wanderlore_user_profile', JSON.stringify(guest));
  return guest;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem('wanderlore_user_profile', JSON.stringify(profile));
}
