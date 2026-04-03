import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { requireOrgAdmin } from '$lib/server/middleware';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { ORG_ROLES } from '$lib/constants/roles';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

export const load: PageServerLoad = async (event) => {
	const orgId = event.params.id;

	const membership = await requireOrgAdmin(event, orgId);
	const { organization } = await event.parent();

	const invitations = await db
		.select()
		.from(schema.organizationInvitation)
		.where(eq(schema.organizationInvitation.orgId, orgId));

	return {
		organization,
		membership,
		invitations
	};
};

export const actions: Actions = {
	sendInvite: async (event) => {
		const { locals, params, request } = event;
		const user = locals.user!;
		const orgId = params.id;

		// Verify membership via centralized helper
		const membership = await requireOrgAdmin(event, orgId);

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const role = formData.get('role') as string;

		if (!email || !role) {
			return actionFailure(400, 'Email and role are required.');
		}

		// Valid roles: all ORG_ROLES except 'owner'
		const validRoles = ORG_ROLES.filter((r) => r !== 'owner');
		if (!validRoles.includes(role as (typeof validRoles)[number])) {
			return actionFailure(400, 'Invalid role.');
		}

		// Get org for notification message
		const [org] = await db
			.select()
			.from(schema.organization)
			.where(eq(schema.organization.id, orgId))
			.limit(1);

		if (!org) {
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
				title: `Undangan bergabung ke ${org.name}`,
				message: `Anda diundang untuk bergabung sebagai ${role} di ${org.name}`,
				link: `/org/invite?token=${token}`,
				read: false
			});
		}

		return actionSuccess({ message: `Invitation sent to ${email}` });
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

		return actionSuccess({ message: 'Invitation cancelled.' });
	}
};
