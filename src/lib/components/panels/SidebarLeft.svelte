<script lang="ts">
  import TrayInfo from './TrayInfo.svelte';
  import ItemPalette from './ItemPalette.svelte';
  import LayersPanel from './LayersPanel.svelte';
  import { t } from '$i18n';

  let trayOpen = $state(true);
  let itemsOpen = $state(true);
  let layersOpen = $state(true);
  let shortcutsOpen = $state(false);

  const groups = [
    {
      key: 'shortcuts.views',
      rows: [
        ['shortcuts.1234', 'shortcuts.1234.desc'],
      ],
    },
    {
      key: 'shortcuts.edit',
      rows: [
        ['shortcuts.undo',        'shortcuts.undo.desc'],
        ['shortcuts.selAll',      'shortcuts.selAll.desc'],
        ['shortcuts.dup',         'shortcuts.dup.desc'],
        ['shortcuts.del',         'shortcuts.del.desc'],
        ['shortcuts.esc',         'shortcuts.esc.desc'],
        ['shortcuts.arrows',      'shortcuts.arrows.desc'],
        ['shortcuts.shiftArrows', 'shortcuts.shiftArrows.desc'],
        ['shortcuts.pageud',      'shortcuts.pageud.desc'],
      ],
    },
    {
      key: 'shortcuts.camera',
      rows: [
        ['shortcuts.pan',    'shortcuts.pan.desc'],
        ['shortcuts.rotate', 'shortcuts.rotate.desc'],
        ['shortcuts.zoom',   'shortcuts.zoom.desc'],
      ],
    },
  ] as const;
</script>

<aside class="w-full h-full bg-brand-panel border-r border-brand-border flex flex-col overflow-hidden">
  <button class="panel-title" onclick={() => (trayOpen = !trayOpen)}>
    <span>{t('panel.tray')}</span><span>{trayOpen ? '▲' : '▼'}</span>
  </button>
  {#if trayOpen}<TrayInfo />{/if}

  <button class="panel-title" onclick={() => (itemsOpen = !itemsOpen)}>
    <span>{t('panel.itemTypes')}</span><span>{itemsOpen ? '▲' : '▼'}</span>
  </button>
  {#if itemsOpen}<ItemPalette />{/if}

  <button class="panel-title" onclick={() => (layersOpen = !layersOpen)}>
    <span>{t('panel.layers')}</span><span>{layersOpen ? '▲' : '▼'}</span>
  </button>
  {#if layersOpen}<LayersPanel />{/if}

  <div class="flex-1 overflow-y-auto"></div>

  <!-- Keyboard shortcuts -->
  <button class="panel-title shrink-0" onclick={() => (shortcutsOpen = !shortcutsOpen)}>
    <span>{t('shortcuts.title')}</span><span>{shortcutsOpen ? '▲' : '▼'}</span>
  </button>
  {#if shortcutsOpen}
    <div class="shrink-0 px-2 py-1.5 space-y-2 text-[9px]">
      {#each groups as group}
        <div>
          <p class="text-white/30 uppercase tracking-widest mb-1">{t(group.key)}</p>
          {#each group.rows as [keyK, descK]}
            <div class="flex items-baseline justify-between gap-2 py-0.5">
              <kbd class="text-white/80 font-mono bg-brand-panel2 rounded px-1 py-0.5 whitespace-nowrap">{t(keyK)}</kbd>
              <span class="text-white/50 text-right">{t(descK)}</span>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Disclaimer -->
  <div class="shrink-0 px-3 py-2 border-t border-brand-border text-[9px] text-white/40 leading-relaxed select-none">
    <p>{t('disclaimer.line1')}</p>
    <p>{t('disclaimer.line2')}</p>
  </div>
</aside>
