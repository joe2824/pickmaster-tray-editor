<script lang="ts">
  import { T } from '@threlte/core';
  import * as THREE from 'three';
  import { editor } from '$state/editor.svelte';

  const tray = $derived(editor.tray);
  const sx = $derived(tray?.size.x ?? 1000);
  const sy = $derived(tray?.size.y ?? 900);
  const sz = $derived(tray?.size.z ?? 5);

  const spacing = $derived(Math.max(50, Math.round(Math.max(sx, sy) / 10 / 50) * 50));

  const gridGeometry = $derived.by(() => {
    const pts: number[] = [];
    const z = 0.5;
    for (let x = 0; x <= sx + 0.01; x += spacing) {
      const cx = Math.min(x, sx);
      pts.push(cx, 0, z, cx, sy, z);
    }
    for (let y = 0; y <= sy + 0.01; y += spacing) {
      const cy = Math.min(y, sy);
      pts.push(0, cy, z, sx, cy, z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  });
</script>

{#if tray}
  <!-- Tray body -->
  <T.Mesh position={[sx / 2, sy / 2, -sz / 2]} receiveShadow>
    <T.BoxGeometry args={[sx, sy, sz]} />
    <T.MeshPhongMaterial color={0x8b7355} shininess={10} />
  </T.Mesh>

  <!-- Grid (perimeter lines included, no extra edge LineSegments needed) -->
  <T.LineSegments>
    <T is={gridGeometry} />
    <T.LineBasicMaterial color={0x2a2e3d} transparent opacity={0.7} depthWrite={false} />
  </T.LineSegments>
{/if}
