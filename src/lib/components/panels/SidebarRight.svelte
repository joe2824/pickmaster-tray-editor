<script lang="ts">
  import { ChevronUp, ChevronDown } from 'lucide-svelte';
  import PropertiesPanel from './PropertiesPanel.svelte';
  import AlignPanel from './AlignPanel.svelte';
  import SceneList from './SceneList.svelte';
  import { t } from '$i18n';

  let propsOpen = $state(true);
  let alignOpen = $state(true);
  let listOpen = $state(true);
</script>

<aside class="w-full h-full bg-brand-panel border-l border-brand-border flex flex-col overflow-hidden">
  <button class="panel-title shrink-0" onclick={() => (propsOpen = !propsOpen)}>
    <span>{t('panel.properties')}</span>
    {#if propsOpen}<ChevronUp size={11} />{:else}<ChevronDown size={11} />{/if}
  </button>
  {#if propsOpen}<div class="shrink-0"><PropertiesPanel /></div>{/if}

  <button class="panel-title shrink-0" onclick={() => (alignOpen = !alignOpen)}>
    <span>{t('panel.align')}</span>
    {#if alignOpen}<ChevronUp size={11} />{:else}<ChevronDown size={11} />{/if}
  </button>
  {#if alignOpen}<div class="shrink-0"><AlignPanel /></div>{/if}

  <button class="panel-title shrink-0" onclick={() => (listOpen = !listOpen)}>
    <span>{t('panel.scene')}</span>
    {#if listOpen}<ChevronUp size={11} />{:else}<ChevronDown size={11} />{/if}
  </button>
  {#if listOpen}<SceneList />{/if}
</aside>
