import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { actionSuccess, actionFailure } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

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

		const app = await db
			.select()
			.from(schema.mentorApplication)
			.where(eq(schema.mentorApplication.id, applicationId))
			.limit(1);

		if (!app[0]) return actionFailure(404, 'Application not found');
		if (app[0].status !== 'pending') return actionFailure(400, 'Application already processed');

		const userExists = await db
			.select({ id: schema.user.id })
			.from(schema.user)
			.where(eq(schema.user.id, app[0].userId))
			.limit(1);

		if (!userExists[0]) return actionFailure(404, 'User not found');

		try {
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

				// 2. Check if user already owns an org
				const existingOwnership = await tx
					.select({ orgId: schema.organizationMember.orgId })
					.from(schema.organizationMember)
					.where(
						and(
							eq(schema.organizationMember.userId, app[0].userId),
							eq(schema.organizationMember.role, 'owner')
						)
					)
					.limit(1);

				let orgId: string;

				if (!existingOwnership[0]) {
					// Auto-create org for this mentor
					orgId = generateId();
					await tx.insert(schema.organization).values({
						id: orgId,
						slug: `${app[0].userId}-academy`,
						name: `${app[0].fullName} Academy`,
						planType: 'free'
					});

					await tx.insert(schema.organizationMember).values({
						id: generateId(),
						orgId,
						userId: app[0].userId,
						role: 'owner',
						createdAt: new Date(),
						updatedAt: new Date()
					});
				} else {
					orgId = existingOwnership[0].orgId;
				}

				// 3. Create affiliate account linked to org
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
					id: crypto.randomUUID(),
					userId: app[0].userId,
					type: 'system',
					title: 'Selamat! Aplikasi Mentor Disetujui 🎉',
					message: `Aplikasi mentor kamu telah disetujui. Akun kamu sekarang memiliki akses mentor dan link affiliate. ${adminNotes ? `Catatan admin: ${adminNotes}` : ''}`,
					link: '/app/affiliate',
					read: false
				});
			});

			return actionSuccess({
				message: `Aplikasi ${app[0].fullName} disetujui, org dibuat, dan affiliate account dibuat.`
			});
		} catch (err) {
			console.error('Approve mentor application failed:', err);
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
