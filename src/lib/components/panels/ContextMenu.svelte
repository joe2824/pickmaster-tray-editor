<script lang="ts">
  import { contextMenu } from '$state/contextmenu.svelte';
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { history } from '$state/history.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { v4 as uuid } from 'uuid';
  import { t } from '$i18n';

  function duplicate() {
    if (!contextMenu.targetId) return;
    const items = selection.selectedItems;
    const copies = items.map((a) => ({ ...a, id: uuid(), rawId: undefined, x: a.x + 10, y: a.y + 10, order: editor.nextOrderId++ }));
    editor.arranged = [...editor.arranged, ...copies];
    selection.set(copies.map((c) => c.id));
    history.push(); contextMenu.hide();
  }

  function deleteItems() {
    editor.arranged = editor.arranged.filter((a) => !selection.has(a.id));
    selection.clear(); history.push(); contextMenu.hide();
  }

  function setLayer(layerId: number) {
    for (const id of selection.ids) { const arr = editor.arrangedById(id); if (arr) arr.layerId = layerId; }
    editor.arranged = [...editor.arranged]; history.push(); contextMenu.hide();
  }

  function snapItem() {
    for (const id of selection.ids) {
      const arr = editor.arrangedById(id);
      if (!arr) continue;
      arr.x = Math.round(arr.x / viewport.snapSize) * viewport.snapSize;
      arr.y = Math.round(arr.y / viewport.snapSize) * viewport.snapSize;
    }
    editor.arranged = [...editor.arranged]; history.push(); contextMenu.hide();
  }
</script>

{#if contextMenu.visible}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-40" onclick={() => contextMenu.hide()} onkeydown={(e) => e.key === 'Escape' && contextMenu.hide()}></div>
  <div class="fixed z-50 bg-brand-panel2 border border-brand-border rounded-lg shadow-xl py-1 min-w-40 text-[11px]" style="left:{contextMenu.x}px;top:{contextMenu.y}px">
    <button class="w-full text-left px-3 py-1.5 hover:bg-brand-border" onclick={duplicate}>{t('ctx.duplicate')}</button>
    <button class="w-full text-left px-3 py-1.5 hover:bg-brand-border" onclick={snapItem}>{t('ctx.snapToGrid')}</button>
    {#if editor.layers.length > 1}
      <div class="border-t border-brand-border mt-1 pt-1 px-3 text-brand-textdim text-[9px] uppercase tracking-widest py-1">{t('ctx.layer')}</div>
      {#each editor.layers as layer}
        <button class="w-full text-left px-3 py-1.5 hover:bg-brand-border {layer.id === editor.activeLayer ? 'text-brand-accent' : ''}" onclick={() => setLayer(layer.id)}>{layer.name}</button>
      {/each}
    {/if}
    <div class="border-t border-brand-border mt-1"></div>
    <button class="w-full text-left px-3 py-1.5 hover:bg-brand-border text-brand-red" onclick={deleteItems}>{t('ctx.delete')}</button>
  </div>
{/if}
