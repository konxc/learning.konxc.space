import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	const user = await requireAuth(event);
	const notificationId = event.params.id;

	// Verify notification belongs to user
	const notification = await db
		.select()
		.from(schema.notification)
		.where(and(eq(schema.notification.id, notificationId), eq(schema.notification.userId, user.id)))
		.limit(1);

	if (!notification[0]) {
		return json({ error: 'Notification not found' }, { status: 404 });
	}

	// Mark as read
	await db
		.update(schema.notification)
		.set({ read: true })
		.where(eq(schema.notification.id, notificationId));

	return json({ success: true });
};
