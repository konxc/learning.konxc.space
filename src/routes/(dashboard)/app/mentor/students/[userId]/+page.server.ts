import { requireMentor } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, isNotNull, count } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

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

	return {
		student,
		courseProgress
	};
};
