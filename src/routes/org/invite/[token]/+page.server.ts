import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

/**
 * Auto-create affiliate account for mentor/facilitator
 * This enables them to earn commission by sharing links
 */
async function createAutoAffiliateAccount(
	userId: string,
	orgId: string,
	role: string
): Promise<void> {
	// Only create for mentor or facilitator
	if (role !== 'mentor' && role !== 'facilitator') {
		return;
	}

	// Check if already has affiliate account for this org
	const existing = await db.query.affiliateAccount.findFirst({
		where: and(eq(schema.affiliateAccount.userId, userId), eq(schema.affiliateAccount.orgId, orgId))
	});

	if (existing) {
		return; // Already exists
	}

	// Create affiliate account
	const accountId = generateId();
	await db.insert(schema.affiliateAccount).values({
		id: accountId,
		userId,
		orgId,
		role,
		commissionRate: 25, // Default 25%
		tier: 'bronze',
		isActive: true
	});

	// Auto-generate affiliate links for all org courses
	const orgCourses = await db.query.course.findMany({
		where: eq(schema.course.orgId, orgId)
	});

	for (const course of orgCourses) {
		const linkCode = `${role}-${userId.substring(0, 6)}-${course.id.substring(0, 6)}`;
		await db.insert(schema.autoAffiliateLink).values({
			id: generateId(),
			accountId,
			courseId: course.id,
			orgId,
			code: linkCode,
			url: `https://naikkelas.id/c/${linkCode}`,
			isActive: true
		});
	}

	// Create affiliate link for organization landing page
	const orgLinkCode = `${role}-${userId.substring(0, 6)}-org`;
	await db.insert(schema.autoAffiliateLink).values({
		id: generateId(),
		accountId,
		courseId: null,
		orgId,
		code: orgLinkCode,
		url: `https://naikkelas.id/o/${orgLinkCode}`,
		isActive: true
	});
}

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
		// Check if already a member (any role)
		const existingMember = await db.query.organizationMember.findFirst({
			where: and(
				eq(schema.organizationMember.orgId, invitation.orgId),
				eq(schema.organizationMember.userId, user.id)
			)
		});

		if (existingMember) {
			// Check if trying to invite as mentor/facilitator when already has a role
			const isMentorOrFacilitatorInvite =
				invitation.role === 'mentor' || invitation.role === 'facilitator';
			const isExistingMentorOrFacilitator =
				existingMember.role === 'mentor' || existingMember.role === 'facilitator';

			if (isMentorOrFacilitatorInvite && isExistingMentorOrFacilitator) {
				throw error(
					403,
					'Anda sudah memiliki peran di organisasi ini. Tidak dapat menerima undangan untuk peran lain.'
				);
			}

			// Delete the invitation and redirect
			await db
				.delete(schema.organizationInvitation)
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
			throw error(
				403,
				'This invitation was sent to a different email address. Please log in with ' +
					invitation.email
			);
		}

		// Add user as member
		const memberId = generateId();

		await db.insert(schema.organizationMember).values({
			id: memberId,
			orgId: invitation.orgId,
			userId: user.id,
			role: invitation.role,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		// Auto-create affiliate account for mentor/facilitator
		await createAutoAffiliateAccount(user.id, invitation.orgId, invitation.role);

		// Delete the used invitation
		await db
			.delete(schema.organizationInvitation)
			.where(eq(schema.organizationInvitation.id, invitation.id));

		// Switch to this workspace
		cookies.set('active-workspace', invitation.orgId, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			sameSite: 'lax'
		});

		// Update user's last workspace and role (for mentor/facilitator invitations)
		const needsRoleUpdate =
			(invitation.role === 'mentor' || invitation.role === 'facilitator') &&
			user.role !== 'mentor' &&
			user.role !== 'facilitator' &&
			user.role !== 'admin';

		await db
			.update(schema.user)
			.set({
				lastWorkspaceId: invitation.orgId,
				...(needsRoleUpdate ? { role: invitation.role, onboardingCompleted: false } : {})
			})
			.where(eq(schema.user.id, user.id));

		// Redirect to appropriate onboarding based on role
		if (invitation.role === 'mentor' || invitation.role === 'facilitator') {
			throw redirect(302, `/onboarding?org=${invitation.orgId}&role=${invitation.role}`);
		}

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
