import type { PickMasterTray } from '$types/pickmaster';
import { editor } from '$state/editor.svelte';

export function serializeTrayJson(): PickMasterTray | null {
  if (!editor.tray) return null;
  const raw = JSON.parse(JSON.stringify(editor.tray.raw)) as PickMasterTray;

  raw.ContainerPattern.Layers.$values = editor.layers.map((layer) => ({
    $type: 'PickMaster.Core.Process.Container.LayerModel, PickMaster.Core',
    LayerId: layer.id,
    Offset: layer.z,
    ArrangedItems: {
      $type: 'System.Collections.Generic.List`1[[PickMaster.Core.Process.Container.ArrangedItemModel, PickMaster.Core]], mscorlib',
      $values: editor.arranged
        .filter((a) => a.layerId === layer.id)
        .map((a) => ({
          $type: 'PickMaster.Core.Process.Container.ArrangedItemModel, PickMaster.Core',
          ItemId: a.itemId,
          X: a.x,
          Y: a.y,
          Z: a.z,
          RX: a.rx ?? 0,
          RY: a.ry ?? 0,
          RZ: a.rz ?? 0,
          Order: a.order,
          Id: a.rawId || a.id,
        })),
    },
    SortingMethod: 2,
  }));

  return raw;
}
