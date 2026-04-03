import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';
import { requireOrgFacilitator } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const orgId = event.params.id;
	const membership = await requireOrgFacilitator(event, orgId);
	const user = event.locals.user!;

	const cohorts = await db
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
		.where(and(eq(schema.organization.id, orgId), eq(schema.cohort.facilitatorId, user.id)))
		.orderBy(schema.cohort.startDate);

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
					.where(and(eq(schema.enrollment.cohortId, cohort.id), eq(schema.enrollment.orgId, orgId))),
				db
					.select({
						userId: schema.enrollment.userId,
						enrolledAt: schema.enrollment.enrolledAt
					})
					.from(schema.enrollment)
					.where(
						and(
							eq(schema.enrollment.cohortId, cohort.id),
							eq(schema.enrollment.orgId, orgId),
							eq(schema.enrollment.status, 'active')
						)
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
		cohorts: cohortsWithStats
	};
};
