import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Get all published courses with mentor info (no authentication required)
	const courses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			thumbnailUrl: schema.course.thumbnailUrl,
			price: schema.course.price,
			duration: schema.course.duration,
			createdAt: schema.course.createdAt,
			mentor: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName
			}
		})
		.from(schema.course)
		.leftJoin(schema.user, eq(schema.course.mentorId, schema.user.id))
		.where(eq(schema.course.status, 'published'));

	return {
		courses
	};
};
