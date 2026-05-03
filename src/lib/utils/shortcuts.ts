import { editor } from '$state/editor.svelte';
import { selection } from '$state/selection.svelte';
import { history } from '$state/history.svelte';
import { viewport } from '$state/viewport.svelte';
import { debounce } from './debounce';
import { v4 as uuid } from 'uuid';

const pushHistoryDebounced = debounce(() => history.push(), 350);

function setView(v: typeof viewport.view) {
  viewport.view = v;
  const tray = editor.tray;
  const size = tray ? Math.max(tray.size.x, tray.size.y) : 1000;
  const cx = tray ? tray.size.x / 2 : 0;
  const cy = tray ? tray.size.y / 2 : 0;
  viewport.applyViewPreset(v, size, cx, cy);
}

function moveSelected(dx: number, dy: number) {
  if (selection.size === 0) return;
  const step = viewport.snap ? viewport.snapSize : 1;
  for (const item of selection.selectedItems) {
    const arr = editor.arrangedById(item.id);
    if (arr) {
      arr.x = snapVal(arr.x + dx * step, viewport.snap, viewport.snapSize);
      arr.y = snapVal(arr.y + dy * step, viewport.snap, viewport.snapSize);
    }
  }
  editor.arranged = [...editor.arranged];
  pushHistoryDebounced();
}

function snapVal(v: number, snap: boolean, size: number): number {
  return snap ? Math.round(v / size) * size : v;
}

export function assignSelectionToLayer(layerId: number) {
  if (selection.size === 0) return;
  for (const id of selection.ids) {
    const arr = editor.arrangedById(id);
    if (arr) arr.layerId = layerId;
  }
  editor.arranged = [...editor.arranged];
  history.push();
}

function cycleLayer(dir: 1 | -1) {
  if (selection.size === 0) return;
  const first = selection.selectedItems[0];
  if (!first) return;
  // Sort layers by Z-offset so PageUp = higher Z, PageDown = lower Z
  const sorted = [...editor.layers].sort((a, b) => a.z - b.z);
  const idx = sorted.findIndex((l) => l.id === first.layerId);
  if (idx === -1) return;
  const next = sorted[idx + dir];
  if (next) assignSelectionToLayer(next.id);
}

function duplicateSelected() {
  if (selection.size === 0) return;
  const newItems = selection.selectedItems.map((a) => ({
    ...a,
    id: uuid(),
    rawId: undefined,
    x: a.x + 10,
    y: a.y + 10,
    order: editor.nextOrderId++,
  }));
  editor.arranged = [...editor.arranged, ...newItems];
  selection.set(newItems.map((a) => a.id));
  history.push();
}

function deleteSelected() {
  if (selection.size === 0) return;
  editor.arranged = editor.arranged.filter((a) => !selection.has(a.id));
  selection.clear();
  history.push();
}

export function initShortcuts(): () => void {
  const handler = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.key === '1') { setView('3d');    return; }
    if (e.key === '2') { setView('top');   return; }
    if (e.key === '3') { setView('front'); return; }
    if (e.key === '4') { setView('side');  return; }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); history.undo(); return; }
      if (e.key === 'z' && e.shiftKey)  { e.preventDefault(); history.redo(); return; }
      if (e.key === 'y')                 { e.preventDefault(); history.redo(); return; }
      if (e.key === 'a')                 { e.preventDefault(); selection.selectAll(); return; }
      if (e.key === 'd')                 { e.preventDefault(); duplicateSelected(); return; }
    }

    if (e.key === 'Escape') {
      selection.clear();
      viewport.activeItemTypeId = null;
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') { deleteSelected(); return; }

    // PageUp = höhere Ebene (größeres Z), PageDown = niedrigere Ebene (kleineres Z)
    if (e.key === 'PageUp')   { e.preventDefault(); cycleLayer(1);  return; }
    if (e.key === 'PageDown') { e.preventDefault(); cycleLayer(-1); return; }

    // Arrow keys: X wächst nach rechts, Y wächst nach unten (0,0 = oben links)
    const step = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); moveSelected(-step, 0);  return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); moveSelected(step, 0);   return; }
    if (e.key === 'ArrowUp')    { e.preventDefault(); moveSelected(0, step);   return; }
    if (e.key === 'ArrowDown')  { e.preventDefault(); moveSelected(0, -step);  return; }
  };

  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
