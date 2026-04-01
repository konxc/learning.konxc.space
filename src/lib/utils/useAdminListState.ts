/**
 * Admin list state composable
 * Wraps useDashboardListState with built-in filtering helpers
 * to reduce boilerplate in admin pages
 */

import { useDashboardListState } from './useDashboardListState';
import { filterEntities, countByField, buildFilterOptions } from './filter';
import type { TableColumn } from '$lib/types/table';
import type { FilterOption } from './useDashboardListState';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface UseAdminListStateOptions<T> {
	columns: TableColumn[];
	storageKey: string;
	filterParam: string;
	defaultFilter?: string;
	filterStatusField?: string;
	searchFields: string[];
	filterLabelMap?: Record<string, string>;
	data: T[];
}

export interface AdminListState<T> {
	// From useDashboardListState
	filter: string;
	searchQuery: string;
	columnVisibility: Record<string, boolean>;
	isColumnVisible: (key: string) => boolean;
	setFilter: (value: string) => Promise<void>;
	handleVisibilityChange: (visibleColumns: Set<string>) => void;

	// Computed
	filteredItems: T[];
	filterOptions: FilterOption[];
	totalCount: number;
	filteredCount: number;
}

// ─── Main Composable ───────────────────────────────────────────────────────────

export function useAdminListState<T extends Record<string, unknown>>(
	options: UseAdminListStateOptions<T>
): AdminListState<T> {
	const {
		columns,
		storageKey,
		filterParam,
		defaultFilter = 'all',
		filterStatusField = 'status',
		searchFields,
		filterLabelMap = {},
		data
	} = options;

	const listState = useDashboardListState({
		columns,
		storageKey,
		filterParam,
		defaultFilter,
		filterStatusField,
		searchFields
	});

	// Filtered items
	const filteredItems = $derived(
		filterEntities(data, listState.searchQuery, listState.filter, {
			searchFields,
			statusField: filterStatusField
		})
	);

	// Counts by status
	const statusCounts = $derived(countByField(data, filterStatusField as keyof T));

	// Filter options
	const filterOptions = $derived(
		buildFilterOptions(statusCounts, {
			all: filterLabelMap.all ?? 'All',
			...filterLabelMap
		})
	);

	return {
		get filter() {
			return listState.filter;
		},
		set filter(value: string) {
			listState.filter = value;
		},

		get searchQuery() {
			return listState.searchQuery;
		},
		set searchQuery(value: string) {
			listState.searchQuery = value;
		},

		get columnVisibility() {
			return listState.columnVisibility;
		},
		isColumnVisible: listState.isColumnVisible,

		setFilter: listState.setFilter,
		handleVisibilityChange: listState.handleVisibilityChange,

		get filteredItems() {
			return filteredItems;
		},
		get filterOptions() {
			return filterOptions;
		},
		get totalCount() {
			return data.length;
		},
		get filteredCount() {
			return filteredItems.length;
		}
	};
}
