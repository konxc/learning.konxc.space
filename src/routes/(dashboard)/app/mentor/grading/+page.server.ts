import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, isNull, desc, inArray } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get mentor's courses
	const courses = await db
		.select({ id: schema.course.id, title: schema.course.title })
		.from(schema.course)
		.where(eq(schema.course.mentorId, user.id));

	if (!courses.length) return { submissions: [], courses: [] };

	const courseIds = courses.map((c) => c.id);

	// Get pending submissions (no grade yet)
	const submissions = await db
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
			studentUsername: schema.user.username
		})
		.from(schema.submission)
		.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
		.leftJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
		.innerJoin(schema.user, eq(schema.submission.userId, schema.user.id))
		.leftJoin(schema.submissionGrade, eq(schema.submission.id, schema.submissionGrade.submissionId))
		.where(
			and(
				eq(schema.submission.type, 'assignment'),
				isNull(schema.submissionGrade.id),
				inArray(schema.submission.courseId, courseIds)
			)
		)
		.orderBy(schema.submission.createdAt);

	return { submissions, courses };
};

export const actions: Actions = {
	bulkGrade: async ({ request, locals }) => {
		const user = await requireAuth({ user: locals.user });

		const formData = await request.formData();
		const submissionIds = (formData.get('submissionIds') as string).split(',').filter(Boolean);
		const score = parseInt(formData.get('score') as string);
		const notes = (formData.get('notes') as string) || '';

		if (!submissionIds.length || isNaN(score)) {
			return actionFailure(400, 'submissionIds and score required');
		}

		for (const submissionId of submissionIds) {
			// Check if grade already exists
			const existing = await db
				.select({ id: schema.submissionGrade.id })
				.from(schema.submissionGrade)
				.where(eq(schema.submissionGrade.submissionId, submissionId))
				.limit(1);

			if (existing.length > 0) continue;

			const gradeId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
			await db.insert(schema.submissionGrade).values({
				id: gradeId,
				submissionId,
				gradedBy: user.id,
				score,
				feedback: notes,
				gradedAt: new Date()
			});

			// Get submission to find student
			const sub = await db
				.select({ userId: schema.submission.userId, courseId: schema.submission.courseId })
				.from(schema.submission)
				.where(eq(schema.submission.id, submissionId))
				.limit(1);

			if (sub.length > 0) {
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
			}
		}

		return actionSuccess({ message: `${submissionIds.length} submission dinilai.` });
	}
} satisfies Actions;
