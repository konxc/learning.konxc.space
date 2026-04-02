import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { actionFailure, actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async ({ params, locals }) => {
	const mentor = await requireAuth({ user: locals.user });
	const { id } = params;

	// Verify mentor owns this course
	const course = await db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
		.limit(1);

	if (course.length === 0) {
		throw redirect(303, '/app/mentor/courses');
	}

	// Get modules with lessons and materials
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, id))
		.orderBy(schema.module.order);

	// Load all lessons for this course (via module join)
	const allLessons = await db
		.select()
		.from(schema.lesson)
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, id))
		.orderBy(schema.lesson.order);

	const lessonRows = allLessons.map((r) => r.lesson);
	const lessonIds = lessonRows.map((l) => l.id);

	// Load all materials for these lessons
	let allMaterials: (typeof schema.material.$inferSelect)[] = [];
	if (lessonIds.length > 0) {
		const { inArray } = await import('drizzle-orm');
		allMaterials = await db
			.select()
			.from(schema.material)
			.where(inArray(schema.material.lessonId, lessonIds))
			.orderBy(schema.material.order);
	}

	return {
		course: course[0],
		modules,
		lessons: lessonRows,
		materials: allMaterials
	};
};

export const actions: Actions = {
	createModule: async ({ request, params, locals }) => {
		const mentor = await requireAuth({ user: locals.user });
		const { id } = params;

		const formData = await request.formData();
		const title = formData.get('title') as string;

		if (!title) {
			return actionFailure(400, 'Title is required');
		}

		// Verify ownership
		const course = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (course.length === 0) {
			return actionFailure(403, 'Unauthorized');
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

		return actionSuccess({ message: 'Modul berhasil dibuat.' });
	},

	createLesson: async ({ request, params, locals }) => {
		const mentor = await requireAuth({ user: locals.user });
		const { id } = params;

		const formData = await request.formData();
		const moduleId = formData.get('moduleId') as string;
		const title = formData.get('title') as string;

		if (!moduleId || !title) {
			return actionFailure(400, 'Module ID and title are required');
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
			return actionFailure(403, 'Unauthorized');
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

		return actionSuccess({ message: 'Lesson berhasil dibuat.' });
	},

	createMaterial: async ({ request, params, locals }) => {
		const mentor = await requireAuth({ user: locals.user });
		const { id } = params;

		const formData = await request.formData();
		const lessonId = formData.get('lessonId') as string;
		const type = formData.get('type') as string;
		const content = formData.get('content') as string;
		const url = formData.get('url') as string;

		if (!lessonId || !type) {
			return actionFailure(400, 'Lesson ID and type are required');
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

		return actionSuccess({ message: 'Materi berhasil ditambahkan.' });
	},

	reorderModules: async ({ request, params, locals }) => {
		const mentor = await requireAuth({ user: locals.user });
		const { id } = params;

		// Verify ownership
		const course = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (course.length === 0) return actionFailure(403, 'Unauthorized');

		const formData = await request.formData();
		const orderedIds = (formData.get('orderedIds') as string).split(',').filter(Boolean);

		for (let i = 0; i < orderedIds.length; i++) {
			await db
				.update(schema.module)
				.set({ order: i })
				.where(and(eq(schema.module.id, orderedIds[i]), eq(schema.module.courseId, id)));
		}

		return actionSuccess({ message: 'Urutan modul diperbarui.' });
	},

	reorderLessons: async ({ request, params, locals }) => {
		const mentor = await requireAuth({ user: locals.user });
		const { id } = params;

		// Verify ownership
		const course = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (course.length === 0) return actionFailure(403, 'Unauthorized');

		const formData = await request.formData();
		const moduleId = formData.get('moduleId') as string;
		const orderedIds = (formData.get('orderedIds') as string).split(',').filter(Boolean);

		if (!moduleId) return actionFailure(400, 'moduleId required');

		for (let i = 0; i < orderedIds.length; i++) {
			await db
				.update(schema.lesson)
				.set({ order: i })
				.where(and(eq(schema.lesson.id, orderedIds[i]), eq(schema.lesson.moduleId, moduleId)));
		}

		return actionSuccess({ message: 'Urutan lesson diperbarui.' });
	},

	setAvailableFrom: async ({ request, params, locals }) => {
		const mentor = await requireAuth({ user: locals.user });
		const { id } = params;

		const course = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (course.length === 0) return actionFailure(403, 'Unauthorized');

		const formData = await request.formData();
		const lessonId = formData.get('lessonId') as string;
		const dateStr = formData.get('availableFrom') as string;

		if (!lessonId) return actionFailure(400, 'lessonId required');

		const availableFrom = dateStr ? new Date(dateStr) : null;

		await db.update(schema.lesson).set({ availableFrom }).where(eq(schema.lesson.id, lessonId));

		return actionSuccess({ message: 'Jadwal lesson diperbarui.' });
	},

	bulkSetSchedule: async ({ request, params, locals }) => {
		const mentor = await requireAuth({ user: locals.user });
		const { id } = params;

		const course = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (course.length === 0) return actionFailure(403, 'Unauthorized');

		const formData = await request.formData();
		const lessonIds = (formData.get('lessonIds') as string).split(',').filter(Boolean);
		const dateStr = formData.get('availableFrom') as string;

		if (!lessonIds.length) return actionFailure(400, 'lessonIds required');

		const availableFrom = dateStr ? new Date(dateStr) : null;

		for (const lessonId of lessonIds) {
			await db.update(schema.lesson).set({ availableFrom }).where(eq(schema.lesson.id, lessonId));
		}

		return actionSuccess({ message: `${lessonIds.length} lesson dijadwalkan.` });
	}
} satisfies Actions;
