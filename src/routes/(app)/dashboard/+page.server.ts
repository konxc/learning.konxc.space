import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Role-specific statistics
	if (user.role === 'user') {
		// Get user's enrollment stats
		const activeEnrollments = await db
			.select()
			.from(schema.enrollment)
			.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.status, 'active')));

		const pendingEnrollments = await db
			.select()
			.from(schema.enrollment)
			.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.status, 'pending')));

		const certificates = await db
			.select()
			.from(schema.certificate)
			.where(eq(schema.certificate.userId, user.id));

		// Calculate average progress
		let totalProgress = 0;
		let completedLessons = 0;
		let totalLessons = 0;

		for (const enrollment of activeEnrollments) {
			const lessons = await db
				.select()
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.where(eq(schema.module.courseId, enrollment.courseId));

			totalLessons += lessons.length;

			const progress = await db
				.select()
				.from(schema.lessonProgress)
				.where(
					and(
						eq(schema.lessonProgress.userId, user.id),
						eq(schema.lessonProgress.courseId, enrollment.courseId)
					)
				);

			completedLessons += progress.length;
		}

		const avgProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

	return {
		stats: {
			myCourses: activeEnrollments.length,
			progress: avgProgress,
			certificates: certificates.length,
			pendingPayments: pendingEnrollments.length
		},
		user: event.locals.user
	};
	} else if (user.role === 'mentor' || user.role === 'admin') {
		// Get mentor's courses
		const mentorCourses = await db
			.select()
			.from(schema.course)
			.where(eq(schema.course.mentorId, user.id));

		// Get total students across mentor's courses
		const courseIds = mentorCourses.map((c) => c.id);
		let totalStudents = 0;

		for (const courseId of courseIds) {
			const students = await db
				.select()
				.from(schema.enrollment)
				.where(
					and(eq(schema.enrollment.courseId, courseId), eq(schema.enrollment.status, 'active'))
				);
			totalStudents += students.length;
		}

		// Get pending submissions
		let pendingSubmissions = 0;
		for (const courseId of courseIds) {
			const submissions = await db
				.select()
				.from(schema.submission)
				.where(
					and(
						eq(schema.submission.courseId, courseId),
						eq(schema.submission.type, 'assignment')
					)
				);

			for (const submission of submissions) {
				const grade = await db
					.select()
					.from(schema.submissionGrade)
					.where(eq(schema.submissionGrade.submissionId, submission.id))
					.limit(1);

				if (grade.length === 0) {
					pendingSubmissions++;
				}
			}
		}

		return {
			stats: {
				myCourses: mentorCourses.length,
				totalStudents: totalStudents,
				pendingSubmissions: pendingSubmissions
			},
			user: event.locals.user
		};
	} else if (user.role === 'admin') {
		// Admin statistics
		const pendingPayments = await db
			.select()
			.from(schema.paymentProof)
			.where(eq(schema.paymentProof.status, 'pending'));

		const pendingApplications = await db
			.select()
			.from(schema.mentorApplication)
			.where(eq(schema.mentorApplication.status, 'pending'));

		return {
			stats: {
				pendingPayments: pendingPayments.length,
				pendingApplications: pendingApplications.length
			},
			user: event.locals.user
		};
	}

	// Default stats
	return {
		stats: {
			myCourses: 0,
			progress: 0,
			certificates: 0,
			messages: 0
		},
		user: event.locals.user
	};
};

