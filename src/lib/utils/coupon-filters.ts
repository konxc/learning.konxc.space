/**
 * Utility functions for filtering coupons
 */

export interface Coupon {
	id: string;
	code: string;
	type: string;
	isActive: boolean;
	validUntil?: Date | string | null;
}

/**
 * Check if a coupon is currently active (isActive && not expired)
 */
export function isCouponActive(coupon: Coupon): boolean {
	if (!coupon.isActive) return false;
	if (!coupon.validUntil) return true; // No expiry = always active if isActive
	return new Date(coupon.validUntil) > new Date();
}

/**
 * Check if a coupon is expired
 */
export function isCouponExpired(coupon: Coupon): boolean {
	if (!coupon.validUntil) return false; // No expiry = never expired
	return new Date(coupon.validUntil) < new Date();
}

/**
 * Check if a coupon matches the search query
 */
export function matchesCouponSearch(coupon: Coupon, query: string): boolean {
	if (!query) return true;
	const lowerQuery = query.toLowerCase();
	return coupon.code.toLowerCase().includes(lowerQuery);
}

/**
 * Check if a coupon matches the filter type
 */
export function matchesCouponFilter(coupon: Coupon, filter: 'all' | 'active' | 'expired'): boolean {
	if (filter === 'all') return true;
	if (filter === 'active') return isCouponActive(coupon);
	if (filter === 'expired') return isCouponExpired(coupon);
	return true;
}

/**
 * Filter coupons based on search query and filter type
 */
export function filterCoupons<T extends Coupon>(
	coupons: T[],
	searchQuery: string,
	filter: 'all' | 'active' | 'expired'
): T[] {
	return coupons.filter(
		(coupon) => matchesCouponSearch(coupon, searchQuery) && matchesCouponFilter(coupon, filter)
	);
}

/**
 * Count coupons by filter type
 */
export function countCouponsByFilter<T extends Coupon>(coupons: T[]): {
	all: number;
	active: number;
	expired: number;
} {
	const counts = {
		all: coupons.length,
		active: 0,
		expired: 0
	};

	coupons.forEach((coupon) => {
		if (isCouponActive(coupon)) {
			counts.active++;
		} else if (isCouponExpired(coupon)) {
			counts.expired++;
		}
	});

	return counts;
}

