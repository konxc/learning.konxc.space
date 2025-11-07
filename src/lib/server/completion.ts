import { db } from './db';
import * as schema from './db/schema';
import { eq, and } from 'drizzle-orm';

interface CompletionResult {
	isComplete: boolean;
	missing: string[];
	progress: {
		totalLessons: number;
		completedLessons: number;
		completedQuizCount: number;
		totalQuizCount: number;
	};
}

export async function checkCourseCompletion(
	userId: string,
	courseId: string
): Promise<CompletionResult> {
	const missing: string[] = [];

	// Get all lessons for this course
	const lessons = await db
		.select()
		.from(schema.lesson)
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId));

	const totalLessons = lessons.length;

	// Check if all lessons are completed
	const completedLessons = await db
		.select()
		.from(schema.lessonProgress)
		.where(
			and(
				eq(schema.lessonProgress.userId, userId),
				eq(schema.lessonProgress.courseId, courseId)
			)
		);

	const completedLessonIds = new Set(completedLessons.map((p) => p.lessonId));

	// Check for incomplete lessons
	for (const lesson of lessons) {
		if (!completedLessonIds.has(lesson.lesson.id)) {
			missing.push(`Lesson: ${lesson.lesson.title}`);
		}
	}

	// Get all quizzes for this course
	const quizzes = await db
		.select()
		.from(schema.quiz)
		.innerJoin(schema.lesson, eq(schema.quiz.lessonId, schema.lesson.id))
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId));

	const totalQuizCount = quizzes.length;

	// Check if all quizzes are passed
	let completedQuizCount = 0;
	for (const quiz of quizzes) {
		const submission = await db
			.select()
			.from(schema.submission)
			.where(
				and(
					eq(schema.submission.userId, userId),
					eq(schema.submission.quizId, quiz.quiz.id),
					eq(schema.submission.type, 'quiz')
				)
			)
			.limit(1);

		if (submission.length > 0 && submission[0].score !== null && submission[0].score >= quiz.quiz.passingScore) {
			completedQuizCount++;
		} else {
			missing.push(`Quiz: ${quiz.quiz.title} (need ${quiz.quiz.passingScore}% to pass)`);
		}
	}

	// Check for pending assignments (if any)
	const assignments = await db
		.select()
		.from(schema.submission)
		.where(
			and(
				eq(schema.submission.userId, userId),
				eq(schema.submission.courseId, courseId),
				eq(schema.submission.type, 'assignment')
			)
		);

	for (const assignment of assignments) {
		const grade = await db
			.select()
			.from(schema.submissionGrade)
			.where(eq(schema.submissionGrade.submissionId, assignment.id))
			.limit(1);

		if (grade.length === 0) {
			missing.push('Assignment: pending mentor review');
		} else if (grade[0].score < 60) {
			missing.push(`Assignment: failed (score ${grade[0].score}%, need 60%)`);
		}
	}

	const isComplete = missing.length === 0;

	return {
		isComplete,
		missing,
		progress: {
			totalLessons,
			completedLessons: completedLessons.length,
			completedQuizCount,
			totalQuizCount
		}
	};
}

