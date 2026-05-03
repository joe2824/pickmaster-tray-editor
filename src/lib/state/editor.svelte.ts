import type { ItemDef, ArrangedItemRef, EditorLayer, TrayDef } from '$types/editor';

class EditorState {
  tray = $state<TrayDef | null>(null);
  items = $state<Record<string, ItemDef>>({});
  arranged = $state<ArrangedItemRef[]>([]);
  layers = $state<EditorLayer[]>([{ id: 1, name: 'Ebene 1', z: 0, visible: true }]);
  activeLayer = $state<number>(1);
  nextLayerId = $state(2);
  nextOrderId = $state(1000);

  itemDef(id: string): ItemDef | undefined {
    return this.items[id];
  }
  layer(id: number): EditorLayer | undefined {
    return this.layers.find((l) => l.id === id);
  }
  arrangedById(id: string): ArrangedItemRef | undefined {
    return this.arranged.find((a) => a.id === id);
  }

  replaceFrom(snap: {
    arranged: ArrangedItemRef[];
    layers: EditorLayer[];
    activeLayer: number;
    nextLayerId: number;
    nextOrderId: number;
  }) {
    this.arranged = JSON.parse(JSON.stringify(snap.arranged));
    this.layers = JSON.parse(JSON.stringify(snap.layers));
    this.activeLayer = snap.activeLayer;
    this.nextLayerId = snap.nextLayerId;
    this.nextOrderId = snap.nextOrderId;
  }

  maxOrder = $derived(
    this.arranged.length === 0 ? 1 : Math.max(...this.arranged.map((a) => a.order))
  );
}

export const editor = new EditorState();
