<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import Header from '$components/Header.svelte';
  import SidebarLeft from '$components/panels/SidebarLeft.svelte';
  import SidebarRight from '$components/panels/SidebarRight.svelte';
  import Viewport from '$components/viewport/Viewport.svelte';
  import ViewControls from '$components/viewport/ViewControls.svelte';
  import StatusBar from '$components/viewport/StatusBar.svelte';
  import GridInfo from '$components/viewport/GridInfo.svelte';
  import GizmoAxes from '$components/viewport/GizmoAxes.svelte';
  import MarqueeBox from '$components/viewport/MarqueeBox.svelte';
  import MeasureTool from '$components/viewport/MeasureTool.svelte';
  import ContextMenu from '$components/panels/ContextMenu.svelte';
  import Toast from '$components/panels/Toast.svelte';
  import AddLayerModal from '$components/panels/AddLayerModal.svelte';
  import PatternModal from '$components/panels/PatternModal.svelte';
  import LandingPage from '$components/LandingPage.svelte';
  import { sceneInteraction } from '$state/scene.svelte';
  import { initShortcuts } from '$utils/shortcuts';
  import { t } from '$i18n';
  import { centerOrbitOnTray, parsePickMasterJson, applyParseResult } from '$io/parse';
  import { loadProject, saveProject, type SavedProject } from '$io/indexeddb';
  import { pickJsonFiles } from '$io/files';
  import { editor } from '$state/editor.svelte';
  import { history } from '$state/history.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { toast } from '$state/toast.svelte';
  import { debounce } from '$utils/debounce';
  import { onMount } from 'svelte';

  // ── Landing state ──────────────────────────────────────────
  let draft = $state<SavedProject | null>(null);
  const showLanding = $derived(editor.tray === null);

  async function handleLandingLoad() {
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

  function handleLandingRestore() {
    if (!draft?.tray) return;
    editor.tray = draft.tray;
    editor.items = draft.items ?? {};
    editor.replaceFrom({
      arranged: draft.arranged ?? [],
      layers: draft.layers ?? [{ id: 1, name: 'Ebene 1', z: 0, visible: true }],
      activeLayer: draft.activeLayer ?? 1,
      nextLayerId: draft.nextLayerId ?? 2,
      nextOrderId: draft.nextOrderId ?? 1000,
    });
    history.reset();
    history.push();
    centerOrbitOnTray(draft.tray);
    if (draft.collisionsEnabled !== undefined) viewport.collisionsEnabled = draft.collisionsEnabled;
    toast.show(t('toast.restored'));
  }

  // ── Sidebar resize ──────────────────────────────────────────
  const MIN_W = 140;
  const MAX_W = 520;

  let leftWidth = $state(parseInt(localStorage.getItem('sidebar-left') ?? '208'));
  let rightWidth = $state(parseInt(localStorage.getItem('sidebar-right') ?? '208'));
  let leftVisible = $state(true);
  let rightVisible = $state(true);

  let resizing = $state<'left' | 'right' | null>(null);
  let resizeStartX = 0;
  let resizeStartW = 0;

  function startResize(side: 'left' | 'right', e: MouseEvent) {
    resizing = side;
    resizeStartX = e.clientX;
    resizeStartW = side === 'left' ? leftWidth : rightWidth;
    e.preventDefault();
  }

  function onMousemove(e: MouseEvent) {
    if (!resizing) return;
    const dx = e.clientX - resizeStartX;
    if (resizing === 'left') {
      leftWidth = Math.max(MIN_W, Math.min(MAX_W, resizeStartW + dx));
      localStorage.setItem('sidebar-left', String(leftWidth));
    } else {
      rightWidth = Math.max(MIN_W, Math.min(MAX_W, resizeStartW - dx));
      localStorage.setItem('sidebar-right', String(rightWidth));
    }
  }

  function stopResize() { resizing = null; }

  // ── Autosave ─────────────────────────────────────────────────
  const autosave = debounce(() => {
    saveProject({
      tray: editor.tray,
      items: editor.items,
      arranged: editor.arranged,
      layers: editor.layers,
      activeLayer: editor.activeLayer,
      nextLayerId: editor.nextLayerId,
      nextOrderId: editor.nextOrderId,
      collisionsEnabled: viewport.collisionsEnabled,
      savedAt: Date.now(),
    });
  }, 1500);

  onMount(() => {
    // Load saved project for the landing page draft option
    // Do NOT auto-restore — let the user decide via landing page
    loadProject().then((saved) => {
      draft = saved;
    });
    return initShortcuts();
  });

  $effect(() => {
    void editor.tray;
    void editor.arranged.length;
    void editor.layers.length;
    void editor.items;
    void viewport.collisionsEnabled;
    autosave();
  });
</script>

<svelte:window onmousemove={onMousemove} onmouseup={stopResize} />

<!-- Landing page when no tray is loaded -->
{#if showLanding}
  <LandingPage {draft} onLoad={handleLandingLoad} onRestore={handleLandingRestore} />
{/if}

<!-- Main editor (always mounted so Three.js context is available, hidden behind landing) -->
<div
  class="flex flex-col h-screen overflow-hidden"
  class:cursor-col-resize={resizing !== null}
  class:invisible={showLanding}
  class:pointer-events-none={showLanding}
>
  <Header />
  <div class="flex flex-1 overflow-hidden">

    <!-- Left sidebar -->
    {#if leftVisible}
      <div class="shrink-0 overflow-hidden" style="width:{leftWidth}px">
        <SidebarLeft />
      </div>
    {/if}

    <!-- Left resize handle + collapse toggle -->
    <div class="flex flex-col shrink-0 w-3 group relative z-10">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="flex-1 cursor-col-resize hover:bg-brand-accent/40 transition-colors bg-brand-border/0 group-hover:bg-brand-border/30"
        onmousedown={(e) => startResize('left', e)}
      ></div>
      <button
        class="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-7 bg-brand-panel2 border border-brand-border rounded-r text-[8px] text-brand-textdim hover:text-brand-text flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onclick={() => (leftVisible = !leftVisible)}
        title={leftVisible ? 'Linke Leiste ausblenden' : 'Linke Leiste einblenden'}
      >{#if leftVisible}<ChevronLeft size={9} />{:else}<ChevronRight size={9} />{/if}</button>
    </div>

    {#if !leftVisible}
      <button
        class="shrink-0 w-4 bg-brand-panel2 border-r border-brand-border text-[8px] text-brand-textdim hover:text-brand-text flex items-center justify-center"
        onclick={() => (leftVisible = true)}
        title="Linke Leiste einblenden"
      ><ChevronRight size={9} /></button>
    {/if}

    <!-- Viewport -->
    <div class="flex-1 relative overflow-hidden">
      <Viewport />
      <GridInfo />
      <ViewControls />
      <GizmoAxes />
      <MeasureTool />
      <StatusBar />
    </div>

    {#if !rightVisible}
      <button
        class="shrink-0 w-4 bg-brand-panel2 border-l border-brand-border text-[8px] text-brand-textdim hover:text-brand-text flex items-center justify-center"
        onclick={() => (rightVisible = true)}
        title="Rechte Leiste einblenden"
      ><ChevronLeft size={9} /></button>
    {/if}

    <!-- Right resize handle + collapse toggle -->
    <div class="flex flex-col shrink-0 w-3 group relative z-10">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="flex-1 cursor-col-resize hover:bg-brand-accent/40 transition-colors bg-brand-border/0 group-hover:bg-brand-border/30"
        onmousedown={(e) => startResize('right', e)}
      ></div>
      <button
        class="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-7 bg-brand-panel2 border border-brand-border rounded-l text-[8px] text-brand-textdim hover:text-brand-text flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onclick={() => (rightVisible = !rightVisible)}
        title={rightVisible ? 'Rechte Leiste ausblenden' : 'Rechte Leiste einblenden'}
      >{#if rightVisible}<ChevronRight size={9} />{:else}<ChevronLeft size={9} />{/if}</button>
    </div>

    {#if rightVisible}
      <div class="shrink-0 overflow-hidden" style="width:{rightWidth}px">
        <SidebarRight />
      </div>
    {/if}

  </div>
</div>

<MarqueeBox
  start={sceneInteraction.marqueeStart}
  end={sceneInteraction.marqueeEnd}
  mode={sceneInteraction.marqueeMode}
/>
<ContextMenu />
<Toast />
<AddLayerModal />
<PatternModal />
