import type { PerspectiveCamera } from 'three';

export interface OrbitState {
  theta: number;
  phi: number;
  radius: number;
  panX: number;
  panY: number;
}

export function applyOrbit(camera: PerspectiveCamera, o: OrbitState) {
  const { theta, phi, radius, panX, panY } = o;
  const sp = Math.sin(phi),
    cp = Math.cos(phi);
  const st = Math.sin(theta),
    ct = Math.cos(theta);
  camera.position.set(panX + radius * sp * ct, panY + radius * sp * st, radius * cp);
  camera.lookAt(panX, panY, 0);
  camera.up.set(0, 0, 1);
  camera.near = Math.max(0.5, radius * 0.005);
  camera.far = Math.max(20000, radius * 50);
  camera.updateProjectionMatrix();
}

export function viewPreset(
  view: 'top' | 'front' | 'side' | '3d',
  dist: number
): Partial<OrbitState> {
  switch (view) {
    case 'top':
      return { theta: -Math.PI / 2, phi: 0.001, radius: dist };
    case 'front':
      return { theta: -Math.PI / 2, phi: Math.PI / 2, radius: dist };
    case 'side':
      return { theta: 0, phi: Math.PI / 2, radius: dist };
    case '3d':
      return { theta: -Math.PI / 4, phi: Math.PI / 3, radius: dist * 1.3 };
  }
}
