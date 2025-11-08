import type { Actions, PageServerLoad } from './$types';
import { requireMentor } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { actionFailure, actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async ({ params, locals }) => {
	const mentor = await requireMentor({ user: locals.user });
	const courseId = params.id;

	// Verify mentor owns this course
	const course = await db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.id, courseId), eq(schema.course.mentorId, mentor.id)))
		.limit(1);

	if (course.length === 0) {
		throw redirect(303, '/dashboard/mentor/courses');
	}

	// Get all modules and lessons for this course
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, courseId))
		.orderBy(schema.module.order);

	const allLessons = await db
		.select()
		.from(schema.lesson)
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId));

	// Get all existing quizzes
	const quizzes = await db
		.select()
		.from(schema.quiz)
		.innerJoin(schema.lesson, eq(schema.quiz.lessonId, schema.lesson.id));

	return {
		course: course[0],
		modules: modules,
		lessons: allLessons,
		quizzes: quizzes
	};
};

export const actions: Actions = {
	createQuiz: async ({ request, params, locals }) => {
		const mentor = await requireMentor({ user: locals.user });
		const courseId = params.id;

		const formData = await request.formData();
		const lessonId = formData.get('lessonId') as string;
		const title = formData.get('title') as string;
		const passingScore = parseInt(formData.get('passingScore') as string);

		if (!lessonId || !title || isNaN(passingScore)) {
			return actionFailure(400, 'Lesson ID, title, and passing score are required');
		}

		// Verify ownership
		const lesson = await db
			.select({
				lesson: schema.lesson,
				module: schema.module,
				course: schema.course
			})
			.from(schema.lesson)
			.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
			.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
			.where(and(eq(schema.lesson.id, lessonId), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (lesson.length === 0) {
			return actionFailure(403, 'Unauthorized');
		}

		// Check if quiz already exists for this lesson
		const existingQuiz = await db
			.select()
			.from(schema.quiz)
			.where(eq(schema.quiz.lessonId, lessonId))
			.limit(1);

		if (existingQuiz.length > 0) {
			return actionFailure(400, 'Quiz already exists for this lesson');
		}

		const quizId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.quiz).values({
			id: quizId,
			lessonId,
			title,
			passingScore
		});

		return actionSuccess({ data: { quizId }, message: 'Quiz berhasil dibuat.' });
	},

	addQuestion: async ({ request, locals }) => {
		const mentor = await requireMentor({ user: locals.user });

		const formData = await request.formData();
		const quizId = formData.get('quizId') as string;
		const question = formData.get('question') as string;
		const choicesText = formData.get('choices') as string; // Comma-separated
		const correctChoice = formData.get('correctChoice') as string;

		if (!quizId || !question || !choicesText || !correctChoice) {
			return actionFailure(400, 'All fields are required');
		}

		// Verify ownership
		const quiz = await db
			.select({
				quiz: schema.quiz,
				lesson: schema.lesson,
				module: schema.module,
				course: schema.course
			})
			.from(schema.quiz)
			.innerJoin(schema.lesson, eq(schema.quiz.lessonId, schema.lesson.id))
			.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
			.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
			.where(and(eq(schema.quiz.id, quizId), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (quiz.length === 0) {
			return actionFailure(403, 'Unauthorized');
		}

		// Get current question count for order
		const questions = await db
			.select()
			.from(schema.quizQuestion)
			.where(eq(schema.quizQuestion.quizId, quizId));

		const order = questions.length;

		const questionId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.quizQuestion).values({
			id: questionId,
			quizId,
			type: 'mcq',
			question,
			order
		});

		// Parse and add choices
		const choices = choicesText.split(',').map((c) => c.trim());
		for (let i = 0; i < choices.length; i++) {
			const choiceId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
			await db.insert(schema.quizChoice).values({
				id: choiceId,
				questionId,
				text: choices[i],
				isCorrect: choices[i] === correctChoice
			});
		}

		return actionSuccess({ message: 'Pertanyaan berhasil ditambahkan.' });
	}
} satisfies Actions;

