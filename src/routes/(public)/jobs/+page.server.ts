import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Get all public job postings
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
		.where(and(eq(schema.jobPosting.visibility, 'public'), eq(schema.jobPosting.status, 'active')))
		.orderBy(desc(schema.jobPosting.createdAt))
		.limit(50);

	return { jobs };
};
