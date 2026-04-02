import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count, inArray, sql } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { createNotification } from '$lib/server/notifications';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const cohortId = event.params.id;

	// Check access: platform admin OR facilitator/mentor/owner/admin in any org
	const isPlatformAdmin = user.role === 'admin';
	if (!isPlatformAdmin) {
		const eligible = await db
			.select({ id: schema.organizationMember.id })
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.userId, user.id),
					inArray(schema.organizationMember.role, ['facilitator', 'mentor', 'owner', 'admin'])
				)
			)
			.limit(1);
		if (eligible.length === 0) throw redirect(303, '/app/overview');
	}

	// Get cohort details
	const cohortResult = await db
		.select({
			id: schema.cohort.id,
			name: schema.cohort.name,
			startDate: schema.cohort.startDate,
			endDate: schema.cohort.endDate,
			status: schema.cohort.status,
			courseId: schema.cohort.courseId,
			courseTitle: schema.course.title
		})
		.from(schema.cohort)
		.innerJoin(schema.course, eq(schema.cohort.courseId, schema.course.id))
		.where(eq(schema.cohort.id, cohortId))
		.limit(1);

	if (!cohortResult[0]) throw error(404, 'Cohort tidak ditemukan');
	const cohort = cohortResult[0];

	// Total lessons in course
	const totalLessonsResult = await db
		.select({ count: count() })
		.from(schema.lesson)
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, cohort.courseId));
	const totalLessons = Math.max(1, Number(totalLessonsResult[0]?.count ?? 1));

	// Get all enrollments
	const enrollments = await db
		.select({
			id: schema.enrollment.id,
			userId: schema.enrollment.userId,
			status: schema.enrollment.status,
			enrolledAt: schema.enrollment.enrolledAt,
			fullName: schema.user.fullName,
			username: schema.user.username,
			email: schema.user.email
		})
		.from(schema.enrollment)
		.innerJoin(schema.user, eq(schema.enrollment.userId, schema.user.id))
		.where(eq(schema.enrollment.cohortId, cohortId));

	// Get checkpoints for this cohort
	const checkpoints = await db
		.select({ id: schema.checkpoint.id })
		.from(schema.checkpoint)
		.where(eq(schema.checkpoint.cohortId, cohortId));

	const totalCheckpoints = checkpoints.length;
	const checkpointIds = checkpoints.map((c) => c.id);

	// Build student progress data
	const students = await Promise.all(
		enrollments.map(async (enrollment) => {
			// Lesson progress
			const progressResult = await db
				.select({ count: count() })
				.from(schema.lessonProgress)
				.where(
					and(
						eq(schema.lessonProgress.userId, enrollment.userId),
						eq(schema.lessonProgress.courseId, cohort.courseId),
						sql`${schema.lessonProgress.completedAt} IS NOT NULL`
					)
				);
			const completedLessons = Number(progressResult[0]?.count ?? 0);
			const progressPct = Math.round((completedLessons / totalLessons) * 100);

			// Checkpoint submissions
			let completedCheckpoints = 0;
			if (checkpointIds.length > 0) {
				const subResult = await db
					.select({ count: count() })
					.from(schema.checkpointSubmission)
					.where(
						and(
							eq(schema.checkpointSubmission.userId, enrollment.userId),
							inArray(schema.checkpointSubmission.checkpointId, checkpointIds),
							eq(schema.checkpointSubmission.completed, true)
						)
					);
				completedCheckpoints = Number(subResult[0]?.count ?? 0);
			}

			// Color coding
			let color: 'green' | 'yellow' | 'red';
			if (progressPct >= 70) color = 'green';
			else if (progressPct >= 30) color = 'yellow';
			else color = 'red';

			return {
				enrollmentId: enrollment.id,
				userId: enrollment.userId,
				fullName: enrollment.fullName,
				username: enrollment.username,
				email: enrollment.email,
				status: enrollment.status,
				enrolledAt: enrollment.enrolledAt,
				completedLessons,
				totalLessons,
				progressPct,
				completedCheckpoints,
				totalCheckpoints,
				color
			};
		})
	);

	return { cohort, students };
};

export const actions: Actions = {
	sendReminder: async (event) => {
		const user = await requireAuth(event);
		const formData = await event.request.formData();
		const targetUserId = formData.get('userId') as string;
		const cohortName = formData.get('cohortName') as string;

		if (!targetUserId) return fail(400, { error: 'User ID wajib diisi' });

		await createNotification({
			userId: targetUserId,
			type: 'reminder',
			title: 'Reminder Belajar',
			message: `Fasilitator mengingatkan kamu untuk melanjutkan belajar di batch "${cohortName}". Yuk, semangat!`,
			link: '/app/learning/courses'
		});

		return { success: true, message: 'Reminder berhasil dikirim' };
	}
};
