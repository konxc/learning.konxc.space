import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '$lib/server/middleware';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get all materials across mentor's courses
	const materials = await db
		.select({
			id: schema.material.id,
			lessonId: schema.material.lessonId,
			type: schema.material.type,
			content: schema.material.content,
			url: schema.material.url,
			lessonTitle: schema.lesson.title,
			moduleTitle: schema.module.title,
			courseId: schema.course.id,
			courseTitle: schema.course.title
		})
		.from(schema.material)
		.innerJoin(schema.lesson, eq(schema.material.lessonId, schema.lesson.id))
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
		.where(and(eq(schema.course.mentorId, user.id)))
		.orderBy(desc(schema.material.id))
		.limit(100);

	return { materials };
};
