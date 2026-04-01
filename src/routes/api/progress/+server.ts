import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { courseId, lessonId, lastPositionMs, completed } = await request.json();

	if (!courseId || !lessonId) {
		return json({ error: 'Missing IDs' }, { status: 400 });
	}

	try {
		// Check if progress entry exists
		const existing = await db.query.lessonProgress.findFirst({
			where: and(
				eq(schema.lessonProgress.userId, locals.user.id),
				eq(schema.lessonProgress.lessonId, lessonId)
			)
		});

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

		return json({ success: true });
	} catch (e) {
		console.error(e);
		return json({ error: 'Failed to update progress' }, { status: 500 });
	}
};
