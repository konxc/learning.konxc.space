import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

export const load: PageServerLoad = async (event) => {
	const token = event.url.searchParams.get('token');

	if (!token) {
		throw redirect(303, '/app');
	}

	if (!event.locals.user) {
		throw redirect(303, `/auth/signin?redirect=/org/invite?token=${token}`);
	}

	const invitationResult = await db
		.select()
		.from(schema.organizationInvitation)
		.where(eq(schema.organizationInvitation.token, token))
		.limit(1);

	if (!invitationResult.length) {
		return { error: 'invalid_token', invitation: null, org: null };
	}

	const invitation = invitationResult[0];

	if (invitation.expiresAt < new Date()) {
		return { error: 'expired', invitation, org: null };
	}

	const orgResult = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.id, invitation.orgId))
		.limit(1);

	return { error: null, invitation, org: orgResult[0] ?? null };
};

export const actions: Actions = {
	accept: async (event) => {
		const token = event.url.searchParams.get('token');

		if (!event.locals.user) {
			return actionFailure(401, 'Login diperlukan');
		}

		if (!token) {
			return actionFailure(400, 'Token tidak valid');
		}

		const invitationResult = await db
			.select()
			.from(schema.organizationInvitation)
			.where(eq(schema.organizationInvitation.token, token))
			.limit(1);

		if (!invitationResult.length) {
			return actionFailure(400, 'Undangan tidak valid atau sudah digunakan');
		}

		const invitation = invitationResult[0];

		if (invitation.expiresAt < new Date()) {
			return actionFailure(400, 'Undangan sudah kedaluwarsa');
		}

		// Check if user is already a member
		const existing = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, invitation.orgId),
					eq(schema.organizationMember.userId, event.locals.user.id)
				)
			)
			.limit(1);

		if (existing.length > 0) {
			throw redirect(303, `/app/organizations/${invitation.orgId}`);
		}

		await db.insert(schema.organizationMember).values({
			id: generateId(),
			orgId: invitation.orgId,
			userId: event.locals.user.id,
			role: invitation.role
		});

		await db
			.delete(schema.organizationInvitation)
			.where(eq(schema.organizationInvitation.token, token));

		throw redirect(303, `/app/organizations/${invitation.orgId}`);
	}
};
