import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get organizations where user is owner/admin
	const memberships = await db
		.select({
			orgId: schema.organizationMember.orgId,
			role: schema.organizationMember.role,
			organization: {
				id: schema.organization.id,
				name: schema.organization.name
			}
		})
		.from(schema.organizationMember)
		.innerJoin(schema.organization, eq(schema.organizationMember.orgId, schema.organization.id))
		.where(
			and(
				eq(schema.organizationMember.userId, user.id),
				eq(schema.organizationMember.role, 'owner')
			)
		);

	if (memberships.length === 0) {
		throw redirect(303, '/app');
	}

	// Get jobs from user's organizations
	const orgIds = memberships.map((m) => m.orgId);
	const jobs = await db
		.select({
			id: schema.jobPosting.id,
			title: schema.jobPosting.title,
			status: schema.jobPosting.status,
			visibility: schema.jobPosting.visibility,
			jobType: schema.jobPosting.jobType,
			createdAt: schema.jobPosting.createdAt,
			organization: {
				name: schema.organization.name
			}
		})
		.from(schema.jobPosting)
		.innerJoin(schema.organization, eq(schema.jobPosting.orgId, schema.organization.id))
		.where(eq(schema.jobPosting.createdBy, user.id))
		.orderBy(desc(schema.jobPosting.createdAt));

	return {
		memberships: memberships.map((m) => m.organization),
		jobs
	};
};

export const actions: Actions = {
	create: async (event) => {
		const user = await requireAuth(event);
		const formData = await event.request.formData();

		const orgId = formData.get('orgId') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const jobType = formData.get('jobType') as string;
		const visibility = formData.get('visibility') as string;
		const location = formData.get('location') as string;
		const isRemote = formData.get('isRemote') === 'true';
		const salaryMin = formData.get('salaryMin')
			? parseInt(formData.get('salaryMin') as string)
			: null;
		const salaryMax = formData.get('salaryMax')
			? parseInt(formData.get('salaryMax') as string)
			: null;

		if (!orgId || !title || !description) {
			return actionFailure(400, 'Organization, title and description are required.');
		}

		// Verify user is owner of the org
		const membership = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, user.id),
					eq(schema.organizationMember.role, 'owner')
				)
			)
			.limit(1);

		if (membership.length === 0) {
			return actionFailure(403, 'Only organization owner can post jobs.');
		}

		const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.jobPosting).values({
			id,
			orgId,
			title: title.trim(),
			description: description.trim(),
			jobType: jobType || 'full-time',
			visibility: visibility || 'internal',
			location: location || null,
			isRemote,
			salaryMin,
			salaryMax,
			status: 'active',
			createdBy: user.id,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return actionSuccess({ message: 'Job posted successfully!' });
	},

	closeJob: async (event) => {
		const user = await requireAuth(event);
		const formData = await event.request.formData();
		const jobId = formData.get('jobId') as string;

		if (!jobId) {
			return actionFailure(400, 'Job ID is required.');
		}

		// Verify ownership
		const job = await db
			.select()
			.from(schema.jobPosting)
			.where(and(eq(schema.jobPosting.id, jobId), eq(schema.jobPosting.createdBy, user.id)))
			.limit(1);

		if (job.length === 0) {
			return actionFailure(404, 'Job not found or unauthorized.');
		}

		await db
			.update(schema.jobPosting)
			.set({ status: 'closed', updatedAt: new Date() })
			.where(eq(schema.jobPosting.id, jobId));

		return actionSuccess({ message: 'Job closed successfully.' });
	}
};
