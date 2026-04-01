import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export type ActivityType =
	| 'lesson_complete'
	| 'checkpoint_submit'
	| 'quiz_pass'
	| 'daily_login'
	| 'streak_7'
	| 'streak_30'
	| 'streak_100'
	| 'course_complete'
	| 'discussion_post'
	| 'referral';

const POINTS_MAP: Record<ActivityType, number> = {
	lesson_complete: 10,
	checkpoint_submit: 25,
	quiz_pass: 15,
	daily_login: 5,
	streak_7: 50,
	streak_30: 100,
	streak_100: 200,
	course_complete: 75,
	discussion_post: 5,
	referral: 30
};

const TIER_THRESHOLDS = {
	starter: 0,
	learner: 101,
	achiever: 501,
	champion: 2001,
	legend: 5001
};

function getTier(points: number): string {
	if (points >= TIER_THRESHOLDS.legend) return 'legend';
	if (points >= TIER_THRESHOLDS.champion) return 'champion';
	if (points >= TIER_THRESHOLDS.achiever) return 'achiever';
	if (points >= TIER_THRESHOLDS.learner) return 'learner';
	return 'starter';
}

export async function awardPoints(
	userId: string,
	activityType: ActivityType,
	metadata?: string
): Promise<void> {
	const points = POINTS_MAP[activityType] ?? 0;
	if (points === 0) return;

	// Log activity
	await db.insert(schema.trackerActivity).values({
		id: crypto.randomUUID(),
		userId,
		activityType,
		points,
		description: metadata ?? null,
		createdAt: new Date()
	});

	// Upsert userTracker
	const existing = await db
		.select()
		.from(schema.userTracker)
		.where(eq(schema.userTracker.userId, userId))
		.limit(1);

	if (existing[0]) {
		const newTotal = (existing[0].totalPoints ?? 0) + points;
		const newWeekly = (existing[0].weeklyPoints ?? 0) + points;
		const newTier = getTier(newTotal);
		await db
			.update(schema.userTracker)
			.set({
				totalPoints: newTotal,
				weeklyPoints: newWeekly,
				tier: newTier,
				updatedAt: new Date()
			})
			.where(eq(schema.userTracker.userId, userId));
	} else {
		await db.insert(schema.userTracker).values({
			userId,
			totalPoints: points,
			weeklyPoints: points,
			currentStreak: 0,
			longestStreak: 0,
			tier: getTier(points),
			tierProgress: 0,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	// Also update userXP
	const xp = await db.select().from(schema.userXP).where(eq(schema.userXP.userId, userId)).limit(1);

	if (xp[0]) {
		const newPoints = xp[0].points + points;
		const newLevel = Math.floor(Math.sqrt(newPoints / 100)) + 1;
		await db
			.update(schema.userXP)
			.set({ points: newPoints, level: newLevel, updatedAt: new Date() })
			.where(eq(schema.userXP.userId, userId));
	} else {
		await db.insert(schema.userXP).values({
			userId,
			points,
			level: 1,
			streakDays: 0,
			lastActiveAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}
}

export async function updateStreak(userId: string): Promise<void> {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const tracker = await db
		.select()
		.from(schema.userTracker)
		.where(eq(schema.userTracker.userId, userId))
		.limit(1);

	if (!tracker[0]) return;

	const todayStr = today.toISOString().slice(0, 10);
	const yesterdayStr = yesterday.toISOString().slice(0, 10);
	const lastStr = tracker[0].lastActiveDate ?? null;

	// Already updated today
	if (lastStr === todayStr) return;

	const isConsecutive = lastStr === yesterdayStr;
	const newStreak = isConsecutive ? (tracker[0].currentStreak ?? 0) + 1 : 1;
	const longestStreak = Math.max(newStreak, tracker[0].longestStreak ?? 0);

	await db
		.update(schema.userTracker)
		.set({
			currentStreak: newStreak,
			longestStreak,
			lastActiveDate: todayStr,
			updatedAt: new Date()
		})
		.where(eq(schema.userTracker.userId, userId));

	// Award streak milestone points
	if (newStreak === 7) await awardPoints(userId, 'streak_7');
	else if (newStreak === 30) await awardPoints(userId, 'streak_30');
	else if (newStreak === 100) await awardPoints(userId, 'streak_100');

	// Award daily login
	await awardPoints(userId, 'daily_login');
}

// Badge criteria check — award badge if not already earned
async function maybeAwardBadge(userId: string, badgeName: string): Promise<boolean> {
	const badge = await db
		.select()
		.from(schema.badge)
		.where(eq(schema.badge.name, badgeName))
		.limit(1);

	if (!badge[0]) return false;

	const already = await db
		.select()
		.from(schema.userBadge)
		.where(and(eq(schema.userBadge.userId, userId), eq(schema.userBadge.badgeId, badge[0].id)))
		.limit(1);

	if (already[0]) return false;

	await db.insert(schema.userBadge).values({
		id: crypto.randomUUID(),
		userId,
		badgeId: badge[0].id,
		earnedAt: new Date()
	});

	// Notify user
	await db.insert(schema.notification).values({
		id: crypto.randomUUID(),
		userId,
		type: 'system',
		title: `Badge Baru: ${badge[0].icon ?? '🏅'} ${badge[0].name}`,
		message: badge[0].description ?? `Kamu berhasil unlock badge "${badge[0].name}"!`,
		link: '/app/achievements',
		read: false
	});

	return true;
}

export async function checkAndAwardBadges(userId: string, _context?: string): Promise<void> {
	const tracker = await db
		.select()
		.from(schema.userTracker)
		.where(eq(schema.userTracker.userId, userId))
		.limit(1);

	// Count completed lessons
	const lessonCount = await db
		.select({ count: sql<number>`count(*)` })
		.from(schema.lessonProgress)
		.where(
			and(
				eq(schema.lessonProgress.userId, userId),
				sql`${schema.lessonProgress.completedAt} IS NOT NULL`
			)
		);

	// Count completed courses (certificates)
	const certCount = await db
		.select({ count: sql<number>`count(*)` })
		.from(schema.certificate)
		.where(eq(schema.certificate.userId, userId));

	const totalLessons = Number(lessonCount[0]?.count ?? 0);
	const totalCerts = Number(certCount[0]?.count ?? 0);
	const streak = tracker[0]?.currentStreak ?? 0;

	// Award badges based on conditions
	if (totalLessons >= 1) await maybeAwardBadge(userId, 'First Lesson');
	if (totalLessons >= 10) await maybeAwardBadge(userId, '10 Lessons');
	if (totalLessons >= 50) await maybeAwardBadge(userId, '50 Lessons');
	if (totalCerts >= 1) await maybeAwardBadge(userId, 'Course Graduate');
	if (totalCerts >= 3) await maybeAwardBadge(userId, 'Triple Graduate');
	if (streak >= 7) await maybeAwardBadge(userId, '7-Day Streak');
	if (streak >= 30) await maybeAwardBadge(userId, '30-Day Streak');
}

// Alias for backward compatibility
export async function awardXP(
	userId: string,
	points: number,
	_description?: string
): Promise<void> {
	// Map raw points to closest activity type
	const activityType: ActivityType =
		points >= 50 ? 'quiz_pass' : points >= 25 ? 'checkpoint_submit' : 'lesson_complete';
	await awardPoints(userId, activityType);
}
