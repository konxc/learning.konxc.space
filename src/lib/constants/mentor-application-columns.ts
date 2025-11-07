/**
 * Column definitions for Mentor Applications Management table
 */

import type { TableColumn } from '$lib/types/table';

export const MENTOR_APPLICATION_COLUMNS: TableColumn[] = [
	{ key: 'name', label: 'Name', required: true },
	{ key: 'email', label: 'Email', required: false },
	{ key: 'expertise', label: 'Expertise', required: false },
	{ key: 'experience', label: 'Experience', required: false },
	{ key: 'status', label: 'Status', required: true },
	{ key: 'applied', label: 'Applied', required: false },
	{ key: 'actions', label: 'Actions', required: true, width: '140px' }
];

/**
 * Default column visibility state (all columns visible)
 */
export function getDefaultMentorApplicationColumnVisibility(): Record<string, boolean> {
	return Object.fromEntries(MENTOR_APPLICATION_COLUMNS.map((col) => [col.key, true]));
}
