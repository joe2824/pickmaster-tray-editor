import type { BufferGeometry } from 'three';

export interface StlRotation { x: number; y: number; z: number }

class StlState {
  geometries = $state<Record<string, BufferGeometry>>({});
  rotations = $state<Record<string, StlRotation>>({});

  has(itemId: string): boolean { return itemId in this.geometries; }
  get(itemId: string): BufferGeometry | undefined { return this.geometries[itemId]; }

  set(itemId: string, geo: BufferGeometry) {
    this.geometries = { ...this.geometries, [itemId]: geo };
  }

  remove(itemId: string) {
    this.geometries[itemId]?.dispose();
    const { [itemId]: _g, ...restG } = this.geometries;
    const { [itemId]: _r, ...restR } = this.rotations;
    this.geometries = restG;
    this.rotations = restR;
  }

  getRotation(itemId: string): StlRotation {
    return this.rotations[itemId] ?? { x: 0, y: 0, z: 0 };
  }

  setRotation(itemId: string, rot: StlRotation) {
    this.rotations = { ...this.rotations, [itemId]: rot };
  }

  clear() {
    for (const geo of Object.values(this.geometries)) geo.dispose();
    this.geometries = {};
    this.rotations = {};
  }

  get count() { return Object.keys(this.geometries).length; }
}

export const stlState = new StlState();
