import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Get all published courses (no authentication required)
	const courses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			thumbnailUrl: schema.course.thumbnailUrl,
			price: schema.course.price,
			duration: schema.course.duration,
			createdAt: schema.course.createdAt
		})
		.from(schema.course)
		.where(eq(schema.course.status, 'published'));

	return {
		courses
	};
};