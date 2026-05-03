<script lang="ts">
  import { sceneInteraction } from '$state/scene.svelte';
  import { viewport } from '$state/viewport.svelte';
  import { t } from '$i18n';

  const pA = $derived(sceneInteraction.measureAScreen);
  const pB = $derived(sceneInteraction.measureBScreen);
  const dist = $derived(sceneInteraction.distance);
</script>

{#if viewport.mode === 'measure'}
  {#if !sceneInteraction.measureA}
    <div class="absolute top-14 left-1/2 -translate-x-1/2 bg-brand-panel2/90 border border-brand-accent text-brand-accent text-[10px] px-3 py-1 rounded pointer-events-none select-none">{t('measure.setA')}</div>
  {:else if !sceneInteraction.measureB}
    <div class="absolute top-14 left-1/2 -translate-x-1/2 bg-brand-panel2/90 border border-brand-accent text-brand-accent text-[10px] px-3 py-1 rounded pointer-events-none select-none">{t('measure.setB')}</div>
  {/if}
  {#if pA}
    <div class="fixed w-3 h-3 rounded-full border-2 border-brand-accent bg-brand-accent/30 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50" style="left:{pA.x}px;top:{pA.y}px"></div>
    <div class="fixed text-[9px] text-brand-accent pointer-events-none z-50 font-mono select-none" style="left:{pA.x+7}px;top:{pA.y-14}px">A</div>
  {/if}
  {#if pB}
    <div class="fixed w-3 h-3 rounded-full border-2 border-brand-accent2 bg-brand-accent2/30 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50" style="left:{pB.x}px;top:{pB.y}px"></div>
    <div class="fixed text-[9px] text-brand-accent2 pointer-events-none z-50 font-mono select-none" style="left:{pB.x+7}px;top:{pB.y-14}px">B</div>
  {/if}
  {#if pA && pB && dist !== null}
    {@const mx = (pA.x + pB.x) / 2}
    {@const my = (pA.y + pB.y) / 2}
    <svg class="fixed inset-0 pointer-events-none z-40" style="width:100vw;height:100vh;position:fixed;top:0;left:0">
      <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#4f7cff" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.8" />
    </svg>
    <div class="fixed -translate-x-1/2 bg-brand-panel2 border border-brand-border text-brand-text text-[11px] px-2 py-0.5 rounded font-mono pointer-events-none z-50" style="left:{mx}px;top:{my-18}px">{t('measure.label', { d: dist.toFixed(1) })}</div>
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 bg-brand-panel2/90 border border-brand-border text-brand-text text-[11px] px-3 py-1 rounded font-mono z-40 flex items-center gap-2">
      <span>{t('measure.distance', { d: dist.toFixed(2) })}</span>
      <button class="text-brand-textdim hover:text-brand-text" onclick={() => sceneInteraction.clearMeasure()}>{t('measure.reset')}</button>
    </div>
  {/if}
{/if}
