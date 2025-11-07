/**
 * Column definitions for Coupon Management table
 */

import type { TableColumn } from '$lib/types/table';

export const COUPON_COLUMNS: TableColumn[] = [
	{ key: 'code', label: 'Code', required: true },
	{ key: 'type', label: 'Type', required: true },
	{ key: 'discount', label: 'Discount', required: false },
	{ key: 'usage', label: 'Usage', required: false },
	{ key: 'validUntil', label: 'Valid Until', required: false },
	{ key: 'status', label: 'Status', required: true },
	{ key: 'createdBy', label: 'Created By', required: false },
	{ key: 'actions', label: 'Actions', required: true, width: '200px' }
];

/**
 * Default column visibility state (all columns visible)
 */
export function getDefaultCouponColumnVisibility(): Record<string, boolean> {
	return Object.fromEntries(COUPON_COLUMNS.map((col) => [col.key, true]));
}

