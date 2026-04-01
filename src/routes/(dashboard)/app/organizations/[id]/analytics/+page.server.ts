import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count, desc, sql, isNotNull } from 'drizzle-orm';
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
		.select({
			id: schema.course.id,
			title: schema.course.title,
			status: schema.course.status,
			price: schema.course.price,
			createdAt: schema.course.createdAt
		})
		.from(schema.course)
		.where(eq(schema.course.orgId, orgId))
		.orderBy(desc(schema.course.createdAt));

	const courseIds = courses.map((c) => c.id);

	// Get enrollment stats per course
	const courseStats = await Promise.all(
		courses.map(async (course) => {
			const enrollCount = await db
				.select({ count: count() })
				.from(schema.enrollment)
				.where(eq(schema.enrollment.courseId, course.id));

			const completedCount = await db
				.select({ count: count() })
				.from(schema.enrollment)
				.where(
					and(eq(schema.enrollment.courseId, course.id), isNotNull(schema.enrollment.completedAt))
				);

			return {
				...course,
				enrollments: Number(enrollCount[0]?.count || 0),
				completions: Number(completedCount[0]?.count || 0)
			};
		})
	);

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

	// Get members by role
	const membersByRole = await db
		.select({
			role: schema.organizationMember.role,
			count: count()
		})
		.from(schema.organizationMember)
		.where(eq(schema.organizationMember.orgId, orgId))
		.groupBy(schema.organizationMember.role);

	// Get cohort count
	const cohortCount = await db
		.select({ count: count() })
		.from(schema.cohort)
		.where(courseIds.length > 0 ? sql`${schema.cohort.courseId} IN ${courseIds}` : sql`1 = 0`);

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
							eq(schema.transaction.status, 'settlement')
						)
					)
			: [{ total: 0 }];

	// Get pending reviews count
	const pendingReviews =
		courseIds.length > 0
			? await db
					.select({ count: count() })
					.from(schema.courseReview)
					.where(
						and(
							sql`${schema.courseReview.courseId} IN ${courseIds}`,
							eq(schema.courseReview.moderationStatus, 'pending')
						)
					)
			: [{ count: 0 }];

	// Get pending submissions count
	const pendingSubmissions =
		courseIds.length > 0
			? await db
					.select({ count: count() })
					.from(schema.submission)
					.leftJoin(
						schema.submissionGrade,
						eq(schema.submission.id, schema.submissionGrade.submissionId)
					)
					.where(
						and(
							sql`${schema.submission.courseId} IN ${courseIds}`,
							eq(schema.submission.type, 'assignment'),
							sql`${schema.submissionGrade.id} IS NULL`
						)
					)
			: [{ count: 0 }];

	return {
		organization: org[0],
		membership: membership[0],
		courses: courseStats,
		stats: {
			totalCourses: courses.length,
			publishedCourses: courses.filter((c) => c.status === 'published').length,
			totalEnrollments: Number(totalEnrollments[0]?.count || 0),
			completedEnrollments: Number(completedEnrollments[0]?.count || 0),
			memberCount: Number(memberCount[0]?.count || 0),
			membersByRole: membersByRole.reduce(
				(acc, r) => {
					acc[r.role] = Number(r.count);
					return acc;
				},
				{} as Record<string, number>
			),
			cohortCount: Number(cohortCount[0]?.count || 0),
			revenue: Number(revenue[0]?.total || 0),
			pendingReviews: Number(pendingReviews[0]?.count || 0),
			pendingSubmissions: Number(pendingSubmissions[0]?.count || 0)
		},
		recentEnrollments
	};
};
