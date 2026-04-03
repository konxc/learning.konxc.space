import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) throw error(401, 'Unauthorized');

	const { membership } = await event.parent();
	if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
		throw error(403, 'Forbidden: Mentor access required for this organization');
	}

	const orgId = membership.orgId;

	// Get all materials for courses in this organization where the user is mentor
	const materials = await db
		.select({
			material: schema.material,
			lesson: schema.lesson,
			module: schema.module,
			course: schema.course
		})
		.from(schema.material)
		.innerJoin(schema.lesson, eq(schema.material.lessonId, schema.lesson.id))
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
		.where(
			and(
				eq(schema.course.orgId, orgId),
				membership.role === 'mentor' ? eq(schema.course.mentorId, user.id) : undefined
			)
		)
		.orderBy(desc(schema.material.createdAt));

	return {
		materials,
		orgId
	};
};
