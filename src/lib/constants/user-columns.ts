/**
 * Column definitions for User Management table
 */

import type { TableColumn } from '$lib/types/table';

export const USER_COLUMNS: TableColumn[] = [
	{ key: 'username', label: 'Username', required: true },
	{ key: 'fullName', label: 'Full Name', required: false },
	{ key: 'email', label: 'Email', required: false },
	{ key: 'role', label: 'Role', required: true },
	{ key: 'onboarding', label: 'Onboarding', required: false },
	{ key: 'joined', label: 'Joined', required: false },
	{ key: 'actions', label: 'Actions', required: true, width: '180px' }
];

/**
 * Default column visibility state (all columns visible)
 */
export function getDefaultUserColumnVisibility(): Record<string, boolean> {
	return Object.fromEntries(USER_COLUMNS.map((col) => [col.key, true]));
}

