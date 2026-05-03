<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { WebGLRenderer, PCFShadowMap } from 'three';
  import Scene from './Scene.svelte';
  import { parsePickMasterJson, applyParseResult } from '$io/parse';
  import { toast } from '$state/toast.svelte';

  function createRenderer(canvas: HTMLCanvasElement) {
    return new WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true });
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files ?? []).filter((f) =>
      f.name.endsWith('.json')
    );
    if (files.length === 0) return;
    let trayCount = 0,
      itemCount = 0;
    for (const f of files) {
      try {
        const json = JSON.parse(await f.text());
        const result = parsePickMasterJson(json);
        applyParseResult(result);
        if (result.type === 'tray') trayCount++;
        else if (result.type === 'item') itemCount++;
      } catch {
        toast.show(`Fehler: ${f.name}`);
      }
    }
    const parts = [];
    if (trayCount) parts.push(`${trayCount} Tray`);
    if (itemCount) parts.push(`${itemCount} Item-Typ(en)`);
    if (parts.length) toast.show(parts.join(', ') + ' geladen');
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="absolute inset-0"
  ondragover={(e) => e.preventDefault()}
  ondrop={handleDrop}
>
  <Canvas {createRenderer} shadows={PCFShadowMap} colorSpace="srgb">
    <Scene />
  </Canvas>
</div>
