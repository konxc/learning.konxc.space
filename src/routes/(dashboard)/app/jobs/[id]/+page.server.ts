import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, error } from '@sveltejs/kit';
import { actionSuccess, actionFailure } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const jobId = event.params.id;

	// Get job with organization info
	const job = await db
		.select({
			id: schema.jobPosting.id,
			orgId: schema.jobPosting.orgId,
			title: schema.jobPosting.title,
			description: schema.jobPosting.description,
			requirements: schema.jobPosting.requirements,
			responsibilities: schema.jobPosting.responsibilities,
			salaryMin: schema.jobPosting.salaryMin,
			salaryMax: schema.jobPosting.salaryMax,
			jobType: schema.jobPosting.jobType,
			location: schema.jobPosting.location,
			isRemote: schema.jobPosting.isRemote,
			visibility: schema.jobPosting.visibility,
			status: schema.jobPosting.status,
			createdAt: schema.jobPosting.createdAt,
			expiresAt: schema.jobPosting.expiresAt,
			organization: {
				id: schema.organization.id,
				name: schema.organization.name,
				logoUrl: schema.organization.logoUrl,
				slug: schema.organization.slug
			}
		})
		.from(schema.jobPosting)
		.innerJoin(schema.organization, eq(schema.jobPosting.orgId, schema.organization.id))
		.where(eq(schema.jobPosting.id, jobId))
		.limit(1);

	if (!job[0]) {
		throw error(404, 'Job not found');
	}

	// Check if job is active
	if (job[0].status !== 'active') {
		throw error(404, 'This job posting is no longer active');
	}

	// Check if user has already applied
	const existingApplication = await db
		.select({ id: schema.jobApplication.id, status: schema.jobApplication.status })
		.from(schema.jobApplication)
		.where(and(eq(schema.jobApplication.jobId, jobId), eq(schema.jobApplication.userId, user.id)))
		.limit(1);

	// Check if user is member of the org
	const membership = await db
		.select({ role: schema.organizationMember.role })
		.from(schema.organizationMember)
		.where(
			and(
				eq(schema.organizationMember.orgId, job[0].orgId),
				eq(schema.organizationMember.userId, user.id)
			)
		)
		.limit(1);

	return {
		job: job[0],
		hasApplied: existingApplication.length > 0,
		application: existingApplication[0] || null,
		isOrgMember: membership.length > 0
	};
};

export const actions: Actions = {
	apply: async (event) => {
		const user = await requireAuth(event);
		const jobId = event.params.id;
		const formData = await event.request.formData();

		const coverLetter = (formData.get('coverLetter') as string) || null;
		const resumeUrl = (formData.get('resumeUrl') as string) || null;
		const portfolioUrl = (formData.get('portfolioUrl') as string) || null;
		const proposedRole = (formData.get('proposedRole') as string) || null;

		// Check job exists and is active
		const job = await db
			.select({ id: schema.jobPosting.id, createdBy: schema.jobPosting.createdBy })
			.from(schema.jobPosting)
			.where(and(eq(schema.jobPosting.id, jobId), eq(schema.jobPosting.status, 'active')))
			.limit(1);

		if (!job[0]) {
			return actionFailure(404, 'Job not found or no longer active');
		}

		// Don't allow applying to own job
		if (job[0].createdBy === user.id) {
			return actionFailure(400, 'You cannot apply to your own job posting');
		}

		// Check if already applied
		const existing = await db
			.select({ id: schema.jobApplication.id })
			.from(schema.jobApplication)
			.where(and(eq(schema.jobApplication.jobId, jobId), eq(schema.jobApplication.userId, user.id)))
			.limit(1);

		if (existing.length > 0) {
			return actionFailure(400, 'You have already applied to this job');
		}

		const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.jobApplication).values({
			id,
			jobId,
			userId: user.id,
			coverLetter: coverLetter?.trim() || null,
			resumeUrl: resumeUrl?.trim() || null,
			portfolioUrl: portfolioUrl?.trim() || null,
			proposedRole: proposedRole?.trim() || null,
			status: 'pending',
			createdAt: new Date(),
			updatedAt: new Date()
		});

		// Notify the job poster
		await db.insert(schema.notification).values({
			id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10))),
			userId: job[0].createdBy,
			type: 'submission',
			title: 'Lamaran Baru',
			message: `${user.fullName || user.username} melamar untuk posisi Anda`,
			link: '/app/jobs/applications',
			read: false,
			createdAt: new Date()
		});

		return actionSuccess({ message: 'Lamaran berhasil dikirim!' });
	},

	withdraw: async (event) => {
		const user = await requireAuth(event);
		const jobId = event.params.id;

		await db
			.delete(schema.jobApplication)
			.where(
				and(
					eq(schema.jobApplication.jobId, jobId),
					eq(schema.jobApplication.userId, user.id),
					eq(schema.jobApplication.status, 'pending')
				)
			);

		return actionSuccess({ message: 'Lamaran berhasil ditarik' });
	}
};
