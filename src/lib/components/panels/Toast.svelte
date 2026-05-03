<script lang="ts">
  import { toast } from '$state/toast.svelte';
</script>

{#if toast.visible}
  <div
    class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-brand-panel2 border border-brand-border text-brand-text text-[11px] px-4 py-2 rounded-lg shadow-lg pointer-events-none"
  >
    {toast.message}
  </div>
{/if}
