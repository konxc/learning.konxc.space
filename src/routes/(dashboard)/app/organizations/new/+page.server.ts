import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

function createSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.substring(0, 50);
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

		// Validation
		if (!name || name.length < 3) {
			return fail(400, { error: 'Nama organisasi minimal 3 karakter' });
		}

		const slug = createSlug(name);

		// Check slug uniqueness
		const existingSlug = await db.query.organization.findFirst({
			where: eq(schema.organization.slug, slug)
		});

		if (existingSlug) {
			return fail(400, { error: 'Nama organisasi sudah digunakan' });
		}

		try {
			const orgId = generateId();

			// Create organization
			await db.insert(schema.organization).values({
				id: orgId,
				slug,
				name,
				brandColor: brandColor || '#4f46e5',
				planType: 'free'
			});

			// Add creator as owner
			await db.insert(schema.organizationMember).values({
				id: generateId(),
				orgId,
				userId: locals.user.id,
				role: 'owner'
			});

			return {
				success: true,
				message: 'Organisasi berhasil dibuat!',
				orgId
			};
		} catch (error) {
			console.error('Create organization error:', error);
			return fail(500, { error: 'Gagal membuat organisasi' });
		}
	}
};
