import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { requireOrgAdmin } from '$lib/server/middleware';
import { ORG_ROLES } from '$lib/constants/roles';
import type { OrgRole } from '$lib/constants/roles';

export const load: PageServerLoad = async (event) => {
	const orgId = event.params.id;

	// Permission: must be admin or owner to manage members
	const membership = await requireOrgAdmin(event, orgId);
	const { organization } = await event.parent();

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
		organization,
		membership,
		members,
		pendingInvitations
	};
};

export const actions: Actions = {
	leave: async (event) => {
		const { locals, params } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;

		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, user.id)
				)
			)
			.limit(1);

		if (!membership) {
			return actionFailure(404, 'You are not a member of this organization.');
		}

		if (membership.role === 'owner') {
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
		const { params, request } = event;
		const orgId = params.id;

		// Verify membership via centralized helper
		const membership = await requireOrgAdmin(event, orgId);

		const formData = await request.formData();
		const targetUserId = formData.get('userId') as string;
		const newRole = formData.get('role') as string;

		if (!targetUserId || !newRole) {
			return actionFailure(400, 'User ID and role are required.');
		}

		// Validate role
		if (!ORG_ROLES.includes(newRole as OrgRole)) {
			return actionFailure(400, 'Role tidak valid');
		}

		// Get target member
		const [targetMember] = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, targetUserId)
				)
			)
			.limit(1);

		if (!targetMember) {
			return actionFailure(404, 'Member not found in this organization.');
		}

		// Cannot change owner's role
		if (targetMember.role === 'owner') {
			return actionFailure(400, "Cannot change the owner's role.");
		}

		await db
			.update(schema.organizationMember)
			.set({ role: newRole as OrgRole })
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, targetUserId)
				)
			);

		return actionSuccess({ message: 'Role berhasil diubah' });
	},

	removeMember: async (event) => {
		const { locals, params, request } = event;
		const user = locals.user!;
		const orgId = params.id;

		// Verify membership via centralized helper
		const membership = await requireOrgAdmin(event, orgId);

		const formData = await request.formData();
		const memberId = formData.get('memberId') as string;

		if (!memberId) {
			return actionFailure(400, 'Member ID is required.');
		}

		// Get target member
		const [targetMember] = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.id, memberId))
			)
			.limit(1);

		if (!targetMember) {
			return actionFailure(404, 'Member not found.');
		}

		// Cannot remove owner
		if (targetMember.role === 'owner') {
			return actionFailure(400, 'Cannot remove the owner.');
		}

		// Cannot remove self
		if (targetMember.userId === user.id) {
			return actionFailure(400, 'Cannot remove yourself. Use leave instead.');
		}

		// Admin cannot remove other admins or owners
		if (membership.role === 'admin' && targetMember.role === 'admin') {
			return actionFailure(403, 'Admin cannot remove other admins.');
		}

		await db.delete(schema.organizationMember).where(
			and(
				eq(schema.organizationMember.id, memberId),
				eq(schema.organizationMember.orgId, orgId)
			)
		);

		return actionSuccess({ message: 'Member removed successfully.' });
	},

	cancelInvite: async (event) => {
		const { params, request } = event;
		const orgId = params.id;

		// Verify membership via centralized helper
		const membership = await requireOrgAdmin(event, orgId);

		const formData = await request.formData();
		const invitationId = formData.get('invitationId') as string;

		if (!invitationId) {
			return actionFailure(400, 'Invitation ID is required.');
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
