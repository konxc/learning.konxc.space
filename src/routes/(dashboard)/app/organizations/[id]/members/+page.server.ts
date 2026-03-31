import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;

	// Check if user is a member
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

	// Get all members with user info
	const members = await db
		.select({
			id: schema.organizationMember.id,
			role: schema.organizationMember.role,
			createdAt: schema.organizationMember.createdAt,
			user: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email
			}
		})
		.from(schema.organizationMember)
		.innerJoin(schema.user, eq(schema.organizationMember.userId, schema.user.id))
		.where(eq(schema.organizationMember.orgId, orgId));

	return {
		organization: org[0],
		membership: membership[0],
		members
	};
};

export const actions: Actions = {
	leave: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;

		// Get user's membership
		const membership = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, user.id)
				)
			)
			.limit(1);

		if (membership.length === 0) {
			return actionFailure(404, 'You are not a member of this organization.');
		}

		// Owner cannot leave - must transfer ownership first
		if (membership[0].role === 'owner') {
			return actionFailure(
				400,
				'Owner cannot leave. Transfer ownership first or delete the organization.'
			);
		}

		// Delete membership
		await db
			.delete(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, user.id)
				)
			);

		return actionSuccess({ message: 'Successfully left the organization.' });
	},

	removeMember: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;
		const formData = await event.request.formData();
		const memberId = formData.get('memberId') as string;

		if (!memberId) {
			return actionFailure(400, 'Member ID is required.');
		}

		// Verify user is owner or admin
		const membership = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, user.id)
				)
			)
			.limit(1);

		if (membership.length === 0 || !['owner', 'admin'].includes(membership[0].role)) {
			return actionFailure(403, 'Unauthorized.');
		}

		// Get target member
		const targetMember = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.id, memberId))
			)
			.limit(1);

		if (targetMember.length === 0) {
			return actionFailure(404, 'Member not found.');
		}

		// Cannot remove owner
		if (targetMember[0].role === 'owner') {
			return actionFailure(400, 'Cannot remove the owner.');
		}

		// Admin can only remove members/facilitators, owner can remove anyone except themselves
		if (membership[0].role === 'admin' && ['admin', 'creator'].includes(targetMember[0].role)) {
			return actionFailure(403, 'Cannot remove admin or creator.');
		}

		// Delete member
		await db.delete(schema.organizationMember).where(eq(schema.organizationMember.id, memberId));

		return actionSuccess({ message: 'Member removed successfully.' });
	}
};
