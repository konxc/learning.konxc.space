import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, count, isNotNull } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	if (user.role !== 'admin') throw redirect(303, '/app/overview');

	// Get all courses for the dropdown
	const courses = await db
		.select({ id: schema.course.id, title: schema.course.title })
		.from(schema.course)
		.where(eq(schema.course.status, 'published'))
		.orderBy(desc(schema.course.createdAt));

	// Get all cohorts with course name and enrollment count
	const cohorts = await db
		.select({
			id: schema.cohort.id,
			name: schema.cohort.name,
			status: schema.cohort.status,
			startDate: schema.cohort.startDate,
			endDate: schema.cohort.endDate,
			createdAt: schema.cohort.createdAt,
			courseId: schema.cohort.courseId,
			courseTitle: schema.course.title
		})
		.from(schema.cohort)
		.innerJoin(schema.course, eq(schema.cohort.courseId, schema.course.id))
		.orderBy(desc(schema.cohort.createdAt));

	// Get enrollment counts and stats per cohort
	const allEnrollments = await db
		.select({
			cohortId: schema.enrollment.cohortId,
			status: schema.enrollment.status,
			track: schema.enrollment.track
		})
		.from(schema.enrollment)
		.where(isNotNull(schema.enrollment.cohortId));

	// Process stats per cohort
	const statsMap = new Map<string, {
		total: number;
		active: number;
		pending: number;
		completed: number;
		tracks: { creator: number; seller: number; affiliate: number; unassigned: number };
	}>();

	for (const c of cohorts) {
		statsMap.set(c.id, {
			total: 0,
			active: 0,
			pending: 0,
			completed: 0,
			tracks: { creator: 0, seller: 0, affiliate: 0, unassigned: 0 }
		});
	}

	for (const e of allEnrollments) {
		if (!e.cohortId) continue;
		const stats = statsMap.get(e.cohortId);
		if (!stats) continue;
		stats.total++;
		if (e.status === 'active') stats.active++;
		else if (e.status === 'pending') stats.pending++;
		else if (e.status === 'completed') stats.completed++;
		if (e.track === 'creator') stats.tracks.creator++;
		else if (e.track === 'seller') stats.tracks.seller++;
		else if (e.track === 'affiliate') stats.tracks.affiliate++;
		else stats.tracks.unassigned++;
	}

	const enrichedCohorts = cohorts.map((c) => {
		const stats = statsMap.get(c.id) || { total: 0, active: 0, pending: 0, completed: 0, tracks: { creator: 0, seller: 0, affiliate: 0, unassigned: 0 } };
		return {
			...c,
			enrollmentCount: stats.total,
			stats
		};
	});

	// Overall admin stats
	const totalStudents = allEnrollments.length;
	const activeStudents = allEnrollments.filter(e => e.status === 'active').length;
	const pendingPayments = allEnrollments.filter(e => e.status === 'pending').length;

	return { courses, cohorts: enrichedCohorts, adminStats: { totalStudents, activeStudents, pendingPayments } };
};

export const actions: Actions = {
	create: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const name = formData.get('name') as string;
		const courseId = formData.get('courseId') as string;
		const startDate = formData.get('startDate') as string;
		const endDate = formData.get('endDate') as string;

		if (!name?.trim() || !courseId || !startDate) {
			return fail(400, { error: 'Nama batch, kursus, dan tanggal mulai wajib diisi.' });
		}

		const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.cohort).values({
			id,
			name: name.trim(),
			courseId,
			startDate: new Date(startDate),
			endDate: endDate ? new Date(endDate) : null,
			status: 'active',
			createdAt: new Date()
		});

		return { success: true, message: `Batch "${name}" berhasil dibuat.` };
	},

	updateStatus: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const cohortId = formData.get('cohortId') as string;
		const status = formData.get('status') as string;

		if (!cohortId || !['upcoming', 'active', 'completed'].includes(status)) {
			return fail(400, { error: 'Data tidak valid.' });
		}

		await db.update(schema.cohort).set({ status }).where(eq(schema.cohort.id, cohortId));

		return { success: true };
	}
};
