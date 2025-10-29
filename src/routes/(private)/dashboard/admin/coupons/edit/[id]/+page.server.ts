import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { redirect, fail, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
    await requireAdmin(event);

    const couponId = event.params.id;

    // Get coupon
    const coupons = await db
        .select()
        .from(schema.coupon)
        .where(eq(schema.coupon.id, couponId))
        .limit(1);

    if (coupons.length === 0) {
        throw redirect(303, '/dashboard/admin/coupons');
    }

    const coupon = coupons[0];

    // Get all courses
    const courses = await db.select().from(schema.course);

    return {
        coupon,
        courses
    };
};

export const actions: Actions = {
    default: async (event) => {
        const user = await requireAdmin(event);
        const couponId = event.params.id;

        const formData = await event.request.formData();
        const code = formData.get('code');
        const type = formData.get('type');
        const discountType = formData.get('discountType');
        const discountValue = formData.get('discountValue');
        const maxUses = formData.get('maxUses');
        const validFrom = formData.get('validFrom');
        const validUntil = formData.get('validUntil');
        const description = formData.get('description');
        const applicableCourses = formData.get('applicableCourses');
        const minPurchaseAmount = formData.get('minPurchaseAmount');

        // Validation
        if (!code || typeof code !== 'string' || code.trim().length === 0) {
            return fail(400, { error: 'Coupon code is required' });
        }

        if (!type || (type !== 'discount' && type !== 'free')) {
            return fail(400, { error: 'Valid coupon type is required' });
        }

        // Check if code already exists (excluding current coupon)
        const existing = await db
            .select()
            .from(schema.coupon)
            .where(eq(schema.coupon.code, code.trim().toUpperCase()))
            .limit(1);

        if (existing.length > 0 && existing[0].id !== couponId) {
            return fail(400, { error: 'Coupon code already exists' });
        }

        let discountTypeVal = null;
        let discountValueVal = null;

        if (type === 'discount') {
            if (!discountType || (discountType !== 'percentage' && discountType !== 'fixed')) {
                return fail(400, { error: 'Valid discount type is required' });
            }
            discountTypeVal = discountType;

            if (!discountValue) {
                return fail(400, { error: 'Discount value is required' });
            }
            const value = parseInt(discountValue as string);
            if (isNaN(value) || value <= 0) {
                return fail(400, { error: 'Valid discount value is required' });
            }
            discountValueVal = value;
        }

        const maxUsesVal = maxUses ? parseInt(maxUses as string) : null;
        if (maxUses && isNaN(maxUsesVal!)) {
            return fail(400, { error: 'Valid max uses is required' });
        }

        const minPurchaseVal = minPurchaseAmount ? parseInt(minPurchaseAmount as string) : null;
        if (minPurchaseAmount && isNaN(minPurchaseVal!)) {
            return fail(400, { error: 'Valid minimum purchase amount is required' });
        }

        // Parse applicable courses
        let applicableCoursesVal = null;
        if (applicableCourses && typeof applicableCourses === 'string') {
            try {
                const coursesArray = JSON.parse(applicableCourses);
                applicableCoursesVal = JSON.stringify(coursesArray);
            } catch (e) {
                applicableCoursesVal = null;
            }
        }

        // Update coupon
        await db
            .update(schema.coupon)
            .set({
                code: code.trim().toUpperCase(),
                type: type as 'discount' | 'free',
                discountType: discountTypeVal,
                discountValue: discountValueVal,
                maxUses: maxUsesVal,
                validFrom: validFrom ? new Date(validFrom as string) : new Date(),
                validUntil: validUntil ? new Date(validUntil as string) : null,
                description: description && typeof description === 'string' ? description.trim() : null,
                applicableCourses: applicableCoursesVal,
                minPurchaseAmount: minPurchaseVal
            })
            .where(eq(schema.coupon.id, couponId));

        throw redirect(303, '/dashboard/admin/coupons');
    },

    checkCode: async (event) => {
        const user = await requireAdmin(event);

        const body = await event.request.json();
        const { code, currentId } = body;

        if (!code || typeof code !== 'string') {
            return json({ exists: false });
        }

        const existing = await db
            .select()
            .from(schema.coupon)
            .where(eq(schema.coupon.code, code.trim().toUpperCase()))
            .limit(1);

        // Check if code exists and is not the current coupon
        const exists = existing.length > 0 && existing[0].id !== currentId;

        return json({ exists });
    }
};

