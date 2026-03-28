import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	if (user.role !== 'admin') throw redirect(303, '/app/overview');

	const statusFilter = event.url.searchParams.get('status') || 'pending';

	let query = db
		.select({
			id: schema.courseReview.id,
			rating: schema.courseReview.rating,
			comment: schema.courseReview.comment,
			moderationStatus: schema.courseReview.moderationStatus,
			createdAt: schema.courseReview.createdAt,
			user: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email
			},
			course: {
				id: schema.course.id,
				title: schema.course.title
			}
		})
		.from(schema.courseReview)
		.innerJoin(schema.user, eq(schema.courseReview.userId, schema.user.id))
		.innerJoin(schema.course, eq(schema.courseReview.courseId, schema.course.id));

	if (statusFilter !== 'all') {
		query = query.where(eq(schema.courseReview.moderationStatus, statusFilter)) as typeof query;
	}

	const reviews = await query.orderBy(desc(schema.courseReview.createdAt));

	const stats = {
		total: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
		avgRating: 0
	};

	const allReviews = await db
		.select({ rating: schema.courseReview.rating, moderationStatus: schema.courseReview.moderationStatus })
		.from(schema.courseReview);

	stats.total = allReviews.length;
	stats.pending = allReviews.filter(r => r.moderationStatus === 'pending').length;
	stats.approved = allReviews.filter(r => r.moderationStatus === 'approved').length;
	stats.rejected = allReviews.filter(r => r.moderationStatus === 'rejected').length;
	
	const ratings = allReviews.filter(r => r.moderationStatus === 'approved').map(r => r.rating);
	stats.avgRating = ratings.length > 0 
		? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 
		: 0;

	return { reviews, statusFilter, stats };
};

export const actions: Actions = {
	approve: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const reviewId = formData.get('reviewId') as string;

		await db
			.update(schema.courseReview)
			.set({ moderationStatus: 'approved' })
			.where(eq(schema.courseReview.id, reviewId));

		return { success: true, message: 'Review approved.' };
	},

	reject: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const reviewId = formData.get('reviewId') as string;

		await db
			.update(schema.courseReview)
			.set({ moderationStatus: 'rejected' })
			.where(eq(schema.courseReview.id, reviewId));

		return { success: true, message: 'Review rejected.' };
	},

	delete: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const reviewId = formData.get('reviewId') as string;

		await db
			.delete(schema.courseReview)
			.where(eq(schema.courseReview.id, reviewId));

		return { success: true, message: 'Review deleted.' };
	}
};
