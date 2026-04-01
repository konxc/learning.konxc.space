import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get all user's certificates with course info
	const certificates = await db
		.select({
			id: schema.certificate.id,
			serial: schema.certificate.serial,
			issuedAt: schema.certificate.issuedAt,
			course: {
				id: schema.course.id,
				title: schema.course.title,
				thumbnailUrl: schema.course.thumbnailUrl
			}
		})
		.from(schema.certificate)
		.innerJoin(schema.course, eq(schema.certificate.courseId, schema.course.id))
		.where(eq(schema.certificate.userId, user.id))
		.orderBy(schema.certificate.issuedAt);

	return { certificates };
};
