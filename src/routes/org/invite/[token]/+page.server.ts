import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
	const { token } = params;
	const user = locals.user;

	// Find the invitation
	const invitation = await db.query.organizationInvitation.findFirst({
		where: eq(schema.organizationInvitation.token, token),
		with: {
			organization: true
		}
	});

	if (!invitation) {
		throw error(404, 'Invitation not found or has been revoked');
	}

	// Check if expired
	if (new Date(invitation.expiresAt) < new Date()) {
		throw error(410, 'This invitation has expired');
	}

	// Get organization details
	const org = await db.query.organization.findFirst({
		where: eq(schema.organization.id, invitation.orgId)
	});

	if (!org) {
		throw error(404, 'Organization not found');
	}

	// If user is logged in, process the invitation
	if (user) {
		// Check if already a member
		const existingMember = await db.query.organizationMember.findFirst({
			where: and(
				eq(schema.organizationMember.orgId, invitation.orgId),
				eq(schema.organizationMember.userId, user.id)
			)
		});

		if (existingMember) {
			// Delete the invitation and redirect
			await db.delete(schema.organizationInvitation)
				.where(eq(schema.organizationInvitation.id, invitation.id));

			// Switch to this workspace
			cookies.set('active-workspace', invitation.orgId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7,
				sameSite: 'lax'
			});

			throw redirect(302, '/app');
		}

		// Check if email matches
		if (user.email !== invitation.email) {
			throw error(403, 'This invitation was sent to a different email address. Please log in with ' + invitation.email);
		}

		// Add user as member
		const generateMemberId = () => 'mem-' + Math.random().toString(36).substring(2, 11);
		
		await db.insert(schema.organizationMember).values({
			id: generateMemberId(),
			orgId: invitation.orgId,
			userId: user.id,
			role: invitation.role,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		// Delete the used invitation
		await db.delete(schema.organizationInvitation)
			.where(eq(schema.organizationInvitation.id, invitation.id));

		// Switch to this workspace
		cookies.set('active-workspace', invitation.orgId, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			sameSite: 'lax'
		});

		// Update user's last workspace
		await db.update(schema.user)
			.set({ lastWorkspaceId: invitation.orgId })
			.where(eq(schema.user.id, user.id));

		throw redirect(302, '/app');
	}

	// Not logged in - show invitation page
	return {
		invitation: {
			id: invitation.id,
			email: invitation.email,
			role: invitation.role,
			expiresAt: invitation.expiresAt
		},
		organization: {
			id: org.id,
			name: org.name,
			slug: org.slug,
			logoUrl: org.logoUrl,
			brandColor: org.brandColor
		}
	};
};
