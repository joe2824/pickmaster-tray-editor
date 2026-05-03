export type Locale = 'de' | 'en';

class LocaleState {
  locale = $state<Locale>('de');

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('locale');
      if (saved === 'de' || saved === 'en') this.locale = saved;
    }
  }

  toggle() {
    this.locale = this.locale === 'de' ? 'en' : 'de';
    localStorage.setItem('locale', this.locale);
  }
}

export const localeState = new LocaleState();
