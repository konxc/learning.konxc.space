import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const GET = async () => {
	if (!dev) {
		throw error(404, 'Not found');
	}

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
