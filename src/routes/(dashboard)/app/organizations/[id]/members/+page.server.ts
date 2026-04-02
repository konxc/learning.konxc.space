import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { getMembership } from '$lib/server/org-utils';
import { hasOrgPermission } from '$lib/server/rbac';
import { ORG_ROLES } from '$lib/constants/roles';
import type { OrgRole } from '$lib/constants/roles';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;

	// Auth: must be member (throws redirect if not)
	const membership = await getMembership(user.id, orgId);

	// Permission: must have member:read
	if (!hasOrgPermission(membership.role, 'member:read')) {
		throw redirect(303, `/app/organizations/${orgId}`);
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
			userId: schema.organizationMember.userId,
			role: schema.organizationMember.role,
			createdAt: schema.organizationMember.createdAt,
			user: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email,
				avatarUrl: schema.user.avatarUrl
			}
		})
		.from(schema.organizationMember)
		.innerJoin(schema.user, eq(schema.organizationMember.userId, schema.user.id))
		.where(eq(schema.organizationMember.orgId, orgId));

	// Get pending invitations
	const pendingInvitations = await db
		.select()
		.from(schema.organizationInvitation)
		.where(eq(schema.organizationInvitation.orgId, orgId));

	return {
		organization: org[0],
		membership,
		members,
		pendingInvitations
	};
};

export const actions: Actions = {
	leave: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;

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

		if (membership[0].role === 'owner') {
			return actionFailure(
				400,
				'Owner cannot leave. Transfer ownership first or delete the organization.'
			);
		}

		await db
			.delete(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, user.id)
				)
			);

		throw redirect(303, '/app/organizations');
	},

	changeRole: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;
		const formData = await event.request.formData();
		const targetUserId = formData.get('userId') as string;
		const newRole = formData.get('role') as string;

		if (!targetUserId || !newRole) {
			return actionFailure(400, 'User ID and role are required.');
		}

		// Get requester's membership
		const membership = await getMembership(user.id, orgId);

		if (!hasOrgPermission(membership.role, 'member:update')) {
			return actionFailure(403, 'Unauthorized.');
		}

		// Validate role
		if (!ORG_ROLES.includes(newRole as OrgRole)) {
			return actionFailure(400, 'Role tidak valid');
		}

		// Get target member
		const targetMember = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, targetUserId)
				)
			)
			.limit(1);

		if (targetMember.length === 0) {
			return actionFailure(404, 'Member not found.');
		}

		// Cannot change owner's role
		if (targetMember[0].role === 'owner') {
			return actionFailure(400, "Cannot change the owner's role.");
		}

		await db
			.update(schema.organizationMember)
			.set({ role: newRole })
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, targetUserId)
				)
			);

		return actionSuccess({ message: 'Role berhasil diubah' });
	},

	removeMember: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;
		const formData = await event.request.formData();
		const memberId = formData.get('memberId') as string;

		if (!memberId) {
			return actionFailure(400, 'Member ID is required.');
		}

		// Get requester's membership
		const membership = await getMembership(user.id, orgId);

		if (!hasOrgPermission(membership.role, 'member:delete')) {
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

		// Cannot remove self
		if (targetMember[0].userId === user.id) {
			return actionFailure(400, 'Cannot remove yourself. Use leave instead.');
		}

		// Admin cannot remove other admins or owners
		if (membership.role === 'admin' && targetMember[0].role === 'admin') {
			return actionFailure(403, 'Admin cannot remove other admins.');
		}

		await db.delete(schema.organizationMember).where(eq(schema.organizationMember.id, memberId));

		return actionSuccess({ message: 'Member removed successfully.' });
	},

	cancelInvite: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;
		const formData = await event.request.formData();
		const invitationId = formData.get('invitationId') as string;

		if (!invitationId) {
			return actionFailure(400, 'Invitation ID is required.');
		}

		// Get requester's membership
		const membership = await getMembership(user.id, orgId);

		if (!hasOrgPermission(membership.role, 'member:create')) {
			return actionFailure(403, 'Unauthorized.');
		}

		await db
			.delete(schema.organizationInvitation)
			.where(
				and(
					eq(schema.organizationInvitation.id, invitationId),
					eq(schema.organizationInvitation.orgId, orgId)
				)
			);

		return actionSuccess({ message: 'Undangan dibatalkan' });
	}
};
