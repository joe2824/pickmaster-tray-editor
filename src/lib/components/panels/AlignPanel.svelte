<script lang="ts">
  import { editor } from '$state/editor.svelte';
  import { selection } from '$state/selection.svelte';
  import { history } from '$state/history.svelte';
  import { t } from '$i18n';

  type AlignDir = 'left' | 'centerX' | 'right' | 'top' | 'centerY' | 'bottom';

  function align(dir: AlignDir) {
    const items = selection.selectedItems;
    if (items.length < 2) return;
    let ref: number;
    if (dir === 'left') ref = Math.min(...items.map((a) => a.x));
    else if (dir === 'right') ref = Math.max(...items.map((a) => a.x));
    else if (dir === 'centerX') ref = (Math.min(...items.map((a) => a.x)) + Math.max(...items.map((a) => a.x))) / 2;
    else if (dir === 'top') ref = Math.max(...items.map((a) => a.y));
    else if (dir === 'bottom') ref = Math.min(...items.map((a) => a.y));
    else ref = (Math.min(...items.map((a) => a.y)) + Math.max(...items.map((a) => a.y))) / 2;
    for (const item of items) {
      const arr = editor.arrangedById(item.id);
      if (!arr) continue;
      if (dir === 'left' || dir === 'right' || dir === 'centerX') arr.x = ref;
      else arr.y = ref;
    }
    editor.arranged = [...editor.arranged]; history.push();
  }

  function distribute(axis: 'x' | 'y') {
    const items = [...selection.selectedItems].sort((a, b) => axis === 'x' ? a.x - b.x : a.y - b.y);
    if (items.length < 3) return;
    const first = axis === 'x' ? items[0].x : items[0].y;
    const last = axis === 'x' ? items[items.length-1].x : items[items.length-1].y;
    const step = (last - first) / (items.length - 1);
    for (let i = 1; i < items.length - 1; i++) {
      const arr = editor.arrangedById(items[i].id);
      if (!arr) continue;
      if (axis === 'x') arr.x = first + step * i; else arr.y = first + step * i;
    }
    editor.arranged = [...editor.arranged]; history.push();
  }

  function rotateAll(deg: number) {
    for (const item of selection.selectedItems) {
      const arr = editor.arrangedById(item.id);
      if (!arr) continue;
      arr.rz = ((arr.rz || 0) + deg + 360) % 360;
    }
    editor.arranged = [...editor.arranged]; history.push();
  }

  const disabled = $derived(selection.size < 2);
  const distDisabled = $derived(selection.size < 3);
</script>

<div class="px-3 py-2 space-y-2 text-[10px]">
  <div class="text-brand-textdim text-[9px] uppercase tracking-widest">{t('align.title')}</div>
  <div class="grid grid-cols-3 gap-1">
    <button class="btn justify-center {disabled ? 'disabled' : ''}" onclick={() => align('left')} title={t('align.title')}>⬤←</button>
    <button class="btn justify-center {disabled ? 'disabled' : ''}" onclick={() => align('centerX')}>⬤→←</button>
    <button class="btn justify-center {disabled ? 'disabled' : ''}" onclick={() => align('right')}>→⬤</button>
    <button class="btn justify-center {disabled ? 'disabled' : ''}" onclick={() => align('top')}>↑⬤</button>
    <button class="btn justify-center {disabled ? 'disabled' : ''}" onclick={() => align('centerY')}>⬤↕</button>
    <button class="btn justify-center {disabled ? 'disabled' : ''}" onclick={() => align('bottom')}>⬤↓</button>
  </div>
  <div class="text-brand-textdim text-[9px] uppercase tracking-widest pt-1">{t('align.distribute')}</div>
  <div class="flex gap-1">
    <button class="btn flex-1 justify-center {distDisabled ? 'disabled' : ''}" onclick={() => distribute('x')}>{t('align.distribute')} X</button>
    <button class="btn flex-1 justify-center {distDisabled ? 'disabled' : ''}" onclick={() => distribute('y')}>{t('align.distribute')} Y</button>
  </div>
  <div class="text-brand-textdim text-[9px] uppercase tracking-widest pt-1">{t('align.rotation')}</div>
  <div class="flex gap-1">
    <button class="btn flex-1 justify-center {selection.size === 0 ? 'disabled' : ''}" onclick={() => rotateAll(-90)}>↺ -90°</button>
    <button class="btn flex-1 justify-center {selection.size === 0 ? 'disabled' : ''}" onclick={() => rotateAll(90)}>↻ +90°</button>
  </div>
</div>
