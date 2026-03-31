import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get jobs created by user with applications
	const jobs = await db
		.select({
			id: schema.jobPosting.id,
			title: schema.jobPosting.title,
			status: schema.jobPosting.status,
			orgId: schema.jobPosting.orgId
		})
		.from(schema.jobPosting)
		.where(eq(schema.jobPosting.createdBy, user.id));

	const jobIds = jobs.map((j) => j.id);

	// Get all applications for user's jobs
	const applications =
		jobIds.length > 0
			? await db
					.select({
						id: schema.jobApplication.id,
						status: schema.jobApplication.status,
						coverLetter: schema.jobApplication.coverLetter,
						proposedRole: schema.jobApplication.proposedRole,
						createdAt: schema.jobApplication.createdAt,
						user: {
							id: schema.user.id,
							username: schema.user.username,
							fullName: schema.user.fullName,
							email: schema.user.email
						},
						job: {
							id: schema.jobPosting.id,
							title: schema.jobPosting.title
						}
					})
					.from(schema.jobApplication)
					.innerJoin(schema.user, eq(schema.jobApplication.userId, schema.user.id))
					.innerJoin(schema.jobPosting, eq(schema.jobApplication.jobId, schema.jobPosting.id))
					.where(eq(schema.jobPosting.createdBy, user.id))
					.orderBy(desc(schema.jobApplication.createdAt))
			: [];

	return {
		jobs,
		applications
	};
};

export const actions: Actions = {
	updateStatus: async (event) => {
		const user = await requireAuth(event);
		const formData = await event.request.formData();
		const applicationId = formData.get('applicationId') as string;
		const newStatus = formData.get('status') as string;

		if (!applicationId || !newStatus) {
			return actionFailure(400, 'Application ID and status are required.');
		}

		const validStatuses = ['pending', 'reviewed', 'interview', 'accepted', 'rejected'];
		if (!validStatuses.includes(newStatus)) {
			return actionFailure(400, 'Invalid status.');
		}

		// Verify user owns the job
		const application = await db
			.select({
				id: schema.jobApplication.id,
				job: {
					createdBy: schema.jobPosting.createdBy
				}
			})
			.from(schema.jobApplication)
			.innerJoin(schema.jobPosting, eq(schema.jobApplication.jobId, schema.jobPosting.id))
			.where(eq(schema.jobApplication.id, applicationId))
			.limit(1);

		if (!application[0] || application[0].job.createdBy !== user.id) {
			return actionFailure(403, 'Unauthorized.');
		}

		await db
			.update(schema.jobApplication)
			.set({ status: newStatus, updatedAt: new Date() })
			.where(eq(schema.jobApplication.id, applicationId));

		return actionSuccess({ message: `Application status updated to ${newStatus}.` });
	},

	inviteToOrg: async (event) => {
		const user = await requireAuth(event);
		const formData = await event.request.formData();
		const applicationId = formData.get('applicationId') as string;

		if (!applicationId) {
			return actionFailure(400, 'Application ID is required.');
		}

		// Get application with job and user info
		const application = await db
			.select({
				id: schema.jobApplication.id,
				proposedRole: schema.jobApplication.proposedRole,
				userId: schema.jobApplication.userId,
				job: {
					orgId: schema.jobPosting.orgId,
					createdBy: schema.jobPosting.createdBy
				}
			})
			.from(schema.jobApplication)
			.innerJoin(schema.jobPosting, eq(schema.jobApplication.jobId, schema.jobPosting.id))
			.where(eq(schema.jobApplication.id, applicationId))
			.limit(1);

		if (!application[0] || application[0].job.createdBy !== user.id) {
			return actionFailure(403, 'Unauthorized.');
		}

		// Check if user is already a member
		const existingMember = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, application[0].job.orgId),
					eq(schema.organizationMember.userId, application[0].userId)
				)
			)
			.limit(1);

		if (existingMember.length > 0) {
			return actionFailure(400, 'User is already a member of this organization.');
		}

		// Add user to organization with proposed role
		const memberId = `mem-${Date.now()}`;
		await db.insert(schema.organizationMember).values({
			id: memberId,
			orgId: application[0].job.orgId,
			userId: application[0].userId,
			role: application[0].proposedRole || 'member',
			createdAt: new Date(),
			updatedAt: new Date()
		});

		// Update application status to accepted
		await db
			.update(schema.jobApplication)
			.set({ status: 'accepted', updatedAt: new Date() })
			.where(eq(schema.jobApplication.id, applicationId));

		return actionSuccess({ message: 'User invited to organization successfully!' });
	}
};
