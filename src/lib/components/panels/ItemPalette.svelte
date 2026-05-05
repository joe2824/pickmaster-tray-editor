<script lang="ts">
  import { Eye, EyeOff, Plus, X, Box } from 'lucide-svelte';
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { history } from '$state/history.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { stlState } from '$state/stl.svelte';
  import { getItemColor } from '$three/coords';
  import { v4 as uuid } from 'uuid';
  import { pickJsonFiles } from '$io/files';
  import { parsePickMasterJson, applyParseResult } from '$io/parse';
  import { loadStlFile } from '$three/stl';
  import { saveStl, deleteStl, saveStlRotations } from '$io/indexeddb';
  import { toast } from '$state/toast.svelte';
  import { t } from '$i18n';

  async function uploadStl(itemId: string) {
    return new Promise<void>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.stl';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) { resolve(); return; }
        try {
          const { geo, buffer } = await loadStlFile(file);
          stlState.set(itemId, geo);
          await saveStl(itemId, buffer);
          viewport.useStlMeshes = true;   // auto-enable STL mode
          toast.show(t('stl.loaded'));
        } catch {
          toast.show(t('toast.loadError'));
        }
        resolve();
      };
      input.click();
    });
  }

  async function removeStl(itemId: string) {
    stlState.remove(itemId);
    await deleteStl(itemId);
  }

  async function loadItems() {
    const files = await pickJsonFiles(true);
    let added = 0;
    for (const f of files) {
      try {
        const json = JSON.parse(await f.text());
        const result = parsePickMasterJson(json);
        if (result.type === 'item') { applyParseResult(result); added++; }
      } catch {
        toast.show(t('toast.fileError', { name: f.name }));
      }
    }
    if (added > 0) toast.show(t('toast.itemsLoaded', { n: added }));
  }

  function toggleActive(itemId: string) {
    viewport.activeItemTypeId = viewport.activeItemTypeId === itemId ? null : itemId;
  }

  function addAtCenter(itemId: string) {
    if (!editor.tray) { toast.show(t('toast.noTray')); return; }
    const { x: sw, y: sh } = editor.tray.size;
    let x = sw / 2, y = sh / 2;
    if (viewport.snap) {
      x = Math.round(x / viewport.snapSize) * viewport.snapSize;
      y = Math.round(y / viewport.snapSize) * viewport.snapSize;
    }
    const newItem = { id: uuid(), itemId, x, y, z: 0, rx: 0, ry: 0, rz: 0, order: editor.nextOrderId++, layerId: editor.activeLayer };
    editor.arranged = [...editor.arranged, newItem];
    selection.set([newItem.id]);
    history.push();
    viewport.activeItemTypeId = null;
  }

  function colorHex(c: number) { return '#' + c.toString(16).padStart(6, '0'); }
</script>

<div class="space-y-0.5 px-2 py-1">
  {#each Object.values(editor.items) as item}
    {@const isActive = viewport.activeItemTypeId === item.id}
    {@const isVisible = viewport.isItemTypeVisible(item.id)}
    {@const hasStl = stlState.has(item.id)}

    <div
      class="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer select-none
             {isActive ? 'bg-brand-accent/25 ring-1 ring-brand-accent' : isVisible ? 'hover:bg-brand-border' : 'opacity-40 hover:opacity-70 hover:bg-brand-border'}"
      onclick={() => toggleActive(item.id)}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === 'Enter' && toggleActive(item.id)}
      title={isActive ? 'Klick auf Tray zum Platzieren · Esc zum Abbrechen' : 'Klick zum Aktivieren'}
    >
      <button
        class="shrink-0 w-4 h-4 flex items-center justify-center {isVisible ? 'text-brand-textdim hover:text-brand-text' : 'text-brand-textdim/40 hover:text-brand-textdim'}"
        onclick={(e) => { e.stopPropagation(); viewport.toggleItemTypeVisibility(item.id); }}
        title={isVisible ? 'Ausblenden' : 'Einblenden'}
      >{#if isVisible}<Eye size={12} />{:else}<EyeOff size={12} />{/if}</button>

      <span
        class="w-3 h-3 rounded-sm shrink-0 ring-1 ring-inset ring-black/20"
        style="background:{colorHex(getItemColor(item.id))}"
      ></span>
      <span class="text-[10px] {isActive ? 'text-brand-accent font-semibold' : isVisible ? 'text-brand-text' : 'text-brand-textdim'} truncate flex-1">
        {item.name}
      </span>
      <span class="text-[9px] text-brand-textdim shrink-0">{item.size.x}×{item.size.y}</span>

      <!-- STL upload/remove -->
      {#if hasStl}
        <button
          class="shrink-0 w-5 h-5 flex items-center justify-center rounded text-brand-green hover:text-brand-red hover:bg-brand-red/10"
          onclick={(e) => { e.stopPropagation(); removeStl(item.id); }}
          title={t('stl.remove')}
        ><Box size={11} /></button>
      {:else}
        <button
          class="shrink-0 w-5 h-5 flex items-center justify-center rounded text-brand-textdim hover:text-brand-accent hover:bg-brand-accent/10"
          onclick={(e) => { e.stopPropagation(); uploadStl(item.id); }}
          title={t('stl.upload')}
        ><Box size={11} /></button>
      {/if}

      <button
        class="shrink-0 w-5 h-5 flex items-center justify-center rounded text-brand-textdim hover:text-brand-accent hover:bg-brand-accent/20"
        onclick={(e) => { e.stopPropagation(); addAtCenter(item.id); }}
        title="In Tray-Mitte platzieren"
      ><Plus size={12} /></button>
    </div>
  {/each}

  {#if viewport.activeItemTypeId && editor.items[viewport.activeItemTypeId]}
    {@const activeItem = editor.items[viewport.activeItemTypeId]}
    <div class="mt-1 px-2 py-1.5 rounded bg-brand-accent/10 border border-brand-accent/30 text-[9px] text-brand-accent flex items-center gap-1">
      <span class="w-2 h-2 rounded-sm shrink-0" style="background:{colorHex(getItemColor(viewport.activeItemTypeId))}"></span>
      <span class="flex-1 truncate">Klick auf Tray → <b>{activeItem.name}</b></span>
      <button class="text-brand-textdim hover:text-brand-text" onclick={() => (viewport.activeItemTypeId = null)} title="Abbrechen (Esc)"><X size={11} /></button>
    </div>
  {/if}

  {#if Object.keys(editor.items).length === 0}
    <p class="text-[10px] text-brand-textdim italic px-2 py-1">{t('items.noItems')}</p>
  {/if}

  <button class="btn w-full justify-center mt-2 text-brand-accent" onclick={loadItems}>
    {t('items.load')}
  </button>

  <!-- STL section -->
  {#if Object.keys(editor.items).length > 0}
    <div class="mt-3 pt-2 border-t border-brand-border">
      <p class="text-[9px] text-brand-textdim uppercase tracking-widest px-2 mb-1">{t('stl.sectionTitle')}</p>
      <p class="text-[9px] text-brand-textdim/60 px-2 mb-2 leading-relaxed">{t('stl.sectionHint')}</p>
      {#each Object.values(editor.items) as item}
        {@const hasStlItem = stlState.has(item.id)}
        <div class="px-2 py-1 rounded hover:bg-brand-border">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-sm shrink-0" style="background:#{getItemColor(item.id).toString(16).padStart(6,'0')}"></span>
            <span class="text-[10px] text-brand-text truncate flex-1">{item.name}</span>
            {#if hasStlItem}
              <span class="text-[9px] text-brand-green">STL ✓</span>
              <button
                class="btn py-0 px-1.5 text-[9px] text-brand-red"
                onclick={() => removeStl(item.id)}
                title={t('stl.remove')}
              >{t('stl.remove')}</button>
            {:else}
              <button
                class="btn py-0 px-1.5 text-[9px] text-brand-accent"
                onclick={() => uploadStl(item.id)}
                title={t('stl.upload')}
              >{t('stl.upload')}</button>
            {/if}
          </div>
          {#if hasStlItem}
            {@const stlRot = stlState.getRotation(item.id)}
            <div class="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr] gap-x-1 gap-y-0.5 mt-1 items-center">
              <span class="text-[8px] text-brand-textdim">RX</span>
              <input class="input-num text-[9px] px-1 py-0" type="number" value={stlRot.x}
                onchange={(e) => { stlState.setRotation(item.id, { ...stlRot, x: parseFloat((e.target as HTMLInputElement).value) || 0 }); saveStlRotations(stlState.rotations); }} step="15" />
              <span class="text-[8px] text-brand-textdim ml-1">RY</span>
              <input class="input-num text-[9px] px-1 py-0" type="number" value={stlRot.y}
                onchange={(e) => { stlState.setRotation(item.id, { ...stlRot, y: parseFloat((e.target as HTMLInputElement).value) || 0 }); saveStlRotations(stlState.rotations); }} step="15" />
              <span class="text-[8px] text-brand-textdim ml-1">RZ</span>
              <input class="input-num text-[9px] px-1 py-0" type="number" value={stlRot.z}
                onchange={(e) => { stlState.setRotation(item.id, { ...stlRot, z: parseFloat((e.target as HTMLInputElement).value) || 0 }); saveStlRotations(stlState.rotations); }} step="15" />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
