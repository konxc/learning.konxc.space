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

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/signin');
	}

	// Get existing verification
	const verification = await db.query.userVerification.findFirst({
		where: eq(schema.userVerification.userId, locals.user.id)
	});

	return {
		user: locals.user,
		verification: verification || null,
		isVerified: verification?.status === 'approved',
		canCreateOrg: verification?.status === 'approved'
	};
};

export const actions: Actions = {
	submitKtp: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const ktpNumber = formData.get('ktpNumber') as string;
		const ktpName = formData.get('ktpName') as string;
		const ktpAddress = formData.get('ktpAddress') as string;
		const ktpDob = formData.get('ktpDob') as string;
		const ktpPhoto = formData.get('ktpPhoto') as string;
		const selfieWithKtp = formData.get('selfieWithKtp') as string;

		// Validation
		if (!ktpNumber || !ktpName || !ktpAddress || !ktpDob || !ktpPhoto || !selfieWithKtp) {
			return fail(400, { error: 'Semua field wajib diisi' });
		}

		// Validate KTP number (16 digits)
		if (!/^\d{16}$/.test(ktpNumber)) {
			return fail(400, { error: 'Nomor KTP harus 16 digit' });
		}

		try {
			// Check if already has verification
			const existing = await db.query.userVerification.findFirst({
				where: eq(schema.userVerification.userId, locals.user.id)
			});

			if (existing) {
				if (existing.status === 'approved') {
					return fail(400, { error: 'KTP Anda sudah terverifikasi' });
				}
				if (existing.status === 'pending') {
					return fail(400, { error: 'Verifikasi sedang dalam proses' });
				}
				// If rejected, allow resubmission
				await db
					.update(schema.userVerification)
					.set({
						ktpNumber,
						ktpName,
						ktpAddress,
						ktpDob: new Date(ktpDob),
						ktpPhotoUrl: ktpPhoto,
						selfieWithKtpUrl: selfieWithKtp,
						status: 'pending',
						verifiedAt: null,
						verifiedBy: null,
						rejectionReason: null,
						updatedAt: new Date()
					})
					.where(eq(schema.userVerification.id, existing.id));
			} else {
				// Create new verification
				await db.insert(schema.userVerification).values({
					id: generateId(),
					userId: locals.user.id,
					ktpNumber,
					ktpName,
					ktpAddress,
					ktpDob: new Date(ktpDob),
					ktpPhotoUrl: ktpPhoto,
					selfieWithKtpUrl: selfieWithKtp,
					status: 'pending'
				});
			}

			return {
				success: true,
				message: 'Verifikasi KTP berhasil dikirim. Menunggu persetujuan admin.'
			};
		} catch (error) {
			console.error('KTP verification error:', error);
			return fail(500, { error: 'Gagal mengirim verifikasi' });
		}
	}
};
