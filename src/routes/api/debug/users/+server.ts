import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';

export const GET = async (requestEvent: RequestEvent) => {
	// Only accessible in dev mode AND requires admin auth
	if (!dev) {
		throw error(404, 'Not found');
	}

	// Verify admin even in dev mode
	await requireAdmin(requestEvent);

	const users = await db
		.select({
			id: schema.user.id,
			username: schema.user.username,
			email: schema.user.email,
			fullName: schema.user.fullName,
			role: schema.user.role,
			createdAt: schema.user.createdAt
		})
		.from(schema.user)
		.limit(20);

	return json(users);
};
