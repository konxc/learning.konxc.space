import * as schema from './db/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';
import type { Coupon } from './db/schema';

export interface CouponValidationResult {
    isValid: boolean;
    coupon: Coupon | null;
    error?: string;
    finalPrice: number;
    discountAmount: number;
}

export async function validateCoupon(
    code: string,
    originalPrice: number,
    courseId?: string
): Promise<CouponValidationResult> {
    // Find the coupon
    const coupon = await db
        .select()
        .from(schema.coupon)
        .where(eq(schema.coupon.code, code))
        .limit(1);

    if (coupon.length === 0) {
        return {
            isValid: false,
            coupon: null,
            error: 'Coupon code not found',
            finalPrice: originalPrice,
            discountAmount: 0
        };
    }

    const foundCoupon = coupon[0];

    // Check if coupon is active
    if (!foundCoupon.isActive) {
        return {
            isValid: false,
            coupon: foundCoupon,
            error: 'Coupon is not active',
            finalPrice: originalPrice,
            discountAmount: 0
        };
    }

    // Check validity date range
    const now = new Date();
    if (foundCoupon.validUntil && new Date(foundCoupon.validUntil) < now) {
        return {
            isValid: false,
            coupon: foundCoupon,
            error: 'Coupon has expired',
            finalPrice: originalPrice,
            discountAmount: 0
        };
    }

    if (new Date(foundCoupon.validFrom) > now) {
        return {
            isValid: false,
            coupon: foundCoupon,
            error: 'Coupon is not yet valid',
            finalPrice: originalPrice,
            discountAmount: 0
        };
    }

    // Check usage limits
    if (foundCoupon.maxUses && foundCoupon.currentUses >= foundCoupon.maxUses) {
        return {
            isValid: false,
            coupon: foundCoupon,
            error: 'Coupon usage limit reached',
            finalPrice: originalPrice,
            discountAmount: 0
        };
    }

    // Check minimum purchase amount
    if (foundCoupon.minPurchaseAmount && originalPrice < foundCoupon.minPurchaseAmount) {
        return {
            isValid: false,
            coupon: foundCoupon,
            error: `Minimum purchase amount is Rp ${foundCoupon.minPurchaseAmount.toLocaleString('id-ID')}`,
            finalPrice: originalPrice,
            discountAmount: 0
        };
    }

    // Check if coupon is applicable to this course
    if (foundCoupon.applicableCourses) {
        try {
            const applicableCourseIds = JSON.parse(foundCoupon.applicableCourses);
            if (courseId && !applicableCourseIds.includes(courseId)) {
                return {
                    isValid: false,
                    coupon: foundCoupon,
                    error: 'Coupon is not applicable to this course',
                    finalPrice: originalPrice,
                    discountAmount: 0
                };
            }
        } catch (e) {
            // Invalid JSON, allow coupon
        }
    }

    // Calculate discount
    let discountAmount = 0;
    let finalPrice = originalPrice;

    if (foundCoupon.type === 'free') {
        finalPrice = 0;
        discountAmount = originalPrice;
    } else if (foundCoupon.type === 'discount' && foundCoupon.discountType && foundCoupon.discountValue) {
        if (foundCoupon.discountType === 'percentage') {
            discountAmount = Math.round((originalPrice * foundCoupon.discountValue) / 100);
            finalPrice = originalPrice - discountAmount;
        } else if (foundCoupon.discountType === 'fixed') {
            discountAmount = foundCoupon.discountValue;
            finalPrice = Math.max(0, originalPrice - discountAmount);
            discountAmount = originalPrice - finalPrice; // Adjust if price goes negative
        }
    }

    return {
        isValid: true,
        coupon: foundCoupon,
        finalPrice,
        discountAmount
    };
}

export async function applyCoupon(
    couponId: string,
    userId: string,
    courseId: string,
    originalPrice: number,
    discountAmount: number
) {
    // Get current coupon to increment
    const currentCoupon = await db
        .select()
        .from(schema.coupon)
        .where(eq(schema.coupon.id, couponId))
        .limit(1);

    if (currentCoupon.length > 0) {
        // Increment usage count
        await db
            .update(schema.coupon)
            .set({
                currentUses: currentCoupon[0].currentUses + 1
            })
            .where(eq(schema.coupon.id, couponId));

        // Track coupon usage
        await db.insert(schema.couponUsage).values({
            id: crypto.randomUUID(),
            couponId,
            userId,
            courseId,
            discountAmount,
            orderAmount: originalPrice,
            finalAmount: originalPrice - discountAmount
        });
    }
}
