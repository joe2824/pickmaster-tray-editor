class SceneInteractionState {
  marqueeStart = $state<{ x: number; y: number } | null>(null);
  marqueeEnd = $state<{ x: number; y: number } | null>(null);
  marqueeShift = $state(false);
  marqueeCtrl = $state(false);

  measureA = $state<{ x: number; y: number; z: number } | null>(null);
  measureB = $state<{ x: number; y: number; z: number } | null>(null);
  measureAScreen = $state<{ x: number; y: number } | null>(null);
  measureBScreen = $state<{ x: number; y: number } | null>(null);

  get marqueeMode(): 'normal' | 'additive' | 'subtractive' {
    if (this.marqueeCtrl) return 'subtractive';
    if (this.marqueeShift) return 'additive';
    return 'normal';
  }

  get distance(): number | null {
    if (!this.measureA || !this.measureB) return null;
    const dx = this.measureB.x - this.measureA.x;
    const dy = this.measureB.y - this.measureA.y;
    const dz = this.measureB.z - this.measureA.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  clearMeasure() {
    this.measureA = null;
    this.measureB = null;
    this.measureAScreen = null;
    this.measureBScreen = null;
  }
}

export const sceneInteraction = new SceneInteractionState();
