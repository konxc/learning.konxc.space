import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { fail, redirect, error } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { requireOrgOwner } from '$lib/server/middleware';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

export const load: PageServerLoad = async (event) => {
	const orgId = event.params.id;

	let membership;
	try {
		membership = await requireOrgOwner(event, orgId);
	} catch (err) {
		throw redirect(303, `/app/organizations/${orgId}`);
	}

	const { organization } = await event.parent();

	// Get existing verification
	const verificationRows = await db
		.select()
		.from(schema.organizationVerification)
		.where(eq(schema.organizationVerification.orgId, orgId))
		.limit(1);

	const verification = verificationRows[0] ?? null;

	return {
		organization,
		verification,
		isVerified: verification?.status === 'verified'
	};
};

export const actions: Actions = {
	submitVerification: async (event) => {
		const { request, params } = event;
		const orgId = params.id;

		// Verify membership via centralized owner helper
		try {
			await requireOrgOwner(event, orgId);
		} catch (err) {
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
