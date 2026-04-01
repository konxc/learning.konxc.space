import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	const user = await requireAuth(event);

	// Mark all user's notifications as read
	await db
		.update(schema.notification)
		.set({ read: true })
		.where(eq(schema.notification.userId, user.id));

	return json({ success: true });
};
