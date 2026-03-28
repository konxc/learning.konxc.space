import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const serial = event.url.searchParams.get('serial');

	if (!serial) {
		return { certificate: null, error: null };
	}

	const certificateResult = await db
		.select({
			id: schema.certificate.id,
			serial: schema.certificate.serial,
			issuedAt: schema.certificate.issuedAt,
			user: {
				fullName: schema.user.fullName,
				username: schema.user.username
			},
			course: {
				id: schema.course.id,
				title: schema.course.title
			}
		})
		.from(schema.certificate)
		.innerJoin(schema.user, eq(schema.certificate.userId, schema.user.id))
		.innerJoin(schema.course, eq(schema.certificate.courseId, schema.course.id))
		.where(eq(schema.certificate.serial, serial))
		.limit(1);

	if (certificateResult[0]) {
		return { certificate: certificateResult[0], error: null };
	}

	return { certificate: null, error: 'Certificate not found. The serial number may be invalid.' };
};
