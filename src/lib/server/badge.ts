import { db } from './db';
import * as schema from './db/schema';
import { eq, count, and, isNotNull } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { createNotification } from './email';

interface BadgeCriteria {
	type: 'lessons_completed' | 'courses_completed' | 'submissions' | 'streak' | 'first_course' | 'perfect_score';
	threshold: number;
}

const BADGES: { id: string; name: string; description: string; icon: string; criteria: BadgeCriteria }[] = [
	{
		id: 'first-lesson',
		name: 'First Step',
		description: 'Complete your first lesson',
		icon: '🌟',
		criteria: { type: 'lessons_completed', threshold: 1 }
	},
	{
		id: 'ten-lessons',
		name: 'Dedicated Learner',
		description: 'Complete 10 lessons',
		icon: '📚',
		criteria: { type: 'lessons_completed', threshold: 10 }
	},
	{
		id: 'fifty-lessons',
		name: 'Knowledge Seeker',
		description: 'Complete 50 lessons',
		icon: '🧠',
		criteria: { type: 'lessons_completed', threshold: 50 }
	},
	{
		id: 'first-course',
		name: 'Graduate',
		description: 'Complete your first course',
		icon: '🎓',
		criteria: { type: 'first_course', threshold: 1 }
	},
	{
		id: 'three-courses',
		name: 'Scholar',
		description: 'Complete 3 courses',
		icon: '🏆',
		criteria: { type: 'courses_completed', threshold: 3 }
	},
	{
		id: 'first-submission',
		name: 'Action Taker',
		description: 'Submit your first action task',
		icon: '✅',
		criteria: { type: 'submissions', threshold: 1 }
	},
	{
		id: 'perfect-score',
		name: 'Perfect Score',
		description: 'Get 100% on a quiz',
		icon: '💯',
		criteria: { type: 'perfect_score', threshold: 1 }
	},
	{
		id: 'week-streak',
		name: 'Consistent',
		description: '7 day learning streak',
		icon: '🔥',
		criteria: { type: 'streak', threshold: 7 }
	},
	{
		id: 'month-streak',
		name: 'Unstoppable',
		description: '30 day learning streak',
		icon: '⚡',
		criteria: { type: 'streak', threshold: 30 }
	}
];

export async function initializeBadges() {
	for (const badge of BADGES) {
		const existing = await db
			.select()
			.from(schema.badge)
			.where(eq(schema.badge.id, badge.id))
			.limit(1);

		if (existing.length === 0) {
			await db.insert(schema.badge).values({
				id: badge.id,
				name: badge.name,
				description: badge.description,
				icon: badge.icon,
				criteria: JSON.stringify(badge.criteria),
				createdAt: new Date()
			});
		}
	}
}

export async function checkAndAwardBadges(userId: string) {
	const awardedBadges: string[] = [];

	// Get user's existing badges
	const existingBadges = await db
		.select({ badgeId: schema.userBadge.badgeId })
		.from(schema.userBadge)
		.where(eq(schema.userBadge.userId, userId));

	const existingBadgeIds = new Set(existingBadges.map(b => b.badgeId));

	// Count lessons completed
	const lessonsCompleted = await db
		.select({ count: count() })
		.from(schema.lessonProgress)
		.where(
			and(
				eq(schema.lessonProgress.userId, userId),
				isNotNull(schema.lessonProgress.completedAt)
			)
		);

	// Count courses completed
	const coursesCompleted = await db
		.select({ count: count() })
		.from(schema.enrollment)
		.where(
			and(
				eq(schema.enrollment.userId, userId),
				eq(schema.enrollment.status, 'completed')
			)
		);

	// Count submissions
	const submissions = await db
		.select({ count: count() })
		.from(schema.submission)
		.where(eq(schema.submission.userId, userId));

	// Get perfect scores
	const perfectScores = await db
		.select({ count: count() })
		.from(schema.submissionGrade)
		.where(
			and(
				eq(schema.submissionGrade.gradedBy, userId),
				eq(schema.submissionGrade.score, 100)
			)
		);

	// Get streak days
	const userXP = await db
		.select()
		.from(schema.userXP)
		.where(eq(schema.userXP.userId, userId))
		.limit(1);

	const streakDays = userXP[0]?.streakDays || 0;

	// Check each badge
	const stats = {
		lessonsCompleted: lessonsCompleted[0]?.count || 0,
		coursesCompleted: coursesCompleted[0]?.count || 0,
		submissions: submissions[0]?.count || 0,
		perfectScore: perfectScores[0]?.count || 0,
		streak: streakDays
	};

	for (const badgeDef of BADGES) {
		if (existingBadgeIds.has(badgeDef.id)) continue;

		let earned = false;
		const criteria = badgeDef.criteria;

		switch (criteria.type) {
			case 'lessons_completed':
				earned = stats.lessonsCompleted >= criteria.threshold;
				break;
			case 'courses_completed':
				earned = stats.coursesCompleted >= criteria.threshold;
				break;
			case 'submissions':
				earned = stats.submissions >= criteria.threshold;
				break;
			case 'perfect_score':
				earned = stats.perfectScore >= criteria.threshold;
				break;
			case 'streak':
				earned = stats.streak >= criteria.threshold;
				break;
			case 'first_course':
				earned = stats.coursesCompleted >= 1;
				break;
		}

		if (earned) {
			// Award badge
			const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
			await db.insert(schema.userBadge).values({
				id,
				userId,
				badgeId: badgeDef.id,
				earnedAt: new Date()
			});

			awardedBadges.push(badgeDef.name);

			// Create notification
			await createNotification(
				userId,
				'badge',
				`🏅 Badge Earned: ${badgeDef.name}`,
				badgeDef.description,
				'/app/leaderboard'
			);
		}
	}

	// Update XP points
	const totalPoints =
		stats.lessonsCompleted * 10 +
		stats.coursesCompleted * 100 +
		stats.submissions * 20 +
		stats.perfectScore * 50 +
		stats.streak * 5;

	const newLevel = Math.floor(totalPoints / 500) + 1;

	if (userXP.length > 0) {
		await db
			.update(schema.userXP)
			.set({
				points: totalPoints,
				level: newLevel,
				updatedAt: new Date()
			})
			.where(eq(schema.userXP.userId, userId));
	} else {
		await db.insert(schema.userXP).values({
			userId,
			points: totalPoints,
			level: newLevel,
			streakDays: 0,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	return awardedBadges;
}
