<script lang="ts">
  import { editor } from '$state/editor.svelte';

  interface Collision {
    a: string;
    b: string;
  }

  const collisions = $derived(() => {
    const result: Collision[] = [];
    const arr = editor.arranged;
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      const defA = editor.itemDef(a.itemId);
      if (!defA) continue;
      for (let j = i + 1; j < arr.length; j++) {
        const b = arr[j];
        if (a.layerId !== b.layerId) continue;
        const defB = editor.itemDef(b.itemId);
        if (!defB) continue;
        const rotA = ((a.rz || 0) * Math.PI) / 180;
        const rotB = ((b.rz || 0) * Math.PI) / 180;
        // Axis-aligned approximation: use bounding box of rotated item
        const hwA = (Math.abs(Math.cos(rotA)) * defA.size.x + Math.abs(Math.sin(rotA)) * defA.size.y) / 2;
        const hhA = (Math.abs(Math.sin(rotA)) * defA.size.x + Math.abs(Math.cos(rotA)) * defA.size.y) / 2;
        const hwB = (Math.abs(Math.cos(rotB)) * defB.size.x + Math.abs(Math.sin(rotB)) * defB.size.y) / 2;
        const hhB = (Math.abs(Math.sin(rotB)) * defB.size.x + Math.abs(Math.cos(rotB)) * defB.size.y) / 2;
        if (
          Math.abs(a.x - b.x) < hwA + hwB &&
          Math.abs(a.y - b.y) < hhA + hhB
        ) {
          result.push({ a: a.id, b: b.id });
          if (result.length >= 20) return result; // cap for performance
        }
      }
    }
    return result;
  });

  const count = $derived(collisions().length);
</script>

{#if count > 0}
  <div
    class="absolute top-14 left-1/2 -translate-x-1/2 bg-brand-red/20 border border-brand-red text-brand-red text-[10px] px-3 py-1 rounded pointer-events-none flex items-center gap-2"
    title="{count} Überlappung(en) erkannt"
  >
    ⚠ {count} Kollision{count > 1 ? 'en' : ''}
  </div>
{/if}
