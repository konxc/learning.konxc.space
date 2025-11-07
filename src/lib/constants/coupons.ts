/**
 * Constants for Coupon Management
 */

export type CouponFilterType = 'all' | 'active' | 'expired';

export const COUPON_FILTER_TYPES: CouponFilterType[] = ['all', 'active', 'expired'];

export const COUPON_FILTER_LABELS: Record<CouponFilterType, string> = {
	all: 'All',
	active: 'Active',
	expired: 'Expired'
};
