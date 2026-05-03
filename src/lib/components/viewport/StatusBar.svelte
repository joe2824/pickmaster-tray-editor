<script lang="ts">
  import { Shield, ShieldOff, AlertTriangle } from 'lucide-svelte';
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { collisions } from '$state/collisions.svelte';
  import { t } from '$i18n';

  const collisionCount = $derived(collisions.collidingIds.size);
  const dupOrderCount = $derived(collisions.duplicateOrderIds.size);
</script>

<div class="absolute bottom-0 left-0 right-0 h-6 bg-brand-panel2/80 border-t border-brand-border flex items-center px-4 gap-5 text-[10px] text-brand-textdim">
  <span class="capitalize">{viewport.view}</span>
  <span>{editor.arranged.length} {t('header.items')}</span>
  {#if selection.size > 0}
    <span class="text-brand-selected">{selection.size} {t('header.sel')}</span>
  {/if}
  {#if viewport.snap}
    <span class="text-brand-accent">snap {viewport.snapSize}mm</span>
  {/if}
  <div class="flex-1"></div>

  <button
    class="flex items-center gap-1 hover:text-brand-text transition-colors"
    onclick={() => (viewport.collisionsEnabled = !viewport.collisionsEnabled)}
    title={viewport.collisionsEnabled ? t('status.toggleOn') : t('status.toggleOff')}
  >
    <span class={viewport.collisionsEnabled ? 'text-brand-text' : 'opacity-30'}>
      {#if viewport.collisionsEnabled}<Shield size={12} />{:else}<ShieldOff size={12} />{/if}
    </span>
    <span class={viewport.collisionsEnabled ? '' : 'opacity-30'}>{t('status.collision')}</span>
  </button>

  {#if viewport.collisionsEnabled}
    {#if dupOrderCount > 0}
      <span class="flex items-center gap-1 text-[9px] text-orange-400" title={t('status.dupOrderTitle', { n: dupOrderCount })}>
        <AlertTriangle size={11} />{dupOrderCount} {t('status.dupOrder')}
      </span>
    {/if}
    {#if collisionCount > 0}
      <span class="flex items-center gap-1 text-[9px] text-brand-red" title={t('status.collisionTitle', { n: collisionCount })}>
        <AlertTriangle size={11} />{collisionCount} {t('status.overlap')}
      </span>
    {/if}
  {/if}
</div>
