import type { Actions, PageServerLoad } from './$types';
import { requireMentor } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ params, locals }) => {
	const mentor = await requireMentor({ user: locals.user });
	const { id } = params;

	// Verify mentor owns this course
	const course = await db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
		.limit(1);

	if (course.length === 0) {
		throw redirect(303, '/dashboard/mentor/courses');
	}

	// Get modules with lessons and materials
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, id))
		.orderBy(schema.module.order);

	const lessons = await db
		.select()
		.from(schema.lesson)
		.where(eq(schema.lesson.moduleId, modules[0]?.id || ''))
		.orderBy(schema.lesson.order);

	const materials = await db
		.select()
		.from(schema.material)
		.where(eq(schema.material.lessonId, lessons[0]?.id || ''))
		.orderBy(schema.material.order);

	// For simplicity, we'll load all and structure on the frontend
	const allLessons = await db.select().from(schema.lesson).orderBy(schema.lesson.order);

	const allMaterials = await db.select().from(schema.material).orderBy(schema.material.order);

	return {
		course: course[0],
		modules,
		lessons: allLessons,
		materials: allMaterials
	};
};

export const actions: Actions = {
	createModule: async ({ request, params, locals }) => {
		const mentor = await requireMentor({ user: locals.user });
		const { id } = params;

		const formData = await request.formData();
		const title = formData.get('title') as string;

		if (!title) {
			return fail(400, { error: 'Title is required' });
		}

		// Verify ownership
		const course = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (course.length === 0) {
			return fail(403, { error: 'Unauthorized' });
		}

		// Get next order
		const modules = await db.select().from(schema.module).where(eq(schema.module.courseId, id));

		const order = modules.length;

		const moduleId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.module).values({
			id: moduleId,
			courseId: id,
			title,
			order
		});

		return { success: true };
	},

	createLesson: async ({ request, params, locals }) => {
		const mentor = await requireMentor({ user: locals.user });
		const { id } = params;

		const formData = await request.formData();
		const moduleId = formData.get('moduleId') as string;
		const title = formData.get('title') as string;

		if (!moduleId || !title) {
			return fail(400, { error: 'Module ID and title are required' });
		}

		// Verify ownership
		const module = await db
			.select({
				module: schema.module,
				course: schema.course
			})
			.from(schema.module)
			.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
			.where(and(eq(schema.module.id, moduleId), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (module.length === 0) {
			return fail(403, { error: 'Unauthorized' });
		}

		// Get next order
		const lessons = await db
			.select()
			.from(schema.lesson)
			.where(eq(schema.lesson.moduleId, moduleId));

		const order = lessons.length;

		const lessonId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.lesson).values({
			id: lessonId,
			moduleId,
			title,
			order
		});

		return { success: true };
	},

	createMaterial: async ({ request, params, locals }) => {
		const mentor = await requireMentor({ user: locals.user });
		const { id } = params;

		const formData = await request.formData();
		const lessonId = formData.get('lessonId') as string;
		const type = formData.get('type') as string;
		const content = formData.get('content') as string;
		const url = formData.get('url') as string;

		if (!lessonId || !type) {
			return fail(400, { error: 'Lesson ID and type are required' });
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
			return fail(403, { error: 'Unauthorized' });
		}

		// Get next order
		const materials = await db
			.select()
			.from(schema.material)
			.where(eq(schema.material.lessonId, lessonId));

		const order = materials.length;

		const materialId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.material).values({
			id: materialId,
			lessonId,
			type,
			content: type === 'text' ? content : null,
			url: type === 'video' || type === 'link' ? url : null,
			order
		});

		return { success: true };
	}
} satisfies Actions;
