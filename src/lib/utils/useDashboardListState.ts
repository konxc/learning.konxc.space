/**
 * Dashboard list state management composable
 * Consolidates URL filter sync, column visibility, and search state
 * into a single, reusable composable for data table pages
 */

import { get } from 'svelte/store';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
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
	// Column visibility
	columns: TableColumn[];
	storageKey: string;
	defaultVisible?: string[];

	// Filter
	filterParam: string;
	defaultFilter?: string;
	filterStatusField?: string;

	// Search
	searchFields?: string[];

	// URL sync
	enableUrlSync?: boolean;
}

export interface DashboardListState {
	// Filter state (reactive, use with $state)
	filter: string;

	// Search state (reactive, use with $state)
	searchQuery: string;

	// Column visibility
	columnVisibility: Record<string, boolean>;
	isColumnVisible: (key: string) => boolean;

	// Actions
	setFilter: (value: string) => Promise<void>;
	setSearchQuery: (query: string) => void;
	handleVisibilityChange: (visibleColumns: Set<string>) => void;

	// Computed data helpers
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
	let _filter = $state(defaultFilter);

	// Initialize from URL on mount
	if (browser && enableUrlSync) {
		const urlParam = get(page).url.searchParams.get(filterParam);
		if (urlParam) {
			_filter = urlParam;
		}
	}

	// Sync with URL changes (browser back/forward)
	$effect(() => {
		if (!enableUrlSync) return;

		const param = get(page).url.searchParams.get(filterParam);
		if (param && param !== _filter) {
			_filter = param;
		} else if (!param && _filter !== defaultFilter) {
			_filter = defaultFilter;
		}
	});

	async function setFilter(value: string) {
		_filter = value;

		if (enableUrlSync) {
			const finalValue = value === defaultFilter ? null : value;
			await updateQueryParam(get(page).url, filterParam, finalValue, goto);
		}

		if (storageKey && browser) {
			localStorage.setItem(`${storageKey}:filter`, value);
		}
	}

	// ── Search State ───────────────────────────────────────────────────────────
	let _searchQuery = $state('');

	function setSearchQuery(query: string) {
		_searchQuery = query;
	}

	// ── Column Visibility ──────────────────────────────────────────────────────
	const defaultState: Record<string, boolean> = {};
	columns.forEach((col) => {
		defaultState[col.key] = defaultVisible?.includes(col.key) ?? true;
	});

	let _visibility = $state<Record<string, boolean>>(defaultState);

	// Load from localStorage on mount
	$effect(() => {
		if (!browser) return;

		const stored = localStorage.getItem(`${storageKey}:columns`);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				_visibility = { ..._visibility, ...parsed };
			} catch {
				// Invalid JSON, use defaults
			}
		}
	});

	function handleVisibilityChange(visibleColumns: Set<string>) {
		const updated: Record<string, boolean> = {};
		columns.forEach((col) => {
			updated[col.key] = visibleColumns.has(col.key);
		});
		_visibility = updated;

		if (storageKey && browser) {
			localStorage.setItem(`${storageKey}:columns`, JSON.stringify(updated));
		}
	}

	function isColumnVisible(key: string): boolean {
		return _visibility[key] ?? true;
	}

	// ── Computed Data Helpers ───────────────────────────────────────────────────

	function filterEntitiesLocal<T extends Record<string, unknown>>(
		entities: T[],
		overrideFilter?: string
	): T[] {
		return filterEntities(entities, _searchQuery, overrideFilter ?? _filter, {
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
			return _filter;
		},
		set filter(value: string) {
			setFilter(value);
		},

		get searchQuery() {
			return _searchQuery;
		},
		set searchQuery(value: string) {
			setSearchQuery(value);
		},

		get columnVisibility() {
			return _visibility;
		},
		isColumnVisible,

		setFilter,
		setSearchQuery,
		handleVisibilityChange,

		filterEntities: filterEntitiesLocal,
		countByStatus: countByStatusLocal
	};
}
