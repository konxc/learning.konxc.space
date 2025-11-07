import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const courseId = event.params.courseId;

	// Verify enrollment with active status
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
		// Check if user is enrolled but pending
		const pendingEnrollment = await db
			.select()
			.from(schema.enrollment)
			.where(
				and(
					eq(schema.enrollment.userId, user.id),
					eq(schema.enrollment.courseId, courseId)
				)
			)
			.limit(1);

		if (pendingEnrollment.length > 0) {
			throw redirect(303, `/dashboard/my-courses`);
		}

		throw redirect(303, `/dashboard/courses/${courseId}`);
	}

	// Get course details
	const courses = await db
		.select()
		.from(schema.course)
		.where(eq(schema.course.id, courseId))
		.limit(1);

	if (courses.length === 0) {
		throw redirect(303, '/dashboard/courses');
	}

	const course = courses[0];

	// Get modules with lessons and materials
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, courseId))
		.orderBy(schema.module.order);

	// Get all lessons
	const lessons = await db
		.select()
		.from(schema.lesson)
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId))
		.orderBy(asc(schema.lesson.order));

	// Get all materials
	const materials = await db
		.select()
		.from(schema.material)
		.innerJoin(schema.lesson, eq(schema.material.lessonId, schema.lesson.id))
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId))
		.orderBy(asc(schema.material.order));

	// Get all quizzes
	const quizzes = await db
		.select()
		.from(schema.quiz)
		.innerJoin(schema.lesson, eq(schema.quiz.lessonId, schema.lesson.id))
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId));

	// Get user's progress
	const progress = await db
		.select()
		.from(schema.lessonProgress)
		.where(
			and(
				eq(schema.lessonProgress.userId, user.id),
				eq(schema.lessonProgress.courseId, courseId)
			)
		);

	// Structure data hierarchically
	const structuredModules = modules.map((module) => {
		const moduleLessons = lessons
			.filter((l) => l.lesson.moduleId === module.id)
			.map((l) => {
				const lessonMaterials = materials.filter((m) => m.material.lessonId === l.lesson.id);
				const lessonProgress = progress.find((p) => p.lessonId === l.lesson.id);
				const lessonQuiz = quizzes.find((q) => q.quiz.lessonId === l.lesson.id);

				return {
					...l.lesson,
					materials: lessonMaterials.map((m) => m.material),
					progress: lessonProgress || null,
					quiz: lessonQuiz ? lessonQuiz.quiz : null
				};
			});

		return {
			...module,
			lessons: moduleLessons
		};
	});

	// Get first lesson for redirect if no specific lesson selected
	const firstLesson =
		structuredModules[0]?.lessons?.[0] || null;

	return {
		course,
		modules: structuredModules,
		progress: progress.map((p) => ({
			lessonId: p.lessonId,
			lastPositionMs: p.lastPositionMs,
			completedAt: p.completedAt
		})),
		firstLesson
	};
};

