/**
 * Persistent Video & Binary Blob Storage for Bodo VR Museum
 * 
 * Uses IndexedDB ('videos_blob_store') to store large video files (MP4, WebM)
 * and generate persistent memory ObjectURLs during the session, with automatic
 * restoration across page refreshes.
 * 
 * Supports both local binary video uploads and external embedded streams
 * (YouTube, Vimeo, MP4 direct streams).
 */

const DB_NAME = 'BodoHeritage3D_DB';
const DB_VERSION = 3; // Bump to 3 to add 'videos_blob_store'
const VIDEOS_STORE = 'videos_blob_store';

// Active Object URL cache so we reuse active URLs and revoke on replacement/deletion
const videoUrlCache = new Map<string, string>();

function openVideoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('models_blob_store')) {
        db.createObjectStore('models_blob_store', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('content_store')) {
        db.createObjectStore('content_store', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('images_blob_store')) {
        db.createObjectStore('images_blob_store', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(VIDEOS_STORE)) {
        db.createObjectStore(VIDEOS_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open Video IndexedDB'));
  });
}

export interface VideoBlobRecord {
  id: string;
  blob: Blob;
  name: string;
  type: string;
  size: number;
  uploadedAt: number;
}

/**
 * Validate video file type and size
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const ext = file.name.toLowerCase();
  const isValidExt = ext.endsWith('.mp4') || ext.endsWith('.webm') || ext.endsWith('.ogg');
  
  if (!validTypes.includes(file.type) && !isValidExt) {
    return {
      valid: false,
      error: 'Invalid video format. Please upload an MP4 or WebM video file (.mp4, .webm).',
    };
  }

  // 500 MB max browser limit
  const maxBytes = 500 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: 'File size exceeds 500MB. Please select a compressed video.',
    };
  }

  return { valid: true };
}

/**
 * Persistently save a video file to IndexedDB
 */
export async function saveVideoBlob(
  id: string,
  fileOrBlob: File | Blob,
  fileName = 'video.mp4'
): Promise<string> {
  const db = await openVideoDB();

  const record: VideoBlobRecord = {
    id,
    blob: fileOrBlob,
    name: fileName,
    type: fileOrBlob.type || 'video/mp4',
    size: fileOrBlob.size,
    uploadedAt: Date.now(),
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([VIDEOS_STORE], 'readwrite');
    const store = tx.objectStore(VIDEOS_STORE);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  // Revoke existing cached URL if any
  if (videoUrlCache.has(id)) {
    try {
      URL.revokeObjectURL(videoUrlCache.get(id)!);
    } catch {}
  }

  const objectUrl = URL.createObjectURL(fileOrBlob);
  videoUrlCache.set(id, objectUrl);
  return objectUrl;
}

/**
 * Retrieve a persistent video URL from IndexedDB by its storage key
 */
export async function resolveVideoUrl(id: string): Promise<string | null> {
  if (videoUrlCache.has(id)) {
    return videoUrlCache.get(id)!;
  }

  try {
    const db = await openVideoDB();
    const record = await new Promise<VideoBlobRecord | null>((resolve, reject) => {
      const tx = db.transaction([VIDEOS_STORE], 'readonly');
      const store = tx.objectStore(VIDEOS_STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    if (record && record.blob) {
      const objectUrl = URL.createObjectURL(record.blob);
      videoUrlCache.set(id, objectUrl);
      return objectUrl;
    }
  } catch (err) {
    console.warn('[videoStorage] resolveVideoUrl error:', err);
  }

  return null;
}

/**
 * Delete a stored video from IndexedDB
 */
export async function deleteVideoBlob(id: string): Promise<boolean> {
  try {
    if (videoUrlCache.has(id)) {
      try {
        URL.revokeObjectURL(videoUrlCache.get(id)!);
      } catch {}
      videoUrlCache.delete(id);
    }

    const db = await openVideoDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([VIDEOS_STORE], 'readwrite');
      const store = tx.objectStore(VIDEOS_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    return true;
  } catch (err) {
    console.warn('[videoStorage] deleteVideoBlob error:', err);
    return false;
  }
}

/**
 * Parse and validate video URLs (YouTube, Vimeo, or direct video streams)
 */
export interface ParsedVideoUrl {
  type: 'youtube' | 'vimeo' | 'direct';
  embedUrl: string;
  originalUrl: string;
}

export function parseVideoUrl(input: string): ParsedVideoUrl | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. YouTube
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      originalUrl: trimmed,
    };
  }

  // 2. Vimeo
  // Matches: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      originalUrl: trimmed,
    };
  }

  // 3. Direct Video URLs (e.g., .mp4, .webm, or absolute HTTP/local paths)
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:video')
  ) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed,
    };
  }

  return null;
}
