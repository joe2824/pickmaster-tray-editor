<script lang="ts">
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { history } from '$state/history.svelte';
  import { getItemColor } from '$three/coords';
  import { t } from '$i18n';

  const sorted = $derived([...editor.arranged].sort((a, b) => a.order - b.order));

  function select(arr: (typeof sorted)[number]) {
    selection.set([arr.id]);
    // Ensure the layer is visible so the item can be seen
    const layer = editor.layer(arr.layerId);
    if (layer && !layer.visible) {
      layer.visible = true;
      editor.layers = [...editor.layers];
    }
  }

  function remove(id: string) {
    editor.arranged = editor.arranged.filter((a) => a.id !== id);
    selection.delete(id);
    history.push();
  }

  function colorHex(c: number) { return '#' + c.toString(16).padStart(6, '0'); }

  // Svelte action: scroll element into view when it becomes selected
  function scrollWhenSelected(node: HTMLElement, isActive: boolean) {
    if (isActive) node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return {
      update(nowActive: boolean) {
        if (nowActive) node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      },
    };
  }
</script>

<div class="overflow-y-auto flex-1 min-h-0">
  {#each sorted as arr (arr.id)}
    {@const itemDef = editor.itemDef(arr.itemId)}
    {@const isActive = selection.has(arr.id)}
    <div
      use:scrollWhenSelected={isActive}
      class="flex items-center gap-1.5 px-2 py-1 cursor-pointer border-l-2 transition-colors
             {isActive
               ? 'bg-brand-accent/20 border-l-brand-accent'
               : 'border-l-transparent hover:bg-white/5'}"
      onclick={() => select(arr)}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === 'Enter' && select(arr)}
    >
      <span
        class="w-2.5 h-2.5 rounded-sm shrink-0"
        style="background:{colorHex(getItemColor(arr.itemId))}"
      ></span>
      <span class="text-[10px] w-7 shrink-0 font-mono {isActive ? 'text-brand-accent' : 'text-white/50'}">{arr.order}</span>
      <span class="text-[11px] flex-1 truncate {isActive ? 'text-brand-accent font-semibold' : 'text-white/85'}">{itemDef?.name ?? arr.itemId.slice(0, 8)}</span>
      <span class="text-[10px] shrink-0 {isActive ? 'text-brand-accent/70' : 'text-white/35'}">L{arr.layerId}</span>
      <button
        class="text-white/25 hover:text-brand-red text-[10px] px-0.5 shrink-0"
        onclick={(e) => { e.stopPropagation(); remove(arr.id); }}
      >✕</button>
    </div>
  {/each}
  {#if editor.arranged.length === 0}
    <p class="text-[10px] text-brand-textdim italic px-3 py-2">{t('scene.noItems')}</p>
  {/if}
</div>
