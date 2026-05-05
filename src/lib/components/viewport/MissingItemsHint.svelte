<script lang="ts">
  import { MoveLeft } from 'lucide-svelte';
  import { editor } from '$state/editor.svelte';
  import { t } from '$i18n';

  const missingCount = $derived(
    editor.arranged.filter((a) => !editor.itemDef(a.itemId)).length
  );
</script>

{#if missingCount > 0}
  <div
    class="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2
           bg-brand-panel2/95 border border-brand-border rounded-lg px-3 py-1.5
           text-[10px] text-brand-textdim pointer-events-none select-none z-10"
  >
    <MoveLeft size={12} class="text-brand-accent shrink-0" />
    {t('stl.missingHint', { n: missingCount })}
  </div>
{/if}
