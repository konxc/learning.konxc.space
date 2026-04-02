import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { getMembership } from '$lib/server/org-utils';
import { hasOrgPermission } from '$lib/server/rbac';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { ORG_ROLES } from '$lib/constants/roles';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;

	const membership = await getMembership(user.id, orgId);
	if (!hasOrgPermission(membership.role, 'member:create')) {
		throw redirect(303, `/app/organizations/${orgId}`);
	}

	const org = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.id, orgId))
		.limit(1);

	if (!org[0]) {
		throw redirect(303, '/app/organizations');
	}

	const invitations = await db
		.select()
		.from(schema.organizationInvitation)
		.where(eq(schema.organizationInvitation.orgId, orgId));

	return {
		organization: org[0],
		membership,
		invitations
	};
};

export const actions: Actions = {
	sendInvite: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;

		const formData = await event.request.formData();
		const email = formData.get('email') as string;
		const role = formData.get('role') as string;

		if (!email || !role) {
			return actionFailure(400, 'Email and role are required.');
		}

		const membership = await getMembership(user.id, orgId);
		if (!hasOrgPermission(membership.role, 'member:create')) {
			return actionFailure(403, 'Unauthorized.');
		}

		// Valid roles: all ORG_ROLES except 'owner'
		const validRoles = ORG_ROLES.filter((r) => r !== 'owner');
		if (!validRoles.includes(role as (typeof validRoles)[number])) {
			return actionFailure(400, 'Invalid role.');
		}

		// Get org for notification message
		const org = await db
			.select()
			.from(schema.organization)
			.where(eq(schema.organization.id, orgId))
			.limit(1);

		if (!org[0]) {
			return actionFailure(404, 'Organization not found.');
		}

		// Check for existing pending invitation
		const existingInvitation = await db
			.select()
			.from(schema.organizationInvitation)
			.where(
				and(
					eq(schema.organizationInvitation.orgId, orgId),
					eq(schema.organizationInvitation.email, email.trim().toLowerCase())
				)
			)
			.limit(1);

		if (existingInvitation.length > 0) {
			if (new Date(existingInvitation[0].expiresAt) > new Date()) {
				return actionFailure(400, 'Invitation already sent to this email.');
			}
			// Delete expired invitation
			await db
				.delete(schema.organizationInvitation)
				.where(eq(schema.organizationInvitation.id, existingInvitation[0].id));
		}

		const token = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(32)));
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

		await db.insert(schema.organizationInvitation).values({
			id: generateId(),
			orgId,
			email: email.trim().toLowerCase(),
			role,
			invitedBy: user.id,
			token,
			expiresAt,
			createdAt: new Date()
		});

		// Send in-app notification if user with that email already exists
		const existingUser = await db
			.select({ id: schema.user.id })
			.from(schema.user)
			.where(eq(schema.user.email, email.trim().toLowerCase()))
			.limit(1);

		if (existingUser.length > 0) {
			await db.insert(schema.notification).values({
				id: generateId(),
				userId: existingUser[0].id,
				type: 'org_invitation',
				title: `Undangan bergabung ke ${org[0].name}`,
				message: `Anda diundang untuk bergabung sebagai ${role} di ${org[0].name}`,
				link: `/org/invite?token=${token}`,
				read: false
			});
		}

		return actionSuccess({ message: `Invitation sent to ${email}` });
	},

	cancelInvite: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;
		const formData = await event.request.formData();
		const invitationId = formData.get('invitationId') as string;

		if (!invitationId) {
			return actionFailure(400, 'Invitation ID is required.');
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

		await db
			.delete(schema.organizationInvitation)
			.where(
				and(
					eq(schema.organizationInvitation.id, invitationId),
					eq(schema.organizationInvitation.orgId, orgId)
				)
			);

		return actionSuccess({ message: 'Invitation cancelled.' });
	}
};
