import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Only facilitator, mentor, and admin can access
	if (!['facilitator', 'mentor', 'admin'].includes(user.role)) {
		throw redirect(303, '/app/overview');
	}

	// Get user's organizations where they are a facilitator
	const memberships = await db
		.select({
			orgId: schema.organizationMember.orgId,
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
				eq(schema.organizationMember.role, 'facilitator')
			)
		);

	const orgIds = memberships.map((m) => m.orgId);

	// Get cohorts where user is facilitator
	const cohorts =
		orgIds.length > 0
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

	// Get student counts for each cohort
	const cohortsWithStats = await Promise.all(
		cohorts.map(async (cohort) => {
			const studentCount = await db
				.select({ count: count() })
				.from(schema.enrollment)
				.where(eq(schema.enrollment.cohortId, cohort.id));

			return {
				...cohort,
				studentCount: Number(studentCount[0]?.count || 0)
			};
		})
	);

	return {
		memberships,
		cohorts: cohortsWithStats
	};
};
