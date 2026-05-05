<script lang="ts">
  import { T } from '@threlte/core';
  import { Text } from '@threlte/extras';
  import { BoxGeometry, BackSide } from 'three';
  import type { ArrangedItemRef } from '$types/editor';
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { stlState } from '$state/stl.svelte';
  import { collisions } from '$state/collisions.svelte';
  import { calcItemZ, getItemColor } from '$three/coords';

  let { arr }: { arr: ArrangedItemRef } = $props();

  const itemDef = $derived(editor.itemDef(arr.itemId));
  const layer = $derived(editor.layer(arr.layerId));
  const isSelected = $derived(selection.has(arr.id));
  const isVisible = $derived((layer?.visible ?? true) && viewport.isItemTypeVisible(arr.itemId));
  const isColliding = $derived(collisions.collidingIds.has(arr.id));
  const isDupOrder = $derived(collisions.duplicateOrderIds.has(arr.id));

  const stlGeo = $derived(stlState.get(arr.itemId));
  const useStl = $derived(viewport.useStlMeshes && !!stlGeo);

  const sx = $derived(itemDef?.size.x ?? 100);
  const sy = $derived(itemDef?.size.y ?? 100);
  const sz = $derived(itemDef?.size.z ?? 40);

  const z = $derived(calcItemZ(arr, itemDef, layer));
  const renderOrder = $derived(arr.order);
  const deg = Math.PI / 180;
  const rotX = $derived((arr.rx || 0) * deg);
  const rotY = $derived((arr.ry || 0) * deg);
  const rotZ = $derived((arr.rz || 0) * deg);

  const color = $derived(!itemDef ? 0x444455 : isColliding ? 0xff5555 : getItemColor(arr.itemId));
  const emissive = $derived(isSelected ? 0x2a1e00 : isColliding ? 0x1a0000 : 0x0d0f14);

  const edgeColor = $derived(isDupOrder ? 0xff8800 : isColliding ? 0xff2222 : 0x111111);
  const edgeOpacity = $derived(isDupOrder || isColliding ? 0.9 : 0.6);

  // Top-face marker: indicator bar + order text
  const markerZ = $derived(sz / 2 + 0.1);
  const barH = $derived(Math.max(4, Math.min(sy * 0.10, 12)));  // bar height in Y
  const barY = $derived(sy / 2 - barH / 2);                     // near top edge
  const fontSize = $derived(Math.max(6, Math.min(sx, sy) * 0.22));

  // Darken item color strongly for indicator bar
  function darken(c: number): number {
    return (Math.floor((c >> 16 & 0xff) * 0.3) << 16)
         | (Math.floor((c >> 8  & 0xff) * 0.3) << 8)
         |  Math.floor((c       & 0xff) * 0.3);
  }
  const barColor = $derived(isColliding ? 0x880000 : darken(getItemColor(arr.itemId)));
</script>

{#if isVisible}
  {#if useStl && stlGeo}
    <!-- ── STL mesh ─────────────────────────────── -->
    {@const stlRot = stlState.getRotation(arr.itemId)}
    {@const stlDeg = Math.PI / 180}
    <T.Mesh
      position={[arr.x, arr.y, z]}
      rotation={[rotX, rotY, rotZ]}
      {renderOrder}
      castShadow receiveShadow
      userData={{ arrangementId: arr.id }}
    >
      <T.Mesh geometry={stlGeo} rotation={[stlRot.x * stlDeg, stlRot.y * stlDeg, stlRot.z * stlDeg]}>
        <T.MeshPhongMaterial {color} shininess={20} {emissive} transparent opacity={0.56} />
      </T.Mesh>
      {#if isSelected}
        <T.Mesh scale={1.07} renderOrder={renderOrder - 1} geometry={stlGeo} rotation={[stlRot.x * stlDeg, stlRot.y * stlDeg, stlRot.z * stlDeg]}>
          <T.MeshBasicMaterial color={0xffffff} side={BackSide} depthWrite={true} />
        </T.Mesh>
      {/if}
    </T.Mesh>

  {:else}
    <!-- ── Box mesh ──────────────────────────────── -->
    <T.Mesh
      position={[arr.x, arr.y, z]}
      rotation={[rotX, rotY, rotZ]}
      {renderOrder}
      castShadow receiveShadow
      userData={{ arrangementId: arr.id }}
    >
      <T.BoxGeometry args={[sx, sy, sz]} />
      <T.MeshPhongMaterial
        {color}
        shininess={60}
        transparent
        opacity={0.80}
        depthWrite={false}
        {emissive}
      />

      <!-- Selection outline -->
      {#if isSelected}
        <T.Mesh scale={1.07} renderOrder={renderOrder - 1}>
          <T.BoxGeometry args={[sx, sy, sz]} />
          <T.MeshBasicMaterial color={0xffffff} side={BackSide} depthWrite={true} />
        </T.Mesh>
      {/if}

      <!-- Edges -->
      {#if (viewport.wireframe && !isSelected) || isDupOrder || isColliding}
        <T.LineSegments renderOrder={renderOrder + 0.5}>
          <T.EdgesGeometry args={[new BoxGeometry(sx, sy, sz)]} />
          <T.LineBasicMaterial color={edgeColor} transparent opacity={edgeOpacity} depthWrite={false} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-4} />
        </T.LineSegments>
      {/if}

      <!-- Indicator bar at top edge (shows orientation, darkened item color) -->
      {#if itemDef}
        <T.Mesh position={[0, barY, markerZ]} renderOrder={renderOrder + 2}>
          <T.PlaneGeometry args={[sx * 0.92, barH]} />
          <T.MeshBasicMaterial color={barColor} transparent opacity={0.40} depthTest={false} depthWrite={false} />
        </T.Mesh>
      {/if}

      <!-- Order ID text — counter-rotate by -rotZ so text stays upright regardless of item rotation -->
      <Text
    text={String(arr.order)}
    position={[0, 0, markerZ]}
    rotation={[0, 0, -rotZ]}
    renderOrder={renderOrder + 2}
    fontSize={fontSize}
    color={isDupOrder ? '#ff8800' : '#ffffff'}
    outlineColor="#000000"
    outlineWidth={0.06}
    anchorX="center"
    anchorY="middle"
    depthTest={false}
  />
    </T.Mesh>
  {/if}
{/if}
