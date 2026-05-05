<script lang="ts">
  import { T } from '@threlte/core';
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

  // Dark edges for visibility; warning colors override; hidden on selected (selection outline handles that)
  const edgeColor = $derived(isDupOrder ? 0xff8800 : isColliding ? 0xff2222 : 0x111111);
  const edgeOpacity = $derived(isDupOrder || isColliding ? 0.9 : 0.6);

  // U-shaped orientation marker dimensions (flat planes on top face — no Z extent, no clipping)
  const barT = $derived(Math.max(2, Math.min(sx, sy) * 0.045)); // bar thickness
  const legH = $derived(sy * 0.22);                             // leg height (down the sides)
  const barY = $derived(sy * 0.43);                             // top bar center Y
  const markerZ = $derived(sz / 2);                              // flat on top face
  const legY = $derived(barY - barT / 2 - legH / 2);           // leg center Y
  const legX = $derived(sx * 0.43 - barT / 2);                  // leg center X
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
        <T.MeshPhongMaterial {color} shininess={60} {emissive} transparent opacity={0.86} depthWrite={true} />
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
        opacity={0.86}
        depthWrite={true}
        polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1}
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
          <T.LineBasicMaterial color={edgeColor} transparent opacity={edgeOpacity} depthWrite={false} />
        </T.LineSegments>
      {/if}

      <!-- U-shaped orientation marker — flat planes on top face, no Z extent, no clipping -->
      {#if itemDef}
        <!-- Top bar -->
        <T.Mesh position={[0, barY, markerZ]} renderOrder={renderOrder + 2}>
          <T.PlaneGeometry args={[sx * 0.86, barT]} />
          <T.MeshBasicMaterial color={0x000000} depthTest={true} polygonOffset polygonOffsetFactor={0} polygonOffsetUnits={-2} />
        </T.Mesh>
        <!-- Left leg -->
        <T.Mesh position={[-legX, legY, markerZ]} renderOrder={renderOrder + 2}>
          <T.PlaneGeometry args={[barT, legH]} />
          <T.MeshBasicMaterial color={0x000000} depthTest={true} polygonOffset polygonOffsetFactor={0} polygonOffsetUnits={-2} />
        </T.Mesh>
        <!-- Right leg -->
        <T.Mesh position={[legX, legY, markerZ]} renderOrder={renderOrder + 2}>
          <T.PlaneGeometry args={[barT, legH]} />
          <T.MeshBasicMaterial color={0x000000} depthTest={true} polygonOffset polygonOffsetFactor={0} polygonOffsetUnits={-2} />
        </T.Mesh>
      {:else}
        <!-- Placeholder cross when no itemDef -->
        <T.Mesh position={[0, 0, markerZ]} renderOrder={renderOrder + 2}>
          <T.PlaneGeometry args={[Math.max(2, sx * 0.04), Math.max(8, sy * 0.15)]} />
          <T.MeshBasicMaterial color={0x8888aa} depthTest={true} polygonOffset polygonOffsetFactor={0} polygonOffsetUnits={-2} />
        </T.Mesh>
        <T.Mesh position={[0, 0, markerZ]} rotation={[0, 0, Math.PI / 2]} renderOrder={renderOrder + 2}>
          <T.PlaneGeometry args={[Math.max(2, sx * 0.04), Math.max(8, sy * 0.15)]} />
          <T.MeshBasicMaterial color={0x8888aa} depthTest={true} polygonOffset polygonOffsetFactor={0} polygonOffsetUnits={-2} />
        </T.Mesh>
      {/if}
    </T.Mesh>
  {/if}
{/if}
