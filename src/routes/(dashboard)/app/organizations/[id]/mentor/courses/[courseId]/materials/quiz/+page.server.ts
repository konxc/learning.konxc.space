import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { actionFailure, actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async (event) => {
	const { params, locals } = event;
	const user = locals.user;
	if (!user) throw error(401, 'Unauthorized');

	const { membership } = await event.parent();
	if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
		throw error(403, 'Forbidden');
	}

	const orgId = membership.orgId;
	const { courseId } = params;

	// Verify course exists in this organization and mentor has access
	const [course] = await db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.id, courseId), eq(schema.course.orgId, orgId)))
		.limit(1);

	if (!course || (membership.role === 'mentor' && course.mentorId !== user.id)) {
		throw redirect(303, `/app/organizations/${orgId}/mentor/courses`);
	}

	// Get all modules and lessons for this course
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, courseId))
		.orderBy(schema.module.order);

	const allLessons = await db
		.select({
			lesson: schema.lesson,
			module: schema.module
		})
		.from(schema.lesson)
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId));

	// Get all existing quizzes for this course
	const quizzes = await db
		.select({
			quiz: schema.quiz,
			lesson: schema.lesson
		})
		.from(schema.quiz)
		.innerJoin(schema.lesson, eq(schema.quiz.lessonId, schema.lesson.id))
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId));

	return {
		course,
		modules,
		lessons: allLessons,
		quizzes
	};
};

export const actions: Actions = {
	createQuiz: async (event) => {
		const { request, params, locals } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;

		// Verify membership
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['owner', 'admin', 'mentor'].includes(membership.role)) {
			return actionFailure(403, 'Unauthorized management access');
		}

		const formData = await request.formData();
		const lessonId = formData.get('lessonId') as string;
		const title = formData.get('title') as string;
		const passingScore = parseInt(formData.get('passingScore') as string);

		if (!lessonId || !title || isNaN(passingScore)) {
			return actionFailure(400, 'Lesson ID, title, and passing score are required');
		}

		// Verify ownership and organization
		const lessonRows = await db
			.select({
				lesson: schema.lesson,
				module: schema.module,
				course: schema.course
			})
			.from(schema.lesson)
			.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
			.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
			.where(and(eq(schema.lesson.id, lessonId), eq(schema.course.orgId, orgId)))
			.limit(1);

		const row = lessonRows[0];
		if (!row) return actionFailure(404, 'Lesson not found');
		if (membership.role === 'mentor' && row.course.mentorId !== user.id) {
			return actionFailure(403, 'Unauthorized access');
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

	addQuestion: async (event) => {
		const { request, locals, params } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;

		const formData = await request.formData();
		const quizId = formData.get('quizId') as string;
		const question = formData.get('question') as string;
		const choicesText = formData.get('choices') as string; // Comma-separated
		const correctChoice = formData.get('correctChoice') as string;

		if (!quizId || !question || !choicesText || !correctChoice) {
			return actionFailure(400, 'All fields are required');
		}

		// Verify membership
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['owner', 'admin', 'mentor'].includes(membership.role)) {
			return actionFailure(403, 'Unauthorized management access');
		}

		// Verify quiz belongs to course in this organization
		const quizRows = await db
			.select({
				quiz: schema.quiz,
				course: schema.course
			})
			.from(schema.quiz)
			.innerJoin(schema.lesson, eq(schema.quiz.lessonId, schema.lesson.id))
			.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
			.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
			.where(and(eq(schema.quiz.id, quizId), eq(schema.course.orgId, orgId)))
			.limit(1);

		const row = quizRows[0];
		if (!row) return actionFailure(404, 'Quiz not found');
		if (membership.role === 'mentor' && row.course.mentorId !== user.id) {
			return actionFailure(403, 'Unauthorized access');
		}

		// Get current question count for order
		const [questionsCount] = await db
			.select({ total: count() })
			.from(schema.quizQuestion)
			.where(eq(schema.quizQuestion.quizId, quizId));

		const order = Number(questionsCount.total);

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
};
