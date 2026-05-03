import { editor } from './editor.svelte';
import { viewport } from './viewport.svelte';

const EMPTY = new Set<string>();

function computeColliding(): Set<string> {
  if (!viewport.collisionsEnabled) return EMPTY;
  const arr = editor.arranged;
  const result = new Set<string>();
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    const defA = editor.itemDef(a.itemId);
    if (!defA) continue;
    for (let j = i + 1; j < arr.length; j++) {
      const b = arr[j];
      if (a.layerId !== b.layerId) continue;
      const defB = editor.itemDef(b.itemId);
      if (!defB) continue;
      const rotA = ((a.rz || 0) * Math.PI) / 180;
      const rotB = ((b.rz || 0) * Math.PI) / 180;
      const hwA = (Math.abs(Math.cos(rotA)) * defA.size.x + Math.abs(Math.sin(rotA)) * defA.size.y) / 2;
      const hhA = (Math.abs(Math.sin(rotA)) * defA.size.x + Math.abs(Math.cos(rotA)) * defA.size.y) / 2;
      const hwB = (Math.abs(Math.cos(rotB)) * defB.size.x + Math.abs(Math.sin(rotB)) * defB.size.y) / 2;
      const hhB = (Math.abs(Math.sin(rotB)) * defB.size.x + Math.abs(Math.cos(rotB)) * defB.size.y) / 2;
      if (Math.abs(a.x - b.x) < hwA + hwB && Math.abs(a.y - b.y) < hhA + hhB) {
        result.add(a.id);
        result.add(b.id);
        if (result.size > 40) return result;
      }
    }
  }
  return result;
}

function computeDuplicateOrders(): Set<string> {
  if (!viewport.collisionsEnabled) return EMPTY;
  const orderMap = new Map<number, string[]>();
  for (const a of editor.arranged) {
    if (!orderMap.has(a.order)) orderMap.set(a.order, []);
    orderMap.get(a.order)!.push(a.id);
  }
  const dupes = new Set<string>();
  for (const ids of orderMap.values()) {
    if (ids.length > 1) ids.forEach((id) => dupes.add(id));
  }
  return dupes;
}

class CollisionState {
  collidingIds = $derived(computeColliding());
  duplicateOrderIds = $derived(computeDuplicateOrders());
}

export const collisions = new CollisionState();
