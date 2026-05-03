class PatternModalState {
  visible = $state(false);
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
}

export const patternModal = new PatternModalState();
