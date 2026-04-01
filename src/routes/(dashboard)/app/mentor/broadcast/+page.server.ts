import { redirect } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Only admin and mentor can access
	if (user.role !== 'admin' && user.role !== 'mentor') {
		throw redirect(302, '/app');
	}

	// Get active organization from cookie
	const activeOrgId = event.cookies.get('active-workspace');

	// Get user's organization IDs for filtering
	const userOrgMemberships = await db
		.select({ orgId: schema.organizationMember.orgId })
		.from(schema.organizationMember)
		.where(eq(schema.organizationMember.userId, user.id));

	const userOrgIds = userOrgMemberships.map((m) => m.orgId);

	// Get available courses - scoped to org for non-admin users
	let courses: { id: string; title: string; orgId: string | null }[] = [];
	if (user.role === 'admin') {
		courses = await db
			.select({
				id: schema.course.id,
				title: schema.course.title,
				orgId: schema.course.orgId
			})
			.from(schema.course)
			.where(eq(schema.course.status, 'published'));
	} else if (userOrgIds.length > 0) {
		courses = await db
			.select({
				id: schema.course.id,
				title: schema.course.title,
				orgId: schema.course.orgId
			})
			.from(schema.course)
			.where(and(eq(schema.course.status, 'published'), inArray(schema.course.orgId, userOrgIds)));
	}

	const courseIds = courses.map((c) => c.id);

	// Get available cohorts - only from user's org courses
	let cohorts: { id: string; name: string; courseName: string | null; orgId: string | null }[] = [];
	if (user.role === 'admin') {
		cohorts = await db
			.select({
				id: schema.cohort.id,
				name: schema.cohort.name,
				courseName: schema.course.title,
				orgId: schema.course.orgId
			})
			.from(schema.cohort)
			.leftJoin(schema.course, eq(schema.cohort.courseId, schema.course.id))
			.where(eq(schema.cohort.status, 'active'));
	} else if (courseIds.length > 0) {
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

	// Get recent broadcasts - admins see all, mentors see their org's
	let broadcasts;
	if (user.role === 'admin') {
		broadcasts = await db
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
	} else {
		// For mentors: show broadcasts for their courses
		broadcasts = await db
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
			.where(
				// Show broadcasts targeting user's courses or sent by user
				eq(schema.broadcastMessage.senderId, user.id)
			)
			.orderBy(schema.broadcastMessage.createdAt)
			.limit(20);
	}

	// Get user's organizations for org selection
	const memberships =
		user.role !== 'admin'
			? await db
					.select({
						orgId: schema.organizationMember.orgId,
						organization: {
							id: schema.organization.id,
							name: schema.organization.name
						}
					})
					.from(schema.organizationMember)
					.innerJoin(
						schema.organization,
						eq(schema.organizationMember.orgId, schema.organization.id)
					)
					.where(eq(schema.organizationMember.userId, user.id))
			: [];

	return {
		broadcasts,
		cohorts,
		courses,
		userRole: user.role,
		memberships,
		activeOrgId
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
