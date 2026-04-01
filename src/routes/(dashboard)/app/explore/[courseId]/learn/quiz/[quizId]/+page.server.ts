import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { actionFailure, actionSuccess } from '$lib/server/actions';

type QuizChoicePublic = Pick<typeof schema.quizChoice.$inferSelect, 'id' | 'text'>;
type QuizChoiceWithAnswer = typeof schema.quizChoice.$inferSelect;

type QuizQuestionWithChoices<TChoice> = typeof schema.quizQuestion.$inferSelect & {
	choices: TChoice[];
	expectedKeywords: string | null;
	maxScore: number | null;
};

type QuizWithQuestions<TChoice> = typeof schema.quiz.$inferSelect & {
	questions: QuizQuestionWithChoices<TChoice>[];
};

type QuizSubmissionAnswers = Record<string, string | string[]>;

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
		throw redirect(303, `/app/explore/${courseId}`);
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
		throw redirect(303, `/app/explore/${courseId}/learn`);
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
		submission: existingSubmission[0] || null,
		canRetake:
			existingSubmission.length > 0 && (existingSubmission[0].score ?? 0) < quiz.passingScore
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
			return actionFailure(404, 'Quiz not found');
		}

		const rawAnswers = formData.get('answers');
		if (typeof rawAnswers !== 'string') {
			return actionFailure(400, 'Invalid answers payload');
		}

		let answers: QuizSubmissionAnswers;
		try {
			answers = JSON.parse(rawAnswers) as QuizSubmissionAnswers;
		} catch (error) {
			return actionFailure(400, 'Invalid answers payload');
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
			return actionFailure(400, 'Quiz already submitted');
		}

		// Grade the quiz
		let totalScore = 0;
		let maxPossibleScore = 0;
		const questions: QuizQuestionWithChoices<QuizChoiceWithAnswer>[] =
			quiz.questions ?? ([] as QuizQuestionWithChoices<QuizChoiceWithAnswer>[]);
		const totalQuestions = questions.length;

		if (totalQuestions === 0) {
			return actionFailure(400, 'Quiz has no questions');
		}

		for (const question of questions) {
			const userAnswer = answers[question.id];
			const questionType = question.type || 'mcq';
			const questionMaxScore = question.maxScore || 10;
			maxPossibleScore += questionMaxScore;

			if (!userAnswer) continue;

			if (questionType === 'mcq') {
				// Single choice question
				const choices = question.choices ?? [];
				const correctChoice = choices.find((choice) => choice.isCorrect);
				if (correctChoice && userAnswer === correctChoice.id) {
					totalScore += questionMaxScore;
				}
			} else if (questionType === 'multi-select') {
				// Multi-select question - userAnswer is an array of choice IDs
				const selectedIds = Array.isArray(userAnswer) ? userAnswer : [];
				const choices = question.choices ?? [];
				const correctChoiceIds = choices.filter((c) => c.isCorrect).map((c) => c.id);
				const incorrectChoiceIds = choices.filter((c) => !c.isCorrect).map((c) => c.id);

				// Check if all correct answers are selected AND no incorrect answers
				const allCorrectSelected = correctChoiceIds.every((id) => selectedIds.includes(id));
				const noIncorrectSelected = !selectedIds.some((id) => incorrectChoiceIds.includes(id));

				if (allCorrectSelected && noIncorrectSelected && selectedIds.length > 0) {
					totalScore += questionMaxScore;
				} else {
					// Partial credit: give points for each correct selection, minus penalties for incorrect
					let partialScore = 0;
					const pointsPerCorrect = questionMaxScore / (correctChoiceIds.length || 1);
					const penaltyPerIncorrect = pointsPerCorrect; // Same penalty as reward

					for (const id of selectedIds) {
						if (correctChoiceIds.includes(id)) {
							partialScore += pointsPerCorrect;
						} else {
							partialScore -= penaltyPerIncorrect;
						}
					}
					totalScore += Math.max(0, Math.min(questionMaxScore, partialScore));
				}
			} else if (questionType === 'free-text') {
				// Free-text question - check for keyword matches
				const expectedKeywords =
					question.expectedKeywords?.split(',').map((k) => k.trim().toLowerCase()) || [];
				const answerText = (userAnswer as string).toLowerCase();

				if (expectedKeywords.length === 0) {
					// No keywords defined, needs manual grading - give 0 for now
					// TODO: Flag for manual review
				} else {
					// Count how many keywords are found
					const matchedKeywords = expectedKeywords.filter((keyword) =>
						answerText.includes(keyword)
					);
					const matchRatio = matchedKeywords.length / expectedKeywords.length;
					totalScore += Math.round(questionMaxScore * matchRatio);
				}
			}
		}

		// Convert to percentage
		const score = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

		// Save submission
		const submissionId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.submission).values({
			id: submissionId,
			userId: user.id,
			courseId: courseId,
			quizId: quizId,
			type: 'quiz',
			payload: JSON.stringify({ answers, totalScore, maxPossibleScore, totalQuestions }),
			score: score
		});

		const passed = score >= quiz.passingScore;

		// If quiz passed, mark the associated lesson as completed
		if (passed) {
			// Get the lesson this quiz belongs to
			const quizWithLesson = await db
				.select({ lessonId: schema.quiz.lessonId })
				.from(schema.quiz)
				.where(eq(schema.quiz.id, quizId))
				.limit(1);

			if (quizWithLesson[0]?.lessonId) {
				// Check if lesson progress already exists
				const existingProgress = await db
					.select()
					.from(schema.lessonProgress)
					.where(
						and(
							eq(schema.lessonProgress.userId, user.id),
							eq(schema.lessonProgress.lessonId, quizWithLesson[0].lessonId)
						)
					)
					.limit(1);

				if (existingProgress.length === 0) {
					// Create progress record
					await db.insert(schema.lessonProgress).values({
						id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10))),
						courseId: courseId,
						userId: user.id,
						lessonId: quizWithLesson[0].lessonId,
						completedAt: new Date()
					});
				} else if (!existingProgress[0].completedAt) {
					// Update existing progress
					await db
						.update(schema.lessonProgress)
						.set({ completedAt: new Date() })
						.where(eq(schema.lessonProgress.id, existingProgress[0].id));
				}

				// Trigger badge checking
				const { checkAndAwardBadges } = await import('$lib/server/badge');
				await checkAndAwardBadges(user.id);
			}
		}

		return actionSuccess({
			data: {
				score,
				passingScore: quiz.passingScore,
				passed
			}
		});
	},
	retakeQuiz: async (event) => {
		const user = await requireAuth(event);
		const { quizId } = event.params;

		// Delete existing submission
		await db
			.delete(schema.submission)
			.where(
				and(
					eq(schema.submission.userId, user.id),
					eq(schema.submission.quizId, quizId),
					eq(schema.submission.type, 'quiz')
				)
			);

		return actionSuccess();
	}
} satisfies Actions;
