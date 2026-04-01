import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	const courseId = event.params.id;

	// Get course
	const courses = await db
		.select()
		.from(schema.course)
		.where(eq(schema.course.id, courseId))
		.limit(1);

	if (courses.length === 0) {
		throw redirect(303, '/app/admin/courses');
	}

	// Get all users for mentor selection
	const users = await db.select().from(schema.user);

	// Get modules with lessons
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, courseId))
		.orderBy(schema.module.order, schema.module.createdAt);

	const modulesWithLessons = await Promise.all(
		modules.map(async (m) => {
			const lessons = await db
				.select()
				.from(schema.lesson)
				.where(eq(schema.lesson.moduleId, m.id))
				.orderBy(schema.lesson.order, schema.lesson.createdAt);
			return { ...m, lessons };
		})
	);

	return {
		course: courses[0],
		users,
		modules: modulesWithLessons
	};
};

export const actions = {
	updateCourse: async (event) => {
		await requireAdmin(event);

		const formData = await event.request.formData();
		const courseId = event.params.id;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const price = formData.get('price') as string;
		const duration = formData.get('duration') as string;
		const thumbnailUrl = formData.get('thumbnailUrl') as string;
		const mentorId = formData.get('mentorId') as string;
		const status = formData.get('status') as string;

		// Validation
		if (!title || title.trim().length === 0) {
			return fail(400, { error: 'Title is required' });
		}

		if (!description || description.trim().length === 0) {
			return fail(400, { error: 'Description is required' });
		}

		const priceNum = parseInt(price) || 0;
		if (isNaN(priceNum) || priceNum < 0) {
			return fail(400, { error: 'Valid price is required' });
		}

		const durationNum = duration ? parseInt(duration) : null;
		if (duration && isNaN(durationNum!)) {
			return fail(400, { error: 'Valid duration is required' });
		}

		// Update course
		await db
			.update(schema.course)
			.set({
				title: title.trim(),
				description: description.trim(),
				price: priceNum,
				duration: durationNum,
				thumbnailUrl: thumbnailUrl?.trim() || null,
				mentorId: mentorId !== 'none' ? mentorId : null,
				status: status || 'draft',
				updatedAt: new Date()
			})
			.where(eq(schema.course.id, courseId));

		return { success: true, message: 'Course updated successfully' };
	},

	addModule: async (event) => {
		await requireAdmin(event);
		const courseId = event.params.id;
		const formData = await event.request.formData();
		const title = formData.get('title') as string;
		const order = parseInt(formData.get('order') as string) || 0;

		if (!title) return fail(400, { error: 'Module title is required' });

		try {
			await db.insert(schema.module).values({
				id: crypto.randomUUID(),
				courseId,
				title,
				order,
				createdAt: new Date(),
				updatedAt: new Date()
			});
			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Failed to create module' });
		}
	},

	updateModule: async (event) => {
		await requireAdmin(event);
		const formData = await event.request.formData();
		const moduleId = formData.get('moduleId') as string;
		const title = formData.get('title') as string;

		if (!moduleId || !title) return fail(400, { error: 'Module ID and title are required' });

		try {
			await db.update(schema.module)
				.set({ title, updatedAt: new Date() })
				.where(eq(schema.module.id, moduleId));
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Failed to update module' });
		}
	},

	deleteModule: async (event) => {
		await requireAdmin(event);
		const formData = await event.request.formData();
		const moduleId = formData.get('moduleId') as string;

		if (!moduleId) return fail(400, { error: 'Module ID is required' });

		try {
			await db.delete(schema.module).where(eq(schema.module.id, moduleId));
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Failed to delete module' });
		}
	},

	addLesson: async (event) => {
		await requireAdmin(event);
		const formData = await event.request.formData();
		const moduleId = formData.get('moduleId') as string;
		const title = formData.get('title') as string;
		const order = parseInt(formData.get('order') as string) || 0;

		if (!moduleId || !title) return fail(400, { error: 'Module ID and title are required' });

		try {
			await db.insert(schema.lesson).values({
				id: crypto.randomUUID(),
				moduleId,
				title,
				order,
				createdAt: new Date(),
				updatedAt: new Date()
			});
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Failed to create lesson' });
		}
	},

	deleteLesson: async (event) => {
		await requireAdmin(event);
		const formData = await event.request.formData();
		const lessonId = formData.get('lessonId') as string;

		if (!lessonId) return fail(400, { error: 'Lesson ID is required' });

		try {
			await db.delete(schema.lesson).where(eq(schema.lesson.id, lessonId));
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Failed to delete lesson' });
		}
	}
} satisfies Actions;
