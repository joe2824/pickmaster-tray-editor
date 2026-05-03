import type { ItemDef, ArrangedItemRef, EditorLayer, TrayDef } from '$types/editor';

const DB_NAME = 'tray-editor';
const DB_VERSION = 2;
const STORE = 'data';

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
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
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
  } catch {
    /* IndexedDB unavailable — ignore */
  }
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
  } catch {
    return null;
  }
}

export const saveItemLibrary = (items: Record<string, ItemDef>) => put('items', items);
export const loadItemLibrary = () => get<Record<string, ItemDef>>('items');

export const saveProject = (project: SavedProject) => put('project', project);
export const loadProject = () => get<SavedProject>('project');
