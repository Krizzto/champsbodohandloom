import { SiteContent } from '../data/siteContent';
import {
  WeaverProfile,
  Artifact,
  Model3D,
  Motif,
  DyeingStep,
  DyeingImageRecord,
  ProcessStage,
} from '../types';

export interface ContentStoragePayload {
  siteContent: SiteContent;
  weavers: WeaverProfile[];
  artifacts: Artifact[];
  models: Model3D[];
  motifs: Motif[];
  dyeingSteps: DyeingStep[];
  dyeingImages: DyeingImageRecord[];
  processes: ProcessStage[];
  documentaries?: import('../types').DocumentaryVideo[];
  customImages?: Record<string, string>;
  version: number;
  lastSavedAt: number;
}

const DB_NAME = 'BodoHeritage3D_DB';
const DB_VERSION = 3; // Upgraded to 3 to include videos_blob_store
const CONTENT_STORE = 'content_store';
const IMAGES_STORE = 'images_blob_store';
const VIDEOS_STORE = 'videos_blob_store';
const CONTENT_RECORD_KEY = 'authoritative_content_payload';

const LOCAL_STORAGE_BACKUP_KEY = 'bodo_vr_museum_content_v2';
const LOCAL_STORAGE_TEXT_KEY = 'bodo_vr_museum_text_cache_v3';

/**
 * Initialize / open IndexedDB with content, image, model, and video stores
 */
export function openContentDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const req = window.indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('models_blob_store')) {
        db.createObjectStore('models_blob_store', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CONTENT_STORE)) {
        db.createObjectStore(CONTENT_STORE, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(VIDEOS_STORE)) {
        db.createObjectStore(VIDEOS_STORE, { keyPath: 'id' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open database'));
  });
}

/**
 * Save authoritative content payload to IndexedDB and sync lightweight text cache to localStorage.
 * Guarantees that large images/videos do not crash localStorage with QuotaExceededError.
 */
export async function saveContentPayload(payload: Omit<ContentStoragePayload, 'version' | 'lastSavedAt'>): Promise<boolean> {
  const fullPayload: ContentStoragePayload = {
    ...payload,
    version: 3,
    lastSavedAt: Date.now(),
  };

  let idbSuccess = false;

  // 1. Primary Authoritative Storage: IndexedDB (hundreds of MBs available)
  try {
    const db = await openContentDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([CONTENT_STORE], 'readwrite');
      const store = tx.objectStore(CONTENT_STORE);
      const req = store.put({ key: CONTENT_RECORD_KEY, data: fullPayload });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    idbSuccess = true;
  } catch (err) {
    console.warn('[ContentStorage] IndexedDB save notice:', err);
  }

  // 2. Synchronous LocalStorage Backup (stripping out heavy base64 customImages to guarantee it fits within 5MB)
  if (typeof window !== 'undefined') {
    try {
      const lightweightTextPayload = {
        siteContent: fullPayload.siteContent,
        weavers: fullPayload.weavers,
        artifacts: fullPayload.artifacts,
        models: fullPayload.models,
        motifs: fullPayload.motifs,
        dyeingSteps: fullPayload.dyeingSteps,
        dyeingImages: fullPayload.dyeingImages,
        processes: fullPayload.processes,
        documentaries: fullPayload.documentaries,
        lastSavedAt: fullPayload.lastSavedAt,
      };
      localStorage.setItem(LOCAL_STORAGE_TEXT_KEY, JSON.stringify(lightweightTextPayload));
      // Also update backward-compatible key without large images
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify({
        ...lightweightTextPayload,
        customImages: {}, // empty in localStorage to prevent QuotaExceededError
      }));
    } catch (err) {
      console.warn('[ContentStorage] LocalStorage backup notice:', err);
    }
  }

  return idbSuccess;
}

/**
 * Load authoritative content payload. Checks IndexedDB first, then falls back to localStorage.
 */
export async function loadContentPayload(): Promise<ContentStoragePayload | null> {
  // 1. Try IndexedDB
  try {
    const db = await openContentDB();
    const result = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction([CONTENT_STORE], 'readonly');
      const store = tx.objectStore(CONTENT_STORE);
      const req = store.get(CONTENT_RECORD_KEY);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => reject(req.error);
    });

    if (result && result.siteContent && result.weavers) {
      return result as ContentStoragePayload;
    }
  } catch (err) {
    console.warn('[ContentStorage] IndexedDB load notice:', err);
  }

  // 2. Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const textRaw = localStorage.getItem(LOCAL_STORAGE_TEXT_KEY) || localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
      if (textRaw) {
        const parsed = JSON.parse(textRaw);
        if (parsed && typeof parsed === 'object') {
          return {
            ...parsed,
            version: 2,
            lastSavedAt: parsed.lastSavedAt || Date.now(),
          } as ContentStoragePayload;
        }
      }
    } catch (e) {
      console.warn('[ContentStorage] LocalStorage read error:', e);
    }
  }

  return null;
}

/**
 * Synchronous initial read for immediate React state hydration before IndexedDB async completes.
 */
export function getInitialSynchronousContent(): Partial<ContentStoragePayload> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TEXT_KEY) || localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
