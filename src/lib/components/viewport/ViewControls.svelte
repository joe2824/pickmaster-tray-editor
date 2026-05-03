<script lang="ts">
  import { viewport } from '$state/viewport.svelte';
  import { editor } from '$state/editor.svelte';
  import { t } from '$i18n';

  function fitToTray() {
    const tray = editor.tray;
    const size = tray ? Math.max(tray.size.x, tray.size.y) : 1000;
    const cx = tray ? tray.size.x / 2 : 0;
    const cy = tray ? tray.size.y / 2 : 0;
    viewport.applyViewPreset(viewport.view, size, cx, cy);
  }

  function setView(v: typeof viewport.view) {
    viewport.view = v;
    const tray = editor.tray;
    const size = tray ? Math.max(tray.size.x, tray.size.y) : 1000;
    const cx = tray ? tray.size.x / 2 : 0;
    const cy = tray ? tray.size.y / 2 : 0;
    viewport.applyViewPreset(v, size, cx, cy);
  }

  const views = [
    ['3d', 'view.btn.3d'],
    ['top', 'view.btn.top'],
    ['front', 'view.btn.front'],
    ['side', 'view.btn.side'],
  ] as const;
</script>

<div class="absolute top-3 right-3 flex flex-col gap-1">
  {#each views as [v, key]}
    <button
      class="btn text-[10px] w-14 justify-center {viewport.view === v ? 'active' : ''}"
      onclick={() => setView(v)}
    >{t(key)}</button>
  {/each}
  <div class="h-px bg-brand-border my-0.5"></div>
  <button class="btn text-[10px] w-14 justify-center" onclick={fitToTray}>
    {t('view.fit')}
  </button>
</div>
