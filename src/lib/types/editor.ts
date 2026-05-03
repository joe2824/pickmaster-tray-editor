export interface ItemDef {
  id: string;
  name: string;
  size: { x: number; y: number; z: number };
  color: string;
  raw: unknown;
}

export interface ArrangedItemRef {
  id: string;
  rawId?: string;
  itemId: string;
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  order: number;
  layerId: number;
}

export interface EditorLayer {
  id: number;
  name: string;
  z: number;
  visible: boolean;
}

export interface TrayDef {
  name: string;
  size: { x: number; y: number; z: number };
  color: string;
  raw: unknown;
}

export type ViewMode = '3d' | 'top' | 'front' | 'side';
export type EditMode = 'select' | 'move' | 'measure';
