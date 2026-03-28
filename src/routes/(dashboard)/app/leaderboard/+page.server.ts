import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import { eq, desc } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get top users by XP
	const leaderboard = await db
		.select({
			userId: schema.userXP.userId,
			points: schema.userXP.points,
			level: schema.userXP.level,
			streakDays: schema.userXP.streakDays,
			fullName: schema.user.fullName,
			username: schema.user.username
		})
		.from(schema.userXP)
		.innerJoin(schema.user, eq(schema.userXP.userId, schema.user.id))
		.orderBy(desc(schema.userXP.points))
		.limit(50);

	// Get current user's rank
	let userRank = 0;
	for (let i = 0; i < leaderboard.length; i++) {
		if (leaderboard[i].userId === user.id) {
			userRank = i + 1;
			break;
		}
	}

	// Get user's XP data
	const userXP = await db
		.select()
		.from(schema.userXP)
		.where(eq(schema.userXP.userId, user.id))
		.limit(1);

	// Get user's badges
	const userBadges = await db
		.select({
			id: schema.badge.id,
			name: schema.badge.name,
			description: schema.badge.description,
			icon: schema.badge.icon,
			earnedAt: schema.userBadge.earnedAt
		})
		.from(schema.userBadge)
		.innerJoin(schema.badge, eq(schema.userBadge.badgeId, schema.badge.id))
		.where(eq(schema.userBadge.userId, user.id));

	// Get all available badges
	const allBadges = await db.select().from(schema.badge).orderBy(schema.badge.name);

	return {
		leaderboard: leaderboard.map((u, i) => ({ ...u, rank: i + 1 })),
		userRank,
		userXP: userXP[0] || null,
		userBadges,
		allBadges
	};
};
