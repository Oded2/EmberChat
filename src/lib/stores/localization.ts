import { writable, derived } from 'svelte/store';
import english from '../translations/en.json';
import hebrew from '../translations/he.json';

export const localeMap: Record<
	string,
	{
		label: string;
		map: Record<string, string>;
	}
> = {
	en: {
		label: 'English',
		map: english
	},
	he: {
		label: 'עברית',
		map: hebrew
	}
};

export const locale = writable('en');

// Derived store that updates translations automatically
export const t = derived(locale, (newLocale) => {
	return (key: string) => localeMap[newLocale].map[key] ?? localeMap.en.map[key] ?? key;
});

export function updateLocale(newLocale: string) {
	locale.set(newLocale);
	localStorage.setItem('locale', newLocale);
}
