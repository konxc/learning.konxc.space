/**
 * URL Filter synchronization composable
 * Handles syncing filter state with URL query parameters
 */

import { get } from 'svelte/store';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { updateQueryParam } from './url-params';

export interface UseUrlFilterOptions {
	paramName: string;
	defaultValue?: string;
	storageKey?: string;
}

export interface UseUrlFilterReturn {
	value: string;
	setValue: (value: string) => Promise<void>;
	reset: () => Promise<void>;
}

/**
 * Get current filter value from URL
 */
export function getUrlFilter(paramName: string, defaultValue = 'all'): string {
	const paramValue = get(page).url.searchParams.get(paramName);
	return paramValue ?? defaultValue;
}

/**
 * Set filter value and update URL
 */
export async function setUrlFilter(
	paramName: string,
	value: string,
	defaultValue = 'all',
	storageKey?: string
): Promise<void> {
	const finalValue = value === defaultValue ? null : value;
	await updateQueryParam(get(page).url, paramName, finalValue, goto);

	if (storageKey) {
		localStorage.setItem(storageKey, value);
	}
}

/**
 * Create URL filter composable for component use
 */
export function useUrlFilter(options: UseUrlFilterOptions): UseUrlFilterReturn {
	const { paramName, defaultValue = 'all', storageKey } = options;

	let currentValue = $state(defaultValue);

	$effect(() => {
		const paramValue = get(page).url.searchParams.get(paramName);
		currentValue = paramValue ?? defaultValue;
	});

	async function setValue(value: string) {
		await setUrlFilter(paramName, value, defaultValue, storageKey);
	}

	async function reset() {
		await setValue(defaultValue);
	}

	return {
		get value() {
			return currentValue;
		},
		setValue,
		reset
	};
}

/**
 * Search state composable
 */
export interface UseUrlSearchOptions {
	paramName?: string;
	storageKey?: string;
}

export interface UseUrlSearchReturn {
	value: string;
	setValue: (value: string) => Promise<void>;
	clear: () => Promise<void>;
}

/**
 * Get current search value from URL
 */
export function getUrlSearch(paramName = 'search'): string {
	return get(page).url.searchParams.get(paramName) ?? '';
}

/**
 * Set search value and update URL
 */
export async function setUrlSearch(
	paramName: string,
	value: string,
	storageKey?: string
): Promise<void> {
	const finalValue = value.trim() === '' ? null : value.trim();
	await updateQueryParam(get(page).url, paramName, finalValue, goto);

	if (storageKey) {
		localStorage.setItem(storageKey, value);
	}
}

/**
 * Create URL search composable for component use
 */
export function useUrlSearch(options: UseUrlSearchOptions = {}): UseUrlSearchReturn {
	const { paramName = 'search', storageKey } = options;

	let currentValue = $state('');

	$effect(() => {
		const paramValue = get(page).url.searchParams.get(paramName);
		currentValue = paramValue ?? '';
	});

	async function setValue(value: string) {
		await setUrlSearch(paramName, value, storageKey);
	}

	async function clear() {
		await setValue('');
	}

	return {
		get value() {
			return currentValue;
		},
		setValue,
		clear
	};
}
