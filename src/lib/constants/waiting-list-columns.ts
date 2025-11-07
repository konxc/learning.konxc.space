/**
 * Column definitions for Waiting List table
 */

import type { TableColumn } from '$lib/types/table';

export const WAITING_LIST_COLUMNS: TableColumn[] = [
	{ key: 'name', label: 'Nama', required: true },
	{ key: 'email', label: 'Email', required: false },
	{ key: 'phone', label: 'HP', required: false },
	{ key: 'interest', label: 'Minat', required: false },
	{ key: 'source', label: 'Source', required: false },
	{ key: 'status', label: 'Status', required: true, width: '10%' },
	{ key: 'createdAt', label: 'Tanggal Daftar', required: false },
	{ key: 'actions', label: 'Actions', required: true, width: '120px' }
];

/**
 * Default column visibility state (all columns visible)
 */
export function getDefaultColumnVisibility(): Record<string, boolean> {
	return Object.fromEntries(WAITING_LIST_COLUMNS.map((col) => [col.key, true]));
}

