<script lang="ts">
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { history } from '$state/history.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { getItemColor } from '$three/coords';
  import { v4 as uuid } from 'uuid';
  import { pickJsonFiles } from '$io/files';
  import { parsePickMasterJson, applyParseResult } from '$io/parse';
  import { toast } from '$state/toast.svelte';
  import { t } from '$i18n';

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

    <div
      class="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer select-none
             {isActive ? 'bg-brand-accent/25 ring-1 ring-brand-accent' : isVisible ? 'hover:bg-brand-border' : 'opacity-40 hover:opacity-70 hover:bg-brand-border'}"
      onclick={() => toggleActive(item.id)}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === 'Enter' && toggleActive(item.id)}
      title={isActive ? 'Klick auf Tray zum Platzieren · Esc zum Abbrechen' : 'Klick zum Aktivieren'}
    >
      <!-- Visibility toggle -->
      <button
        class="shrink-0 w-4 h-4 flex items-center justify-center text-[10px] leading-none
               {isVisible ? 'text-brand-textdim hover:text-brand-text' : 'text-brand-textdim/40 hover:text-brand-textdim'}"
        onclick={(e) => { e.stopPropagation(); viewport.toggleItemTypeVisibility(item.id); }}
        title={isVisible ? 'Ausblenden' : 'Einblenden'}
      >{isVisible ? '●' : '○'}</button>

      <span
        class="w-3 h-3 rounded-sm shrink-0 ring-1 ring-inset ring-black/20"
        style="background:{colorHex(getItemColor(item.id))}"
      ></span>
      <span class="text-[10px] {isActive ? 'text-brand-accent font-semibold' : isVisible ? 'text-brand-text' : 'text-brand-textdim'} truncate flex-1">
        {item.name}
      </span>
      <span class="text-[9px] text-brand-textdim shrink-0">{item.size.x}×{item.size.y}</span>

      <!-- Add-at-center button -->
      <button
        class="shrink-0 w-5 h-5 flex items-center justify-center rounded text-brand-textdim
               hover:text-brand-accent hover:bg-brand-accent/20 text-[13px] leading-none"
        onclick={(e) => { e.stopPropagation(); addAtCenter(item.id); }}
        title="In Tray-Mitte platzieren"
      >+</button>
    </div>
  {/each}

  {#if viewport.activeItemTypeId && editor.items[viewport.activeItemTypeId]}
    {@const activeItem = editor.items[viewport.activeItemTypeId]}
    <div class="mt-1 px-2 py-1.5 rounded bg-brand-accent/10 border border-brand-accent/30 text-[9px] text-brand-accent flex items-center gap-1">
      <span class="w-2 h-2 rounded-sm shrink-0" style="background:{colorHex(getItemColor(viewport.activeItemTypeId))}"></span>
      <span class="flex-1 truncate">Klick auf Tray → <b>{activeItem.name}</b></span>
      <button class="text-brand-textdim hover:text-brand-text text-[11px]" onclick={() => (viewport.activeItemTypeId = null)} title="Abbrechen (Esc)">✕</button>
    </div>
  {/if}

  {#if Object.keys(editor.items).length === 0}
    <p class="text-[10px] text-brand-textdim italic px-2 py-1">{t('items.noItems')}</p>
  {/if}

  <button class="btn w-full justify-center mt-2 text-brand-accent" onclick={loadItems}>
    {t('items.load')}
  </button>
</div>
