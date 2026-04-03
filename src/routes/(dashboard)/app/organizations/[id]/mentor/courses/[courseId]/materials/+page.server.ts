import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, inArray, count } from 'drizzle-orm';
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

	const { courseId } = params;
	const orgId = membership.orgId;

	// Verify course exists in this organization and mentor has access
	const [course] = await db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.id, courseId), eq(schema.course.orgId, orgId)))
		.limit(1);

	if (!course || (membership.role === 'mentor' && course.mentorId !== user.id)) {
		throw redirect(302, `/app/organizations/${orgId}/mentor/courses`);
	}

	// Get modules for this course
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, courseId))
		.orderBy(schema.module.order);

	// Load all lessons for this course (via module join)
	const allLessons = await db
		.select({
			lesson: schema.lesson,
			module: schema.module
		})
		.from(schema.lesson)
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId))
		.orderBy(schema.lesson.order);

	const lessonRows = allLessons.map((r) => r.lesson);
	const lessonIds = lessonRows.map((l) => l.id);

	// Load all materials for these lessons
	let allMaterials: (typeof schema.material.$inferSelect)[] = [];
	if (lessonIds.length > 0) {
		allMaterials = await db
			.select()
			.from(schema.material)
			.where(inArray(schema.material.lessonId, lessonIds))
			.orderBy(schema.material.order);
	}

	return {
		course,
		modules,
		lessons: lessonRows,
		materials: allMaterials
	};
};

export const actions: Actions = {
	createModule: async (event) => {
		const { request, params, locals } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;
		const { courseId } = params;

		// Verify membership
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['owner', 'admin', 'mentor'].includes(membership.role)) {
			return actionFailure(403, 'Unauthorized management access');
		}

		// Verify course focus and ownership
		const [course] = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, courseId), eq(schema.course.orgId, orgId)))
			.limit(1);

		if (!course) return actionFailure(404, 'Course not found');
		if (membership.role === 'mentor' && course.mentorId !== user.id) {
			return actionFailure(403, 'Unauthorized access');
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		if (!title) return actionFailure(400, 'Title is required');

		// Get next order
		const [modulesCount] = await db
			.select({ total: count() })
			.from(schema.module)
			.where(eq(schema.module.courseId, courseId));

		await db.insert(schema.module).values({
			id: crypto.randomUUID(),
			courseId,
			title,
			order: Number(modulesCount.total)
		});

		return actionSuccess({ message: 'Module added' });
	},

	createLesson: async (event) => {
		const { request, params, locals } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;
		const { courseId } = params;

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
		const moduleId = formData.get('moduleId') as string;
		const title = formData.get('title') as string;

		if (!moduleId || !title) return actionFailure(400, 'Module ID and title are required');

		// Verify module belongs to course in this organization
		const moduleRows = await db
			.select({
				module: schema.module,
				course: schema.course
			})
			.from(schema.module)
			.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
			.where(and(eq(schema.module.id, moduleId), eq(schema.course.orgId, orgId), eq(schema.course.id, courseId)))
			.limit(1);

		const row = moduleRows[0];
		if (!row) return actionFailure(404, 'Module not found');
		if (membership.role === 'mentor' && row.course.mentorId !== user.id) {
			return actionFailure(403, 'Unauthorized access');
		}

		// Get next order
		const [lessonsCount] = await db
			.select({ total: count() })
			.from(schema.lesson)
			.where(eq(schema.lesson.moduleId, moduleId));

		const lessonId = crypto.randomUUID();
		await db.insert(schema.lesson).values({
			id: lessonId,
			moduleId,
			title,
			order: Number(lessonsCount.total)
		});

		return actionSuccess({ message: 'Lesson added', data: { lessonId } });
	},

	createMaterial: async (event) => {
		const { request, params, locals } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;
		const { courseId } = params;

		// Verify membership
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
			return actionFailure(403, 'Forbidden');
		}

		const formData = await request.formData();
		const lessonId = formData.get('lessonId') as string;
		const type = formData.get('type') as string;
		const content = formData.get('content') as string;
		const url = formData.get('url') as string;

		if (!lessonId || !type) return actionFailure(400, 'Lesson ID and type are required');

		// Verify lesson belongs to course in this organization
		const lessonCheck = await db
			.select({ lessonId: schema.lesson.id })
			.from(schema.lesson)
			.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
			.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
			.where(and(eq(schema.lesson.id, lessonId), eq(schema.course.id, courseId), eq(schema.course.orgId, orgId)))
			.limit(1);

		if (lessonCheck.length === 0) return actionFailure(404, 'Lesson not found');
		
		// If mentor, check if they own the course
		const [course] = await db
			.select()
			.from(schema.course)
			.where(eq(schema.course.id, courseId))
			.limit(1);
		
		if (membership.role === 'mentor' && course.mentorId !== user.id) {
			return actionFailure(403, 'Unauthorized access');
		}

		const [materialsCount] = await db
			.select({ total: count() })
			.from(schema.material)
			.where(eq(schema.material.lessonId, lessonId));

		const materialId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
		await db.insert(schema.material).values({
			id: materialId,
			lessonId,
			type,
			content: type === 'text' ? content : null,
			url: type === 'video' || type === 'link' ? url : null,
			order: Number(materialsCount.total)
		});

		return actionSuccess({ message: 'Materi berhasil ditambahkan.' });
	},

	reorderModules: async (event) => {
		const { request, params, locals } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;
		const { courseId } = params;

		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
			return actionFailure(403, 'Forbidden');
		}

		const [course] = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, courseId), eq(schema.course.orgId, orgId)))
			.limit(1);

		if (!course) return actionFailure(404, 'Course not found');
		if (membership.role === 'mentor' && course.mentorId !== user.id) {
			return actionFailure(403, 'Unauthorized access');
		}

		const formData = await request.formData();
		const orderedIds = (formData.get('orderedIds') as string).split(',').filter(Boolean);

		for (let i = 0; i < orderedIds.length; i++) {
			await db
				.update(schema.module)
				.set({ order: i })
				.where(and(eq(schema.module.id, orderedIds[i]), eq(schema.module.courseId, courseId)));
		}

		return actionSuccess({ message: 'Urutan modul diperbarui.' });
	},

	reorderLessons: async (event) => {
		const { request, params, locals } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const orgId = params.id;
		const { courseId } = params;

		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
			return actionFailure(403, 'Forbidden');
		}

		const formData = await request.formData();
		const moduleId = formData.get('moduleId') as string;
		const orderedIds = (formData.get('orderedIds') as string).split(',').filter(Boolean);

		if (!moduleId) return actionFailure(400, 'moduleId required');

		// Verify module belongs to organization
		const moduleCheck = await db
			.select({ moduleId: schema.module.id, mentorId: schema.course.mentorId })
			.from(schema.module)
			.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
			.where(and(eq(schema.module.id, moduleId), eq(schema.course.id, courseId), eq(schema.course.orgId, orgId)))
			.limit(1);

		if (moduleCheck.length === 0) return actionFailure(404, 'Module not found');
		if (membership.role === 'mentor' && moduleCheck[0].mentorId !== user.id) {
			return actionFailure(403, 'Unauthorized access');
		}

		for (let i = 0; i < orderedIds.length; i++) {
			await db
				.update(schema.lesson)
				.set({ order: i })
				.where(and(eq(schema.lesson.id, orderedIds[i]), eq(schema.lesson.moduleId, moduleId)));
		}

		return actionSuccess({ message: 'Urutan lesson diperbarui.' });
	}
};
