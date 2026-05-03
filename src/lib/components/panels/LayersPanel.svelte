<script lang="ts">
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { history } from '$state/history.svelte';
  import { addLayerModal } from '$state/addlayermodal.svelte';
  import { t } from '$i18n';

  const hasSelection = $derived(selection.size > 0);

  function toggleVisibility(id: number) {
    const layer = editor.layer(id);
    if (layer) { layer.visible = !layer.visible; editor.layers = [...editor.layers]; }
  }

  function setActive(id: number) { editor.activeLayer = id; }

  function assignSelectionToLayer(id: number) {
    for (const sid of selection.ids) {
      const arr = editor.arrangedById(sid);
      if (arr) arr.layerId = id;
    }
    editor.arranged = [...editor.arranged];
    history.push();
  }
</script>

<div class="space-y-0.5 px-2 py-1">
  {#each editor.layers as layer}
    <div
      class="flex items-center gap-1 px-2 py-1 rounded cursor-pointer {layer.id === editor.activeLayer ? 'bg-brand-accent/20 text-brand-accent' : 'hover:bg-brand-border text-brand-text'}"
      onclick={() => setActive(layer.id)}
      role="button" tabindex="0"
      onkeydown={(e) => e.key === 'Enter' && setActive(layer.id)}
    >
      <button
        class="w-4 h-4 flex items-center justify-center text-[9px] shrink-0 {layer.visible ? 'text-brand-text' : 'text-brand-textdim'}"
        onclick={(e) => { e.stopPropagation(); toggleVisibility(layer.id); }}
        title={layer.visible ? t('layers.hide') : t('layers.show')}
      >{layer.visible ? '●' : '○'}</button>
      <span class="text-[10px] flex-1 truncate">{layer.name}</span>
      <span class="text-[9px] text-brand-textdim shrink-0">Z={layer.z}</span>
      {#if hasSelection}
        <button
          class="btn px-1 py-0 text-[9px] text-brand-accent hover:bg-brand-accent/20 shrink-0"
          onclick={(e) => { e.stopPropagation(); assignSelectionToLayer(layer.id); }}
          title={t('layers.assign', { name: layer.name })}
        >→</button>
      {/if}
    </div>
  {/each}
  <button class="btn w-full justify-center mt-2 text-brand-accent text-[10px]" onclick={() => addLayerModal.show()}>
    {t('layers.add')}
  </button>
</div>
