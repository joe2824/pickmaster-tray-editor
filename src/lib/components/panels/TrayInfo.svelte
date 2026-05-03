<script lang="ts">
  import { editor } from '$state/editor.svelte';
  import { t } from '$i18n';
</script>

<div class="px-3 py-2 space-y-1 text-[10px]">
  {#if editor.tray}
    <div class="flex justify-between">
      <span class="text-brand-textdim">{t('tray.name')}</span>
      <span class="text-brand-text truncate ml-2">{editor.tray.name}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-brand-textdim">{t('tray.size')}</span>
      <span class="text-brand-text font-mono">{editor.tray.size.x} × {editor.tray.size.y} × {editor.tray.size.z} mm</span>
    </div>
    <div class="flex justify-between">
      <span class="text-brand-textdim">{t('tray.items')}</span>
      <span class="text-brand-text">{editor.arranged.length}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-brand-textdim">{t('tray.types')}</span>
      <span class="text-brand-text">{Object.keys(editor.items).length}</span>
    </div>
  {:else}
    <p class="text-brand-textdim italic">{t('tray.noTray')}</p>
  {/if}
</div>
