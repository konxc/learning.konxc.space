import type { Actions, PageServerLoad } from './$types';
import { requireMentor } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

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
		: [] as typeof schema.quiz.$inferSelect[];

	const quizMap = new Map(quizzes.map((q) => [q.id, q]));

	// Get grades for submissions
const gradedSubmissionIds = submissions.map((s) => s.submission.id);
const grades =
	gradedSubmissionIds.length > 0
		? await db
				.select()
				.from(schema.submissionGrade)
				.where(inArray(schema.submissionGrade.submissionId, gradedSubmissionIds))
		: [] as typeof schema.submissionGrade.$inferSelect[];

	const gradeMap = new Map(grades.map((g) => [g.submissionId, g]));

	// Enrich submissions with quiz details and grades
	const enrichedSubmissions = submissions.map((s) => {
		const quiz = s.submission.quizId ? quizMap.get(s.submission.quizId) : null;
		const grade = gradeMap.get(s.submission.id);

		// Determine if submission is pending (quiz is auto-graded, assignment needs manual grading)
		const isPending = s.submission.type === 'assignment' && !grade;

		return {
			...s,
			quiz,
			grade,
			isPending
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
	gradeAssignment: async ({ request, locals }) => {
		const mentor = await requireMentor({ user: locals.user });

		const formData = await request.formData();
		const submissionIdValue = formData.get('submissionId');
		const scoreValue = formData.get('score');
		const feedbackValue = formData.get('feedback');

		if (typeof submissionIdValue !== 'string' || submissionIdValue.trim().length === 0) {
			return fail(400, { error: 'Submission ID and score are required' });
		}

		const parsedScore = typeof scoreValue === 'string' ? Number.parseInt(scoreValue, 10) : Number.NaN;
		if (!Number.isFinite(parsedScore)) {
			return fail(400, { error: 'Submission ID and score are required' });
		}

		const feedback = typeof feedbackValue === 'string' ? feedbackValue.trim() : '';
		const submissionId = submissionIdValue.trim();
		const score = parsedScore;

		// Verify mentor owns the course
		const submission = (await db.query.submission.findFirst({
			where: eq(schema.submission.id, submissionId),
			with: {
				course: true
			}
		})) as SubmissionWithCourse | undefined;

		if (!submission?.course || submission.course.mentorId !== mentor.id) {
			return fail(403, { error: 'Unauthorized' });
		}

		// Check if already graded
		const existingGrade = await db
			.select()
			.from(schema.submissionGrade)
			.where(eq(schema.submissionGrade.submissionId, submissionId))
			.limit(1);

		if (existingGrade.length > 0) {
			return fail(400, { error: 'Submission already graded' });
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

		return { success: true };
	}
} satisfies Actions;
