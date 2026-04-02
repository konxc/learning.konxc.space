import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { generateUniqueSlug } from '$lib/server/org-utils';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/signin');
	}

	// Check KTP verification
	const verification = await db.query.userVerification.findFirst({
		where: eq(schema.userVerification.userId, locals.user.id)
	});

	if (verification?.status !== 'approved') {
		throw redirect(303, '/app/verification');
	}

	// Check if user already has an organization
	const existingOrg = await db.query.organizationMember.findFirst({
		where: eq(schema.organizationMember.userId, locals.user.id)
	});

	if (existingOrg) {
		throw redirect(303, `/app/organizations/${existingOrg.orgId}`);
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Verify KTP status
		const verification = await db.query.userVerification.findFirst({
			where: eq(schema.userVerification.userId, locals.user.id)
		});

		if (verification?.status !== 'approved') {
			return fail(403, { error: 'Verifikasi KTP diperlukan untuk membuat organisasi' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const brandColor = formData.get('brandColor') as string;
		const logoBase64 = formData.get('logoBase64') as string;

		// Validation
		if (!name || name.trim().length < 3) {
			return fail(400, { error: 'Nama organisasi minimal 3 karakter' });
		}

		// Parse invite emails
		let inviteEmails: Array<{ email: string; role: string }> = [];
		try {
			const raw = formData.get('inviteEmails') as string;
			inviteEmails = JSON.parse(raw || '[]');
		} catch {
			inviteEmails = [];
		}

		try {
			// Generate unique slug
			const slug = await generateUniqueSlug(name.trim());
			const orgId = generateId();

			// Create organization
			await db.insert(schema.organization).values({
				id: orgId,
				slug,
				name: name.trim(),
				brandColor: brandColor || '#4f46e5',
				logoUrl: logoBase64 || null,
				planType: 'free'
			});

			// Add creator as owner
			await db.insert(schema.organizationMember).values({
				id: generateId(),
				orgId,
				userId: locals.user.id,
				role: 'owner'
			});

			// Process invitations
			for (const invite of inviteEmails) {
				if (!invite.email || !invite.email.includes('@')) continue;

				const tokenBytes = crypto.getRandomValues(new Uint8Array(20));
				const token = encodeBase32LowerCase(tokenBytes);
				const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

				await db.insert(schema.organizationInvitation).values({
					id: generateId(),
					orgId,
					email: invite.email,
					role: invite.role || 'member',
					token,
					invitedBy: locals.user.id,
					expiresAt
				});
			}

			throw redirect(303, `/app/organizations/${orgId}`);
		} catch (error) {
			// Re-throw redirects
			if (error instanceof Response || (error as { status?: number })?.status === 303) {
				throw error;
			}
			console.error('Create organization error:', error);
			return fail(500, { error: 'Gagal membuat organisasi' });
		}
	}
};
