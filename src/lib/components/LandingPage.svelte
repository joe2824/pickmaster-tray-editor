<script lang="ts">
  import { t } from '$i18n';
  import { localeState } from '$state/locale.svelte';
  import type { SavedProject } from '$io/indexeddb';

  let {
    draft,
    onLoad,
    onRestore,
  }: {
    draft: SavedProject | null;
    onLoad: () => void;
    onRestore: () => void;
  } = $props();

  const draftDate = $derived(() => {
    if (!draft?.savedAt) return '';
    return new Date(draft.savedAt).toLocaleString(
      localeState.locale === 'de' ? 'de-DE' : 'en-GB',
      { dateStyle: 'medium', timeStyle: 'short' }
    );
  });
</script>

<div class="fixed inset-0 z-50 bg-brand-bg flex flex-col items-center justify-center p-6 overflow-auto">

  <!-- Logo + name -->
  <div class="mb-10 text-center select-none">
    <img src="/icons/icon.svg" alt="Logo" class="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-lg" />
    <h1 class="font-display text-2xl font-bold text-brand-accent">PickMaster Twin®</h1>
    <p class="font-display text-sm text-brand-textdim mt-0.5">Fast Pattern Editor</p>
  </div>

  <!-- Main card -->
  <div class="w-full max-w-md bg-brand-panel border border-brand-border rounded-2xl p-8 shadow-2xl">
    <h2 class="font-display text-lg font-semibold text-brand-text mb-2">{t('landing.title')}</h2>
    <p class="text-[12px] text-brand-textdim leading-relaxed mb-1">{t('landing.subtitle')}</p>
    <p class="text-[11px] text-brand-textdim/60 leading-relaxed mb-6">{t('landing.hint')}</p>

    <button
      class="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl
             bg-brand-accent text-white font-mono text-[13px] font-semibold
             hover:bg-brand-accent/80 active:scale-[0.98] transition-all"
      onclick={onLoad}
    >
      <span class="text-lg">📂</span>
      {t('landing.loadContainer')}
    </button>
  </div>

  <!-- Draft restore card (only if draft exists and has a tray) -->
  {#if draft?.tray}
    <div class="w-full max-w-md mt-4 bg-brand-panel2 border border-brand-border rounded-2xl px-6 py-4
                flex items-center gap-4 shadow-lg">
      <div class="flex-1 min-w-0">
        <p class="text-[11px] text-brand-textdim">{t('landing.draftFound')}</p>
        <p class="text-[12px] text-brand-text font-medium truncate mt-0.5">
          {draft.tray.name}
        </p>
        {#if draft.savedAt}
          <p class="text-[10px] text-brand-textdim/50 mt-0.5">
            {t('landing.draftDate', { date: draftDate() })}
          </p>
        {/if}
      </div>
      <button
        class="shrink-0 btn active text-[12px] px-4 py-2"
        onclick={onRestore}
      >{t('landing.restore')}</button>
    </div>
  {/if}

  <!-- Privacy + Disclaimer -->
  <div class="w-full max-w-md mt-6 space-y-2">
    <p class="text-[10px] text-white/40 leading-relaxed text-center">
      🔒 {t('landing.privacy')}
    </p>
    <p class="text-[9px] text-white/25 leading-relaxed text-center">
      {t('landing.disclaimer')}
    </p>
  </div>

  <!-- Language toggle -->
  <button
    class="mt-4 text-[10px] text-white/30 hover:text-white/60 transition-colors"
    onclick={() => localeState.toggle()}
  >
    {localeState.locale === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
  </button>

</div>
