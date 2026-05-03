<script lang="ts">
  import { T } from '@threlte/core';
  import { BoxGeometry } from 'three';
  import type { ArrangedItemRef } from '$types/editor';
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { collisions } from '$state/collisions.svelte';
  import { calcItemZ, getItemColor } from '$three/coords';

  let { arr }: { arr: ArrangedItemRef } = $props();

  const itemDef = $derived(editor.itemDef(arr.itemId));
  const layer = $derived(editor.layer(arr.layerId));
  const isSelected = $derived(selection.has(arr.id));
  const isVisible = $derived((layer?.visible ?? true) && viewport.isItemTypeVisible(arr.itemId));
  const isColliding = $derived(collisions.collidingIds.has(arr.id));
  const isDupOrder = $derived(collisions.duplicateOrderIds.has(arr.id));

  const z = $derived(calcItemZ(arr, itemDef, layer));
  const renderOrder = $derived(arr.order);
  const deg = Math.PI / 180;
  const rotX = $derived((arr.rx || 0) * deg);
  const rotY = $derived((arr.ry || 0) * deg);
  const rotZ = $derived((arr.rz || 0) * deg);

  // Base color: keep original always, collision tints red
  const color = $derived(isColliding ? 0xff5555 : getItemColor(arr.itemId));

  // Emissive: selected = warm glow so the item stands out from tray surface
  const emissive = $derived(isSelected ? 0x2a1e00 : isColliding ? 0x1a0000 : 0x0d0f14);

  // Edge color + opacity — selection = bright white, warnings = orange/red
  const edgeColor = $derived(
    isSelected ? 0xffffff : isDupOrder ? 0xff8800 : isColliding ? 0xff2222 : 0x000000
  );
  const edgeOpacity = $derived(isSelected ? 1 : isDupOrder || isColliding ? 0.9 : 0.35);

  // Orientation stripe — slim, fully opaque to avoid dark overlap artifacts
  const stripeW = $derived(itemDef ? itemDef.size.x * 0.82 : 1);
  const stripeH = $derived(itemDef ? Math.max(2, itemDef.size.y * 0.025) : 1);
  const stripeY = $derived(itemDef ? itemDef.size.y * 0.44 : 0);
  const stripeZ = $derived(itemDef ? itemDef.size.z / 2 + 1 : 1);
</script>

{#if itemDef && isVisible}
  <T.Mesh
    position={[arr.x, arr.y, z]}
    rotation={[rotX, rotY, rotZ]}
    {renderOrder}
    castShadow
    receiveShadow
    userData={{ arrangementId: arr.id }}
  >
    <T.BoxGeometry args={[itemDef.size.x, itemDef.size.y, itemDef.size.z]} />
    <!-- Fully opaque — no transparency bleeding onto tray surface -->
    <T.MeshPhongMaterial
      {color}
      shininess={60}
      polygonOffset
      polygonOffsetFactor={1}
      polygonOffsetUnits={1}
      {emissive}
    />

    <!-- Edges: bright white when selected, subtle otherwise -->
    {#if !viewport.wireframe || isSelected || isDupOrder || isColliding}
      <T.LineSegments renderOrder={renderOrder + 0.5}>
        <T.EdgesGeometry args={[new BoxGeometry(itemDef.size.x, itemDef.size.y, itemDef.size.z)]} />
        <T.LineBasicMaterial
          color={edgeColor}
          transparent={!isSelected}
          opacity={edgeOpacity}
          depthWrite={false}
        />
      </T.LineSegments>
    {/if}

    <!-- Orientation stripe on +Y end of top face -->
    <T.Mesh position={[0, stripeY, stripeZ]} renderOrder={renderOrder + 1}>
      <T.BoxGeometry args={[stripeW, stripeH, 2]} />
      <T.MeshBasicMaterial color={0x000000} />
    </T.Mesh>
  </T.Mesh>
{/if}
