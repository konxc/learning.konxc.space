import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/signin');
	}

	// Get or create user tracker
	let tracker = await db.query.userTracker.findFirst({
		where: eq(schema.userTracker.userId, locals.user.id)
	});

	if (!tracker) {
		// Create initial tracker
		await db.insert(schema.userTracker).values({
			userId: locals.user.id,
			totalPoints: 0,
			weeklyPoints: 0,
			currentStreak: 0,
			longestStreak: 0,
			tier: 'starter',
			tierProgress: 0
		});
		tracker = await db.query.userTracker.findFirst({
			where: eq(schema.userTracker.userId, locals.user.id)
		});
	}

	// Get recent activities
	const activities = await db.query.trackerActivity.findMany({
		where: eq(schema.trackerActivity.userId, locals.user.id),
		orderBy: desc(schema.trackerActivity.createdAt),
		limit: 20
	});

	// Calculate tier thresholds
	const tierThresholds = {
		starter: { min: 0, max: 100, next: 'Learner' },
		learner: { min: 101, max: 500, next: 'Achiever' },
		achiever: { min: 501, max: 2000, next: 'Champion' },
		champion: { min: 2001, max: 5000, next: 'Legend' },
		legend: { min: 5001, max: Infinity, next: null }
	};

	const currentTier = tracker?.tier || 'starter';
	const tierInfo = tierThresholds[currentTier as keyof typeof tierThresholds];

	return {
		tracker,
		activities,
		currentTier,
		tierInfo
	};
};
