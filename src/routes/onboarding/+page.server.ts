import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { validateCoupon, applyCoupon } from '$lib/server/coupon';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/auth/signin');
    }

    // Get all published courses
    const courses = await db
        .select()
        .from(schema.course)
        .where(eq(schema.course.status, 'published'));

    return {
        courses
    };
};

export const actions: Actions = {
    validateCoupon: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        const formData = await request.formData();
        const couponCode = formData.get('couponCode') as string;
        const courseId = formData.get('courseId') as string;

        if (!couponCode) {
            return fail(400, { error: 'Coupon code is required' });
        }

        // Get course to get price
        const courses = await db
            .select()
            .from(schema.course)
            .where(eq(schema.course.id, courseId))
            .limit(1);

        if (courses.length === 0) {
            return fail(404, { error: 'Course not found' });
        }

        const course = courses[0];

        // Validate coupon
        const validation = await validateCoupon(couponCode, course.price, courseId);

        if (!validation.isValid) {
            return fail(400, {
                error: validation.error || 'Invalid coupon',
                isValid: false,
                finalPrice: course.price,
                discountAmount: 0
            });
        }

        return {
            isValid: true,
            finalPrice: validation.finalPrice,
            discountAmount: validation.discountAmount,
            coupon: validation.coupon
        };
    },

    enroll: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        const formData = await request.formData();
        const courseId = formData.get('courseId') as string;
        const couponCode = formData.get('couponCode') as string | null;

        // Get course
        const courses = await db
            .select()
            .from(schema.course)
            .where(eq(schema.course.id, courseId))
            .limit(1);

        if (courses.length === 0) {
            return fail(404, { error: 'Course not found' });
        }

        const course = courses[0];

        // Check if already enrolled
        const existingEnrollment = await db
            .select()
            .from(schema.enrollment)
            .where(eq(schema.enrollment.userId, locals.user.id))
            .limit(1);

        // Filter in-memory to check specific course enrollment
        const alreadyEnrolled = existingEnrollment.some(e => e.courseId === courseId);
        if (alreadyEnrolled) {
            return fail(400, { error: 'You are already enrolled in this course' });
        }

        try {
            // Validate and apply coupon if provided
            let finalPrice = course.price;
            let couponId = null;
            let discountAmount = 0;

            if (couponCode) {
                const validation = await validateCoupon(couponCode, course.price, courseId);
                if (!validation.isValid) {
                    return fail(400, { error: validation.error || 'Invalid coupon code' });
                }
                finalPrice = validation.finalPrice;
                discountAmount = validation.discountAmount;
                couponId = validation.coupon!.id;
            }

            // Create enrollment
            const enrollmentId = generateId();
            await db.insert(schema.enrollment).values({
                id: enrollmentId,
                userId: locals.user.id,
                courseId: courseId,
                couponId,
                status: finalPrice === 0 ? 'active' : 'pending'
            });

            // Apply coupon if used
            if (couponCode && couponId) {
                await applyCoupon(couponId, locals.user.id, courseId, course.price, discountAmount);
            }

            // Redirect to dashboard
            throw redirect(303, '/dashboard');
        } catch (error) {
            if (error instanceof Error && error.message.includes('redirect')) {
                throw error;
            }
            return fail(500, { error: 'Failed to enroll' });
        }
    }
};

function generateId() {
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    return encodeBase32LowerCase(bytes);
}
