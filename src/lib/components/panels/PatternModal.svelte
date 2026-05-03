<script lang="ts">
  import { patternModal } from '$state/patternmodal.svelte';
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { history } from '$state/history.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { toast } from '$state/toast.svelte';
  import { v4 as uuid } from 'uuid';
  import { t } from '$i18n';

  let itemId = $state('');
  let rows = $state(3);
  let cols = $state(3);
  let spacingX = $state(200);
  let spacingY = $state(200);
  let startX = $state(0);
  let startY = $state(0);

  $effect(() => {
    if (patternModal.visible && editor.tray) {
      const item = itemId ? editor.itemDef(itemId) : null;
      const iw = item?.size.x ?? 160;
      const ih = item?.size.y ?? 340;
      startX = Math.round((editor.tray.size.x - (cols - 1) * spacingX - iw) / 2);
      startY = Math.round((editor.tray.size.y - (rows - 1) * spacingY - ih) / 2);
    }
  });

  $effect(() => {
    if (patternModal.visible && !itemId) {
      const ids = Object.keys(editor.items);
      if (ids.length > 0) itemId = ids[0];
    }
  });

  function generate() {
    if (!itemId || !editor.items[itemId]) { toast.show(t('pattern.noItem')); return; }
    const newItems = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let x = startX + c * spacingX;
        let y = startY + r * spacingY;
        if (viewport.snap) { x = Math.round(x / viewport.snapSize) * viewport.snapSize; y = Math.round(y / viewport.snapSize) * viewport.snapSize; }
        newItems.push({ id: uuid(), itemId, x, y, z: 0, rx: 0, ry: 0, rz: 0, order: editor.nextOrderId++, layerId: editor.activeLayer });
      }
    }
    editor.arranged = [...editor.arranged, ...newItems];
    selection.set(newItems.map((a) => a.id));
    history.push();
    toast.show(t('pattern.created', { n: newItems.length }));
    patternModal.hide();
  }
</script>

{#if patternModal.visible}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    onclick={(e) => e.target === e.currentTarget && patternModal.hide()}
    onkeydown={(e) => e.key === 'Escape' && patternModal.hide()}>
    <div class="bg-brand-panel2 border border-brand-border rounded-xl p-6 w-80 shadow-2xl">
      <h3 class="text-[11px] uppercase tracking-widest text-brand-textdim mb-4">{t('pattern.title')}</h3>
      <div class="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px]">
        <label for="pt-item" class="text-brand-textdim self-center col-span-2">{t('pattern.itemType')}</label>
        <select id="pt-item" class="input-num col-span-2" bind:value={itemId}>
          {#each Object.values(editor.items) as item}
            <option value={item.id}>{item.name}</option>
          {/each}
        </select>
        <label for="pt-rows" class="text-brand-textdim self-center">{t('pattern.rows')}</label>
        <input id="pt-rows" class="input-num" type="number" bind:value={rows} min="1" max="50" />
        <label for="pt-cols" class="text-brand-textdim self-center">{t('pattern.cols')}</label>
        <input id="pt-cols" class="input-num" type="number" bind:value={cols} min="1" max="50" />
        <label for="pt-sx" class="text-brand-textdim self-center">{t('pattern.spacingX')}</label>
        <input id="pt-sx" class="input-num" type="number" bind:value={spacingX} step="1" />
        <label for="pt-sy" class="text-brand-textdim self-center">{t('pattern.spacingY')}</label>
        <input id="pt-sy" class="input-num" type="number" bind:value={spacingY} step="1" />
        <label for="pt-ox" class="text-brand-textdim self-center">{t('pattern.startX')}</label>
        <input id="pt-ox" class="input-num" type="number" bind:value={startX} step="1" />
        <label for="pt-oy" class="text-brand-textdim self-center">{t('pattern.startY')}</label>
        <input id="pt-oy" class="input-num" type="number" bind:value={startY} step="1" />
      </div>
      <p class="text-[9px] text-brand-textdim mt-3">{t('pattern.summary', { n: rows * cols, layer: editor.activeLayer })}</p>
      <div class="flex gap-2 justify-end mt-4">
        <button class="btn" onclick={() => patternModal.hide()}>{t('pattern.cancel')}</button>
        <button class="btn active" onclick={generate}>{t('pattern.generate')}</button>
      </div>
    </div>
  </div>
{/if}
