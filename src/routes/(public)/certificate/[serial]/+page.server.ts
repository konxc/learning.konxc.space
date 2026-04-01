import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const serial = params.serial;

	// Fetch certificate by serial
	const certificates = await db
		.select({
			certificate: schema.certificate,
			user: {
				fullName: schema.user.fullName,
				username: schema.user.username,
				avatarUrl: schema.user.avatarUrl
			},
			course: {
				title: schema.course.title,
				description: schema.course.description,
				thumbnailUrl: schema.course.thumbnailUrl
			}
		})
		.from(schema.certificate)
		.innerJoin(schema.user, eq(schema.certificate.userId, schema.user.id))
		.innerJoin(schema.course, eq(schema.certificate.courseId, schema.course.id))
		.where(eq(schema.certificate.serial, serial))
		.limit(1);

	if (certificates.length === 0) {
		throw error(404, 'Certificate not found or invalid serial number');
	}

	return {
		certificate: certificates[0]
	};
};
