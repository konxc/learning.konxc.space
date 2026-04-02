/**
 * Dashboard list state management composable
 * Consolidates URL filter sync, column visibility, and search state
 * into a single, reusable composable for data table pages
 */

import { get } from 'svelte/store';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { writable, derived, get as getStore } from 'svelte/store';
import { updateQueryParam } from './url-params';
import { filterEntities, countByField } from './filter';
import type { TableColumn } from '$lib/types/table';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface FilterOption {
	value: string;
	label: string;
	count?: number;
}

export interface UseDashboardListStateOptions {
	columns: TableColumn[];
	storageKey: string;
	defaultVisible?: string[];
	filterParam: string;
	defaultFilter?: string;
	filterStatusField?: string;
	searchFields?: string[];
	enableUrlSync?: boolean;
}

export interface DashboardListState {
	filter: string;
	searchQuery: string;
	columnVisibility: Record<string, boolean>;
	isColumnVisible: (key: string) => boolean;
	setFilter: (value: string) => Promise<void>;
	setSearchQuery: (query: string) => void;
	handleVisibilityChange: (visibleColumns: Set<string>) => void;
	filterEntities: <T extends Record<string, unknown>>(
		entities: T[],
		overrideFilter?: string
	) => T[];
	countByStatus: <T extends Record<string, unknown>>(entities: T[]) => Record<string, number>;
}

// ─── Main Composable ───────────────────────────────────────────────────────────

export function useDashboardListState(options: UseDashboardListStateOptions): DashboardListState {
	const {
		columns,
		storageKey,
		defaultVisible,
		filterParam,
		defaultFilter = 'all',
		filterStatusField = 'status',
		searchFields = [],
		enableUrlSync = true
	} = options;

	// ── Filter State ───────────────────────────────────────────────────────────
	const _filter = writable(defaultFilter);

	// Initialize from URL on mount
	if (browser && enableUrlSync) {
		const urlParam = get(page).url.searchParams.get(filterParam);
		if (urlParam) {
			_filter.set(urlParam);
		}
	}

	// Sync with URL changes (browser back/forward)
	if (browser && enableUrlSync) {
		const unsubscribe = page.subscribe(() => {
			const param = get(page).url.searchParams.get(filterParam);
			const currentFilter = getStore(_filter);
			if (param && param !== currentFilter) {
				_filter.set(param);
			} else if (!param && currentFilter !== defaultFilter) {
				_filter.set(defaultFilter);
			}
		});
	}

	async function setFilter(value: string) {
		_filter.set(value);

		if (enableUrlSync) {
			const finalValue = value === defaultFilter ? null : value;
			await updateQueryParam(get(page).url, filterParam, finalValue, goto);
		}

		if (storageKey && browser) {
			localStorage.setItem(`${storageKey}:filter`, value);
		}
	}

	// ── Search State ───────────────────────────────────────────────────────────
	const _searchQuery = writable('');

	function setSearchQuery(query: string) {
		_searchQuery.set(query);
	}

	// ── Column Visibility ──────────────────────────────────────────────────────
	const defaultState: Record<string, boolean> = {};
	columns.forEach((col) => {
		defaultState[col.key] = defaultVisible?.includes(col.key) ?? true;
	});

	const _visibility = writable<Record<string, boolean>>(defaultState);

	// Load from localStorage on mount
	if (browser) {
		const stored = localStorage.getItem(`${storageKey}:columns`);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				_visibility.update((v) => ({ ...v, ...parsed }));
			} catch {
				// Invalid JSON, use defaults
			}
		}
	}

	function handleVisibilityChange(visibleColumns: Set<string>) {
		const updated: Record<string, boolean> = {};
		columns.forEach((col) => {
			updated[col.key] = visibleColumns.has(col.key);
		});
		_visibility.set(updated);

		if (storageKey && browser) {
			localStorage.setItem(`${storageKey}:columns`, JSON.stringify(updated));
		}
	}

	function isColumnVisible(key: string): boolean {
		return getStore(_visibility)[key] ?? true;
	}

	// ── Computed Data Helpers ───────────────────────────────────────────────────

	function filterEntitiesLocal<T extends Record<string, unknown>>(
		entities: T[],
		overrideFilter?: string
	): T[] {
		return filterEntities(entities, getStore(_searchQuery), overrideFilter ?? getStore(_filter), {
			searchFields,
			statusField: filterStatusField
		});
	}

	function countByStatusLocal<T extends Record<string, unknown>>(
		entities: T[]
	): Record<string, number> {
		return countByField(entities, filterStatusField as keyof T);
	}

	// ── Return ──────────────────────────────────────────────────────────────────
	return {
		get filter() {
			return getStore(_filter);
		},
		set filter(value: string) {
			setFilter(value);
		},

		get searchQuery() {
			return getStore(_searchQuery);
		},
		set searchQuery(value: string) {
			setSearchQuery(value);
		},

		get columnVisibility() {
			return getStore(_visibility);
		},
		isColumnVisible,

		setFilter,
		setSearchQuery,
		handleVisibilityChange,

		filterEntities: filterEntitiesLocal,
		countByStatus: countByStatusLocal
	};
}
