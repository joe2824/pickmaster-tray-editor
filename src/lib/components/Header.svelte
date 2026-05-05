<script lang="ts">
  import {
    Undo2, Redo2, FolderOpen, Download, FilePlus2,
    Magnet, Boxes, Ruler, LayoutGrid, Box,
  } from 'lucide-svelte';
  import { stlState } from '$state/stl.svelte';
  import { history } from '$state/history.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { sceneInteraction } from '$state/scene.svelte';
  import { localeState } from '$state/locale.svelte';
  import { pickJsonFiles } from '$io/files';
  import { parsePickMasterJson, applyParseResult } from '$io/parse';
  import { serializeTrayJson } from '$io/serialize';
  import { downloadJson } from '$io/files';
  import { toast } from '$state/toast.svelte';
  import { patternModal } from '$state/patternmodal.svelte';
  import { saveProject } from '$io/indexeddb';
  import { t } from '$i18n';

  async function loadTray() {
    const [file] = await pickJsonFiles(false);
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      const result = parsePickMasterJson(json);
      if (result.type === 'tray') {
        applyParseResult(result);
        toast.show(t('toast.trayLoaded', { name: result.tray!.def.name }));
      } else {
        toast.show(t('toast.noTrayFile'));
      }
    } catch {
      toast.show(t('toast.loadError'));
    }
  }

  function exportTray() {
    const data = serializeTrayJson();
    if (!data) { toast.show(t('toast.noTrayExport')); return; }
    downloadJson((editor.tray?.name ?? 'tray') + '.json', data);
    toast.show(t('toast.exported'));
  }

  function newProject() {
    if (!confirm(t('header.newConfirm'))) return;
    editor.tray = null; editor.items = {};
    editor.replaceFrom({ arranged: [], layers: [{ id: 1, name: 'Ebene 1', z: 0, visible: true }], activeLayer: 1, nextLayerId: 2, nextOrderId: 1000 });
    selection.clear(); history.reset();
    saveProject({ tray: null, items: {}, arranged: [], layers: [], activeLayer: 1, nextLayerId: 2, nextOrderId: 1000, savedAt: Date.now() });
    toast.show(t('toast.newProject'));
  }

  function toggleMeasure() {
    if (viewport.mode === 'measure') { viewport.mode = 'select'; sceneInteraction.clearMeasure(); }
    else { viewport.mode = 'measure'; sceneInteraction.clearMeasure(); }
  }
</script>

<header class="h-10 flex items-center bg-brand-panel border-b border-brand-border px-3 gap-2 shrink-0 overflow-x-auto">
  <span class="font-display text-[13px] font-semibold text-brand-accent mr-1 shrink-0 whitespace-nowrap">
    PickMaster Twin® <span class="text-brand-textdim font-normal">Fast Pattern Editor</span>
  </span>

  <div class="flex gap-0.5 shrink-0">
    <button class="btn {history.canUndo ? '' : 'disabled'}" onclick={() => history.undo()} title="Undo (Ctrl+Z)">
      <Undo2 size={13} />
    </button>
    <button class="btn {history.canRedo ? '' : 'disabled'}" onclick={() => history.redo()} title="Redo (Ctrl+Shift+Z)">
      <Redo2 size={13} />
    </button>
  </div>

  <div class="w-px h-5 bg-brand-border shrink-0"></div>

  <button class="btn shrink-0 gap-1.5" onclick={newProject}>
    <FilePlus2 size={13} />{t('header.new')}
  </button>
  <button class="btn shrink-0 gap-1.5" onclick={loadTray}>
    <FolderOpen size={13} />{t('header.loadTray')}
  </button>
  <button class="btn shrink-0 gap-1.5" onclick={exportTray} title={t('header.exportTitle')} disabled={!editor.tray}>
    <Download size={13} />{t('header.export')}
  </button>

  <div class="w-px h-5 bg-brand-border shrink-0"></div>

  <button class="btn shrink-0 gap-1.5 {viewport.snap ? 'active' : ''}" onclick={() => (viewport.snap = !viewport.snap)} title={t('header.snapTitle')}>
    <Magnet size={13} />{t('header.snap')}
  </button>
  {#if viewport.snap}
    <input class="input-num w-14 shrink-0" type="number" bind:value={viewport.snapSize} min="1" step="1" title={t('header.snapUnit')} />
    <span class="text-[10px] text-brand-textdim shrink-0">{t('header.snapUnit')}</span>
  {/if}

  <div class="w-px h-5 bg-brand-border shrink-0"></div>

  <button class="btn shrink-0 gap-1.5 {viewport.wireframe ? 'active' : ''}" onclick={() => (viewport.wireframe = !viewport.wireframe)} title={t('header.edgesTitle')}>
    <Boxes size={13} />{t('header.edges')}
  </button>
  <button
    class="btn shrink-0 gap-1.5 {viewport.useStlMeshes && stlState.count > 0 ? 'active' : ''}"
    onclick={() => { if (stlState.count > 0) viewport.useStlMeshes = !viewport.useStlMeshes; }}
    title={stlState.count > 0 ? t('stl.modeTitle') : t('stl.uploadHint')}
  >
    <Box size={13} />{t('stl.mode')}
    {#if stlState.count > 0}
      <span class="text-[9px] opacity-60">{stlState.count}</span>
    {/if}
  </button>
  <button class="btn shrink-0 gap-1.5 {viewport.mode === 'measure' ? 'active' : ''}" onclick={toggleMeasure} title={t('header.measureTitle')}>
    <Ruler size={13} />{t('header.measure')}
  </button>
  <button class="btn shrink-0 gap-1.5" onclick={() => patternModal.show()} title={t('header.patternTitle')} disabled={Object.keys(editor.items).length === 0}>
    <LayoutGrid size={13} />{t('header.pattern')}
  </button>

  <div class="flex-1 min-w-0"></div>

  <span class="text-[10px] text-brand-textdim shrink-0 whitespace-nowrap">
    {editor.arranged.length} {t('header.items')}
    {#if selection.size > 0}· <span class="text-brand-selected">{selection.size} {t('header.sel')}</span>{/if}
  </span>

  <div class="w-px h-5 bg-brand-border shrink-0"></div>

  <button class="btn shrink-0 text-[10px] font-bold text-brand-accent" onclick={() => localeState.toggle()} title="Switch language">
    {t('header.langSwitch')}
  </button>
</header>
