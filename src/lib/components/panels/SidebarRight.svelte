<script lang="ts">
  import PropertiesPanel from './PropertiesPanel.svelte';
  import AlignPanel from './AlignPanel.svelte';
  import SceneList from './SceneList.svelte';
  import { t } from '$i18n';

  let propsOpen = $state(true);
  let alignOpen = $state(true);
  let listOpen = $state(true);
</script>

<!-- overflow-y-auto removed from aside — SceneList handles its own scroll -->
<aside class="w-full h-full bg-brand-panel border-l border-brand-border flex flex-col overflow-hidden">
  <button class="panel-title shrink-0" onclick={() => (propsOpen = !propsOpen)}>
    <span>{t('panel.properties')}</span><span>{propsOpen ? '▲' : '▼'}</span>
  </button>
  {#if propsOpen}<div class="shrink-0"><PropertiesPanel /></div>{/if}

  <button class="panel-title shrink-0" onclick={() => (alignOpen = !alignOpen)}>
    <span>{t('panel.align')}</span><span>{alignOpen ? '▲' : '▼'}</span>
  </button>
  {#if alignOpen}<div class="shrink-0"><AlignPanel /></div>{/if}

  <button class="panel-title shrink-0" onclick={() => (listOpen = !listOpen)}>
    <span>{t('panel.scene')}</span><span>{listOpen ? '▲' : '▼'}</span>
  </button>
  <!-- SceneList takes remaining space and scrolls independently -->
  {#if listOpen}<SceneList />{/if}
</aside>
