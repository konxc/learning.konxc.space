import { fail, isRedirect, redirect } from '@sveltejs/kit';
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

	const user = locals.user;

	// Bridge logic for students with existing enrollments
	if (user.role === 'user' && !user.onboardingCompleted) {
		const existingEnrollment = await db.query.enrollment.findFirst({
			where: eq(schema.enrollment.userId, user.id)
		});

		if (existingEnrollment) {
			await db
				.update(schema.user)
				.set({ onboardingCompleted: true })
				.where(eq(schema.user.id, user.id));
			throw redirect(303, '/app');
		}
	}

	// Redirect to dashboard if onboarding already completed (for mentor/facilitator)
	if ((user.role === 'mentor' || user.role === 'facilitator') && user.onboardingCompleted) {
		throw redirect(303, '/app');
	}

	// For Students (User role) - Load available courses with track config
	const courses = await db
		.select()
		.from(schema.course)
		.where(eq(schema.course.status, 'published'));

	// Parse featuresConfig for each course
	const coursesWithTracks = courses.map((course) => {
		let featuresConfig = { tracks: false, affiliate: false, performance: false };
		try {
			if (course.featuresConfig) {
				featuresConfig = JSON.parse(course.featuresConfig);
			}
		} catch {
			// Keep default
		}
		return { ...course, featuresConfig };
	});

	// For Mentors - Load application status
	let mentorData = null;
	if (user.role === 'mentor') {
		mentorData = await db.query.mentorApplication.findFirst({
			where: eq(schema.mentorApplication.userId, user.id)
		});
	}

	// For Facilitators - Load available organizations
	let organizations: Array<{ id: string; name: string; slug: string }> = [];
	if (user.role === 'facilitator') {
		organizations = await db
			.select({
				id: schema.organization.id,
				name: schema.organization.name,
				slug: schema.organization.slug
			})
			.from(schema.organization);
	}

	return {
		role: user.role,
		courses: coursesWithTracks,
		mentorData,
		organizations
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
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const courseId = formData.get('courseId') as string;
		const couponCode = formData.get('couponCode') as string | null;
		const track = formData.get('track') as string | null;

		// Validate track if provided
		const validTracks = ['creator', 'seller', 'affiliate'];
		const validatedTrack = track && validTracks.includes(track) ? track : null;

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
			.where(eq(schema.enrollment.userId, user.id))
			.limit(1);

		// Filter in-memory to check specific course enrollment
		const alreadyEnrolled = existingEnrollment.some((e) => e.courseId === courseId);
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

			// Create enrollment with track and mark onboarding as complete
			const enrollmentId = generateId();
			await db.transaction(async (tx) => {
				await tx.insert(schema.enrollment).values({
					id: enrollmentId,
					userId: user.id,
					courseId: courseId,
					couponId,
					track: validatedTrack,
					status: finalPrice === 0 ? 'active' : 'pending'
				});

				await tx
					.update(schema.user)
					.set({ onboardingCompleted: true })
					.where(eq(schema.user.id, user.id));
			});

			// Apply coupon if used
			if (couponCode && couponId) {
				await applyCoupon(couponId, user.id, courseId, course.price, discountAmount);
			}

			// Redirect to dashboard
			throw redirect(303, '/app');
		} catch (error) {
			if (isRedirect(error)) throw error;
			console.error('Failed to enroll:', error);
			return fail(500, { error: 'Failed to enroll' });
		}
	},

	completeOnboarding: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const organizationId = formData.get('organizationId') as string | null;

		try {
			// If facilitator, add them to the organization
			if (user.role === 'facilitator' && organizationId) {
				// Check if already a member
				const existingMember = await db.query.organizationMember.findFirst({
					where: (fields, operators) =>
						operators.and(
							operators.eq(fields.orgId, organizationId),
							operators.eq(fields.userId, user.id)
						)
				});

				if (!existingMember) {
					await db.insert(schema.organizationMember).values({
						id: generateId(),
						orgId: organizationId,
						userId: user.id,
						role: 'facilitator'
					});
				}
			}

			// Mark onboarding as complete
			await db
				.update(schema.user)
				.set({ onboardingCompleted: true })
				.where(eq(schema.user.id, user.id));

			throw redirect(303, '/app');
		} catch (error) {
			if (isRedirect(error)) throw error;
			console.error('Failed to complete onboarding:', error);
			return fail(500, { error: 'Terjadi kesalahan saat menyelesaikan onboarding' });
		}
	},

	redirectToSettings: async ({ locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		// Mark onboarding as complete and redirect to settings
		try {
			await db
				.update(schema.user)
				.set({ onboardingCompleted: true })
				.where(eq(schema.user.id, user.id));

			throw redirect(303, '/app/settings');
		} catch (error) {
			if (isRedirect(error)) throw error;
			console.error('Failed to redirect to settings:', error);
			return fail(500, { error: 'Terjadi kesalahan' });
		}
	}
};

function generateId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}
