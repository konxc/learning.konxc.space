import { redirect } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	const enrollments = await db
		.select({
			id: schema.enrollment.id,
			courseId: schema.enrollment.courseId,
			cohortId: schema.enrollment.cohortId,
			track: schema.enrollment.track,
			courseTitle: schema.course.title,
			cohortName: schema.cohort.name
		})
		.from(schema.enrollment)
		.leftJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.leftJoin(schema.cohort, eq(schema.enrollment.cohortId, schema.cohort.id))
		.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.status, 'active')));

	const checkpointsWithSubmissions = [];

	for (const enrollment of enrollments) {
		if (!enrollment.cohortId) continue;

		const checkpoints = await db
			.select()
			.from(schema.checkpoint)
			.where(
				and(
					eq(schema.checkpoint.cohortId, enrollment.cohortId),
					eq(schema.checkpoint.isActive, true)
				)
			)
			.orderBy(asc(schema.checkpoint.weekNumber));

		for (const checkpoint of checkpoints) {
			const submission = await db
				.select()
				.from(schema.checkpointSubmission)
				.where(
					and(
						eq(schema.checkpointSubmission.checkpointId, checkpoint.id),
						eq(schema.checkpointSubmission.userId, user.id)
					)
				)
				.limit(1);

			checkpointsWithSubmissions.push({
				...checkpoint,
				courseId: enrollment.courseId,
				courseTitle: enrollment.courseTitle,
				cohortName: enrollment.cohortName,
				track: enrollment.track,
				submission: submission[0] || null
			});
		}
	}

	checkpointsWithSubmissions.sort((a, b) => {
		const titleA = a.courseTitle || '';
		const titleB = b.courseTitle || '';
		if (titleA !== titleB) return titleA.localeCompare(titleB);
		return a.weekNumber - b.weekNumber;
	});

	const stats = {
		total: checkpointsWithSubmissions.length,
		completed: checkpointsWithSubmissions.filter((c) => c.submission?.completed).length,
		pending: checkpointsWithSubmissions.filter((c) => !c.submission?.completed).length
	};

	return {
		checkpoints: checkpointsWithSubmissions,
		stats
	};
};

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		const user = await requireAuth(locals);

		const formData = await request.formData();
		const checkpointId = formData.get('checkpointId') as string;
		const notes = formData.get('notes') as string;

		if (!checkpointId) {
			return { success: false, error: 'Checkpoint ID required' };
		}

		const existing = await db
			.select()
			.from(schema.checkpointSubmission)
			.where(
				and(
					eq(schema.checkpointSubmission.checkpointId, checkpointId),
					eq(schema.checkpointSubmission.userId, user.id)
				)
			)
			.limit(1);

		if (existing.length > 0) {
			await db
				.update(schema.checkpointSubmission)
				.set({
					notes,
					completed: true,
					submittedAt: new Date()
				})
				.where(eq(schema.checkpointSubmission.id, existing[0].id));
		} else {
			const id = crypto.randomUUID();
			await db.insert(schema.checkpointSubmission).values({
				id,
				checkpointId,
				userId: user.id,
				notes,
				completed: true,
				submittedAt: new Date()
			});
		}

		return { success: true };
	}
};
