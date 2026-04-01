import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;

	// Check if user is owner or admin
	const membership = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id))
		)
		.limit(1);

	if (membership.length === 0 || !['owner', 'admin'].includes(membership[0].role)) {
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

	// Get pending invitations
	const invitations = await db
		.select()
		.from(schema.organizationInvitation)
		.where(eq(schema.organizationInvitation.orgId, orgId));

	return {
		organization: org[0],
		membership: membership[0],
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

		// Validate role
		const validRoles = ['admin', 'creator', 'facilitator', 'member'];
		if (!validRoles.includes(role)) {
			return actionFailure(400, 'Invalid role.');
		}

		// Check for existing pending invitation
		const existingInvitation = await db
			.select()
			.from(schema.organizationInvitation)
			.where(
				and(
					eq(schema.organizationInvitation.orgId, orgId),
					eq(schema.organizationInvitation.email, email)
				)
			)
			.limit(1);

		if (existingInvitation.length > 0) {
			// Check if not expired
			if (new Date(existingInvitation[0].expiresAt) > new Date()) {
				return actionFailure(400, 'Invitation already sent to this email.');
			}
			// Delete expired invitation
			await db
				.delete(schema.organizationInvitation)
				.where(eq(schema.organizationInvitation.id, existingInvitation[0].id));
		}

		// Create invitation token
		const token = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(20)));
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

		await db.insert(schema.organizationInvitation).values({
			id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10))),
			orgId,
			email: email.trim().toLowerCase(),
			role,
			invitedBy: user.id,
			token,
			expiresAt,
			createdAt: new Date()
		});

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

		// Delete invitation
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
