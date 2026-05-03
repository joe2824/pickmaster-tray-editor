class AddLayerModalState {
  visible = $state(false);
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
}

export const addLayerModal = new AddLayerModalState();
