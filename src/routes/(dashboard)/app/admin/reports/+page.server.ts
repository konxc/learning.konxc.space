import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, isNotNull, count, and, gte, lte, between } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	if (user.role !== 'admin') throw redirect(303, '/app/overview');

	const courses = await db
		.select({ id: schema.course.id, title: schema.course.title })
		.from(schema.course)
		.orderBy(desc(schema.course.createdAt));

	const cohorts = await db
		.select({ id: schema.cohort.id, name: schema.cohort.name })
		.from(schema.cohort)
		.orderBy(desc(schema.cohort.createdAt));

	const partners = await db
		.select({ id: schema.partner.id, name: schema.partner.name })
		.from(schema.partner)
		.where(eq(schema.partner.status, 'active'))
		.orderBy(schema.partner.name);

	const stats = {
		totalStudents: 0,
		activeStudents: 0,
		completedStudents: 0,
		totalCourses: courses.length,
		totalCohorts: cohorts.length,
		byTrack: { creator: 0, seller: 0, affiliate: 0 }
	};

	const allEnrollments = await db
		.select({
			status: schema.enrollment.status,
			track: schema.enrollment.track
		})
		.from(schema.enrollment);

	stats.totalStudents = allEnrollments.length;
	stats.activeStudents = allEnrollments.filter(e => e.status === 'active').length;
	stats.completedStudents = allEnrollments.filter(e => e.status === 'completed').length;

	for (const e of allEnrollments) {
		if (e.track === 'creator') stats.byTrack.creator++;
		else if (e.track === 'seller') stats.byTrack.seller++;
		else if (e.track === 'affiliate') stats.byTrack.affiliate++;
	}

	return { courses, cohorts, partners, stats };
};

export const actions: Actions = {
	exportEnrollments: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const format = formData.get('format') as string;
		const courseId = formData.get('courseId') as string;
		const cohortId = formData.get('cohortId') as string;
		const partnerId = formData.get('partnerId') as string;
		const status = formData.get('status') as string;

		let query = db
			.select({
				userId: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email,
				courseTitle: schema.course.title,
				cohortName: schema.cohort.name,
				track: schema.enrollment.track,
				status: schema.enrollment.status,
				enrolledAt: schema.enrollment.enrolledAt,
				completedAt: schema.enrollment.completedAt,
				partnerId: schema.enrollment.partnerId
			})
			.from(schema.enrollment)
			.innerJoin(schema.user, eq(schema.enrollment.userId, schema.user.id))
			.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
			.leftJoin(schema.cohort, eq(schema.enrollment.cohortId, schema.cohort.id));

		const conditions = [];
		if (courseId) conditions.push(eq(schema.enrollment.courseId, courseId));
		if (cohortId) conditions.push(eq(schema.enrollment.cohortId, cohortId));
		if (partnerId) conditions.push(eq(schema.enrollment.partnerId, partnerId));
		if (status) conditions.push(eq(schema.enrollment.status, status));

		if (conditions.length > 0) {
			query = query.where(and(...conditions)) as typeof query;
		}

		const enrollments = await query.orderBy(desc(schema.enrollment.enrolledAt));

		if (format === 'csv') {
			const headers = ['Username', 'Full Name', 'Email', 'Course', 'Cohort', 'Track', 'Status', 'Enrolled At', 'Completed At', 'Partner ID'];
			const rows = enrollments.map(e => [
				e.username,
				e.fullName || '',
				e.email || '',
				e.courseTitle,
				e.cohortName || '',
				e.track || '',
				e.status,
				e.enrolledAt ? new Date(e.enrolledAt).toISOString() : '',
				e.completedAt ? new Date(e.completedAt).toISOString() : '',
				e.partnerId || ''
			]);

			const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');

			return {
				success: true,
				download: true,
				filename: `enrollments-${new Date().toISOString().split('T')[0]}.csv`,
				content: csv
			};
		}

		return { success: true, enrollments };
	},

	generateSummary: async (event) => {
		const user = await requireAuth(event);
		if (user.role !== 'admin') return fail(403, { error: 'Forbidden' });

		const formData = await event.request.formData();
		const period = formData.get('period') as string;

		let startDate: Date;
		const now = new Date();

		switch (period) {
			case 'week':
				startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case 'month':
				startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				break;
			case 'quarter':
				startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
				break;
			default:
				startDate = new Date(0);
		}

		const enrollments = await db
			.select({
				status: schema.enrollment.status,
				track: schema.enrollment.track,
				enrolledAt: schema.enrollment.enrolledAt
			})
			.from(schema.enrollment)
			.where(gte(schema.enrollment.enrolledAt, startDate));

		const newEnrollments = enrollments.length;
		const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
		const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;

		const tracks = {
			creator: enrollments.filter(e => e.track === 'creator').length,
			seller: enrollments.filter(e => e.track === 'seller').length,
			affiliate: enrollments.filter(e => e.track === 'affiliate').length
		};

		return {
			success: true,
			summary: {
				period,
				startDate: startDate.toISOString(),
				endDate: now.toISOString(),
				newEnrollments,
				activeEnrollments,
				completedEnrollments,
				tracks
			}
		};
	}
};
