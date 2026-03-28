import { requireMentor } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, isNotNull, count, or } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	const mentor = await requireMentor(event);
	const { userId } = event.params;

	// Verify the student exists and is enrolled in at least one mentor course
	const mentorCourses = await db
		.select({ id: schema.course.id, title: schema.course.title })
		.from(schema.course)
		.where(eq(schema.course.mentorId, mentor.id));

	const mentorCourseIds = mentorCourses.map((c) => c.id);

	if (mentorCourseIds.length === 0) {
		throw error(404, 'Student not found in your courses');
	}

	// Get student info
	const studentResult = await db
		.select({
			id: schema.user.id,
			username: schema.user.username,
			fullName: schema.user.fullName,
			email: schema.user.email,
			createdAt: schema.user.createdAt
		})
		.from(schema.user)
		.where(eq(schema.user.id, userId))
		.limit(1);

	if (!studentResult[0]) {
		throw error(404, 'Student not found');
	}

	const student = studentResult[0];

	// Get all enrollments for this student in mentor's courses
	const enrollments = await db
		.select({
			id: schema.enrollment.id,
			status: schema.enrollment.status,
			track: schema.enrollment.track,
			enrolledAt: schema.enrollment.enrolledAt,
			completedAt: schema.enrollment.completedAt,
			course: {
				id: schema.course.id,
				title: schema.course.title,
				thumbnailUrl: schema.course.thumbnailUrl,
				duration: schema.course.duration
			}
		})
		.from(schema.enrollment)
		.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.where(
			and(eq(schema.enrollment.userId, userId), eq(schema.course.mentorId, mentor.id))
		);

	if (enrollments.length === 0) {
		throw error(404, 'This student is not enrolled in any of your courses');
	}

	// Build per-course progress details
	const courseProgress = await Promise.all(
		enrollments.map(async (enrollment) => {
			// Total lessons in this course
			const totalResult = await db
				.select({ total: count(schema.lesson.id) })
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.where(eq(schema.module.courseId, enrollment.course.id));

			// Completed lessons by this student
			const completedResult = await db
				.select({ completed: count(schema.lessonProgress.id) })
				.from(schema.lessonProgress)
				.where(
					and(
						eq(schema.lessonProgress.userId, userId),
						eq(schema.lessonProgress.courseId, enrollment.course.id),
						isNotNull(schema.lessonProgress.completedAt)
					)
				);

			// Get individual lesson progress details
			const lessonDetails = await db
				.select({
					lesson: {
						id: schema.lesson.id,
						title: schema.lesson.title,
						order: schema.lesson.order
					},
					module: {
						id: schema.module.id,
						title: schema.module.title,
						order: schema.module.order
					},
					completedAt: schema.lessonProgress.completedAt,
					lastPositionMs: schema.lessonProgress.lastPositionMs
				})
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.leftJoin(
					schema.lessonProgress,
					and(
						eq(schema.lessonProgress.lessonId, schema.lesson.id),
						eq(schema.lessonProgress.userId, userId)
					)
				)
				.where(eq(schema.module.courseId, enrollment.course.id))
				.orderBy(schema.module.order, schema.lesson.order);

			const totalLessons = totalResult[0]?.total ?? 0;
			const completedLessons = completedResult[0]?.completed ?? 0;
			const progressPercent =
				totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

			return {
				enrollment,
				totalLessons,
				completedLessons,
				progressPercent,
				lessonDetails
			};
		})
	);

	// Get submissions for this student
	const submissions = await db
		.select({
			id: schema.submission.id,
			type: schema.submission.type,
			payload: schema.submission.payload,
			metadata: schema.submission.metadata,
			score: schema.submission.score,
			createdAt: schema.submission.createdAt,
			lesson: {
				id: schema.lesson.id,
				title: schema.lesson.title
			},
			course: {
				id: schema.course.id,
				title: schema.course.title
			}
		})
		.from(schema.submission)
		.innerJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
		.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
		.where(eq(schema.submission.userId, userId))
		.orderBy(schema.submission.createdAt);

	// Get grades for submissions
	const submissionIds = submissions.map((s) => s.id);
	let grades: Record<string, typeof schema.submissionGrade.$inferSelect> = {};
	if (submissionIds.length > 0) {
		const gradesResult = await db
			.select()
			.from(schema.submissionGrade)
			.where(
				// @ts-ignore - dynamic where clause
				or(...submissionIds.map((id) => eq(schema.submissionGrade.submissionId, id)))
			);
		for (const g of gradesResult) {
			grades[g.submissionId] = g;
		}
	}

	return {
		student,
		courseProgress,
		submissions: submissions.map((s) => ({
			...s,
			grade: grades[s.id] || null
		}))
	};
};

export const actions: Actions = {
	grade: async (event) => {
		const mentor = await requireMentor(event);
		const { userId } = event.params;

		const formData = await event.request.formData();
		const submissionId = formData.get('submissionId') as string;
		const score = parseInt(formData.get('score') as string);
		const feedback = formData.get('feedback') as string;

		if (!submissionId || isNaN(score) || score < 0 || score > 100) {
			return fail(400, { error: 'Score must be between 0-100' });
		}

		// Verify submission belongs to a student in mentor's course
		const submission = await db
			.select()
			.from(schema.submission)
			.where(eq(schema.submission.id, submissionId))
			.limit(1);

		if (!submission[0] || submission[0].userId !== userId) {
			return fail(403, { error: 'Submission not found' });
		}

		// Verify course belongs to mentor
		const course = await db
			.select()
			.from(schema.course)
			.where(eq(schema.course.id, submission[0].courseId))
			.limit(1);

		if (!course[0] || course[0].mentorId !== mentor.id) {
			return fail(403, { error: 'Not authorized to grade this submission' });
		}

		// Check if grade already exists
		const existingGrade = await db
			.select()
			.from(schema.submissionGrade)
			.where(eq(schema.submissionGrade.submissionId, submissionId))
			.limit(1);

		if (existingGrade[0]) {
			// Update existing grade
			await db
				.update(schema.submissionGrade)
				.set({
					score,
					feedback: feedback || null,
					gradedAt: new Date()
				})
				.where(eq(schema.submissionGrade.id, existingGrade[0].id));
		} else {
			// Create new grade
			await db.insert(schema.submissionGrade).values({
				id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10))),
				submissionId,
				gradedBy: mentor.id,
				score,
				feedback: feedback || null,
				gradedAt: new Date()
			});
		}

		return { success: true };
	}
};
