/**
 * Generic filter utilities for dashboard list pages
 * Consolidates patterns from: coupon-filters, user-filters, course-filters, etc.
 */

export interface FilterableEntity {
	status?: string;
	[key: string]: unknown;
}

export interface SearchableEntity {
	[key: string]: unknown;
}

export interface FilterOptions<T> {
	searchFields?: (keyof T | string)[];
	statusField?: keyof T;
	filterValues?: string[];
}

/**
 * Check if an entity matches a search query across multiple fields
 */
export function matchesSearch<T extends SearchableEntity>(
	entity: T,
	query: string,
	searchFields: (keyof T | string)[] = []
): boolean {
	if (!query) return true;
	if (searchFields.length === 0) return true;

	const lowerQuery = query.toLowerCase();
	return searchFields.some((field) => {
		const value = entity[field as keyof T];
		if (typeof value === 'string') {
			return value.toLowerCase().includes(lowerQuery);
		}
		if (value === null || value === undefined) return false;
		return String(value).toLowerCase().includes(lowerQuery);
	});
}

/**
 * Check if an entity matches a status filter
 */
export function matchesStatus<T extends FilterableEntity>(
	entity: T,
	filter: string,
	statusField: keyof T = 'status' as keyof T
): boolean {
	if (!filter || filter === 'all') return true;
	const status = entity[statusField];
	return status === filter;
}

/**
 * Filter entities based on search query and filter
 */
export function filterEntities<T extends FilterableEntity>(
	entities: T[],
	query: string,
	filter: string,
	options: FilterOptions<T> = {}
): T[] {
	const searchFields = options.searchFields || [];
	const statusField = options.statusField || 'status';

	return entities.filter((entity) => {
		const matchesSearchResult =
			searchFields.length > 0 ? matchesSearch(entity, query, searchFields) : true;
		const matchesFilterResult = matchesStatus(entity, filter, statusField);
		return matchesSearchResult && matchesFilterResult;
	});
}

/**
 * Count entities by status/filter value
 */
export function countByStatus<T extends FilterableEntity>(
	entities: T[],
	statusField: keyof T = 'status' as keyof T
): Record<string, number> {
	const counts: Record<string, number> = { all: entities.length };

	entities.forEach((entity) => {
		const status = String(entity[statusField] ?? 'unknown');
		counts[status] = (counts[status] || 0) + 1;
	});

	return counts;
}

/**
 * Count entities by any field value
 */
export function countByField<T extends Record<string, unknown>>(
	entities: T[],
	field: keyof T
): Record<string, number> {
	const counts: Record<string, number> = { all: entities.length };

	entities.forEach((entity) => {
		const value = String(entity[field] ?? 'unknown');
		counts[value] = (counts[value] || 0) + 1;
	});

	return counts;
}

/**
 * Create filter functions for a specific entity type
 */
export function createFilterUtils<T extends FilterableEntity & SearchableEntity>(
	options: FilterOptions<T>
) {
	const searchFields = options.searchFields || [];
	const statusField = options.statusField || 'status';

	return {
		matchesSearch: (entity: T, query: string) => matchesSearch(entity, query, searchFields),
		matchesStatus: (entity: T, filter: string) => matchesStatus(entity, filter, statusField),
		filter: (entities: T[], query: string, filter: string) =>
			filterEntities(entities, query, filter, { searchFields, statusField }),
		countByStatus: (entities: T[]) => countByStatus(entities, statusField)
	};
}

/**
 * Check if an entity is active/valid based on date fields
 */
export function isActive<T extends { isActive?: boolean; validUntil?: Date | string | null }>(
	entity: T
): boolean {
	if (entity.isActive === false) return false;
	if (!entity.validUntil) return true;
	return new Date(entity.validUntil) > new Date();
}

/**
 * Check if an entity is expired
 */
export function isExpired<T extends { validUntil?: Date | string | null }>(entity: T): boolean {
	if (!entity.validUntil) return false;
	return new Date(entity.validUntil) < new Date();
}

/**
 * Filter by active/expired status
 */
export function filterByActiveStatus<
	T extends { isActive?: boolean; validUntil?: Date | string | null }
>(entities: T[], filter: 'all' | 'active' | 'expired'): T[] {
	if (filter === 'all') return entities;
	return entities.filter((entity) => {
		if (filter === 'active') return isActive(entity);
		if (filter === 'expired') return isExpired(entity);
		return true;
	});
}

/** Build filter options for StatusFilter component from counts and labels */
export function buildFilterOptions(
	counts: Record<string, number>,
	labels: Record<string, string>
): Array<{ value: string; label: string; count: number }> {
	return Object.entries(labels).map(([value, label]) => ({
		value,
		label,
		count: counts[value] ?? 0
	}));
}
