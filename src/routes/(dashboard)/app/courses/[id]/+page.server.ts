import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const courseId = params.id;

	// Get course with mentor info
	const courses = await db
		.select({
			course: {
				id: schema.course.id,
				title: schema.course.title,
				description: schema.course.description,
				thumbnailUrl: schema.course.thumbnailUrl,
				price: schema.course.price,
				duration: schema.course.duration,
				status: schema.course.status,
				orgId: schema.course.orgId,
				category: schema.course.category,
				featuresConfig: schema.course.featuresConfig,
				createdAt: schema.course.createdAt,
				updatedAt: schema.course.updatedAt
			},
			mentor: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email
			}
		})
		.from(schema.course)
		.leftJoin(schema.user, eq(schema.course.mentorId, schema.user.id))
		.where(eq(schema.course.id, courseId))
		.limit(1);

	if (courses.length === 0) {
		return {
			course: null,
			mentor: null,
			isEnrolled: false
		};
	}

	const courseData = courses[0];

	// Check if user is enrolled in this specific course
	let isEnrolled = false;
	if (locals.user) {
		const enrollments = await db
			.select()
			.from(schema.enrollment)
			.where(
				and(eq(schema.enrollment.userId, locals.user.id), eq(schema.enrollment.courseId, courseId))
			)
			.limit(1);

		isEnrolled = enrollments.length > 0;
	}

	// Get curriculum preview
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, courseId))
		.orderBy(schema.module.order);

	const moduleIds = modules.map((m) => m.id);
	let allLessons: any[] = [];

	if (moduleIds.length > 0) {
		// Fetch lessons that belong to any of the modules in this course
		const lessonsResult = await db
			.select({
				id: schema.lesson.id,
				moduleId: schema.lesson.moduleId,
				title: schema.lesson.title,
				order: schema.lesson.order
			})
			.from(schema.lesson)
			.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
			.where(eq(schema.module.courseId, courseId))
			.orderBy(schema.lesson.order);

		allLessons = lessonsResult;
	}

	// Group lessons by module
	const modulesWithLessons = modules.map((m) => ({
		...m,
		lessons: allLessons.filter((l) => l.moduleId === m.id)
	}));

	// Get course reviews
	const reviews = await db
		.select({
			id: schema.courseReview.id,
			rating: schema.courseReview.rating,
			comment: schema.courseReview.comment,
			createdAt: schema.courseReview.createdAt,
			user: {
				fullName: schema.user.fullName,
				username: schema.user.username
			}
		})
		.from(schema.courseReview)
		.innerJoin(schema.user, eq(schema.courseReview.userId, schema.user.id))
		.where(
			and(
				eq(schema.courseReview.courseId, courseId),
				eq(schema.courseReview.moderationStatus, 'approved')
			)
		)
		.orderBy(desc(schema.courseReview.createdAt));

	// Calculate average rating
	const avgRating =
		reviews.length > 0 ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length : 0;

	// Parse features configuration
	let features = { tracks: false, affiliate: false, performance: false };
	try {
		if (courseData.course.featuresConfig) {
			features = JSON.parse(courseData.course.featuresConfig);
		} else {
			// Sane defaults based on category
			const category = courseData.course.category?.toLowerCase() || '';
			const isMarketing = category === 'marketing' || category === 'business';
			
			features = { 
				tracks: isMarketing, 
				affiliate: isMarketing, 
				performance: true // Performance tracking generally useful
			};
		}
	} catch (e) {
		console.error('Error parsing featuresConfig:', e);
	}

	return {
		course: courseData.course,
		mentor: courseData.mentor,
		isEnrolled,
		modules: modulesWithLessons,
		reviews,
		avgRating,
		features
	};
};

export const actions = {
	submitReview: async (event) => {
		const formData = await event.request.formData();
		const courseId = event.params.id;
		const rating = parseInt(formData.get('rating') as string);
		const comment = (formData.get('comment') as string) || '';

		if (!event.locals.user) {
			return fail(401, { error: 'You must be logged in to review' });
		}

		if (isNaN(rating) || rating < 1 || rating > 5) {
			return fail(400, { error: 'Invalid rating (1-5)' });
		}

		// Check if user is enrolled
		const enrollment = await db
			.select()
			.from(schema.enrollment)
			.where(
				and(
					eq(schema.enrollment.userId, event.locals.user.id),
					eq(schema.enrollment.courseId, courseId)
				)
			)
			.limit(1);

		if (enrollment.length === 0) {
			return fail(403, { error: 'Only enrolled students can leave a review' });
		}

		// Check if user already reviewed
		const existingReview = await db
			.select()
			.from(schema.courseReview)
			.where(
				and(
					eq(schema.courseReview.userId, event.locals.user.id),
					eq(schema.courseReview.courseId, courseId)
				)
			)
			.limit(1);

		if (existingReview.length > 0) {
			// Update review
			await db
				.update(schema.courseReview)
				.set({
					rating,
					comment,
					moderationStatus: 'pending', // Re-moderate on edit
					updatedAt: new Date()
				})
				.where(eq(schema.courseReview.id, existingReview[0].id));
		} else {
			// Create review
			const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
			await db.insert(schema.courseReview).values({
				id,
				userId: event.locals.user.id,
				courseId,
				rating,
				comment,
				moderationStatus: 'pending',
				createdAt: new Date(),
				updatedAt: new Date()
			});
		}

		return { success: true, message: 'Review submitted and is pending moderation.' };
	}
};
