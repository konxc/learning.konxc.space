import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, asc, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const courseId = params.id;

	// Get course with mentor info (public access, no auth required)
	const courses = await db
		.select({
			course: {
				id: schema.course.id,
				title: schema.course.title,
				description: schema.course.description,
				thumbnailUrl: schema.course.thumbnailUrl,
				price: schema.course.price,
				duration: schema.course.duration,
				status: schema.course.status,
				createdAt: schema.course.createdAt
			},
			mentor: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName
			}
		})
		.from(schema.course)
		.leftJoin(schema.user, eq(schema.course.mentorId, schema.user.id))
		.where(eq(schema.course.id, courseId))
		.limit(1);

	if (courses.length === 0) {
		return {
			course: null,
			mentor: null,
			modules: []
		};
	}

	const courseData = courses[0];

	// Only show published courses
	if (courseData.course && courseData.course.status !== 'published') {
		return {
			course: null,
			mentor: null,
			modules: []
		};
	}

	// Get modules and lessons for curriculum
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, courseId))
		.orderBy(asc(schema.module.order));

	// Get lessons count per module
	const modulesWithLessons = await Promise.all(
		modules.map(async (mod) => {
			const lessons = await db
				.select()
				.from(schema.lesson)
				.where(eq(schema.lesson.moduleId, mod.id))
				.orderBy(asc(schema.lesson.order));
			return {
				...mod,
				lessons: lessons.map((l) => ({
					id: l.id,
					title: l.title
				}))
			};
		})
	);

	// Get enrollment count
	const enrollmentCount = await db
		.select()
		.from(schema.enrollment)
		.where(and(eq(schema.enrollment.courseId, courseId), eq(schema.enrollment.status, 'active')));

	return {
		course: courseData.course,
		mentor: courseData.mentor,
		modules: modulesWithLessons,
		enrollmentCount: enrollmentCount.length
	};
};
