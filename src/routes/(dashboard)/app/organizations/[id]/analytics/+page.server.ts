import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count, desc, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;

	// Check membership
	const membership = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id))
		)
		.limit(1);

	if (membership.length === 0) {
		throw redirect(303, '/app/organizations');
	}

	// Get organization
	const org = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.id, orgId))
		.limit(1);

	if (!org[0]) {
		throw redirect(303, '/app/organizations');
	}

	// Get courses in this org
	const courses = await db
		.select({ id: schema.course.id, title: schema.course.title })
		.from(schema.course)
		.where(eq(schema.course.orgId, orgId));

	const courseIds = courses.map((c) => c.id);

	// Get total enrollments for org courses
	const totalEnrollments =
		courseIds.length > 0
			? await db
					.select({ count: count() })
					.from(schema.enrollment)
					.where(sql`${schema.enrollment.courseId} IN ${courseIds}`)
			: [{ count: 0 }];

	// Get completed enrollments
	const completedEnrollments =
		courseIds.length > 0
			? await db
					.select({ count: count() })
					.from(schema.enrollment)
					.where(
						and(
							sql`${schema.enrollment.courseId} IN ${courseIds}`,
							sql`${schema.enrollment.completedAt} IS NOT NULL`
						)
					)
			: [{ count: 0 }];

	// Get total members
	const memberCount = await db
		.select({ count: count() })
		.from(schema.organizationMember)
		.where(eq(schema.organizationMember.orgId, orgId));

	// Get recent enrollments
	const recentEnrollments =
		courseIds.length > 0
			? await db
					.select({
						enrolledAt: schema.enrollment.enrolledAt,
						course: { title: schema.course.title },
						user: { fullName: schema.user.fullName, username: schema.user.username }
					})
					.from(schema.enrollment)
					.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
					.innerJoin(schema.user, eq(schema.enrollment.userId, schema.user.id))
					.where(sql`${schema.enrollment.courseId} IN ${courseIds}`)
					.orderBy(desc(schema.enrollment.enrolledAt))
					.limit(10)
			: [];

	// Revenue (total transactions for org courses)
	const revenue =
		courseIds.length > 0
			? await db
					.select({ total: sql<number>`COALESCE(SUM(${schema.transaction.amount}), 0)` })
					.from(schema.transaction)
					.where(
						and(
							sql`${schema.transaction.courseId} IN ${courseIds}`,
							eq(schema.transaction.status, 'success')
						)
					)
			: [{ total: 0 }];

	return {
		organization: org[0],
		membership: membership[0],
		courses,
		stats: {
			totalCourses: courses.length,
			totalEnrollments: Number(totalEnrollments[0]?.count || 0),
			completedEnrollments: Number(completedEnrollments[0]?.count || 0),
			memberCount: Number(memberCount[0]?.count || 0),
			revenue: Number(revenue[0]?.total || 0)
		},
		recentEnrollments
	};
};
