import { browser } from '$app/environment';

export interface Column {
	key: string;
	label?: string;
}

export interface UseColumnVisibilityOptions {
	columns: Column[];
	storageKey?: string;
	defaultVisible?: string[];
}

/**
 * Convert Set of visible column keys to Record format
 */
export function setToVisibilityRecord(
	visibleColumns: Set<string>,
	allColumns: Column[]
): Record<string, boolean> {
	const updated: Record<string, boolean> = {};
	allColumns.forEach((col) => {
		updated[col.key] = visibleColumns.has(col.key);
	});
	return updated;
}

/**
 * Check if a column is visible
 */
export function isColumnVisible(key: string, visibility: Record<string, boolean>): boolean {
	return visibility[key] ?? true;
}

export function useColumnVisibility(options: UseColumnVisibilityOptions) {
	const { columns, storageKey, defaultVisible } = options;

	const defaultState: Record<string, boolean> = {};
	columns.forEach((col) => {
		defaultState[col.key] = defaultVisible?.includes(col.key) ?? true;
	});

	let visibility = $state<Record<string, boolean>>(defaultState);

	$effect(() => {
		if (!browser || !storageKey) return;

		const stored = localStorage.getItem(storageKey);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				visibility = { ...visibility, ...parsed };
			} catch {
				// Invalid JSON, use defaults
			}
		}
	});

	function setVisibility(newVisibility: Record<string, boolean>) {
		visibility = newVisibility;

		if (storageKey && browser) {
			localStorage.setItem(storageKey, JSON.stringify(newVisibility));
		}
	}

	function toggleColumn(key: string) {
		const updated = { ...visibility, [key]: !visibility[key] };
		setVisibility(updated);
	}

	function isVisible(key: string): boolean {
		return visibility[key] ?? true;
	}

	function showAll() {
		const updated: Record<string, boolean> = {};
		columns.forEach((col) => {
			updated[col.key] = true;
		});
		setVisibility(updated);
	}

	function hideAll() {
		const updated: Record<string, boolean> = {};
		columns.forEach((col) => {
			updated[col.key] = false;
		});
		setVisibility(updated);
	}

	function reset() {
		setVisibility(defaultState);
	}

	return {
		get visibility() {
			return visibility;
		},
		setVisibility,
		toggleColumn,
		isVisible,
		showAll,
		hideAll,
		reset,
		get visibleKeys() {
			return columns.filter((col) => isVisible(col.key)).map((col) => col.key);
		}
	};
}
