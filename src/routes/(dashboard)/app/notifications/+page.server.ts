import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');

	// Fetch all notifications for the user
	const notifications = await db
		.select()
		.from(schema.notification)
		.where(eq(schema.notification.userId, locals.user.id))
		.orderBy(desc(schema.notification.createdAt))
		.limit(50);

	return {
		notifications
	};
};

export const actions: Actions = {
	markAsRead: async ({ locals, request }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'Notification ID is required' });

		try {
			await db
				.update(schema.notification)
				.set({ read: true })
				.where(eq(schema.notification.id, id));

			return { success: true };
		} catch (e) {
			console.error('Error marking notification as read:', e);
			return fail(500, { error: 'Internal Server Error' });
		}
	},

	markAllAsRead: async ({ locals }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		try {
			await db
				.update(schema.notification)
				.set({ read: true })
				.where(eq(schema.notification.userId, locals.user.id));

			return { success: true };
		} catch (e) {
			console.error('Error marking all notifications as read:', e);
			return fail(500, { error: 'Internal Server Error' });
		}
	},

	delete: async ({ locals, request }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'Notification ID is required' });

		try {
			await db.delete(schema.notification).where(eq(schema.notification.id, id));

			return { success: true };
		} catch (e) {
			console.error('Error deleting notification:', e);
			return fail(500, { error: 'Internal Server Error' });
		}
	},

	deleteAll: async ({ locals }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		try {
			await db.delete(schema.notification).where(eq(schema.notification.userId, locals.user.id));

			return { success: true };
		} catch (e) {
			console.error('Error deleting all notifications:', e);
			return fail(500, { error: 'Internal Server Error' });
		}
	}
};
