/**
 * Column definitions for Payment Proof Management table
 */

import type { TableColumn } from '$lib/types/table';

export const PAYMENT_PROOF_COLUMNS: TableColumn[] = [
	{ key: 'user', label: 'User', required: true },
	{ key: 'course', label: 'Course', required: true },
	{ key: 'price', label: 'Price', required: false },
	{ key: 'status', label: 'Status', required: true },
	{ key: 'uploaded', label: 'Uploaded', required: false },
	{ key: 'actions', label: 'Actions', required: true, width: '200px' }
];

/**
 * Default column visibility state (all columns visible)
 */
export function getDefaultPaymentProofColumnVisibility(): Record<string, boolean> {
	return Object.fromEntries(PAYMENT_PROOF_COLUMNS.map((col) => [col.key, true]));
}

