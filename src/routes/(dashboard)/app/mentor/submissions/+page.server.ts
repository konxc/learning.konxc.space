import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { requireMentor } from '$lib/server/middleware';

export const load: PageServerLoad = async (event) => {
	const user = await requireMentor(event);

	// Get all submissions for mentor's courses
	const submissions = await db
		.select({
			id: schema.submission.id,
			userId: schema.submission.userId,
			courseId: schema.submission.courseId,
			type: schema.submission.type,
			payload: schema.submission.payload,
			score: schema.submission.score,
			createdAt: schema.submission.createdAt,
			// Student info
			studentName: schema.user.fullName,
			studentEmail: schema.user.email,
			// Course info
			courseTitle: schema.course.title,
			// Lesson info
			lessonTitle: schema.lesson.title,
			// Grade info
			gradeId: schema.submissionGrade.id,
			gradeScore: schema.submissionGrade.score,
			gradeFeedback: schema.submissionGrade.feedback
		})
		.from(schema.submission)
		.innerJoin(schema.user, eq(schema.submission.userId, schema.user.id))
		.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
		.leftJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
		.leftJoin(schema.submissionGrade, eq(schema.submission.id, schema.submissionGrade.submissionId))
		.where(and(eq(schema.course.mentorId, user.id)))
		.orderBy(desc(schema.submission.createdAt))
		.limit(100);

	return { submissions };
};
