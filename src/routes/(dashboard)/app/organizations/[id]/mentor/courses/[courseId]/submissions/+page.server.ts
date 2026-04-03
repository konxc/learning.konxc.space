import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { awardXP, checkAndAwardBadges } from '$lib/server/gamification';
import { createInAppNotification, sendNotification } from '$lib/server/notifications';

type SubmissionRecord = typeof schema.submission.$inferSelect;
type CourseRecord = typeof schema.course.$inferSelect;
type SubmissionWithCourse = SubmissionRecord & { course: CourseRecord | null };

export const load: PageServerLoad = async (event) => {
	const { params, locals, url } = event;
	const user = locals.user;
	if (!user) throw error(401, 'Unauthorized');

	const { membership } = await event.parent();
	if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
		throw error(403, 'Forbidden');
	}

	const orgId = membership.orgId;
	const { courseId } = params;
	const filterType = url.searchParams.get('type'); // 'quiz' | 'assignment' | null
	const filterStatus = url.searchParams.get('status'); // 'pending' | 'graded' | null

	// Verify course exists in this organization and mentor has access
	const [course] = await db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.id, courseId), eq(schema.course.orgId, orgId)))
		.limit(1);

	if (!course || (membership.role === 'mentor' && course.mentorId !== user.id)) {
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
		course,
		submissions: filtered
	};
};

export const actions: Actions = {
	gradeAssignment: async (event) => {
		const { request, locals, url, params } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;
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

		// Verify membership and role
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['owner', 'admin', 'mentor'].includes(membership.role)) {
			return actionFailure(403, 'Unauthorized management access');
		}

		// Verify submission and course belong to this org, and if mentor, they own it
		const submissionRows = await db
			.select({
				submission: schema.submission,
				course: schema.course,
				lesson: schema.lesson
			})
			.from(schema.submission)
			.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
			.leftJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
			.where(and(eq(schema.submission.id, submissionId), eq(schema.course.orgId, orgId)))
			.limit(1);

		const row = submissionRows[0];
		if (!row) return actionFailure(404, 'Submission not found');

		if (membership.role === 'mentor' && row.course.mentorId !== user.id) {
			return actionFailure(403, 'Unauthorized course access');
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
			gradedBy: user.id,
			score,
			feedback: feedback.length > 0 ? feedback : null
		});

		// Send notification to student about their grade
		await sendNotification({
			userId: row.submission.userId,
			type: 'grade',
			title: score >= 70 ? '🎉 Assignment Approved!' : '📝 Assignment Graded',
			message:
				score >= 70
					? `Congratulations! Your submission for "${row.course.title}" has been approved with score ${score}/100.`
					: `Your submission for "${row.course.title}" has been graded. Score: ${score}/100. ${feedback || ''}`,
			link: `/app/learning`,
			emailData: {
				lessonName: row.lesson?.title || 'Assignment',
				score: score.toString(),
				feedback: feedback || '',
				viewUrl: `${url.origin}/app/learning`
			},
			channel: 'email' // Default to email for now to ensure delivery
		});

		// Award XP (50 XP for approval) and check for badges
		if (score >= 70) {
			await awardXP(row.submission.userId, 50, `Submission approved for ${row.course.title}`);
			await checkAndAwardBadges(row.submission.userId, 'submission');
		}

		return actionSuccess();
	}
} satisfies Actions;
