import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { checkAndAwardBadges } from '$lib/server/badge';

export const POST: RequestHandler = async (event) => {
	const user = await requireAuth(event);
	const courseId = event.params.courseId;

	const body = await event.request.json();
	const { lessonId, lastPositionMs, completed } = body;

	if (!lessonId) {
		throw error(400, 'Lesson ID is required');
	}

	// Verify enrollment
	const enrollment = await db
		.select()
		.from(schema.enrollment)
		.where(
			and(
				eq(schema.enrollment.userId, user.id),
				eq(schema.enrollment.courseId, courseId),
				eq(schema.enrollment.status, 'active')
			)
		)
		.limit(1);

	if (enrollment.length === 0) {
		throw error(403, 'You are not enrolled in this course');
	}

	// Check if progress record exists
	const existingProgress = await db
		.select()
		.from(schema.lessonProgress)
		.where(
			and(
				eq(schema.lessonProgress.userId, user.id),
				eq(schema.lessonProgress.courseId, courseId),
				eq(schema.lessonProgress.lessonId, lessonId)
			)
		)
		.limit(1);

	let wasCompleted = false;

	if (existingProgress.length > 0) {
		// Update existing progress
		wasCompleted = !!existingProgress[0].completedAt;
		await db
			.update(schema.lessonProgress)
			.set({
				lastPositionMs: completed ? 0 : lastPositionMs,
				completedAt: completed ? new Date() : existingProgress[0].completedAt
			})
			.where(eq(schema.lessonProgress.id, existingProgress[0].id));
	} else {
		// Create new progress record
		const progressId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.lessonProgress).values({
			id: progressId,
			userId: user.id,
			courseId: courseId,
			lessonId: lessonId,
			lastPositionMs: completed ? 0 : lastPositionMs,
			completedAt: completed ? new Date() : null
		});
		wasCompleted = completed;
	}

	// Check for badges when lesson is completed
	if (completed && !wasCompleted) {
		try {
			const newBadges = await checkAndAwardBadges(user.id);
			if (newBadges.length > 0) {
				return json({ success: true, newBadges });
			}
		} catch (e) {
			// Badge checking is optional, don't fail the request
			console.error('Badge check failed:', e);
		}
	}

	return json({ success: true });
};
