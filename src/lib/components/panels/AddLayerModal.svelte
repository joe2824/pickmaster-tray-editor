<script lang="ts">
  import { addLayerModal } from '$state/addlayermodal.svelte';
  import { editor } from '$state/editor.svelte';
  import { history } from '$state/history.svelte';
  import { t } from '$i18n';

  let name = $state('');
  let offset = $state(0);

  function submit() {
    const id = editor.nextLayerId++;
    editor.layers = [...editor.layers, { id, name: name || t('addLayer.placeholder', { id }), z: offset, visible: true }];
    editor.activeLayer = id;
    history.push();
    addLayerModal.hide();
    name = ''; offset = 0;
  }
</script>

{#if addLayerModal.visible}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    onclick={(e) => e.target === e.currentTarget && addLayerModal.hide()}
    onkeydown={(e) => { if (e.key === 'Escape') addLayerModal.hide(); if (e.key === 'Enter') submit(); }}
  >
    <div class="bg-brand-panel2 border border-brand-border rounded-xl p-6 w-72 shadow-2xl">
      <h3 class="text-[11px] uppercase tracking-widest text-brand-textdim mb-4">{t('addLayer.title')}</h3>
      <div class="mb-3">
        <label for="al-name" class="block text-[10px] text-brand-textdim mb-1">{t('addLayer.name')}</label>
        <input id="al-name" class="input-num" type="text" bind:value={name} placeholder={t('addLayer.placeholder', { id: editor.nextLayerId })} />
      </div>
      <div class="mb-5">
        <label for="al-z" class="block text-[10px] text-brand-textdim mb-1">{t('addLayer.zOffset')}</label>
        <input id="al-z" class="input-num" type="number" bind:value={offset} step="1" />
      </div>
      <div class="flex gap-2 justify-end">
        <button class="btn" onclick={() => addLayerModal.hide()}>{t('addLayer.cancel')}</button>
        <button class="btn active" onclick={submit}>{t('addLayer.add')}</button>
      </div>
    </div>
  </div>
{/if}
