import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
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
	const quizRow = await db.select().from(schema.quiz).where(eq(schema.quiz.id, quizId)).limit(1);

	if (!quizRow[0]) {
		throw redirect(303, `/app/explore/${courseId}/learn`);
	}

	const questions = await db
		.select()
		.from(schema.quizQuestion)
		.where(eq(schema.quizQuestion.quizId, quizId))
		.orderBy(asc(schema.quizQuestion.order));

	const questionIds = questions.map((q) => q.id);
	const allChoices =
		questionIds.length > 0
			? await db
					.select({
						id: schema.quizChoice.id,
						text: schema.quizChoice.text,
						questionId: schema.quizChoice.questionId
					})
					.from(schema.quizChoice)
					.where(eq(schema.quizChoice.questionId, questionIds[0]))
			: [];

	// Build choices per question (fetch all at once would need inArray)
	const choicesPerQuestion: Record<string, QuizChoicePublic[]> = {};
	for (const qId of questionIds) {
		const choices = await db
			.select({ id: schema.quizChoice.id, text: schema.quizChoice.text })
			.from(schema.quizChoice)
			.where(eq(schema.quizChoice.questionId, qId));
		choicesPerQuestion[qId] = choices;
	}

	const quiz: QuizWithQuestions<QuizChoicePublic> = {
		...quizRow[0],
		questions: questions.map((q) => ({
			...q,
			choices: choicesPerQuestion[q.id] ?? []
		}))
	};

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

	// Check if submission needs manual review
	const submissionNeedsReview = existingSubmission[0]?.payload
		? (() => {
				try {
					return JSON.parse(existingSubmission[0].payload).needsManualReview === true;
				} catch {
					return false;
				}
			})()
		: false;

	return {
		quiz,
		hasSubmitted: existingSubmission.length > 0,
		submission: existingSubmission[0] || null,
		needsManualReview: submissionNeedsReview,
		canRetake:
			existingSubmission.length > 0 &&
			!submissionNeedsReview &&
			(existingSubmission[0].score ?? 0) < quiz.passingScore
	};
};

export const actions: Actions = {
	submitQuiz: async (event) => {
		const user = await requireAuth(event);
		const { courseId, quizId } = event.params;

		const formData = await event.request.formData();

		// Get quiz with correct answers
		const quizBaseRow = await db
			.select()
			.from(schema.quiz)
			.where(eq(schema.quiz.id, quizId))
			.limit(1);

		if (!quizBaseRow[0]) {
			return actionFailure(404, 'Quiz not found');
		}

		const quizQuestions = await db
			.select()
			.from(schema.quizQuestion)
			.where(eq(schema.quizQuestion.quizId, quizId))
			.orderBy(asc(schema.quizQuestion.order));

		const choicesWithAnswers: Record<string, QuizChoiceWithAnswer[]> = {};
		for (const q of quizQuestions) {
			choicesWithAnswers[q.id] = await db
				.select()
				.from(schema.quizChoice)
				.where(eq(schema.quizChoice.questionId, q.id));
		}

		const quiz: QuizWithQuestions<QuizChoiceWithAnswer> = {
			...quizBaseRow[0],
			questions: quizQuestions.map((q) => ({
				...q,
				choices: choicesWithAnswers[q.id] ?? []
			}))
		};

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
		let needsManualReview = false;
		const reviewedAnswers: Array<{
			questionId: string;
			answer: string | string[];
			status: 'correct' | 'incorrect' | 'partial' | 'pending';
		}> = [];
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

			if (!userAnswer) {
				reviewedAnswers.push({ questionId: question.id, answer: '', status: 'incorrect' });
				continue;
			}

			if (questionType === 'mcq') {
				// Single choice question
				const choices = question.choices ?? [];
				const correctChoice = choices.find((choice) => choice.isCorrect);
				if (correctChoice && userAnswer === correctChoice.id) {
					totalScore += questionMaxScore;
					reviewedAnswers.push({ questionId: question.id, answer: userAnswer, status: 'correct' });
				} else {
					reviewedAnswers.push({
						questionId: question.id,
						answer: userAnswer,
						status: 'incorrect'
					});
				}
			} else if (questionType === 'multi-select') {
				// Multi-select question - userAnswer is an array of choice IDs
				const selectedIds = Array.isArray(userAnswer) ? userAnswer : [];
				const choices = question.choices ?? [];
				const correctChoiceIds = choices.filter((c) => c.isCorrect).map((c) => c.id);
				const incorrectChoiceIds = choices.filter((c) => !c.isCorrect).map((c) => c.id);

				const allCorrectSelected = correctChoiceIds.every((id) => selectedIds.includes(id));
				const noIncorrectSelected = !selectedIds.some((id) => incorrectChoiceIds.includes(id));

				if (allCorrectSelected && noIncorrectSelected && selectedIds.length > 0) {
					totalScore += questionMaxScore;
					reviewedAnswers.push({ questionId: question.id, answer: selectedIds, status: 'correct' });
				} else {
					let partialScore = 0;
					const pointsPerCorrect = questionMaxScore / (correctChoiceIds.length || 1);
					const penaltyPerIncorrect = pointsPerCorrect;

					for (const id of selectedIds) {
						if (correctChoiceIds.includes(id)) {
							partialScore += pointsPerCorrect;
						} else {
							partialScore -= penaltyPerIncorrect;
						}
					}
					const finalPartial = Math.max(0, Math.min(questionMaxScore, partialScore));
					totalScore += finalPartial;
					const status: 'partial' | 'incorrect' = finalPartial > 0 ? 'partial' : 'incorrect';
					reviewedAnswers.push({ questionId: question.id, answer: selectedIds, status });
				}
			} else if (questionType === 'free-text') {
				// Free-text question - check for keyword matches
				const expectedKeywords =
					question.expectedKeywords?.split(',').map((k) => k.trim().toLowerCase()) || [];
				const answerText = (userAnswer as string).toLowerCase();

				if (expectedKeywords.length === 0) {
					// No keywords defined - flag for manual review
					needsManualReview = true;
					maxPossibleScore -= questionMaxScore; // Don't count toward max
					reviewedAnswers.push({
						questionId: question.id,
						answer: userAnswer as string,
						status: 'pending'
					});
				} else {
					// Count how many keywords are found
					const matchedKeywords = expectedKeywords.filter((keyword) =>
						answerText.includes(keyword)
					);
					const matchRatio = matchedKeywords.length / expectedKeywords.length;
					totalScore += Math.round(questionMaxScore * matchRatio);
					const status = matchRatio >= 1 ? 'correct' : matchRatio > 0 ? 'partial' : 'incorrect';
					reviewedAnswers.push({ questionId: question.id, answer: userAnswer as string, status });
				}
			}
		}

		// Convert to percentage (only count graded questions)
		const score = needsManualReview
			? null
			: maxPossibleScore > 0
				? Math.round((totalScore / maxPossibleScore) * 100)
				: 0;

		// Save submission
		const submissionId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.submission).values({
			id: submissionId,
			userId: user.id,
			courseId: courseId,
			quizId: quizId,
			type: 'quiz',
			payload: JSON.stringify({
				answers,
				totalScore,
				maxPossibleScore,
				totalQuestions,
				needsManualReview,
				reviewedAnswers
			}),
			score: score
		});

		const passed = score !== null && score >= quiz.passingScore;

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
				passed,
				needsManualReview
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
