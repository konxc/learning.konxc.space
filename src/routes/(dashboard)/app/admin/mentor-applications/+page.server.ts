import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { actionSuccess, actionFailure } from '$lib/server/actions';

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

		// Update application status
		await db
			.update(schema.mentorApplication)
			.set({
				status: 'approved',
				adminNotes: adminNotes || null,
				reviewedAt: new Date(),
				reviewedBy: admin.id
			})
			.where(eq(schema.mentorApplication.id, applicationId));

		// Upgrade user role to mentor
		await db.update(schema.user).set({ role: 'mentor' }).where(eq(schema.user.id, app[0].userId));

		// Send notification to applicant
		await db.insert(schema.notification).values({
			id: crypto.randomUUID(),
			userId: app[0].userId,
			type: 'system',
			title: 'Selamat! Aplikasi Mentor Disetujui 🎉',
			message: `Aplikasi mentor kamu telah disetujui. Akun kamu sekarang memiliki akses mentor. ${adminNotes ? `Catatan admin: ${adminNotes}` : ''}`,
			link: '/app/mentor/courses',
			read: false
		});

		return actionSuccess({
			message: `Aplikasi ${app[0].fullName} disetujui dan role diupgrade ke mentor.`
		});
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
