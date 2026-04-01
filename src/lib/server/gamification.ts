import { db } from './db';
import * as schema from './db/schema';
import { eq, sql } from 'drizzle-orm';
import { generateId } from '$lib/utils/id';

/**
 * Award XP to a user and handle level-up logic.
 */
export async function awardXP(userId: string, points: number, reason: string) {
	console.log(`Awarding ${points} XP to user ${userId} for: ${reason}`);

	// 1. Get or create user XP record
	const existingXP = await db.query.userXP.findFirst({
		where: eq(schema.userXP.userId, userId)
	});

	if (!existingXP) {
		await db.insert(schema.userXP).values({
			userId,
			points,
			level: 1,
			updatedAt: new Date()
		});
	} else {
		const newPoints = existingXP.points + points;
		const newLevel = Math.floor(Math.sqrt(newPoints / 100)) + 1; // Square-root scaling for progression

		await db.update(schema.userXP)
			.set({
				points: newPoints,
				level: newLevel,
				updatedAt: new Date(),
				streakDays: existingXP.streakDays // preserve
			})
			.where(eq(schema.userXP.userId, userId));
		
		if (newLevel > existingXP.level) {
			console.log(`User ${userId} leveled up to ${newLevel}!`);
			
			// Trigger level-up notification
			try {
				const { sendNotification } = await import('./notifications');
				await sendNotification({
					userId,
					type: 'broadcast', // Use broadcast type for level up aesthetic
					title: `🚀 Level Up! You're now Level ${newLevel}`,
					message: `Incredible work! You've unlocked Level ${newLevel}. Keep pushing those boundaries.`,
					channel: 'both' // Send email and notification for level ups
				});
			} catch (e) {
				console.error('Failed to send level-up notification:', e);
			}
		}
	}
}

/**
 * Check and award badges based on specific criteria.
 */
export async function checkAndAwardBadges(userId: string, type: 'submission' | 'streak' | 'completion') {
	// Example: "Pecah Telur" (First Blood)
	if (type === 'submission') {
		const submissionsCount = await db.select({ count: sql`count(*)` })
			.from(schema.submission)
			.where(eq(schema.submission.userId, userId));
		
		const count = Number(submissionsCount[0]?.count || 0);

		if (count === 1) {
			await awardBadge(userId, 'badge-pecah-telur');
		}
	}
}

async function awardBadge(userId: string, badgeId: string) {
	// Check if already earned
	const existing = await db.query.userBadge.findFirst({
		where: sql`${schema.userBadge.userId} = ${userId} AND ${schema.userBadge.badgeId} = ${badgeId}`
	});

	if (!existing) {
		await db.insert(schema.userBadge).values({
			id: generateId(),
			userId,
			badgeId,
			earnedAt: new Date()
		});
		console.log(`User ${userId} earned badge: ${badgeId}`);
	}
}
