import { editor } from './editor.svelte';
import type { ArrangedItemRef, EditorLayer } from '$types/editor';

interface Snapshot {
  arranged: ArrangedItemRef[];
  layers: EditorLayer[];
  activeLayer: number;
  nextLayerId: number;
  nextOrderId: number;
}

class HistoryState {
  stack = $state<Snapshot[]>([]);
  pointer = $state(-1);
  max = 100;
  suspended = false;

  canUndo = $derived(this.pointer > 0);
  canRedo = $derived(this.pointer < this.stack.length - 1);

  private snapshot(): Snapshot {
    return {
      arranged: JSON.parse(JSON.stringify(editor.arranged)),
      layers: JSON.parse(JSON.stringify(editor.layers)),
      activeLayer: editor.activeLayer,
      nextLayerId: editor.nextLayerId,
      nextOrderId: editor.nextOrderId,
    };
  }

  push() {
    if (this.suspended) return;
    const sliced = this.stack.slice(0, this.pointer + 1);
    sliced.push(this.snapshot());
    if (sliced.length > this.max) sliced.shift();
    this.stack = sliced;
    this.pointer = sliced.length - 1;
  }

  reset() {
    this.stack = [];
    this.pointer = -1;
  }

  undo() {
    if (!this.canUndo) return;
    this.suspended = true;
    this.pointer -= 1;
    editor.replaceFrom(this.stack[this.pointer]);
    this.suspended = false;
  }

  redo() {
    if (!this.canRedo) return;
    this.suspended = true;
    this.pointer += 1;
    editor.replaceFrom(this.stack[this.pointer]);
    this.suspended = false;
  }
}

export const history = new HistoryState();
