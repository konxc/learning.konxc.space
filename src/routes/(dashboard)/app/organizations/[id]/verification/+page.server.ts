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

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/signin');
	}

	const orgId = params.id;

	// Check if user is owner/admin of this org
	const member = await db.query.organizationMember.findFirst({
		where: (fields, operators) =>
			operators.and(
				eq(fields.orgId, orgId),
				eq(fields.userId, locals.user!.id),
				eq(fields.role, 'owner')
			)
	});

	if (!member) {
		throw redirect(303, '/app');
	}

	// Get organization
	const organization = await db.query.organization.findFirst({
		where: eq(schema.organization.id, orgId)
	});

	// Get existing verification
	const verification = await db.query.organizationVerification.findFirst({
		where: eq(schema.organizationVerification.orgId, orgId)
	});

	return {
		organization,
		verification: verification || null,
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
		const member = await db.query.organizationMember.findFirst({
			where: (fields, operators) =>
				operators.and(
					eq(fields.orgId, orgId),
					eq(fields.userId, locals.user!.id),
					eq(fields.role, 'owner')
				)
		});

		if (!member) {
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
			const existing = await db.query.organizationVerification.findFirst({
				where: eq(schema.organizationVerification.orgId, orgId)
			});

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
