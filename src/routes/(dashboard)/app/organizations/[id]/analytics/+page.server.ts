import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { getMembership } from '$lib/server/org-utils';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { hasOrgPermission } from '$lib/server/rbac';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;

	const membership = await getMembership(user.id, orgId);
	if (!hasOrgPermission(membership.role, 'analytics:view')) {
		throw redirect(303, `/app/organizations/${orgId}`);
	}

	// Get org courses (needed for courseStats revenue calc)
	const courses = await db
		.select({ id: schema.course.id, title: schema.course.title, price: schema.course.price })
		.from(schema.course)
		.where(eq(schema.course.orgId, orgId));

	// Build per-course stats with revenue
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

	// Three parallel queries
	const [enrollmentsByCourse, memberCountResult, completionData] = await Promise.all([
		// Query A — Enrollment count per course
		db
			.select({
				courseId: schema.course.id,
				courseTitle: schema.course.title,
				count: count(schema.enrollment.id)
			})
			.from(schema.course)
			.leftJoin(schema.enrollment, eq(schema.enrollment.courseId, schema.course.id))
			.where(eq(schema.course.orgId, orgId))
			.groupBy(schema.course.id, schema.course.title),

		// Query B — Member count
		db
			.select({ count: count() })
			.from(schema.organizationMember)
			.where(eq(schema.organizationMember.orgId, orgId)),

		// Query C — Course completion rate per course
		db
			.select({
				courseId: schema.course.id,
				courseTitle: schema.course.title,
				totalEnrollments: count(schema.enrollment.id)
			})
			.from(schema.course)
			.leftJoin(
				schema.enrollment,
				and(
					eq(schema.enrollment.courseId, schema.course.id),
					eq(schema.enrollment.status, 'completed')
				)
			)
			.where(eq(schema.course.orgId, orgId))
			.groupBy(schema.course.id, schema.course.title)
	]);

	const totalMembers = Number(memberCountResult[0]?.count ?? 0);

	// Summary totals
	const totalRevenue = courseStats.reduce((sum, c) => sum + c.revenue, 0);
	const totalEnrollments = courseStats.reduce((sum, c) => sum + c.total, 0);
	const totalActive = courseStats.reduce((sum, c) => sum + c.active, 0);
	const totalCompleted = courseStats.reduce((sum, c) => sum + c.completed, 0);

	return {
		orgId,
		courseStats,
		enrollmentsByCourse,
		completionData,
		summary: {
			totalRevenue,
			totalEnrollments,
			totalActive,
			totalCompleted,
			totalCourses: courses.length,
			totalMembers
		}
	};
};
