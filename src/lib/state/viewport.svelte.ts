import type { ViewMode, EditMode } from '$types/editor';
import type { OrbitState } from '$three/orbit';
import { viewPreset } from '$three/orbit';

class ViewportState {
  view = $state<ViewMode>('3d');
  mode = $state<EditMode>('select');
  snap = $state(false);
  snapSize = $state(10);
  wireframe = $state(true);
  collisionsEnabled = $state(false);
  useStlMeshes = $state(false);
  activeItemTypeId = $state<string | null>(null);
  hiddenItemTypeIds = $state<string[]>([]);

  isItemTypeVisible(id: string): boolean {
    return !this.hiddenItemTypeIds.includes(id);
  }

  toggleItemTypeVisibility(id: string) {
    if (this.hiddenItemTypeIds.includes(id)) {
      this.hiddenItemTypeIds = this.hiddenItemTypeIds.filter((i) => i !== id);
    } else {
      this.hiddenItemTypeIds = [...this.hiddenItemTypeIds, id];
    }
  }

  orbit = $state<OrbitState>({
    theta: -Math.PI / 4,
    phi: Math.PI / 3,
    radius: 1500,
    panX: 0,
    panY: 0,
  });

  applyViewPreset(view: ViewMode, traySizeMax: number, centerX: number, centerY: number) {
    const preset = viewPreset(view as 'top' | 'front' | 'side' | '3d', traySizeMax * 1.5);
    this.orbit = { ...this.orbit, ...preset, panX: centerX, panY: centerY };
  }
}

export const viewport = new ViewportState();
