import { requireAuth } from '$lib/server/middleware';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { validateCoupon, applyCoupon } from '$lib/server/coupon';
import { sendEmail, createNotification } from '$lib/server/email';

export const actions = {
	default: async (event) => {
		const user = await requireAuth(event);

		const formData = await event.request.formData();
		const courseId = event.params.id;
		const couponCode = formData.get('couponCode') as string | null;
		const track = formData.get('track') as string | null; // 'creator' | 'seller' | 'affiliate'

		// Validate track value
		const validTracks = ['creator', 'seller', 'affiliate'];
		const validatedTrack = track && validTracks.includes(track) ? track : null;

		// Check if course exists
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
			.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.courseId, courseId)))
			.limit(1);

		if (existingEnrollment.length > 0) {
			return fail(400, { error: 'You are already enrolled in this course' });
		}

		// Validate coupon if provided
		let finalPrice = course.price;
		let couponId = null;
		let discountAmount = 0;

		if (couponCode) {
			const couponValidation = await validateCoupon(couponCode, course.price, courseId);
			if (!couponValidation.isValid) {
				return fail(400, { error: couponValidation.error || 'Invalid coupon code' });
			}
			finalPrice = couponValidation.finalPrice;
			discountAmount = couponValidation.discountAmount;
			couponId = couponValidation.coupon!.id;
		}

		// Create enrollment with track
		const enrollmentId = crypto.randomUUID();

		await db.insert(schema.enrollment).values({
			id: enrollmentId,
			userId: user.id,
			courseId: course.id,
			couponId,
			track: validatedTrack,
			status: finalPrice === 0 ? 'active' : 'pending'
		});

		// Apply the coupon if used
		if (couponCode && couponId) {
			await applyCoupon(couponId, user.id, courseId, course.price, discountAmount);
		}

		// Send email if user has an email and notification
		if (user.email) {
			sendEmail(user.email, 'enrollment', {
				name: user.fullName || user.username,
				courseName: course.title,
				track: track || 'Regular',
				cohort: 'Open enrollment',
				learnUrl: `${event.url.origin}/app/explore/${courseId}/learn`
			}).catch(console.error);
		}

		createNotification(
			user.id,
			'enrollment',
			'Enrollment Successful 📚',
			`You are now enrolled in ${course.title}. Start learning!`,
			`/app/explore/${courseId}/learn`
		).catch(console.error);

		// Redirect based on price: free courses go directly to learning, paid courses go to payment
		if (finalPrice === 0) {
			throw redirect(303, '/app/learning/courses');
		} else {
			throw redirect(303, `/app/payments?courseId=${courseId}`);
		}
	}
} satisfies Actions;
