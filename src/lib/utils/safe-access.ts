/**
 * Type-safe utilities for safely accessing nested object properties
 */

/**
 * Safely get a nested property value from an object
 * Returns the value if it exists, or a fallback value otherwise
 * 
 * @example
 * safeGet(entry, 'user', 'fullName', '—')
 * safeGet(entry, ['user', 'username'], 'Unknown')
 */
export function safeGet<T extends Record<string, any>>(
	obj: T,
	path: string | string[],
	fallback: string | null = '—'
): string | null {
	if (!obj) return fallback;

	const keys = Array.isArray(path) ? path : path.split('.');
	let current: any = obj;

	for (const key of keys) {
		if (current === null || current === undefined) {
			return fallback;
		}
		current = current[key];
	}

	return current ?? fallback;
}

/**
 * Safely get a nested property value with type inference
 * Returns the value if it exists, or undefined
 */
export function safeGetTyped<T, K extends keyof T>(
	obj: T | null | undefined,
	key: K
): T[K] | undefined {
	return obj?.[key];
}

/**
 * Safely access nested object property chain
 * Returns the value if entire chain exists, or fallback otherwise
 * 
 * @example
 * safeChain(entry, 'user', 'email', '—')
 * safeChain(entry?.user, 'fullName', entry?.user?.username, '—')
 */
export function safeChain<T>(
	value: T | null | undefined,
	fallback: string | null = '—'
): string | null {
	if (value === null || value === undefined) {
		return fallback;
	}
	if (typeof value === 'string') {
		return value || fallback;
	}
	return fallback;
}

