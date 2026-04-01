import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count, sum, gte } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { hasOrgPermission } from '$lib/server/rbac';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;

	// Check membership and permission
	const membership = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id))
		)
		.limit(1);

	if (!membership[0] || !hasOrgPermission(membership[0].role, 'analytics:view')) {
		throw redirect(303, `/app/organizations/${orgId}`);
	}

	// Get org courses
	const courses = await db
		.select({ id: schema.course.id, title: schema.course.title, price: schema.course.price })
		.from(schema.course)
		.where(eq(schema.course.orgId, orgId));

	const courseIds = courses.map((c) => c.id);

	// Enrollment stats per course
	const enrollmentStats =
		courseIds.length > 0
			? await db
					.select({
						courseId: schema.enrollment.courseId,
						total: count(),
						status: schema.enrollment.status
					})
					.from(schema.enrollment)
					.where(
						and(
							eq(schema.enrollment.courseId, courseIds[0]) // simplified — loop below
						)
					)
					.groupBy(schema.enrollment.courseId, schema.enrollment.status)
			: [];

	// Build per-course stats
	const courseStats = await Promise.all(
		courses.map(async (course) => {
			const enrollments = await db
				.select({ status: schema.enrollment.status })
				.from(schema.enrollment)
				.where(eq(schema.enrollment.courseId, course.id));

			const total = enrollments.length;
			const active = enrollments.filter((e) => e.status === 'active').length;
			const completed = enrollments.filter((e) => e.status === 'completed').length;
			const revenue = active * course.price;

			return { ...course, total, active, completed, revenue };
		})
	);

	// Member activity (last 30 days)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const members = await db
		.select({
			userId: schema.organizationMember.userId,
			role: schema.organizationMember.role,
			username: schema.user.username,
			fullName: schema.user.fullName
		})
		.from(schema.organizationMember)
		.innerJoin(schema.user, eq(schema.organizationMember.userId, schema.user.id))
		.where(eq(schema.organizationMember.orgId, orgId));

	// Summary totals
	const totalRevenue = courseStats.reduce((sum, c) => sum + c.revenue, 0);
	const totalEnrollments = courseStats.reduce((sum, c) => sum + c.total, 0);
	const totalActive = courseStats.reduce((sum, c) => sum + c.active, 0);
	const totalCompleted = courseStats.reduce((sum, c) => sum + c.completed, 0);

	return {
		orgId,
		courseStats,
		members,
		summary: {
			totalRevenue,
			totalEnrollments,
			totalActive,
			totalCompleted,
			totalCourses: courses.length,
			totalMembers: members.length
		}
	};
};
