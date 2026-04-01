import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, and, gte } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(302, '/auth/signin');

	const filter = url.searchParams.get('period') ?? 'week';

	let dateFilter: Date | undefined;
	const now = new Date();
	if (filter === 'week') {
		dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	} else if (filter === 'month') {
		dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
	}

	const query = db
		.select()
		.from(schema.trackerActivity)
		.where(
			and(
				eq(schema.trackerActivity.userId, locals.user.id),
				dateFilter ? gte(schema.trackerActivity.createdAt, dateFilter) : undefined
			)
		)
		.orderBy(desc(schema.trackerActivity.createdAt))
		.limit(100);

	const activities = await query;

	// Get user tracker stats
	const [tracker] = await db
		.select()
		.from(schema.userTracker)
		.where(eq(schema.userTracker.userId, locals.user.id))
		.limit(1);

	// Get user XP
	const [xp] = await db
		.select()
		.from(schema.userXP)
		.where(eq(schema.userXP.userId, locals.user.id))
		.limit(1);

	return {
		activities,
		tracker: tracker ?? null,
		xp: xp ?? null,
		filter
	};
};
