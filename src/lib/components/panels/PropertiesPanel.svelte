<script lang="ts">
  import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-svelte';
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { history } from '$state/history.svelte';
  import { collisions } from '$state/collisions.svelte';
  import { t } from '$i18n';

  const single = $derived(selection.size === 1 ? selection.selectedItems[0] : null);

  const currentLayerId = $derived(
    single
      ? single.layerId
      : selection.selectedItems.length > 0 &&
          selection.selectedItems.every((a) => a.layerId === selection.selectedItems[0].layerId)
        ? selection.selectedItems[0].layerId
        : null
  );
  const currentLayer = $derived(currentLayerId !== null ? editor.layer(currentLayerId) : null);
  // Sort by Z so ▶ = higher Z (up), ◀ = lower Z (down)
  const layersByZ = $derived([...editor.layers].sort((a, b) => a.z - b.z));
  const layerIndex = $derived(currentLayerId !== null ? layersByZ.findIndex((l) => l.id === currentLayerId) : -1);
  const prevLayer = $derived(layerIndex > 0 ? layersByZ[layerIndex - 1] : null);
  const nextLayer = $derived(layerIndex >= 0 && layerIndex < layersByZ.length - 1 ? layersByZ[layerIndex + 1] : null);
  const isDupOrder = $derived(single ? collisions.duplicateOrderIds.has(single.id) : false);

  function update(field: 'x' | 'y' | 'z' | 'rx' | 'ry' | 'rz' | 'order', value: number) {
    if (!single) return;
    const arr = editor.arrangedById(single.id);
    if (!arr) return;
    arr[field] = value;
    editor.arranged = [...editor.arranged];
    history.push();
  }

  export function assignToLayer(layerId: number) {
    if (selection.size === 0) return;
    for (const id of selection.ids) { const arr = editor.arrangedById(id); if (arr) arr.layerId = layerId; }
    editor.arranged = [...editor.arranged];
    history.push();
  }

  function cycleLayer(dir: 1 | -1) {
    const target = dir === -1 ? prevLayer : nextLayer;
    if (target) assignToLayer(target.id);
  }
</script>

<div class="px-3 py-2 space-y-1.5 text-[10px]">
  {#if selection.size === 0}
    <p class="text-brand-textdim italic">{t('props.nothing')}</p>
  {:else}
    {#if single}
      <div class="grid grid-cols-2 gap-x-2 gap-y-1.5">
        <label for="prop-x" class="text-brand-textdim self-center">{t('props.x')}</label>
        <input id="prop-x" class="input-num" type="number" value={Math.round(single.x*10)/10} onchange={(e) => update('x', parseFloat((e.target as HTMLInputElement).value))} step="1" />
        <label for="prop-y" class="text-brand-textdim self-center">{t('props.y')}</label>
        <input id="prop-y" class="input-num" type="number" value={Math.round(single.y*10)/10} onchange={(e) => update('y', parseFloat((e.target as HTMLInputElement).value))} step="1" />
        <label for="prop-z" class="text-brand-textdim self-center">{t('props.z')}</label>
        <input id="prop-z" class="input-num" type="number" value={Math.round(single.z*10)/10} onchange={(e) => update('z', parseFloat((e.target as HTMLInputElement).value))} step="1" />
        <label for="prop-rx" class="text-brand-textdim self-center">{t('props.rx')}</label>
        <input id="prop-rx" class="input-num" type="number" value={Math.round((single.rx||0)*10)/10} onchange={(e) => update('rx', parseFloat((e.target as HTMLInputElement).value))} step="1" />
        <label for="prop-ry" class="text-brand-textdim self-center">{t('props.ry')}</label>
        <input id="prop-ry" class="input-num" type="number" value={Math.round((single.ry||0)*10)/10} onchange={(e) => update('ry', parseFloat((e.target as HTMLInputElement).value))} step="1" />
        <label for="prop-rz" class="text-brand-textdim self-center">{t('props.rz')}</label>
        <input id="prop-rz" class="input-num" type="number" value={Math.round((single.rz||0)*10)/10} onchange={(e) => update('rz', parseFloat((e.target as HTMLInputElement).value))} step="1" />
      </div>
      <div class="pt-1 border-t border-brand-border grid grid-cols-2 gap-x-2 gap-y-1.5">
        <label for="prop-order" class="self-center {isDupOrder ? 'text-orange-400' : 'text-brand-textdim'}" title={isDupOrder ? t('props.dupOrder') : ''}>
          {t('props.order')} {#if isDupOrder}<AlertTriangle size={10} class="inline" />{/if}
        </label>
        <input id="prop-order" class="input-num {isDupOrder ? 'border-orange-400' : ''}" type="number" value={single.order} onchange={(e) => update('order', parseInt((e.target as HTMLInputElement).value))} step="1" min="0" />
      </div>
    {:else}
      <p class="text-brand-text">{t('props.multiSelect', { n: selection.size })}</p>
    {/if}

    <div class="pt-1 border-t border-brand-border flex items-center gap-1">
      <span class="text-brand-textdim shrink-0">{t('props.layer')}</span>
      <button class="btn px-1 py-0.5 {!prevLayer ? 'disabled' : ''}" onclick={() => cycleLayer(-1)} title={t('props.prevLayer')}><ChevronLeft size={13} /></button>
      <span class="flex-1 text-center text-brand-text truncate">{currentLayer?.name ?? '—'}</span>
      <button class="btn px-1 py-0.5 {!nextLayer ? 'disabled' : ''}" onclick={() => cycleLayer(1)} title={t('props.nextLayer')}><ChevronRight size={13} /></button>
    </div>
    {#if editor.layers.length > 1}
      <select class="input-num w-full" value={currentLayerId ?? ''} onchange={(e) => { const id = parseInt((e.target as HTMLSelectElement).value); if (!isNaN(id)) assignToLayer(id); }}>
        {#each editor.layers as layer}
          <option value={layer.id}>{layer.name} (Z={layer.z})</option>
        {/each}
      </select>
    {/if}
  {/if}
</div>
