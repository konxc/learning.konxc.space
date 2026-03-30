import { requireAuth } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, sql, isNull } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';

	// Map role
	const role = parentData.effectiveRole || user.role;
	const isMgmt = ['admin', 'mentor', 'owner', 'facilitator'].includes(role);

	if (!isMgmt) {
		throw error(403, 'Forbidden');
	}

	// Build where condition based on workspace
	const whereClause =
		activeWorkspaceId !== 'personal'
			? and(eq(schema.course.orgId, activeWorkspaceId), eq(schema.course.mentorId, user.id))
			: eq(schema.course.mentorId, user.id);

	// Use subqueries for counts - single query instead of N+1
	const studentCountSubquery = sql<number>`
		(SELECT COUNT(*) FROM ${schema.enrollment} WHERE ${schema.enrollment.courseId} = ${schema.course.id})
	`.as('student_count');

	const pendingCountSubquery = sql<number>`
		(SELECT COUNT(*) FROM ${schema.submission} 
			LEFT JOIN ${schema.submissionGrade} ON ${schema.submission.id} = ${schema.submissionGrade.submissionId}
			WHERE ${schema.submission.courseId} = ${schema.course.id}
			AND ${schema.submission.type} = 'assignment'
			AND ${schema.submissionGrade.id} IS NULL)
	`.as('pending_count');

	// Single query with aggregated counts
	const courseResults = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			thumbnailUrl: schema.course.thumbnailUrl,
			price: schema.course.price,
			duration: schema.course.duration,
			status: schema.course.status,
			createdAt: schema.course.createdAt,
			orgId: schema.course.orgId,
			studentCount: studentCountSubquery,
			pendingSubmissionsCount: pendingCountSubquery
		})
		.from(schema.course)
		.where(whereClause);

	return {
		courses: courseResults
	};
};
