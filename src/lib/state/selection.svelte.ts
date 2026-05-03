import { SvelteSet } from 'svelte/reactivity';
import { editor } from './editor.svelte';

class SelectionState {
  ids = $state<SvelteSet<string>>(new SvelteSet());

  has(id: string) {
    return this.ids.has(id);
  }
  size = $derived(this.ids.size);
  selectedItems = $derived(editor.arranged.filter((a) => this.ids.has(a.id)));

  add(id: string) {
    this.ids.add(id);
  }
  delete(id: string) {
    this.ids.delete(id);
  }
  clear() {
    this.ids.clear();
  }
  set(ids: Iterable<string>) {
    this.ids = new SvelteSet(ids);
  }
  selectAll() {
    this.set(editor.arranged.map((a) => a.id));
  }
  toggle(id: string) {
    this.has(id) ? this.delete(id) : this.add(id);
  }
}

export const selection = new SelectionState();
