/**
 * Notification helper — flat re-export + convenience wrappers
 * Re-exports from src/lib/server/notifications/index.ts for backward compat
 */
export {
	sendNotification,
	createInAppNotification,
	getUnreadNotifications,
	markNotificationRead,
	getUnreadNotificationCount
} from '$lib/server/notifications/index';

import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export interface CreateNotificationParams {
	userId: string;
	type: string;
	title: string;
	message: string;
	link?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
	await db.insert(schema.notification).values({
		id: crypto.randomUUID(),
		userId: params.userId,
		type: params.type,
		title: params.title,
		message: params.message,
		link: params.link ?? null,
		read: false,
		createdAt: new Date()
	});
}

export async function markAsRead(notificationId: string, userId: string): Promise<void> {
	await db
		.update(schema.notification)
		.set({ read: true })
		.where(and(eq(schema.notification.id, notificationId), eq(schema.notification.userId, userId)));
}

export async function getUnreadCount(userId: string): Promise<number> {
	const result = await db
		.select({ id: schema.notification.id })
		.from(schema.notification)
		.where(and(eq(schema.notification.userId, userId), eq(schema.notification.read, false)));
	return result.length;
}
