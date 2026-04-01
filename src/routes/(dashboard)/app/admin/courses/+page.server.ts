import type { PageServerLoad, Actions } from './$types';
import { requireAdmin } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	// Get all courses with mentor name and counts
	const courses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			status: schema.course.status,
			price: schema.course.price,
			createdAt: schema.course.createdAt,
			mentorId: schema.course.mentorId,
			mentorName: schema.user.fullName,
			moduleCount: sql<number>`(SELECT COUNT(id) FROM ${schema.module} WHERE ${schema.module.courseId} = ${schema.course.id})`,
			lessonCount: sql<number>`(SELECT COUNT(l.id) FROM ${schema.lesson} l JOIN ${schema.module} m ON l.module_id = m.id WHERE m.course_id = ${schema.course.id})`,
			enrollmentCount: sql<number>`(SELECT COUNT(id) FROM ${schema.enrollment} WHERE ${schema.enrollment.courseId} = ${schema.course.id} AND status = 'active')`
		})
		.from(schema.course)
		.leftJoin(schema.user, eq(schema.course.mentorId, schema.user.id))
		.orderBy(desc(schema.course.createdAt));

	return {
		courses: courses || []
	};
};

export const actions = {
	createCourse: async (event) => {
		await requireAdmin(event);
		const formData = await event.request.formData();
		const title = formData.get('title') as string;

		if (!title) return fail(400, { error: 'Title is required' });

		const id = crypto.randomUUID();
		try {
			await db.insert(schema.course).values({
				id,
				title,
				description: 'A new course description.',
				price: 0,
				status: 'draft',
				createdBy: event.locals.user!.id,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} catch (e) {
			return fail(500, { error: 'Failed to create course' });
		}

		throw redirect(303, `/app/admin/courses/edit/${id}`);
	},

	deleteCourse: async (event) => {
		await requireAdmin(event);
		const formData = await event.request.formData();
		const courseId = formData.get('courseId') as string;

		if (!courseId) return fail(400, { error: 'Course ID missing' });

		try {
			await db.delete(schema.course).where(eq(schema.course.id, courseId));
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Failed to delete course' });
		}
	}
} satisfies Actions;
