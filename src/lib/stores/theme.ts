// Cookie-based theme switching for Tailwind CSS 4 (no FOUC)
export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'nk-theme';
const COOKIE_KEY = 'nk-theme';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function getStoredTheme(): Theme {
	if (typeof localStorage === 'undefined') return 'system';
	const v = localStorage.getItem(STORAGE_KEY);
	if (v === 'light' || v === 'dark' || v === 'system') return v;
	return 'system';
}

export function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
	const isDark = theme === 'dark' || (theme === 'system' && systemDark);

	// Remove first, then add to ensure clean state
	root.classList.remove('dark');
	if (isDark) {
		root.classList.add('dark');
	}
}

export function setTheme(theme: Theme) {
	if (typeof window === 'undefined') return;

	// Store in localStorage
	localStorage.setItem(STORAGE_KEY, theme);

	// Set cookie for SSR
	document.cookie = `${COOKIE_KEY}=${theme}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;

	// Apply theme immediately
	applyTheme(theme);
}

export function initTheme() {
	const t = getStoredTheme();
	applyTheme(t);

	// React to system theme changes when using system mode
	if (typeof window !== 'undefined') {
		const m = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = () => {
			if (getStoredTheme() === 'system') applyTheme('system');
		};
		m.addEventListener?.('change', handler);
	}
}
