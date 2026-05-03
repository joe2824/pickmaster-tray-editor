import type { PickMasterTray, PickMasterItem } from '$types/pickmaster';
import type { ItemDef, TrayDef, ArrangedItemRef, EditorLayer } from '$types/editor';
import { isPickMasterTray, isPickMasterItem } from '$types/pickmaster';
import { editor } from '$state/editor.svelte';
import { history } from '$state/history.svelte';
import { viewport } from '$state/viewport.svelte';

export interface ParseResult {
  type: 'tray' | 'item' | 'unknown';
  tray?: { def: TrayDef; layers: EditorLayer[]; arranged: ArrangedItemRef[] };
  item?: ItemDef;
}

export function parsePickMasterJson(json: unknown): ParseResult {
  if (isPickMasterTray(json)) {
    const t = json as PickMasterTray;
    const def: TrayDef = {
      name: t.Name,
      size: { x: t.Size.x, y: t.Size.y, z: t.Size.z },
      color: t.AppearanceModel.ItemColor,
      raw: t,
    };

    const layers: EditorLayer[] = [];
    const arranged: ArrangedItemRef[] = [];

    for (const layer of t.ContainerPattern.Layers.$values) {
      layers.push({
        id: layer.LayerId,
        name: `Ebene ${layer.LayerId}`,
        z: layer.Offset || 0,
        visible: true,
      });
      for (const ai of layer.ArrangedItems.$values) {
        arranged.push({
          id: ai.Id,
          rawId: ai.Id,
          itemId: ai.ItemId,
          x: ai.X,
          y: ai.Y,
          z: ai.Z,
          rx: ai.RX,
          ry: ai.RY,
          rz: ai.RZ,
          order: ai.Order,
          layerId: layer.LayerId,
        });
      }
    }

    return { type: 'tray', tray: { def, layers, arranged } };
  }

  if (isPickMasterItem(json)) {
    const i = json as PickMasterItem;
    const item: ItemDef = {
      id: i.Id,
      name: i.Name,
      size: { x: i.Size.x, y: i.Size.y, z: i.Size.z },
      color: i.AppearanceModel.ItemColor,
      raw: i,
    };
    return { type: 'item', item };
  }

  return { type: 'unknown' };
}

export function centerOrbitOnTray(tray: TrayDef) {
  const cx = tray.size.x / 2;
  const cy = tray.size.y / 2;
  const dist = Math.max(tray.size.x, tray.size.y);
  viewport.orbit = {
    ...viewport.orbit,
    panX: cx,
    panY: cy,
    radius: dist * 1.8,
  };
}

export function applyParseResult(result: ParseResult) {
  if (result.type === 'tray' && result.tray) {
    const { def, layers, arranged } = result.tray;
    editor.tray = def;
    const maxOrder = arranged.length > 0 ? Math.max(...arranged.map((a) => a.order)) : 0;
    editor.replaceFrom({
      arranged,
      layers,
      activeLayer: layers[0]?.id ?? 1,
      nextLayerId: Math.max(...layers.map((l) => l.id)) + 1,
      nextOrderId: maxOrder + 1,
    });
    history.reset();
    history.push();
    centerOrbitOnTray(def);

    // Keep only item definitions that are actually referenced by this container
    const usedIds = new Set(arranged.map((a) => a.itemId));
    editor.items = Object.fromEntries(
      Object.entries(editor.items).filter(([id]) => usedIds.has(id))
    );
  } else if (result.type === 'item' && result.item) {
    // Only add item definition if it is referenced in the current container
    const isUsed =
      editor.arranged.length === 0 ||
      editor.arranged.some((a) => a.itemId === result.item!.id);
    if (isUsed) {
      editor.items = { ...editor.items, [result.item.id]: result.item };
    }
  }
}

export async function loadDemoData() {
  try {
    const [trayResp, item1Resp, item2Resp] = await Promise.all([
      fetch('/samples/05_Tray_1000ml.json'),
      fetch('/samples/05_Item_1000ml_1.json'),
      fetch('/samples/05_Item_1000ml_2.json'),
    ]);
    if (!trayResp.ok) return;

    const [trayJson, item1Json, item2Json] = await Promise.all([
      trayResp.json(),
      item1Resp.ok ? item1Resp.json() : null,
      item2Resp.ok ? item2Resp.json() : null,
    ]);

    if (item1Json) applyParseResult(parsePickMasterJson(item1Json));
    if (item2Json) applyParseResult(parsePickMasterJson(item2Json));
    applyParseResult(parsePickMasterJson(trayJson));
  } catch {
    /* silent — demo data is optional */
  }
}
