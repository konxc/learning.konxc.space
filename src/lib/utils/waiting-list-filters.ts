/**
 * Utility functions for filtering waiting list entries
 */

export interface WaitingListEntry {
	fullName: string;
	email: string;
	phone?: string | null;
	status: string;
}

/**
 * Check if an entry matches the search query
 */
export function matchesSearch(entry: WaitingListEntry, query: string): boolean {
	if (!query) return true;
	const lowerQuery = query.toLowerCase();
	return (
		entry.fullName.toLowerCase().includes(lowerQuery) ||
		entry.email.toLowerCase().includes(lowerQuery) ||
		(entry.phone?.toLowerCase().includes(lowerQuery) ?? false)
	);
}

/**
 * Check if an entry matches the status filter
 */
export function matchesStatus(entry: WaitingListEntry, filter: string): boolean {
	return !filter || entry.status === filter;
}

/**
 * Filter entries based on search query and status
 */
export function filterEntries<T extends WaitingListEntry>(
	entries: T[],
	searchQuery: string,
	statusFilter: string
): T[] {
	return entries.filter(
		(entry) => matchesSearch(entry, searchQuery) && matchesStatus(entry, statusFilter)
	);
}

/**
 * Count entries by status
 */
export function countEntriesByStatus<T extends { status: string }>(
	entries: T[],
	statuses: string[]
): Record<string, number> {
	const counts: Record<string, number> = {
		all: entries.length,
		...Object.fromEntries(statuses.map((status) => [status, 0]))
	};

	entries.forEach((entry) => {
		if (entry.status in counts) {
			counts[entry.status]++;
		}
	});

	return counts;
}
