import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// Check admin role
	if (!locals.user || locals.user.role !== 'admin') {
		throw new Error('Unauthorized');
	}

	// Get pending KTP verifications with user data
	const pendingKtpRaw = await db.query.userVerification.findMany({
		where: eq(schema.userVerification.status, 'pending'),
		orderBy: desc(schema.userVerification.createdAt)
	});

	// Get user details for each verification
	const pendingKtp = await Promise.all(
		pendingKtpRaw.map(async (v) => {
			const user = await db.query.user.findFirst({
				where: eq(schema.user.id, v.userId)
			});
			return { ...v, user };
		})
	);

	// Get pending org verifications
	const pendingOrgsRaw = await db.query.organizationVerification.findMany({
		where: eq(schema.organizationVerification.status, 'pending'),
		orderBy: desc(schema.organizationVerification.createdAt)
	});

	// Get organization details for each verification
	const pendingOrgs = await Promise.all(
		pendingOrgsRaw.map(async (v) => {
			const organization = await db.query.organization.findFirst({
				where: eq(schema.organization.id, v.orgId)
			});
			return { ...v, organization };
		})
	);

	return {
		pendingKtp,
		pendingOrgs
	};
};

export const actions: Actions = {
	approveKtp: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const verificationId = formData.get('verificationId') as string;

		try {
			await db
				.update(schema.userVerification)
				.set({
					status: 'approved',
					verifiedAt: new Date(),
					verifiedBy: locals.user.id
				})
				.where(eq(schema.userVerification.id, verificationId));

			return { success: true, message: 'KTP berhasil diverifikasi' };
		} catch (error) {
			console.error('Approve KTP error:', error);
			return fail(500, { error: 'Gagal memverifikasi KTP' });
		}
	},

	rejectKtp: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const verificationId = formData.get('verificationId') as string;
		const reason = formData.get('rejectionReason') as string;

		try {
			await db
				.update(schema.userVerification)
				.set({
					status: 'rejected',
					verifiedAt: new Date(),
					verifiedBy: locals.user.id,
					rejectionReason: reason || 'Dokumen tidak valid'
				})
				.where(eq(schema.userVerification.id, verificationId));

			return { success: true, message: 'KTP ditolak' };
		} catch (error) {
			console.error('Reject KTP error:', error);
			return fail(500, { error: 'Gagal menolak KTP' });
		}
	},

	approveOrg: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const verificationId = formData.get('verificationId') as string;

		try {
			await db
				.update(schema.organizationVerification)
				.set({
					status: 'verified',
					isTrusted: true,
					verifiedAt: new Date(),
					verifiedBy: locals.user.id
				})
				.where(eq(schema.organizationVerification.id, verificationId));

			return { success: true, message: 'Organisasi berhasil diverifikasi' };
		} catch (error) {
			console.error('Approve Org error:', error);
			return fail(500, { error: 'Gagal memverifikasi organisasi' });
		}
	},

	rejectOrg: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const verificationId = formData.get('verificationId') as string;
		const reason = formData.get('rejectionReason') as string;

		try {
			await db
				.update(schema.organizationVerification)
				.set({
					status: 'rejected',
					rejectionReason: reason || 'Dokumen tidak valid'
				})
				.where(eq(schema.organizationVerification.id, verificationId));

			return { success: true, message: 'Verifikasi organisasi ditolak' };
		} catch (error) {
			console.error('Reject Org error:', error);
			return fail(500, { error: 'Gagal menolak verifikasi organisasi' });
		}
	}
};
