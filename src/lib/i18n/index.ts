import { localeState } from '$state/locale.svelte';
import { de } from './de';
import { en } from './en';

const translations = { de, en };

export function t(key: string, params?: Record<string, string | number>): string {
  const locale = localeState.locale; // reactive read — re-runs when locale changes
  let result = translations[locale][key] ?? translations.de[key] ?? key;
  if (params) {
    result = result.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? k));
  }
  return result;
}
