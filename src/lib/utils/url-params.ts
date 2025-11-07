/**
 * Utility functions for managing URL query parameters in SvelteKit
 */

/**
 * Get a query parameter value from the current URL
 */
export function getQueryParam(url: URL, key: string): string | null {
	return url.searchParams.get(key);
}

/**
 * Set a query parameter in the URL
 */
export function setQueryParam(url: URL, key: string, value: string | null): void {
	if (value) {
		url.searchParams.set(key, value);
	} else {
		url.searchParams.delete(key);
	}
}

/**
 * Update URL with query parameter using SvelteKit's goto
 */
export async function updateQueryParam(
	url: URL,
	key: string,
	value: string | null,
	gotoFn: (url: string, options?: { replaceState?: boolean; noScroll?: boolean }) => Promise<void>
): Promise<void> {
	const newUrl = new URL(url);
	setQueryParam(newUrl, key, value);
	await gotoFn(newUrl.toString(), { replaceState: true, noScroll: true });
}
