import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const lessonId = url.searchParams.get('lessonId');
	const courseId = url.searchParams.get('courseId');

	if (!lessonId) return json({ error: 'Lesson ID required' }, { status: 400 });

	try {
		// Fetch top-level discussions (questions) for this lesson
		const discussions = await db.query.discussion.findMany({
				where: and(
					eq(schema.discussion.lessonId, lessonId),
					isNull(schema.discussion.parentId)
				),
				orderBy: [desc(schema.discussion.isPinned), desc(schema.discussion.createdAt)],
				with: {
					user: {
						columns: {
							username: true,
							fullName: true,
							avatarUrl: true,
							role: true
						}
					}
				}
		});

		// For each discussion, fetch replies (nested or separate, let's keep it simple for now)
		const withReplies = await Promise.all(discussions.map(async (d) => {
			const replies = await db.query.discussion.findMany({
				where: eq(schema.discussion.parentId, d.id),
				orderBy: [schema.discussion.createdAt],
				with: {
					user: {
						columns: {
							username: true,
							fullName: true,
							avatarUrl: true,
							role: true
						}
					}
				}
			});
			return { ...d, replies };
		}));

		return json({ discussions: withReplies });
	} catch (e) {
		console.error(e);
		return json({ error: 'Server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { lessonId, courseId, parentId, content, title } = await request.json();

	if (!content || (!lessonId && !courseId)) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	try {
		const id = crypto.randomUUID();
		await db.insert(schema.discussion).values({
			id,
			userId: locals.user.id,
			courseId,
			lessonId,
			parentId,
			title: title || null,
			content,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return json({ success: true, id });
	} catch (e) {
		console.error(e);
		return json({ error: 'Failed to post' }, { status: 500 });
	}
};
