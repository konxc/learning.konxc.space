import type { Actions, PageServerLoad } from './$types';
import { requireMentor } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { awardXP, checkAndAwardBadges } from '$lib/server/gamification';
import { createInAppNotification, sendNotification } from '$lib/server/notifications';

type SubmissionRecord = typeof schema.submission.$inferSelect;
type CourseRecord = typeof schema.course.$inferSelect;
type SubmissionWithCourse = SubmissionRecord & { course: CourseRecord | null };

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const mentor = await requireMentor({ user: locals.user });
	const courseId = params.id;
	const filterType = url.searchParams.get('type'); // 'quiz' | 'assignment' | null
	const filterStatus = url.searchParams.get('status'); // 'pending' | 'graded' | null

	// Verify mentor owns this course
	const course = await db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.id, courseId), eq(schema.course.mentorId, mentor.id)))
		.limit(1);

	if (course.length === 0) {
		return { course: null, submissions: [] };
	}

	// Get all submissions for this course
	const submissions = await db
		.select({
			submission: schema.submission,
			student: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email
			},
			lesson: {
				id: schema.lesson.id,
				title: schema.lesson.title
			}
		})
		.from(schema.submission)
		.innerJoin(schema.user, eq(schema.submission.userId, schema.user.id))
		.leftJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
		.where(eq(schema.submission.courseId, courseId))
		.orderBy(desc(schema.submission.createdAt));

	// Get quiz details for quiz submissions
	const quizSubmissions = submissions.filter((s) => s.submission.type === 'quiz');
	const quizIds = quizSubmissions
		.map((s) => s.submission.quizId)
		.filter((id): id is string => typeof id === 'string' && id.length > 0);

	const quizzes =
		quizIds.length > 0
			? await db.select().from(schema.quiz).where(inArray(schema.quiz.id, quizIds))
			: ([] as (typeof schema.quiz.$inferSelect)[]);

	const quizMap = new Map(quizzes.map((q) => [q.id, q]));

	// Get grades for submissions
	const gradedSubmissionIds = submissions.map((s) => s.submission.id);
	const grades =
		gradedSubmissionIds.length > 0
			? await db
					.select()
					.from(schema.submissionGrade)
					.where(inArray(schema.submissionGrade.submissionId, gradedSubmissionIds))
			: ([] as (typeof schema.submissionGrade.$inferSelect)[]);

	const gradeMap = new Map(grades.map((g) => [g.submissionId, g]));

	// Enrich submissions with quiz details and grades
	const enrichedSubmissions = submissions.map((s) => {
		const quiz = s.submission.quizId ? quizMap.get(s.submission.quizId) : null;
		const grade = gradeMap.get(s.submission.id);

		// Check if quiz submission needs manual review (free-text with no keywords)
		let needsManualReview = false;
		if (s.submission.type === 'quiz' && s.submission.payload) {
			try {
				const payload = JSON.parse(s.submission.payload);
				needsManualReview = payload.needsManualReview === true;
			} catch {
				// ignore parse errors
			}
		}

		// Determine if submission is pending
		const isPending =
			(s.submission.type === 'assignment' && !grade) ||
			(s.submission.type === 'quiz' && needsManualReview && !grade);

		return {
			...s,
			quiz,
			grade,
			isPending,
			needsManualReview
		};
	});

	// Apply filters
	let filtered = enrichedSubmissions;
	if (filterType) {
		filtered = filtered.filter((s) => s.submission.type === filterType);
	}
	if (filterStatus === 'pending') {
		filtered = filtered.filter((s) => s.isPending);
	} else if (filterStatus === 'graded') {
		filtered = filtered.filter((s) => !s.isPending);
	}

	return {
		course: course[0],
		submissions: filtered
	};
};

export const actions: Actions = {
	gradeAssignment: async (event) => {
		const { request, locals, url } = event;
		const mentor = await requireMentor({ user: locals.user });

		const formData = await request.formData();
		const submissionIdValue = formData.get('submissionId');
		const scoreValue = formData.get('score');
		const feedbackValue = formData.get('feedback');

		if (typeof submissionIdValue !== 'string' || submissionIdValue.trim().length === 0) {
			return actionFailure(400, 'Submission ID and score are required');
		}

		const parsedScore =
			typeof scoreValue === 'string' ? Number.parseInt(scoreValue, 10) : Number.NaN;
		if (!Number.isFinite(parsedScore)) {
			return actionFailure(400, 'Submission ID and score are required');
		}

		const feedback = typeof feedbackValue === 'string' ? feedbackValue.trim() : '';
		const submissionId = submissionIdValue.trim();
		const score = parsedScore;

		// Verify mentor owns the course — explicit join, no db.query with:
		const submissionRows = await db
			.select({
				id: schema.submission.id,
				userId: schema.submission.userId,
				courseId: schema.submission.courseId,
				lessonId: schema.submission.lessonId,
				type: schema.submission.type,
				payload: schema.submission.payload,
				metadata: schema.submission.metadata,
				score: schema.submission.score,
				createdAt: schema.submission.createdAt
			})
			.from(schema.submission)
			.where(eq(schema.submission.id, submissionId))
			.limit(1);

		const submissionBase = submissionRows[0];
		if (!submissionBase) return actionFailure(403, 'Unauthorized');

		const courseRows = await db
			.select()
			.from(schema.course)
			.where(eq(schema.course.id, submissionBase.courseId))
			.limit(1);

		const lessonRows = submissionBase.lessonId
			? await db
					.select()
					.from(schema.lesson)
					.where(eq(schema.lesson.id, submissionBase.lessonId))
					.limit(1)
			: [];

		const submission = {
			...submissionBase,
			course: courseRows[0] ?? null,
			lesson: lessonRows[0] ?? null
		};

		if (!submission.course || submission.course.mentorId !== mentor.id) {
			return actionFailure(403, 'Unauthorized');
		}

		// Check if already graded
		const existingGrade = await db
			.select()
			.from(schema.submissionGrade)
			.where(eq(schema.submissionGrade.submissionId, submissionId))
			.limit(1);

		if (existingGrade.length > 0) {
			return actionFailure(400, 'Submission already graded');
		}

		// Create grade
		const gradeId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.submissionGrade).values({
			id: gradeId,
			submissionId,
			gradedBy: mentor.id,
			score,
			feedback: feedback.length > 0 ? feedback : null
		});

		// Send notification to student about their grade
		await sendNotification({
			userId: submission.userId,
			type: 'grade',
			title: score >= 70 ? '🎉 Assignment Approved!' : '📝 Assignment Graded',
			message:
				score >= 70
					? `Congratulations! Your submission for "${submission.course?.title}" has been approved with score ${score}/100.`
					: `Your submission for "${submission.course?.title}" has been graded. Score: ${score}/100. ${feedback || ''}`,
			link: `/app/learning`,
			emailData: {
				lessonName: submission.lesson?.title || 'Assignment',
				score: score.toString(),
				feedback: feedback || '',
				viewUrl: `${url.origin}/app/learning`
			},
			channel: 'email' // Default to email for now to ensure delivery
		});

		// Award XP (50 XP for approval) and check for badges
		if (score >= 70) {
			await awardXP(submission.userId, 50, `Submission approved for ${submission.course?.title}`);
			await checkAndAwardBadges(submission.userId, 'submission');
		}

		return actionSuccess();
	}
} satisfies Actions;
