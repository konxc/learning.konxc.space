import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = await requireAuth({ user: locals.user });
	const { submissionId } = params;

	const rows = await db
		.select({
			id: schema.submission.id,
			type: schema.submission.type,
			payload: schema.submission.payload,
			createdAt: schema.submission.createdAt,
			courseId: schema.submission.courseId,
			lessonId: schema.submission.lessonId,
			userId: schema.submission.userId,
			courseTitle: schema.course.title,
			lessonTitle: schema.lesson.title,
			studentName: schema.user.fullName,
			studentUsername: schema.user.username,
			gradeId: schema.submissionGrade.id,
			gradeScore: schema.submissionGrade.score,
			gradeFeedback: schema.submissionGrade.feedback,
			gradedAt: schema.submissionGrade.gradedAt
		})
		.from(schema.submission)
		.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
		.leftJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
		.innerJoin(schema.user, eq(schema.submission.userId, schema.user.id))
		.leftJoin(schema.submissionGrade, eq(schema.submission.id, schema.submissionGrade.submissionId))
		.where(and(eq(schema.submission.id, submissionId), eq(schema.course.mentorId, user.id)))
		.limit(1);

	if (rows.length === 0) throw error(404, 'Submission not found');

	return { submission: rows[0] };
};

export const actions: Actions = {
	grade: async ({ request, params, locals }) => {
		const user = await requireAuth({ user: locals.user });
		const { submissionId } = params;

		const formData = await request.formData();
		const score = parseInt(formData.get('score') as string);
		const feedback = (formData.get('feedback') as string) || '';

		if (isNaN(score) || score < 0 || score > 100) {
			return actionFailure(400, 'Score harus antara 0-100');
		}

		// Verify mentor owns the course
		const sub = await db
			.select({ userId: schema.submission.userId, courseId: schema.submission.courseId })
			.from(schema.submission)
			.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
			.where(and(eq(schema.submission.id, submissionId), eq(schema.course.mentorId, user.id)))
			.limit(1);

		if (sub.length === 0) return actionFailure(403, 'Unauthorized');

		// Upsert grade
		const existing = await db
			.select({ id: schema.submissionGrade.id })
			.from(schema.submissionGrade)
			.where(eq(schema.submissionGrade.submissionId, submissionId))
			.limit(1);

		if (existing.length > 0) {
			await db
				.update(schema.submissionGrade)
				.set({ score, feedback, gradedAt: new Date(), gradedBy: user.id })
				.where(eq(schema.submissionGrade.id, existing[0].id));
		} else {
			const gradeId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
			await db.insert(schema.submissionGrade).values({
				id: gradeId,
				submissionId,
				gradedBy: user.id,
				score,
				feedback,
				gradedAt: new Date()
			});
		}

		// Notify student
		const notifId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
		await db.insert(schema.notification).values({
			id: notifId,
			userId: sub[0].userId,
			type: 'grade',
			title: 'Submission Dinilai',
			message: `Submission kamu telah dinilai dengan skor ${score}.`,
			link: '/app/learning?tab=checkpoints',
			read: false
		});

		throw redirect(303, '/app/mentor/grading');
	}
} satisfies Actions;
