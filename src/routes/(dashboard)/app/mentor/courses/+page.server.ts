import { requireAuth } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count, inArray } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';

	const role = parentData.effectiveRole || user.role;
	const isMgmt = ['admin', 'mentor', 'owner', 'facilitator'].includes(role);

	if (!isMgmt) {
		throw error(403, 'Forbidden');
	}

	// Get courses for this mentor
	const whereClause =
		activeWorkspaceId !== 'personal'
			? and(eq(schema.course.orgId, activeWorkspaceId), eq(schema.course.mentorId, user.id))
			: eq(schema.course.mentorId, user.id);

	const courses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			thumbnailUrl: schema.course.thumbnailUrl,
			price: schema.course.price,
			duration: schema.course.duration,
			status: schema.course.status,
			visibility: schema.course.visibility,
			createdAt: schema.course.createdAt,
			orgId: schema.course.orgId
		})
		.from(schema.course)
		.where(whereClause);

	if (courses.length === 0) {
		return { courses: [] };
	}

	const courseIds = courses.map((c) => c.id);

	// Count enrollments per course
	const enrollmentCounts = await db
		.select({ courseId: schema.enrollment.courseId, total: count() })
		.from(schema.enrollment)
		.where(inArray(schema.enrollment.courseId, courseIds))
		.groupBy(schema.enrollment.courseId);

	const enrollmentMap = new Map(enrollmentCounts.map((e) => [e.courseId, e.total]));

	// Count pending submissions (assignments without a grade) per course
	const allSubmissions = await db
		.select({ id: schema.submission.id, courseId: schema.submission.courseId })
		.from(schema.submission)
		.where(
			and(inArray(schema.submission.courseId, courseIds), eq(schema.submission.type, 'assignment'))
		);

	const submissionIds = allSubmissions.map((s) => s.id);

	const gradedIds = new Set<string>();
	if (submissionIds.length > 0) {
		const grades = await db
			.select({ submissionId: schema.submissionGrade.submissionId })
			.from(schema.submissionGrade)
			.where(inArray(schema.submissionGrade.submissionId, submissionIds));
		grades.forEach((g) => gradedIds.add(g.submissionId));
	}

	// Build pending count per course
	const pendingMap = new Map<string, number>();
	for (const sub of allSubmissions) {
		if (!gradedIds.has(sub.id) && sub.courseId) {
			pendingMap.set(sub.courseId, (pendingMap.get(sub.courseId) ?? 0) + 1);
		}
	}

	return {
		courses: courses.map((c) => ({
			...c,
			studentCount: enrollmentMap.get(c.id) ?? 0,
			pendingSubmissionsCount: pendingMap.get(c.id) ?? 0
		}))
	};
};
