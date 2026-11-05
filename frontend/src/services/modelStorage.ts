import { Model3D } from '../types';

const DB_NAME = 'BodoHeritage3D_DB';
const DB_VERSION = 3; // Synchronized with contentStorage.ts and videoStorage.ts
const STORE_NAME = 'models_blob_store';

// Cache for active object URLs created from IndexedDB blobs
const objectUrlCache = new Map<string, string>();

/**
 * Initialize IndexedDB for storing binary 3D assets (GLB / GLTF)
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('content_store')) {
        db.createObjectStore('content_store', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('images_blob_store')) {
        db.createObjectStore('images_blob_store', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('videos_blob_store')) {
        db.createObjectStore('videos_blob_store', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

/**
 * Validate uploaded 3D model file (.glb / .gltf)
 */
export function validate3DFile(file: File): {
  valid: boolean;
  error?: string;
  warning?: string;
  type: 'glb' | 'gltf';
} {
  const name = file.name.toLowerCase();
  const isGLB = name.endsWith('.glb');
  const isGLTF = name.endsWith('.gltf');

  if (!isGLB && !isGLTF) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a GLB or GLTF model (.glb, .gltf).',
      type: 'glb',
    };
  }

  const type: 'glb' | 'gltf' = isGLB ? 'glb' : 'gltf';
  let warning: string | undefined;

  // 35MB warning threshold for smooth mobile AR performance
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > 35) {
    warning = `File size is ${sizeMB.toFixed(1)}MB. Large 3D models (>35MB) may take longer to load on mobile WebXR devices.`;
  }

  return {
    valid: true,
    warning,
    type,
  };
}

/**
 * Save binary 3D model blob into IndexedDB
 */
export async function saveModelBlob(id: string, blob: Blob, fileName: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = {
      id,
      fileName,
      blob,
      size: blob.size,
      type: blob.type || (fileName.endsWith('.glb') ? 'model/gltf-binary' : 'model/gltf+json'),
      updatedAt: Date.now(),
    };

    const request = store.put(record);
    request.onsuccess = () => {
      // If we previously had an object URL for this model, revoke it so a fresh one is created
      if (objectUrlCache.has(id)) {
        try {
          URL.revokeObjectURL(objectUrlCache.get(id)!);
        } catch {}
        objectUrlCache.delete(id);
      }
      resolve();
    };
    request.onerror = () => reject(request.error || new Error('Failed to save model blob'));
  });
}

/**
 * Retrieve binary blob for a 3D model from IndexedDB
 */
export async function getModelBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result && request.result.blob) {
          resolve(request.result.blob as Blob);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error || new Error('Failed to get model blob'));
    });
  } catch (err) {
    console.warn('[ModelStorage] IndexedDB get error:', err);
    return null;
  }
}

/**
 * Delete a model blob from IndexedDB
 */
export async function deleteModelBlob(id: string): Promise<void> {
  revokeModelUrl(id);
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[ModelStorage] IndexedDB delete error:', err);
  }
}

/**
 * List all model IDs currently stored in IndexedDB
 */
export async function getAllStoredModelBlobIds(): Promise<string[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAllKeys();
      request.onsuccess = () => {
        resolve((request.result || []).map((k) => String(k)));
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

/**
 * Resolves a playable URL for any 3D model.
 * If the model is stored in IndexedDB, returns a managed object URL.
 * If it is a static path or remote URL, returns it directly.
 */
export async function resolveModelUrl(
  modelOrUrl: Model3D | string,
  modelId?: string
): Promise<string> {
  const url = typeof modelOrUrl === 'string' ? modelOrUrl : modelOrUrl.url;
  const id =
    typeof modelOrUrl === 'string'
      ? modelId || url.replace('indexeddb://', '')
      : modelOrUrl.id;
  const isIndexedDB =
    (typeof modelOrUrl !== 'string' && modelOrUrl.storageType === 'indexeddb') ||
    url.startsWith('indexeddb://');

  if (isIndexedDB) {
    // Check in-memory object URL cache
    if (objectUrlCache.has(id)) {
      return objectUrlCache.get(id)!;
    }

    const blob = await getModelBlob(id);
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      objectUrlCache.set(id, objectUrl);
      return objectUrl;
    }
    // Fallback if blob was not found
    return url;
  }

  return url;
}

/**
 * Revoke cached Object URL when model is deleted or replaced
 */
export function revokeModelUrl(id: string): void {
  if (objectUrlCache.has(id)) {
    try {
      URL.revokeObjectURL(objectUrlCache.get(id)!);
    } catch {}
    objectUrlCache.delete(id);
  }
}
