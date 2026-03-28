import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import { eq, and, isNotNull, count, desc } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get all enrollments for this user
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
				thumbnailUrl: schema.course.thumbnailUrl
			}
		})
		.from(schema.enrollment)
		.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.where(eq(schema.enrollment.userId, user.id));

	// Get progress for each course
	const coursesWithProgress = await Promise.all(
		enrollments.map(async (enrollment) => {
			const totalLessons = await db
				.select({ count: count(schema.lesson.id) })
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.where(eq(schema.module.courseId, enrollment.course.id));

			const completedLessons = await db
				.select({ count: count(schema.lessonProgress.id) })
				.from(schema.lessonProgress)
				.where(
					and(
						eq(schema.lessonProgress.userId, user.id),
						eq(schema.lessonProgress.courseId, enrollment.course.id),
						isNotNull(schema.lessonProgress.completedAt)
					)
				);

			const total = totalLessons[0]?.count || 0;
			const completed = completedLessons[0]?.count || 0;
			const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

			return { ...enrollment, totalLessons: total, completedLessons: completed, progressPercent: percent };
		})
	);

	// Get submissions and grades
	const submissions = await db
		.select({
			id: schema.submission.id,
			type: schema.submission.type,
			score: schema.submission.score,
			createdAt: schema.submission.createdAt,
			lessonTitle: schema.lesson.title,
			courseTitle: schema.course.title,
			gradedAt: schema.submissionGrade.gradedAt,
			feedback: schema.submissionGrade.feedback
		})
		.from(schema.submission)
		.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
		.leftJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
		.leftJoin(schema.submissionGrade, eq(schema.submission.id, schema.submissionGrade.submissionId))
		.where(eq(schema.submission.userId, user.id))
		.orderBy(desc(schema.submission.createdAt))
		.limit(10);

	// Calculate overall stats
	const totalCourses = coursesWithProgress.length;
	const completedCourses = coursesWithProgress.filter(e => e.status === 'completed').length;
	const inProgressCourses = coursesWithProgress.filter(e => e.status === 'active' && e.progressPercent > 0).length;
	const totalLessonsCompleted = coursesWithProgress.reduce((sum, c) => sum + c.completedLessons, 0);

	// Quiz stats
	const gradedSubmissions = submissions.filter(s => s.score !== null);
	const avgScore = gradedSubmissions.length > 0
		? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length)
		: 0;
	const passedQuizzes = gradedSubmissions.filter(s => (s.score || 0) >= 70).length;

	// Get certificates
	const certificates = await db
		.select({
			id: schema.certificate.id,
			serial: schema.certificate.serial,
			issuedAt: schema.certificate.issuedAt,
			courseTitle: schema.course.title
		})
		.from(schema.certificate)
		.innerJoin(schema.course, eq(schema.certificate.courseId, schema.course.id))
		.where(eq(schema.certificate.userId, user.id))
		.orderBy(desc(schema.certificate.issuedAt));

	// Get user XP if exists
	const userXP = await db
		.select()
		.from(schema.userXP)
		.where(eq(schema.userXP.userId, user.id))
		.limit(1);

	return {
		enrollments: coursesWithProgress,
		submissions,
		certificates,
		stats: {
			totalCourses,
			completedCourses,
			inProgressCourses,
			totalLessonsCompleted,
			avgScore,
			passedQuizzes,
			totalSubmissions: submissions.length
		},
		xp: userXP[0] || null
	};
};
