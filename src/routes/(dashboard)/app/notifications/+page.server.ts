import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(302, '/auth/signin');

	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const typeFilter = url.searchParams.get('type') ?? '';
	const readFilter = url.searchParams.get('read') ?? '';

	// Build where conditions
	const conditions = [eq(schema.notification.userId, locals.user.id)];

	if (typeFilter) {
		conditions.push(eq(schema.notification.type, typeFilter));
	}
	if (readFilter === 'true') {
		conditions.push(eq(schema.notification.read, true));
	} else if (readFilter === 'false') {
		conditions.push(eq(schema.notification.read, false));
	}

	const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);

	// Total count for pagination
	const allForCount = await db
		.select({ id: schema.notification.id })
		.from(schema.notification)
		.where(whereClause);

	const total = allForCount.length;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const offset = (safePage - 1) * PAGE_SIZE;

	const notifications = await db
		.select()
		.from(schema.notification)
		.where(whereClause)
		.orderBy(desc(schema.notification.createdAt))
		.limit(PAGE_SIZE)
		.offset(offset);

	// Distinct types for filter dropdown
	const allTypes = await db
		.select({ type: schema.notification.type })
		.from(schema.notification)
		.where(eq(schema.notification.userId, locals.user.id));

	const distinctTypes = [...new Set(allTypes.map((r) => r.type))].sort();

	return {
		notifications,
		pagination: {
			page: safePage,
			totalPages,
			total,
			pageSize: PAGE_SIZE
		},
		filters: {
			type: typeFilter,
			read: readFilter
		},
		distinctTypes
	};
};

export const actions: Actions = {
	markAsRead: async ({ locals, request }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'Notification ID is required' });

		await db
			.update(schema.notification)
			.set({ read: true })
			.where(and(eq(schema.notification.id, id), eq(schema.notification.userId, locals.user.id)));

		return { success: true };
	},

	markAllAsRead: async ({ locals }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		await db
			.update(schema.notification)
			.set({ read: true })
			.where(eq(schema.notification.userId, locals.user.id));

		return { success: true };
	},

	delete: async ({ locals, request }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'Notification ID is required' });

		await db
			.delete(schema.notification)
			.where(and(eq(schema.notification.id, id), eq(schema.notification.userId, locals.user.id)));

		return { success: true };
	},

	deleteAll: async ({ locals }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		await db.delete(schema.notification).where(eq(schema.notification.userId, locals.user.id));

		return { success: true };
	}
};
