import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { awardPoints, updateStreak, checkAndAwardBadges } from '$lib/server/gamification';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { courseId, lessonId, lastPositionMs, completed } = await request.json();

	if (!courseId || !lessonId) {
		return json({ error: 'Missing IDs' }, { status: 400 });
	}

	// Validate enrollment - user must be enrolled in the course
	const enrollment = await db
		.select({ id: schema.enrollment.id })
		.from(schema.enrollment)
		.where(
			and(
				eq(schema.enrollment.userId, locals.user.id),
				eq(schema.enrollment.courseId, courseId),
				eq(schema.enrollment.status, 'active')
			)
		)
		.limit(1);

	if (enrollment.length === 0) {
		return json({ error: 'Not enrolled in this course' }, { status: 403 });
	}

	try {
		const existing = await db.query.lessonProgress.findFirst({
			where: and(
				eq(schema.lessonProgress.userId, locals.user.id),
				eq(schema.lessonProgress.lessonId, lessonId)
			)
		});

		const wasAlreadyCompleted = existing?.completedAt != null;
		const nowCompleting = completed && !wasAlreadyCompleted;

		if (existing) {
			await db
				.update(schema.lessonProgress)
				.set({
					lastPositionMs: lastPositionMs ?? existing.lastPositionMs,
					completedAt: completed ? (existing.completedAt ?? new Date()) : existing.completedAt
				})
				.where(eq(schema.lessonProgress.id, existing.id));
		} else {
			await db.insert(schema.lessonProgress).values({
				id: crypto.randomUUID(),
				userId: locals.user.id,
				courseId,
				lessonId,
				lastPositionMs: lastPositionMs || 0,
				completedAt: completed ? new Date() : null
			});
		}

		// Award gamification points only when lesson is newly completed
		if (nowCompleting) {
			try {
				await awardPoints(locals.user.id, 'lesson_complete', lessonId);
				await updateStreak(locals.user.id);
				await checkAndAwardBadges(locals.user.id);
			} catch {
				// Gamification errors should not block progress tracking
			}
		}

		return json({ success: true });
	} catch (e) {
		console.error(e);
		return json({ error: 'Failed to update progress' }, { status: 500 });
	}
};
