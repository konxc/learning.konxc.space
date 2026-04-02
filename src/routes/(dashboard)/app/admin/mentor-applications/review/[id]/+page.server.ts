import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, error } from '@sveltejs/kit';
import { actionSuccess, actionFailure } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);
	const applicationId = event.params.id;

	const apps = await db
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
			user: {
				username: schema.user.username,
				role: schema.user.role,
				email: schema.user.email
			}
		})
		.from(schema.mentorApplication)
		.innerJoin(schema.user, eq(schema.mentorApplication.userId, schema.user.id))
		.where(eq(schema.mentorApplication.id, applicationId))
		.limit(1);

	if (!apps[0]) throw error(404, 'Application not found');

	return { application: apps[0] };
};

export const actions: Actions = {
	approve: async (event) => {
		const admin = await requireAdmin(event);
		const applicationId = event.params.id;
		const formData = await event.request.formData();
		const adminNotes = formData.get('adminNotes') as string;

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

		// Check if user already has an org (as owner)
		const existingOwnership = await db
			.select({ orgId: schema.organizationMember.orgId })
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.userId, app[0].userId),
					eq(schema.organizationMember.role, 'owner')
				)
			)
			.limit(1);

		if (!existingOwnership[0]) {
			// Auto-create org for this mentor
			const orgId = generateId();
			const slug = `${app[0].userId}-academy`;

			await db.insert(schema.organization).values({
				id: orgId,
				slug,
				name: `${app[0].fullName} Academy`,
				planType: 'free'
			});

			// Add as owner (org-level) — single record per user per org
			await db.insert(schema.organizationMember).values({
				id: generateId(),
				orgId,
				userId: app[0].userId,
				role: 'owner',
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} else {
			// Already has an org — ensure they have mentor role in it
			const orgId = existingOwnership[0].orgId;
			const existingMentorRole = await db
				.select({ id: schema.organizationMember.id })
				.from(schema.organizationMember)
				.where(
					and(
						eq(schema.organizationMember.userId, app[0].userId),
						eq(schema.organizationMember.orgId, orgId),
						eq(schema.organizationMember.role, 'mentor')
					)
				)
				.limit(1);

			if (!existingMentorRole[0]) {
				await db.insert(schema.organizationMember).values({
					id: generateId(),
					orgId,
					userId: app[0].userId,
					role: 'mentor',
					createdAt: new Date(),
					updatedAt: new Date()
				});
			}
		}

		await db.insert(schema.notification).values({
			id: crypto.randomUUID(),
			userId: app[0].userId,
			type: 'system',
			title: 'Selamat! Aplikasi Mentor Disetujui 🎉',
			message: `Aplikasi mentor kamu telah disetujui. Akun kamu sekarang memiliki akses mentor.${adminNotes ? ` Catatan: ${adminNotes}` : ''}`,
			link: '/app/mentor/courses',
			read: false
		});

		throw redirect(303, '/app/admin/mentor-applications');
	},

	reject: async (event) => {
		const admin = await requireAdmin(event);
		const applicationId = event.params.id;
		const formData = await event.request.formData();
		const adminNotes = formData.get('adminNotes') as string;

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

		await db.insert(schema.notification).values({
			id: crypto.randomUUID(),
			userId: app[0].userId,
			type: 'system',
			title: 'Update Aplikasi Mentor',
			message: `Aplikasi mentor kamu belum dapat disetujui.${adminNotes ? ` Alasan: ${adminNotes}` : ' Kamu bisa mengajukan kembali setelah memenuhi persyaratan.'}`,
			link: '/app/apply-mentor',
			read: false
		});

		throw redirect(303, '/app/admin/mentor-applications');
	}
};
