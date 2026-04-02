import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { sendNotification } from '$lib/server/notifications';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const lessonId = url.searchParams.get('lessonId');
	const courseId = url.searchParams.get('courseId');

	if (!lessonId) return json({ error: 'Lesson ID required' }, { status: 400 });

	try {
		// Fetch top-level discussions (questions) for this lesson
		const discussions = await db.query.discussion.findMany({
			where: and(eq(schema.discussion.lessonId, lessonId), isNull(schema.discussion.parentId)),
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
		const withReplies = await Promise.all(
			discussions.map(async (d) => {
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
			})
		);

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
			upvotes: 0,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		// Notify: if replying to a discussion, notify the parent author
		if (parentId) {
			const parentDiscussion = await db.query.discussion.findFirst({
				where: eq(schema.discussion.id, parentId),
				columns: { userId: true }
			});

			if (parentDiscussion && parentDiscussion.userId !== locals.user.id) {
				try {
					await sendNotification({
						userId: parentDiscussion.userId,
						type: 'system',
						title: 'Balasan Diskusi Baru',
						message: `${locals.user.fullName ?? locals.user.username} membalas diskusi kamu`,
						link: lessonId ? `/app/discussion/${lessonId}` : `/app/discussion`,
						channel: 'notification'
					});
				} catch (e) {
					console.warn('Failed to send discussion reply notification:', e);
				}
			}
		}

		// Notify mentor if this is a new top-level discussion
		if (!parentId && courseId) {
			const course = await db.query.course.findFirst({
				where: eq(schema.course.id, courseId),
				columns: { mentorId: true, title: true }
			});

			if (course?.mentorId && course.mentorId !== locals.user.id) {
				try {
					await sendNotification({
						userId: course.mentorId,
						type: 'system',
						title: 'Diskusi Baru di Kursus',
						message: `${locals.user.fullName ?? locals.user.username} memulai diskusi baru di "${course.title}"`,
						link: lessonId ? `/app/discussion/${lessonId}` : `/app/discussion`,
						channel: 'notification'
					});
				} catch (e) {
					console.warn('Failed to send new discussion notification to mentor:', e);
				}
			}
		}

		return json({ success: true, id });
	} catch (e) {
		console.error(e);
		return json({ error: 'Failed to post' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { discussionId, action } = await request.json();

	if (!discussionId || !action || !['upvote', 'remove'].includes(action)) {
		return json({ error: 'Missing or invalid required fields' }, { status: 400 });
	}

	try {
		// Verify discussion exists
		const discussion = await db.query.discussion.findFirst({
			where: eq(schema.discussion.id, discussionId),
			columns: { upvotes: true, userId: true }
		});

		if (!discussion) {
			return json({ error: 'Discussion not found' }, { status: 404 });
		}

		// Prevent user from voting on their own discussion
		if (discussion.userId === locals.user.id) {
			return json({ error: 'Cannot vote on your own discussion' }, { status: 400 });
		}

		if (action === 'upvote') {
			// Atomic increment - prevents race conditions
			await db
				.update(schema.discussion)
				.set({ upvotes: (discussion.upvotes ?? 0) + 1 })
				.where(eq(schema.discussion.id, discussionId));
		} else if (action === 'remove') {
			// Remove vote - only if currently voted (positive)
			if ((discussion.upvotes ?? 0) > 0) {
				await db
					.update(schema.discussion)
					.set({ upvotes: Math.max(0, (discussion.upvotes ?? 0) - 1) })
					.where(eq(schema.discussion.id, discussionId));
			}
		}

		return json({ success: true, action });
	} catch (e) {
		console.error('Vote error:', e);
		return json({ error: 'Failed to process vote' }, { status: 500 });
	}
};
