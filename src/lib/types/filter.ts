/**
 * Filter-related type definitions
 * Centralizes types for filter components and composables
 */

export interface FilterOption {
	value: string;
	label: string;
	count?: number;
}

export interface FilterConfig {
	statusField: string;
	searchFields: string[];
	filterParam: string;
	defaultFilter: string;
	validValues: string[];
}

export interface StatusFilterProps {
	options: FilterOption[];
	active: string;
	onChange?: (value: string) => void;
}
