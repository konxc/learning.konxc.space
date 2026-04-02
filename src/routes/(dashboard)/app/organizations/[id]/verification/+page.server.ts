import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/signin');
	}

	const orgId = params.id;

	// Check if user is owner of this org — explicit join, no db.query
	const memberRows = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(
				eq(schema.organizationMember.orgId, orgId),
				eq(schema.organizationMember.userId, locals.user.id),
				eq(schema.organizationMember.role, 'owner')
			)
		)
		.limit(1);

	if (!memberRows[0]) {
		throw redirect(303, '/app');
	}

	// Get organization
	const orgRows = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.id, orgId))
		.limit(1);

	// Get existing verification
	const verificationRows = await db
		.select()
		.from(schema.organizationVerification)
		.where(eq(schema.organizationVerification.orgId, orgId))
		.limit(1);

	const verification = verificationRows[0] ?? null;

	return {
		organization: orgRows[0] ?? null,
		verification,
		isVerified: verification?.status === 'verified'
	};
};

export const actions: Actions = {
	submitVerification: async ({ request, locals, params }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const orgId = params.id;

		// Check if user is owner/admin
		const memberRows2 = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, locals.user!.id),
					eq(schema.organizationMember.role, 'owner')
				)
			)
			.limit(1);

		if (!memberRows2[0]) {
			return fail(403, { error: 'Hanya owner yang dapat melakukan verifikasi' });
		}

		const formData = await request.formData();
		const legalName = formData.get('legalName') as string;
		const legalType = formData.get('legalType') as string;
		const npwp = formData.get('npwp') as string;
		const skPendirian = formData.get('skPendirian') as string;
		const representativeName = formData.get('representativeName') as string;
		const representativePosition = formData.get('representativePosition') as string;
		const legalAddress = formData.get('legalAddress') as string;
		const city = formData.get('city') as string;
		const province = formData.get('province') as string;
		const postalCode = formData.get('postalCode') as string;

		// Validation
		if (
			!legalName ||
			!legalType ||
			!npwp ||
			!representativeName ||
			!legalAddress ||
			!city ||
			!province
		) {
			return fail(400, { error: 'Semua field wajib diisi' });
		}

		try {
			// Check if already has verification
			const existingRows = await db
				.select()
				.from(schema.organizationVerification)
				.where(eq(schema.organizationVerification.orgId, orgId))
				.limit(1);
			const existing = existingRows[0] ?? null;

			if (existing) {
				if (existing.status === 'verified') {
					return fail(400, { error: 'Organisasi sudah terverifikasi' });
				}
				if (existing.status === 'pending') {
					return fail(400, { error: 'Verifikasi sedang dalam proses' });
				}
				// If rejected, allow resubmission
				await db
					.update(schema.organizationVerification)
					.set({
						legalName,
						legalType,
						npwp,
						skPendirian: skPendirian || null,
						representativeName,
						representativePosition,
						legalAddress,
						city,
						province,
						postalCode: postalCode || null,
						status: 'pending',
						verifiedAt: null,
						verifiedBy: null,
						rejectionReason: null,
						updatedAt: new Date()
					})
					.where(eq(schema.organizationVerification.id, existing.id));
			} else {
				// Create new verification
				await db.insert(schema.organizationVerification).values({
					id: generateId(),
					orgId,
					legalName,
					legalType,
					npwp,
					skPendirian: skPendirian || null,
					representativeName,
					representativePosition,
					legalAddress,
					city,
					province,
					postalCode: postalCode || null,
					status: 'pending'
				});
			}

			return {
				success: true,
				message: 'Verifikasi organisasi berhasil dikirim. Menunggu persetujuan admin.'
			};
		} catch (error) {
			console.error('Org verification error:', error);
			return fail(500, { error: 'Gagal mengirim verifikasi' });
		}
	}
};
