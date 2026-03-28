import { redirect } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Only admin and mentor can access
	if (user.role !== 'admin' && user.role !== 'mentor') {
		throw redirect(302, '/app');
	}

	// Get recent broadcasts
	const broadcasts = await db
		.select({
			id: schema.broadcastMessage.id,
			title: schema.broadcastMessage.title,
			content: schema.broadcastMessage.content,
			targetRole: schema.broadcastMessage.targetRole,
			targetCohortId: schema.broadcastMessage.targetCohortId,
			targetCourseId: schema.broadcastMessage.targetCourseId,
			sentVia: schema.broadcastMessage.sentVia,
			recipientCount: schema.broadcastMessage.recipientCount,
			createdAt: schema.broadcastMessage.createdAt,
			senderName: schema.user.fullName
		})
		.from(schema.broadcastMessage)
		.leftJoin(schema.user, eq(schema.broadcastMessage.senderId, schema.user.id))
		.orderBy(schema.broadcastMessage.createdAt)
		.limit(20);

	// Get available cohorts for targeting
	const cohorts = await db
		.select({
			id: schema.cohort.id,
			name: schema.cohort.name,
			courseName: schema.course.title
		})
		.from(schema.cohort)
		.leftJoin(schema.course, eq(schema.cohort.courseId, schema.course.id))
		.where(eq(schema.cohort.status, 'active'));

	// Get available courses
	const courses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title
		})
		.from(schema.course)
		.where(eq(schema.course.status, 'published'));

	return {
		broadcasts,
		cohorts,
		courses,
		userRole: user.role
	};
};

export const actions: Actions = {
	send: async ({ request, locals, url }) => {
		const user = await requireAuth(locals);

		if (user.role !== 'admin' && user.role !== 'mentor') {
			return { success: false, error: 'Unauthorized' };
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;
		const targetRole = formData.get('targetRole') as string;
		const targetCohortId = formData.get('targetCohortId') as string;
		const targetCourseId = formData.get('targetCourseId') as string;
		const sentVia = formData.get('sentVia') as string;

		if (!title || !content) {
			return { success: false, error: 'Title and content are required' };
		}

		try {
			const response = await fetch(`${url.origin}/api/broadcast`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Cookie: request.headers.get('cookie') || ''
				},
				body: JSON.stringify({
					title,
					content,
					targetRole: targetRole || null,
					targetCohortId: targetCohortId || null,
					targetCourseId: targetCourseId || null,
					sentVia: sentVia || 'notification'
				})
			});

			const result = await response.json();

			if (!response.ok) {
				return { success: false, error: result.error || 'Failed to send broadcast' };
			}

			return {
				success: true,
				message: `Message sent to ${result.recipientCount} recipients`
			};
		} catch (e) {
			return { success: false, error: 'Failed to send broadcast' };
		}
	}
};
