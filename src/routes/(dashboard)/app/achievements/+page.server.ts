import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, inArray, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user)
		return {
			badges: [],
			xp: 0,
			level: 1,
			progressPercent: 0,
			nextLevelXP: 100,
			tracks: { creator: 0, seller: 0, affiliate: 0 },
			insight: null
		};

	// Get all possible badges
	const allBadges = await db.select().from(schema.badge);

	// Get user earned badges
	const earnedBadges = await db
		.select({
			badgeId: schema.userBadge.badgeId,
			earnedAt: schema.userBadge.earnedAt
		})
		.from(schema.userBadge)
		.where(eq(schema.userBadge.userId, locals.user.id));

	const earnedMap = new Map(earnedBadges.map((b) => [b.badgeId, b.earnedAt]));

	// Enrich all badges with earned status
	const enrichedBadges = allBadges.map((b) => ({
		...b,
		isEarned: earnedMap.has(b.id),
		earnedAt: earnedMap.get(b.id)
	}));

	// Get user XP
	const xpData = await db
		.select()
		.from(schema.userXP)
		.where(eq(schema.userXP.userId, locals.user.id))
		.limit(1);
	const xp = xpData[0] || { points: 0 };
	const level = Math.floor(Math.sqrt(xp.points / 100)) + 1;
	const currentLevelThreshold = Math.pow(level - 1, 2) * 100;
	const nextLevelThreshold = Math.pow(level, 2) * 100;
	const progressInLevel = xp.points - currentLevelThreshold;
	const levelTotalNeeded = nextLevelThreshold - currentLevelThreshold;

	const progressPercent = Math.floor((progressInLevel / levelTotalNeeded) * 100);
	const nextLevelXP = nextLevelThreshold - xp.points;

	// Calculate track progress
	const enrollments = await db
		.select({
			track: schema.enrollment.track,
			courseId: schema.enrollment.courseId
		})
		.from(schema.enrollment)
		.where(
			and(eq(schema.enrollment.userId, locals.user.id), eq(schema.enrollment.status, 'active'))
		);

	const tracks = { creator: 0, seller: 0, affiliate: 0 };

	for (const enr of enrollments) {
		if (!enr.track) continue;

		// Find lessons in this course
		const lessons = await db
			.select({ id: schema.lesson.id })
			.from(schema.lesson)
			.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
			.where(eq(schema.module.courseId, enr.courseId));

		if (lessons.length === 0) continue;

		// Find completed lessons
		const completed = await db
			.select()
			.from(schema.lessonProgress)
			.where(
				and(
					eq(schema.lessonProgress.userId, locals.user.id),
					eq(schema.lessonProgress.courseId, enr.courseId)
				)
			);

		const progress = Math.round((completed.length / lessons.length) * 100);

		if (enr.track === 'creator') tracks.creator = Math.max(tracks.creator, progress);
		if (enr.track === 'seller') tracks.seller = Math.max(tracks.seller, progress);
		if (enr.track === 'affiliate') tracks.affiliate = Math.max(tracks.affiliate, progress);
	}

	// Get latest mentorship feedback via join (no relation defined for gradedByUser)
	const latestGradeRows = await db
		.select({
			feedback: schema.submissionGrade.feedback,
			mentorFullName: schema.user.fullName,
			mentorUsername: schema.user.username,
			mentorRole: schema.user.role
		})
		.from(schema.submissionGrade)
		.innerJoin(schema.submission, eq(schema.submissionGrade.submissionId, schema.submission.id))
		.leftJoin(schema.user, eq(schema.submissionGrade.gradedBy, schema.user.id))
		.where(eq(schema.submission.userId, locals.user.id))
		.orderBy(desc(schema.submissionGrade.gradedAt))
		.limit(1);

	const latestGrade = latestGradeRows[0] ?? null;

	return {
		badges: enrichedBadges,
		xp: xp.points,
		level,
		progressPercent,
		nextLevelXP,
		tracks: tracks ?? { creator: 0, seller: 0, affiliate: 0 },
		insight: latestGrade
			? {
					feedback: latestGrade.feedback,
					mentorName: latestGrade.mentorFullName || latestGrade.mentorUsername || 'Mentor',
					mentorRole: latestGrade.mentorRole || 'Expert'
				}
			: null
	};
};
