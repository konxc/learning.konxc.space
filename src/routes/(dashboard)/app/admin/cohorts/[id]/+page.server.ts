import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, isNotNull, count } from 'drizzle-orm';
import { fail, redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	if (user.role !== 'admin') throw redirect(303, '/app/overview');

	const cohortId = event.params.id;

	// Get cohort details with course info
	const cohortResult = await db
		.select({
			id: schema.cohort.id,
			name: schema.cohort.name,
			startDate: schema.cohort.startDate,
			endDate: schema.cohort.endDate,
			status: schema.cohort.status,
			createdAt: schema.cohort.createdAt,
			course: {
				id: schema.course.id,
				title: schema.course.title
			},
			facilitator: {
				id: schema.user.id,
				fullName: schema.user.fullName,
				email: schema.user.email
			}
		})
		.from(schema.cohort)
		.innerJoin(schema.course, eq(schema.cohort.courseId, schema.course.id))
		.leftJoin(schema.user, eq(schema.cohort.facilitatorId, schema.user.id))
		.where(eq(schema.cohort.id, cohortId))
		.limit(1);

	if (!cohortResult[0]) {
		throw error(404, 'Cohort not found');
	}

	const cohort = cohortResult[0];

	// Get all enrollments for this cohort
	const enrollments = await db
		.select({
			id: schema.enrollment.id,
			status: schema.enrollment.status,
			track: schema.enrollment.track,
			enrolledAt: schema.enrollment.enrolledAt,
			activatedAt: schema.enrollment.activatedAt,
			completedAt: schema.enrollment.completedAt,
			user: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email
			},
			course: {
				id: schema.course.id,
				title: schema.course.title
			}
		})
		.from(schema.enrollment)
		.innerJoin(schema.user, eq(schema.enrollment.userId, schema.user.id))
		.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.where(eq(schema.enrollment.cohortId, cohortId));

	// Calculate stats
	const totalStudents = enrollments.length;
	const activeStudents = enrollments.filter((e) => e.status === 'active').length;
	const completedStudents = enrollments.filter((e) => e.status === 'completed').length;
	const pendingStudents = enrollments.filter((e) => e.status === 'pending').length;

	const tracks = {
		creator: enrollments.filter((e) => e.track === 'creator').length,
		seller: enrollments.filter((e) => e.track === 'seller').length,
		affiliate: enrollments.filter((e) => e.track === 'affiliate').length,
		unassigned: enrollments.filter((e) => !e.track).length
	};

	// Get all facilitators for dropdown — via org membership role
	const facilitators = await db
		.selectDistinct({
			id: schema.user.id,
			fullName: schema.user.fullName,
			email: schema.user.email
		})
		.from(schema.user)
		.innerJoin(schema.organizationMember, eq(schema.organizationMember.userId, schema.user.id))
		.where(eq(schema.organizationMember.role, 'facilitator'));

	return {
		cohort,
		enrollments,
		facilitators,
		stats: {
			totalStudents,
			activeStudents,
			completedStudents,
			pendingStudents,
			tracks
		}
	};
};

export const actions: Actions = {
	assignFacilitator: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const cohortId = event.params.id;
		const facilitatorId = formData.get('facilitatorId') as string;

		await db
			.update(schema.cohort)
			.set({ facilitatorId: facilitatorId || null })
			.where(eq(schema.cohort.id, cohortId));

		return { success: true, message: 'Facilitator assigned successfully.' };
	},

	updateStatus: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const cohortId = event.params.id;
		const status = formData.get('status') as string;

		if (!['upcoming', 'active', 'completed'].includes(status)) {
			return fail(400, { error: 'Invalid status' });
		}

		await db.update(schema.cohort).set({ status }).where(eq(schema.cohort.id, cohortId));

		return { success: true };
	},

	removeStudent: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const enrollmentId = formData.get('enrollmentId') as string;

		await db.delete(schema.enrollment).where(eq(schema.enrollment.id, enrollmentId));

		return { success: true, message: 'Student removed from cohort.' };
	}
};
