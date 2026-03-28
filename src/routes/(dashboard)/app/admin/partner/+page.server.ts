import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, isNotNull, count, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	if (user.role !== 'admin') throw redirect(303, '/app/overview');

	const partners = await db
		.select()
		.from(schema.partner)
		.orderBy(desc(schema.partner.createdAt));

	const partnerStats = await Promise.all(
		partners.map(async (partner) => {
			const enrollments = await db
				.select({
					id: schema.enrollment.id,
					status: schema.enrollment.status,
					track: schema.enrollment.track
				})
				.from(schema.enrollment)
				.where(eq(schema.enrollment.partnerId, partner.id));

			const totalStudents = enrollments.length;
			const activeStudents = enrollments.filter(e => e.status === 'active').length;
			const completedStudents = enrollments.filter(e => e.status === 'completed').length;

			const tracks = {
				creator: enrollments.filter(e => e.track === 'creator').length,
				seller: enrollments.filter(e => e.track === 'seller').length,
				affiliate: enrollments.filter(e => e.track === 'affiliate').length
			};

			return {
				...partner,
				totalStudents,
				activeStudents,
				completedStudents,
				tracks
			};
		})
	);

	const totalPartners = partners.length;
	const totalEnrollments = await db
		.select({ count: count() })
		.from(schema.enrollment)
		.where(isNotNull(schema.enrollment.partnerId));

	return {
		partners: partnerStats,
		stats: {
			totalPartners,
			totalEnrollments: totalEnrollments[0]?.count || 0
		}
	};
};

export const actions: Actions = {
	create: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const contactEmail = formData.get('contactEmail') as string;
		const contactPhone = formData.get('contactPhone') as string;

		if (!id?.trim() || !name?.trim()) {
			return fail(400, { error: 'Partner ID and Name are required.' });
		}

		await db.insert(schema.partner).values({
			id: id.trim().toLowerCase().replace(/\s+/g, '-'),
			name: name.trim(),
			description: description?.trim() || null,
			contactEmail: contactEmail?.trim() || null,
			contactPhone: contactPhone?.trim() || null,
			status: 'active',
			createdAt: new Date()
		});

		return { success: true, message: `Partner "${name}" created successfully.` };
	},

	updateStatus: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const partnerId = formData.get('partnerId') as string;
		const status = formData.get('status') as string;

		if (!partnerId || !['active', 'inactive'].includes(status)) {
			return fail(400, { error: 'Invalid data.' });
		}

		await db.update(schema.partner).set({ status }).where(eq(schema.partner.id, partnerId));

		return { success: true };
	}
};
