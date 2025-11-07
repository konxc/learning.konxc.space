/**
 * Utility functions for managing table column visibility
 */

/**
 * Convert Set of visible column keys to Record format
 */
export function setToVisibilityRecord(
	visibleColumns: Set<string>,
	allColumns: Array<{ key: string }>
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
export function isColumnVisible(
	key: string,
	visibility: Record<string, boolean>
): boolean {
	return visibility[key] ?? true;
}

