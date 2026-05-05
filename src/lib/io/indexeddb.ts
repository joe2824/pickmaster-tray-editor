import type { ItemDef, ArrangedItemRef, EditorLayer, TrayDef } from '$types/editor';

const DB_NAME = 'tray-editor';
const DB_VERSION = 3;
const STORE = 'data';
const STL_STORE = 'stl-meshes';

export interface SavedProject {
  tray: TrayDef | null;
  items: Record<string, ItemDef>;
  arranged: ArrangedItemRef[];
  layers: EditorLayer[];
  activeLayer: number;
  nextLayerId: number;
  nextOrderId: number;
  collisionsEnabled?: boolean;
  savedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      if (!db.objectStoreNames.contains(STL_STORE)) db.createObjectStore(STL_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function put(key: string, value: unknown): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(JSON.stringify(value), key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch { /* ignore */ }
}

async function get<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result ? JSON.parse(req.result) : null);
      req.onerror = () => resolve(null);
    });
  } catch { return null; }
}

export const saveItemLibrary = (items: Record<string, ItemDef>) => put('items', items);
export const loadItemLibrary = () => get<Record<string, ItemDef>>('items');
export const saveProject = (project: SavedProject) => put('project', project);
export const loadProject = () => get<SavedProject>('project');

import type { StlRotation } from '$state/stl.svelte';
export const saveStlRotations = (rots: Record<string, StlRotation>) => put('stl-rotations', rots);
export const loadStlRotations = () => get<Record<string, StlRotation>>('stl-rotations');

// ── STL binary storage ─────────────────────────────────────────────────────
export async function saveStl(itemId: string, buffer: ArrayBuffer): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STL_STORE, 'readwrite');
      tx.objectStore(STL_STORE).put(buffer, itemId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch { /* ignore */ }
}

export async function deleteStl(itemId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STL_STORE, 'readwrite');
      tx.objectStore(STL_STORE).delete(itemId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch { /* ignore */ }
}

export async function loadAllStls(): Promise<Record<string, ArrayBuffer>> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const result: Record<string, ArrayBuffer> = {};
      const tx = db.transaction(STL_STORE, 'readonly');
      const store = tx.objectStore(STL_STORE);
      const keysReq = store.getAllKeys();
      keysReq.onsuccess = () => {
        const keys = keysReq.result as string[];
        if (keys.length === 0) { resolve(result); return; }
        let done = 0;
        for (const key of keys) {
          const req = store.get(key);
          req.onsuccess = () => {
            result[key] = req.result as ArrayBuffer;
            if (++done === keys.length) resolve(result);
          };
          req.onerror = () => { if (++done === keys.length) resolve(result); };
        }
      };
      keysReq.onerror = () => resolve(result);
    });
  } catch { return {}; }
}
