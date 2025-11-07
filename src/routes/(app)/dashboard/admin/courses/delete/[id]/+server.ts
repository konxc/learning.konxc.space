import { requireAdmin } from '$lib/server/middleware';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	await requireAdmin(event);

	const courseId = event.params.id;

	// Delete course
	await db.delete(schema.course).where(eq(schema.course.id, courseId));

	return json({ success: true });
};
