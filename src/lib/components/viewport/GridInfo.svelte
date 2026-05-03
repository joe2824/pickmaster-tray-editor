<script lang="ts">
  import { viewport } from '$state/viewport.svelte';
  import { editor } from '$state/editor.svelte';
  import { t } from '$i18n';

  const labelKey: Record<string, string> = {
    '3d': 'view.3d', top: 'view.top', front: 'view.front', side: 'view.side',
  };
</script>

<div class="absolute top-3 left-3 text-[10px] text-brand-textdim select-none pointer-events-none">
  <div>{t(labelKey[viewport.view])}</div>
  {#if editor.tray}
    <div class="mt-0.5 text-brand-textdim/60">{editor.tray.size.x} × {editor.tray.size.y} mm</div>
  {/if}
</div>
