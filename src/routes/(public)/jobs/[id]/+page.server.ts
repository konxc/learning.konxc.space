import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	const jobId = event.params.id;

	// Get job details with organization info
	const job = await db
		.select({
			id: schema.jobPosting.id,
			title: schema.jobPosting.title,
			description: schema.jobPosting.description,
			requirements: schema.jobPosting.requirements,
			responsibilities: schema.jobPosting.responsibilities,
			jobType: schema.jobPosting.jobType,
			location: schema.jobPosting.location,
			isRemote: schema.jobPosting.isRemote,
			salaryMin: schema.jobPosting.salaryMin,
			salaryMax: schema.jobPosting.salaryMax,
			status: schema.jobPosting.status,
			createdAt: schema.jobPosting.createdAt,
			organization: {
				id: schema.organization.id,
				name: schema.organization.name,
				logoUrl: schema.organization.logoUrl
			}
		})
		.from(schema.jobPosting)
		.innerJoin(schema.organization, eq(schema.jobPosting.orgId, schema.organization.id))
		.where(and(eq(schema.jobPosting.id, jobId), eq(schema.jobPosting.status, 'active')))
		.limit(1);

	if (!job[0]) {
		throw redirect(303, '/jobs');
	}

	return { job: job[0] };
};

export const actions: Actions = {
	apply: async (event) => {
		const user = event.locals.user;

		if (!user) {
			return actionFailure(401, 'Please login to apply.');
		}

		const jobId = event.params.id;
		const formData = await event.request.formData();
		const coverLetter = formData.get('coverLetter') as string;
		const portfolioUrl = formData.get('portfolioUrl') as string;
		const proposedRole = formData.get('proposedRole') as string;

		// Check if job exists
		const job = await db
			.select()
			.from(schema.jobPosting)
			.where(and(eq(schema.jobPosting.id, jobId), eq(schema.jobPosting.status, 'active')))
			.limit(1);

		if (!job[0]) {
			return actionFailure(404, 'Job not found or closed.');
		}

		// Check if already applied
		const existingApplication = await db
			.select()
			.from(schema.jobApplication)
			.where(and(eq(schema.jobApplication.jobId, jobId), eq(schema.jobApplication.userId, user.id)))
			.limit(1);

		if (existingApplication.length > 0) {
			return actionFailure(400, 'You have already applied for this position.');
		}

		const applicationId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.jobApplication).values({
			id: applicationId,
			jobId,
			userId: user.id,
			coverLetter: coverLetter || null,
			portfolioUrl: portfolioUrl || null,
			proposedRole: proposedRole || 'member',
			status: 'pending',
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return actionSuccess({ message: 'Application submitted successfully!' });
	}
};
