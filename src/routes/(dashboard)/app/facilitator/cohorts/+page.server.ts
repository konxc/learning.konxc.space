import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count, inArray, lt, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	const isPlatformAdmin = user.role === 'admin';

	if (!isPlatformAdmin) {
		const eligibleMemberships = await db
			.select({ orgId: schema.organizationMember.orgId })
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.userId, user.id),
					inArray(schema.organizationMember.role, ['facilitator', 'mentor', 'owner', 'admin'])
				)
			)
			.limit(1);

		if (eligibleMemberships.length === 0) {
			throw redirect(303, '/app/overview');
		}
	}

	const memberships = await db
		.select({
			orgId: schema.organizationMember.orgId,
			role: schema.organizationMember.role,
			organization: {
				name: schema.organization.name,
				logoUrl: schema.organization.logoUrl
			}
		})
		.from(schema.organizationMember)
		.innerJoin(schema.organization, eq(schema.organizationMember.orgId, schema.organization.id))
		.where(
			and(
				eq(schema.organizationMember.userId, user.id),
				inArray(schema.organizationMember.role, ['facilitator', 'mentor', 'owner', 'admin'])
			)
		);

	const cohorts =
		memberships.length > 0
			? await db
					.select({
						id: schema.cohort.id,
						name: schema.cohort.name,
						startDate: schema.cohort.startDate,
						endDate: schema.cohort.endDate,
						status: schema.cohort.status,
						course: {
							id: schema.course.id,
							title: schema.course.title
						},
						organization: {
							id: schema.organization.id,
							name: schema.organization.name
						}
					})
					.from(schema.cohort)
					.innerJoin(schema.course, eq(schema.cohort.courseId, schema.course.id))
					.innerJoin(schema.organization, eq(schema.course.orgId, schema.organization.id))
					.where(eq(schema.cohort.facilitatorId, user.id))
					.orderBy(schema.cohort.startDate)
			: [];

	// Three weeks ago threshold for at-risk detection
	const threeWeeksAgo = new Date();
	threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

	// Get student counts + at-risk count per cohort
	const cohortsWithStats = await Promise.all(
		cohorts.map(async (cohort) => {
			const [studentCountResult, enrollmentsResult] = await Promise.all([
				db
					.select({ count: count() })
					.from(schema.enrollment)
					.where(eq(schema.enrollment.cohortId, cohort.id)),
				db
					.select({
						userId: schema.enrollment.userId,
						enrolledAt: schema.enrollment.enrolledAt
					})
					.from(schema.enrollment)
					.where(
						and(eq(schema.enrollment.cohortId, cohort.id), eq(schema.enrollment.status, 'active'))
					)
			]);

			const studentCount = Number(studentCountResult[0]?.count ?? 0);

			// Count at-risk: enrolled > 21 days ago but progress < 30%
			// Get total lessons for the course
			const totalLessonsResult = await db
				.select({ count: count() })
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.where(eq(schema.module.courseId, cohort.course.id));

			const totalLessons = Number(totalLessonsResult[0]?.count ?? 1);

			let atRiskCount = 0;
			for (const enrollment of enrollmentsResult) {
				const enrolledDate = new Date(enrollment.enrolledAt);
				if (enrolledDate > threeWeeksAgo) continue; // not yet 3 weeks

				const progressResult = await db
					.select({ count: count() })
					.from(schema.lessonProgress)
					.where(
						and(
							eq(schema.lessonProgress.userId, enrollment.userId),
							eq(schema.lessonProgress.courseId, cohort.course.id),
							sql`${schema.lessonProgress.completedAt} IS NOT NULL`
						)
					);

				const completed = Number(progressResult[0]?.count ?? 0);
				const pct = totalLessons > 0 ? (completed / totalLessons) * 100 : 0;
				if (pct < 30) atRiskCount++;
			}

			return {
				...cohort,
				studentCount,
				atRiskCount
			};
		})
	);

	return {
		memberships,
		cohorts: cohortsWithStats
	};
};
