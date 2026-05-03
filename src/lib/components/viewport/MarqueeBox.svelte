<script lang="ts">
  let {
    start,
    end,
    mode = 'normal',
  }: {
    start: { x: number; y: number } | null;
    end: { x: number; y: number } | null;
    mode?: 'normal' | 'additive' | 'subtractive';
  } = $props();

  // Coordinates are clientX/clientY (viewport-relative via getBoundingClientRect in Scene)
  // We need them relative to the viewport container. Use fixed positioning so no parent clips them.
  const visible = $derived(start !== null && end !== null);
  const left = $derived(start && end ? Math.min(start.x, end.x) : 0);
  const top = $derived(start && end ? Math.min(start.y, end.y) : 0);
  const w = $derived(start && end ? Math.abs(end.x - start.x) : 0);
  const h = $derived(start && end ? Math.abs(end.y - start.y) : 0);

  const border = $derived(
    mode === 'subtractive' ? 'border-brand-red' : 'border-brand-accent'
  );
  const bg = $derived(mode === 'subtractive' ? 'bg-brand-red/10' : 'bg-brand-accent/10');
</script>

{#if visible && (w > 2 || h > 2)}
  <div
    class="fixed pointer-events-none border {border} {bg}"
    style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;z-index:100;"
  ></div>
{/if}
