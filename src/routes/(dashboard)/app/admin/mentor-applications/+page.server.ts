import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { actionSuccess, actionFailure } from '$lib/server/actions';
import { createAffiliateAccountForUser } from '$lib/server/affiliate';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	const applications = await db
		.select({
			id: schema.mentorApplication.id,
			userId: schema.mentorApplication.userId,
			fullName: schema.mentorApplication.fullName,
			email: schema.mentorApplication.email,
			phone: schema.mentorApplication.phone,
			bio: schema.mentorApplication.bio,
			expertise: schema.mentorApplication.expertise,
			yearsExperience: schema.mentorApplication.yearsExperience,
			portfolioUrl: schema.mentorApplication.portfolioUrl,
			githubUrl: schema.mentorApplication.githubUrl,
			linkedinUrl: schema.mentorApplication.linkedinUrl,
			motivation: schema.mentorApplication.motivation,
			status: schema.mentorApplication.status,
			adminNotes: schema.mentorApplication.adminNotes,
			createdAt: schema.mentorApplication.createdAt,
			reviewedAt: schema.mentorApplication.reviewedAt,
			reviewedBy: schema.mentorApplication.reviewedBy,
			user: {
				username: schema.user.username,
				role: schema.user.role
			}
		})
		.from(schema.mentorApplication)
		.innerJoin(schema.user, eq(schema.mentorApplication.userId, schema.user.id))
		.orderBy(schema.mentorApplication.createdAt);

	return { applications };
};

export const actions: Actions = {
	approve: async (event) => {
		const admin = await requireAdmin(event);
		const formData = await event.request.formData();
		const applicationId = formData.get('applicationId') as string;
		const adminNotes = formData.get('adminNotes') as string;

		if (!applicationId) return actionFailure(400, 'Application ID required');

		// Verify application exists first
		const app = await db
			.select()
			.from(schema.mentorApplication)
			.where(eq(schema.mentorApplication.id, applicationId))
			.limit(1);

		if (!app[0]) return actionFailure(404, 'Application not found');
		if (app[0].status !== 'pending') return actionFailure(400, 'Application already processed');

		// Verify user exists
		const userExists = await db
			.select({ id: schema.user.id })
			.from(schema.user)
			.where(eq(schema.user.id, app[0].userId))
			.limit(1);

		if (!userExists[0]) return actionFailure(404, 'User not found');

		// Get user's org
		const userOrgs = await db
			.select()
			.from(schema.organizationMember)
			.where(eq(schema.organizationMember.userId, app[0].userId))
			.limit(1);

		const orgId = userOrgs[0]?.orgId || 'personal';
		const notificationId = crypto.randomUUID();

		try {
			// Execute all operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Update application status
				await tx
					.update(schema.mentorApplication)
					.set({
						status: 'approved',
						adminNotes: adminNotes || null,
						reviewedAt: new Date(),
						reviewedBy: admin.id
					})
					.where(eq(schema.mentorApplication.id, applicationId));

				// 2. Upgrade user role to mentor
				await tx
					.update(schema.user)
					.set({ role: 'mentor' })
					.where(eq(schema.user.id, app[0].userId));

				// 3. Create affiliate account
				const accountId = `aff_${crypto.randomUUID().slice(0, 12)}`;
				await tx.insert(schema.affiliateAccount).values({
					id: accountId,
					userId: app[0].userId,
					orgId,
					role: 'mentor',
					commissionRate: 25,
					isActive: true
				});

				// 4. Create auto affiliate link
				const baseUrl = process.env.APP_URL || 'https://naikkelas.id';
				await tx.insert(schema.autoAffiliateLink).values({
					id: `link_${crypto.randomUUID().slice(0, 12)}`,
					accountId,
					orgId,
					code: `mentor-${app[0].userId.slice(0, 8)}`,
					url: `${baseUrl}/ref/mentor-${app[0].userId.slice(0, 8)}`,
					isActive: true
				});

				// 5. Send notification
				await tx.insert(schema.notification).values({
					id: notificationId,
					userId: app[0].userId,
					type: 'system',
					title: 'Selamat! Aplikasi Mentor Disetujui 🎉',
					message: `Aplikasi mentor kamu telah disetujui. Akun kamu sekarang memiliki akses mentor dan link affiliate. ${adminNotes ? `Catatan admin: ${adminNotes}` : ''}`,
					link: '/app/affiliate',
					read: false
				});
			});

			return actionSuccess({
				message: `Aplikasi ${app[0].fullName} disetujui, role diupgrade ke mentor, dan affiliate account dibuat.`
			});
		} catch (error) {
			console.error('Approve mentor application failed:', error);
			return actionFailure(500, 'Failed to process application. Please try again.');
		}
	},

	reject: async (event) => {
		const admin = await requireAdmin(event);
		const formData = await event.request.formData();
		const applicationId = formData.get('applicationId') as string;
		const adminNotes = formData.get('adminNotes') as string;

		if (!applicationId) return actionFailure(400, 'Application ID required');

		const app = await db
			.select()
			.from(schema.mentorApplication)
			.where(eq(schema.mentorApplication.id, applicationId))
			.limit(1);

		if (!app[0]) return actionFailure(404, 'Application not found');
		if (app[0].status !== 'pending') return actionFailure(400, 'Application already processed');

		await db
			.update(schema.mentorApplication)
			.set({
				status: 'rejected',
				adminNotes: adminNotes || null,
				reviewedAt: new Date(),
				reviewedBy: admin.id
			})
			.where(eq(schema.mentorApplication.id, applicationId));

		// Notify applicant
		await db.insert(schema.notification).values({
			id: crypto.randomUUID(),
			userId: app[0].userId,
			type: 'system',
			title: 'Update Aplikasi Mentor',
			message: `Aplikasi mentor kamu belum dapat disetujui saat ini. ${adminNotes ? `Alasan: ${adminNotes}` : 'Kamu bisa mengajukan kembali setelah memenuhi persyaratan.'}`,
			link: '/app/apply-mentor',
			read: false
		});

		return actionSuccess({ message: `Aplikasi ${app[0].fullName} ditolak.` });
	}
};
