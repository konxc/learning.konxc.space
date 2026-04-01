import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get all public jobs that user can apply to
	const jobs = await db
		.select({
			id: schema.jobPosting.id,
			title: schema.jobPosting.title,
			description: schema.jobPosting.description,
			jobType: schema.jobPosting.jobType,
			location: schema.jobPosting.location,
			isRemote: schema.jobPosting.isRemote,
			salaryMin: schema.jobPosting.salaryMin,
			salaryMax: schema.jobPosting.salaryMax,
			createdAt: schema.jobPosting.createdAt,
			organization: {
				id: schema.organization.id,
				name: schema.organization.name,
				logoUrl: schema.organization.logoUrl
			}
		})
		.from(schema.jobPosting)
		.innerJoin(schema.organization, eq(schema.jobPosting.orgId, schema.organization.id))
		.where(eq(schema.jobPosting.status, 'active'))
		.orderBy(desc(schema.jobPosting.createdAt))
		.limit(50);

	// Check which jobs user has already applied to
	const applicationIds = await db
		.select({ jobId: schema.jobApplication.jobId })
		.from(schema.jobApplication)
		.where(eq(schema.jobApplication.userId, user.id));

	const appliedJobIds = new Set(applicationIds.map((a) => a.jobId));

	return {
		jobs: jobs.map((j) => ({
			...j,
			hasApplied: appliedJobIds.has(j.id)
		}))
	};
};
