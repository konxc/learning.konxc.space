import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, inArray, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) throw error(401, 'Unauthorized');

	const { membership, organization } = await event.parent();

	if (!membership || !['owner', 'admin', 'mentor'].includes(membership.role)) {
		throw error(403, 'Forbidden: Management access required');
	}

	const orgId = membership.orgId;

	// Get available courses for this organization
	const courses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			orgId: schema.course.orgId
		})
		.from(schema.course)
		.where(and(eq(schema.course.orgId, orgId), eq(schema.course.status, 'published')));

	const courseIds = courses.map((c) => c.id);

	// Get available cohorts for these courses
	let cohorts: any[] = [];
	if (courseIds.length > 0) {
		cohorts = await db
			.select({
				id: schema.cohort.id,
				name: schema.cohort.name,
				courseName: schema.course.title,
				orgId: schema.course.orgId
			})
			.from(schema.cohort)
			.leftJoin(schema.course, eq(schema.cohort.courseId, schema.course.id))
			.where(and(eq(schema.cohort.status, 'active'), inArray(schema.cohort.courseId, courseIds)));
	}

	// Get recent broadcasts sent by this mentor in this organization context
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
		.where(eq(schema.broadcastMessage.senderId, user.id))
		.orderBy(desc(schema.broadcastMessage.createdAt))
		.limit(20);

	return {
		broadcasts,
		cohorts,
		courses,
		membership,
		organization
	};
};

export const actions: Actions = {
	send: async ({ request, locals, url, params }) => {
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;

		// Verify membership and role
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['owner', 'admin', 'mentor'].includes(membership.role)) {
			return { success: false, error: 'Unauthorized: Management access required' };
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

		// Additional safety: if targetCourseId is provided, verify it belongs to this org
		if (targetCourseId) {
			const [course] = await db
				.select()
				.from(schema.course)
				.where(and(eq(schema.course.id, targetCourseId), eq(schema.course.orgId, orgId)))
				.limit(1);
			if (!course) return { success: false, error: 'Invalid target course' };
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
					sentVia: sentVia || 'notification',
					orgId // Pass orgId to API to ensure scoping
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
