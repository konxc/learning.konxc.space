import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export async function seedBadges(db: NeonHttpDatabase<typeof schema>) {
	logSection('Seeding badges');

	const badges = [
		{
			id: 'badge-001',
			name: 'First Step',
			description: 'Menyelesaikan materi pertama',
			icon: '🚀',
			criteria: JSON.stringify({ type: 'complete_lesson', count: 1 })
		},
		{
			id: 'badge-002',
			name: 'Dedicated Learner',
			description: 'Login 7 hari berturut-turut',
			icon: '🔥',
			criteria: JSON.stringify({ type: 'streak', days: 7 })
		},
		{
			id: 'badge-003',
			name: 'Course Master',
			description: 'Menelesaikan satu course lengkap',
			icon: '🎓',
			criteria: JSON.stringify({ type: 'complete_course', count: 1 })
		},
		{
			id: 'badge-004',
			name: 'Quiz Ace',
			description: 'Mendapat nilai 100 di kuis',
			icon: '⭐',
			criteria: JSON.stringify({ type: 'perfect_quiz', score: 100 })
		},
		{
			id: 'badge-005',
			name: 'Helping Hand',
			description: 'Membantu pebbles lain di forum',
			icon: '🤝',
			criteria: JSON.stringify({ type: 'forum_helpful', count: 1 })
		},
		{
			id: 'badge-006',
			name: 'Weekend Warrior',
			description: 'Menyelesaikan checkpoint mingguan',
			icon: '💪',
			criteria: JSON.stringify({ type: 'checkpoint_completed', count: 1 })
		},
		{
			id: 'badge-007',
			name: 'Content Creator',
			description: 'Mengupload 5 karya',
			icon: '📸',
			criteria: JSON.stringify({ type: 'upload_work', count: 5 })
		},
		{
			id: 'badge-008',
			name: 'Affiliate Pro',
			description: 'Mendapat 10 penjualan affiliate',
			icon: '💰',
			criteria: JSON.stringify({ type: 'affiliate_sales', count: 10 })
		}
	];

	for (const badge of badges) {
		await db.insert(schema.badge).values(badge).onConflictDoNothing();
	}

	logSuccess(`Seeded ${badges.length} badges`);
}

export async function seedUserXP(db: NeonHttpDatabase<typeof schema>, userIds: string[]) {
	logSection('Seeding user XP');

	const xpData = [
		{
			userId: userIds[0],
			points: 1250,
			level: 5,
			streakDays: 7,
			lastActiveAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			userId: userIds[1],
			points: 2100,
			level: 7,
			streakDays: 14,
			lastActiveAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			userId: userIds[2],
			points: 450,
			level: 2,
			streakDays: 3,
			lastActiveAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date()
		}
	];

	for (const xp of xpData) {
		await db.insert(schema.userXP).values(xp).onConflictDoNothing();
	}

	logSuccess(`Seeded user XP for ${xpData.length} users`);
}

export async function seedUserBadges(db: NeonHttpDatabase<typeof schema>, userIds: string[]) {
	logSection('Seeding user badges');

	const userBadges = [
		{ id: 'ub-001', userId: userIds[0], badgeId: 'badge-001', earnedAt: new Date('2024-01-25') },
		{ id: 'ub-002', userId: userIds[0], badgeId: 'badge-002', earnedAt: new Date('2024-02-01') },
		{ id: 'ub-003', userId: userIds[0], badgeId: 'badge-004', earnedAt: new Date('2024-02-10') },
		{ id: 'ub-004', userId: userIds[1], badgeId: 'badge-001', earnedAt: new Date('2024-01-22') },
		{ id: 'ub-005', userId: userIds[1], badgeId: 'badge-002', earnedAt: new Date('2024-01-29') },
		{ id: 'ub-006', userId: userIds[1], badgeId: 'badge-003', earnedAt: new Date('2024-02-15') },
		{ id: 'ub-007', userId: userIds[1], badgeId: 'badge-004', earnedAt: new Date('2024-02-08') },
		{ id: 'ub-008', userId: userIds[2], badgeId: 'badge-001', earnedAt: new Date('2024-01-28') }
	];

	for (const ub of userBadges) {
		await db.insert(schema.userBadge).values(ub).onConflictDoNothing();
	}

	logSuccess(`Seeded ${userBadges.length} user badges`);
}
