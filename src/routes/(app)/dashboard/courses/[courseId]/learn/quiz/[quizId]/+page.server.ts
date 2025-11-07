import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

type QuizChoicePublic = Pick<typeof schema.quizChoice.$inferSelect, 'id' | 'text'>;
type QuizChoiceWithAnswer = typeof schema.quizChoice.$inferSelect;

type QuizQuestionWithChoices<TChoice> = typeof schema.quizQuestion.$inferSelect & {
	choices: TChoice[];
};

type QuizWithQuestions<TChoice> = typeof schema.quiz.$inferSelect & {
	questions: QuizQuestionWithChoices<TChoice>[];
};

type QuizSubmissionAnswers = Record<string, string>;

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const { courseId, quizId } = event.params;

	// Verify enrollment
	const enrollment = await db
		.select()
		.from(schema.enrollment)
		.where(
			and(
				eq(schema.enrollment.userId, user.id),
				eq(schema.enrollment.courseId, courseId),
				eq(schema.enrollment.status, 'active')
			)
		)
		.limit(1);

	if (enrollment.length === 0) {
		throw redirect(303, `/dashboard/courses/${courseId}`);
	}

	// Get quiz with questions and choices (exclude isCorrect for student)
	const quiz = (await db.query.quiz.findFirst({
		where: eq(schema.quiz.id, quizId),
		with: {
			questions: {
				orderBy: schema.quizQuestion.order,
				with: {
					choices: {
						columns: {
							id: true,
							text: true
							// Explicitly exclude isCorrect
						}
					}
				}
			}
		}
	})) as QuizWithQuestions<QuizChoicePublic> | undefined;

	if (!quiz) {
		throw redirect(303, `/dashboard/courses/${courseId}/learn`);
	}

	// Check if user already submitted this quiz
	const existingSubmission = await db
		.select()
		.from(schema.submission)
		.where(
			and(
				eq(schema.submission.userId, user.id),
				eq(schema.submission.quizId, quizId),
				eq(schema.submission.type, 'quiz')
			)
		)
		.limit(1);

	return {
		quiz,
		hasSubmitted: existingSubmission.length > 0,
		submission: existingSubmission[0] || null
	};
};

export const actions: Actions = {
	submitQuiz: async (event) => {
		const user = await requireAuth(event);
		const { courseId, quizId } = event.params;

		const formData = await event.request.formData();

		// Get quiz with correct answers
		const quiz = (await db.query.quiz.findFirst({
			where: eq(schema.quiz.id, quizId),
			with: {
				questions: {
					with: {
						choices: true
					}
				}
			}
		})) as QuizWithQuestions<QuizChoiceWithAnswer> | undefined;

		if (!quiz) {
			return fail(404, { error: 'Quiz not found' });
		}

		const rawAnswers = formData.get('answers');
		if (typeof rawAnswers !== 'string') {
			return fail(400, { error: 'Invalid answers payload' });
		}

		let answers: QuizSubmissionAnswers;
		try {
			answers = JSON.parse(rawAnswers) as QuizSubmissionAnswers;
		} catch (error) {
			return fail(400, { error: 'Invalid answers payload' });
		}

		// Check for existing submission
		const existingSubmission = await db
			.select()
			.from(schema.submission)
			.where(
				and(
					eq(schema.submission.userId, user.id),
					eq(schema.submission.quizId, quizId),
					eq(schema.submission.type, 'quiz')
				)
			)
			.limit(1);

		if (existingSubmission.length > 0) {
			return fail(400, { error: 'Quiz already submitted' });
		}

		// Grade the quiz
		let correctCount = 0;
		const questions: QuizQuestionWithChoices<QuizChoiceWithAnswer>[] =
			quiz.questions ?? ([] as QuizQuestionWithChoices<QuizChoiceWithAnswer>[]);
		const totalQuestions = questions.length;

		if (totalQuestions === 0) {
			return fail(400, { error: 'Quiz has no questions' });
		}

		for (const question of questions) {
			const userAnswer = answers[question.id];
			if (!userAnswer) continue;

			const choices = question.choices ?? [];
			const correctChoice = choices.find((choice) => choice.isCorrect);
			if (correctChoice && userAnswer === correctChoice.id) {
				correctCount++;
			}
		}

		const score = Math.round((correctCount / totalQuestions) * 100);

		// Save submission
		const submissionId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.submission).values({
			id: submissionId,
			userId: user.id,
			courseId: courseId,
			quizId: quizId,
			type: 'quiz',
			payload: JSON.stringify({ answers, correctCount, totalQuestions }),
			score: score
		});

		return {
			success: true,
			score,
			passingScore: quiz.passingScore,
			passed: score >= quiz.passingScore
		};
	}
} satisfies Actions;
