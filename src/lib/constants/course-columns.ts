/**
 * Column definitions for Course Management table
 */

import type { TableColumn } from '$lib/types/table';

export const COURSE_COLUMNS: TableColumn[] = [
	{ key: 'title', label: 'Title', required: true },
	{ key: 'status', label: 'Status', required: true },
	{ key: 'price', label: 'Price', required: false },
	{ key: 'duration', label: 'Duration', required: false },
	{ key: 'mentor', label: 'Mentor', required: false },
	{ key: 'createdAt', label: 'Created', required: false },
	{ key: 'actions', label: 'Actions', required: true, width: '150px' }
];

/**
 * Default column visibility state (all columns visible)
 */
export function getDefaultCourseColumnVisibility(): Record<string, boolean> {
	return Object.fromEntries(COURSE_COLUMNS.map((col) => [col.key, true]));
}

