import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

/**
 * Verifies if a user has access to a specific course.
 * Access is granted if the user:
 * 1. Has an active enrollment in the course OR
 * 2. Is the mentor of the course OR
 * 3. Is an admin/owner of the organization that owns the course
 */
export async function checkCourseAccess(userId: string, courseId: string) {
	// 1. Check for active enrollment
	const [enrollment] = await db
		.select()
		.from(schema.enrollment)
		.where(
			and(
				eq(schema.enrollment.userId, userId),
				eq(schema.enrollment.courseId, courseId),
				eq(schema.enrollment.status, 'active')
			)
		)
		.limit(1);

	if (enrollment) return { hasAccess: true, type: 'student' };

	// 2. Check course details for organization context
	const [course] = await db
		.select({ orgId: schema.course.orgId, mentorId: schema.course.mentorId })
		.from(schema.course)
		.where(eq(schema.course.id, courseId))
		.limit(1);

	if (!course) return { hasAccess: false, error: 'Course not found' };

	// 3. User is the mentor
	if (course.mentorId === userId) return { hasAccess: true, type: 'mentor' };

	// 4. Check for admin/owner membership in the organization
	if (course.orgId) {
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.userId, userId),
					eq(schema.organizationMember.orgId, course.orgId)
				)
			)
			.limit(1);

		if (membership && ['admin', 'owner'].includes(membership.role)) {
			return { hasAccess: true, type: 'admin' };
		}
	}

	return { hasAccess: false, error: 'Forbidden' };
}

/**
 * Get courseId from a lessonId if it's not provided
 */
export async function getCourseIdFromLesson(lessonId: string) {
	const result = await db
		.select({ courseId: schema.module.courseId })
		.from(schema.lesson)
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.lesson.id, lessonId))
		.limit(1);

	return result[0]?.courseId;
}
