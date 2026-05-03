class ContextMenuState {
  visible = $state(false);
  x = $state(0);
  y = $state(0);
  targetId = $state<string | null>(null);

  show(x: number, y: number, id: string | null) {
    this.x = x;
    this.y = y;
    this.targetId = id;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}

export const contextMenu = new ContextMenuState();
