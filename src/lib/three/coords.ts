import type { ArrangedItemRef, ItemDef, EditorLayer } from '$types/editor';


export const ITEM_COLORS = [
  0x4f7cff, 0xff6b35, 0x3ecf8e, 0xffe566, 0xff4d6d, 0xa78bfa, 0x38bdf8,
];

const colorIndex: Record<string, number> = {};
export function getItemColor(itemId: string): number {
  if (!(itemId in colorIndex)) {
    colorIndex[itemId] = Object.keys(colorIndex).length % ITEM_COLORS.length;
  }
  return ITEM_COLORS[colorIndex[itemId]];
}

export function calcItemZ(
  arr: ArrangedItemRef,
  itemDef: ItemDef | undefined,
  layer: EditorLayer | undefined,
): number {
  const layerZ = layer?.z ?? 0;
  const itemH = itemDef?.size.z ?? 45;
  return layerZ + (arr.z || 0) + itemH / 2;
}
