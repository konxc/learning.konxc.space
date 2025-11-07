import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const certificateId = event.params.id;

	// Get certificate with course details
	const certificates = await db
		.select({
			certificate: schema.certificate,
			course: {
				id: schema.course.id,
				title: schema.course.title,
				description: schema.course.description
			}
		})
		.from(schema.certificate)
		.innerJoin(schema.course, eq(schema.certificate.courseId, schema.course.id))
		.where(eq(schema.certificate.id, certificateId))
		.limit(1);

	if (certificates.length === 0) {
		throw error(404, 'Certificate not found');
	}

	const certificateData = certificates[0];

	// Verify ownership
	if (certificateData.certificate.userId !== user.id) {
		throw error(403, 'Unauthorized');
	}

	// Get user details
	const users = await db.select().from(schema.user).where(eq(schema.user.id, user.id)).limit(1);

	return {
		certificate: certificateData.certificate,
		course: certificateData.course,
		user: users[0]
	};
};

