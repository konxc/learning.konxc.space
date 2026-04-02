import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	const cohortId = event.url.searchParams.get('cohortId') ?? '';
	const courseId = event.url.searchParams.get('courseId') ?? '';

	// Base leaderboard query
	let leaderboard: Array<{
		userId: string;
		points: number;
		level: number;
		streakDays: number;
		fullName: string | null;
		username: string;
	}>;

	if (cohortId) {
		// Filter by cohort: only users enrolled in this cohort
		const enrolledUsers = await db
			.select({ userId: schema.enrollment.userId })
			.from(schema.enrollment)
			.where(eq(schema.enrollment.cohortId, cohortId));

		const userIds = enrolledUsers.map((e) => e.userId);

		if (userIds.length === 0) {
			leaderboard = [];
		} else {
			leaderboard = await db
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
				.where(sql`${schema.userXP.userId} IN ${userIds}`)
				.orderBy(desc(schema.userXP.points))
				.limit(50);
		}
	} else if (courseId) {
		// Filter by course: only users enrolled in this course
		const enrolledUsers = await db
			.select({ userId: schema.enrollment.userId })
			.from(schema.enrollment)
			.where(eq(schema.enrollment.courseId, courseId));

		const userIds = enrolledUsers.map((e) => e.userId);

		if (userIds.length === 0) {
			leaderboard = [];
		} else {
			leaderboard = await db
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
				.where(sql`${schema.userXP.userId} IN ${userIds}`)
				.orderBy(desc(schema.userXP.points))
				.limit(50);
		}
	} else {
		leaderboard = await db
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
	}

	// Rank movement: compare current points vs weekly points earned
	// weeklyPoints from userTracker gives points earned this week
	const trackerData = await db
		.select({
			userId: schema.userTracker.userId,
			weeklyPoints: schema.userTracker.weeklyPoints
		})
		.from(schema.userTracker);

	const trackerMap = new Map(trackerData.map((t) => [t.userId, t.weeklyPoints ?? 0]));

	// Calculate rank delta: sort by (points - weeklyPoints) to get "last week rank"
	const lastWeekOrder = [...leaderboard]
		.map((u) => ({
			userId: u.userId,
			lastWeekPoints: u.points - (trackerMap.get(u.userId) ?? 0)
		}))
		.sort((a, b) => b.lastWeekPoints - a.lastWeekPoints);

	const lastWeekRankMap = new Map(lastWeekOrder.map((u, i) => [u.userId, i + 1]));

	// Current user rank
	let userRank = 0;
	for (let i = 0; i < leaderboard.length; i++) {
		if (leaderboard[i].userId === user.id) {
			userRank = i + 1;
			break;
		}
	}

	// User's own XP
	const userXP = await db
		.select()
		.from(schema.userXP)
		.where(eq(schema.userXP.userId, user.id))
		.limit(1);

	// User's badges
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

	// All badges
	const allBadges = await db.select().from(schema.badge).orderBy(schema.badge.name);

	// Available cohorts for filter dropdown
	const cohorts = await db
		.select({ id: schema.cohort.id, name: schema.cohort.name })
		.from(schema.cohort)
		.orderBy(desc(schema.cohort.startDate))
		.limit(20);

	// Available courses for filter dropdown
	const courses = await db
		.select({ id: schema.course.id, title: schema.course.title })
		.from(schema.course)
		.where(eq(schema.course.status, 'published'))
		.orderBy(schema.course.title)
		.limit(30);

	const enrichedLeaderboard = leaderboard.map((u, i) => {
		const currentRank = i + 1;
		const lastRank = lastWeekRankMap.get(u.userId) ?? currentRank;
		const delta = lastRank - currentRank; // positive = moved up
		return { ...u, rank: currentRank, rankDelta: delta };
	});

	return {
		leaderboard: enrichedLeaderboard,
		userRank,
		userXP: userXP[0] ?? null,
		userBadges,
		allBadges,
		cohorts,
		courses,
		filters: { cohortId, courseId },
		currentUserId: user.id
	};
};
