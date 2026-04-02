import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, gte, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/auth/signin');

	const userId = locals.user.id;

	// Get or create user tracker
	let tracker = await db
		.select()
		.from(schema.userTracker)
		.where(eq(schema.userTracker.userId, userId))
		.limit(1)
		.then((r) => r[0] ?? null);

	if (!tracker) {
		await db.insert(schema.userTracker).values({
			userId,
			totalPoints: 0,
			weeklyPoints: 0,
			currentStreak: 0,
			longestStreak: 0,
			tier: 'starter',
			tierProgress: 0,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		tracker = await db
			.select()
			.from(schema.userTracker)
			.where(eq(schema.userTracker.userId, userId))
			.limit(1)
			.then((r) => r[0] ?? null);
	}

	// Recent 20 activities
	const activities = await db
		.select()
		.from(schema.trackerActivity)
		.where(eq(schema.trackerActivity.userId, userId))
		.orderBy(desc(schema.trackerActivity.createdAt))
		.limit(20);

	// Activities last 30 days grouped by date
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const recentActivities = await db
		.select({
			date: sql<string>`date(${schema.trackerActivity.createdAt})`,
			points: sql<number>`sum(${schema.trackerActivity.points})`
		})
		.from(schema.trackerActivity)
		.where(
			sql`${schema.trackerActivity.userId} = ${userId} AND ${schema.trackerActivity.createdAt} >= ${thirtyDaysAgo}`
		)
		.groupBy(sql`date(${schema.trackerActivity.createdAt})`);

	// Build 30-day calendar data
	const calendarMap = new Map<string, number>();
	for (const row of recentActivities) {
		calendarMap.set(row.date, Number(row.points ?? 0));
	}
	const calendarData: Array<{ date: string; points: number }> = [];
	for (let i = 29; i >= 0; i--) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		const key = d.toISOString().slice(0, 10);
		calendarData.push({ date: key, points: calendarMap.get(key) ?? 0 });
	}

	// Points breakdown per activity type
	const breakdown = await db
		.select({
			activityType: schema.trackerActivity.activityType,
			total: sql<number>`sum(${schema.trackerActivity.points})`
		})
		.from(schema.trackerActivity)
		.where(eq(schema.trackerActivity.userId, userId))
		.groupBy(schema.trackerActivity.activityType);

	const tierThresholds = {
		starter: { min: 0, max: 100, next: 'Learner' },
		learner: { min: 101, max: 500, next: 'Achiever' },
		achiever: { min: 501, max: 2000, next: 'Champion' },
		champion: { min: 2001, max: 5000, next: 'Legend' },
		legend: { min: 5001, max: Infinity, next: null }
	};

	const currentTier = tracker?.tier ?? 'starter';
	const tierInfo = tierThresholds[currentTier as keyof typeof tierThresholds];

	return {
		tracker,
		activities,
		calendarData,
		breakdown,
		currentTier,
		tierInfo
	};
};
