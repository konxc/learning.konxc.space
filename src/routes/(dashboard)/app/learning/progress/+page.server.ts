import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count, isNotNull } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get active enrollments with course info
	const enrollments = await db
		.select({
			id: schema.enrollment.id,
			status: schema.enrollment.status,
			activatedAt: schema.enrollment.activatedAt,
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

	// Get progress stats for each course
	const courseProgress = await Promise.all(
		enrollments.map(async (enrollment) => {
			// Count total lessons
			const totalLessons = await db
				.select({ count: count() })
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.where(eq(schema.module.courseId, enrollment.course.id));

			// Count completed lessons
			const completedLessons = await db
				.select({ count: count() })
				.from(schema.lessonProgress)
				.innerJoin(schema.lesson, eq(schema.lessonProgress.lessonId, schema.lesson.id))
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.where(
					and(
						eq(schema.lessonProgress.userId, user.id),
						eq(schema.module.courseId, enrollment.course.id),
						isNotNull(schema.lessonProgress.completedAt)
					)
				);

			const total = Number(totalLessons[0]?.count || 0);
			const completed = Number(completedLessons[0]?.count || 0);
			const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

			return {
				...enrollment,
				totalLessons: total,
				completedLessons: completed,
				progressPercent: percentage
			};
		})
	);

	// Get overall stats
	const totalCourses = enrollments.length;
	const completedCourses = enrollments.filter((e) => e.completedAt).length;
	const activeCourses = enrollments.filter((e) => e.status === 'active' && !e.completedAt).length;

	// Get total lessons completed
	const totalLessonsCompleted = await db
		.select({ count: count() })
		.from(schema.lessonProgress)
		.where(
			and(eq(schema.lessonProgress.userId, user.id), isNotNull(schema.lessonProgress.completedAt))
		);

	// Get user XP
	const userXP = await db.query.userXP.findFirst({
		where: eq(schema.userXP.userId, user.id)
	});

	return {
		courseProgress,
		stats: {
			totalCourses,
			completedCourses,
			activeCourses,
			totalLessonsCompleted: Number(totalLessonsCompleted[0]?.count || 0),
			xp: userXP?.points || 0,
			level: userXP?.level || 1
		}
	};
};
