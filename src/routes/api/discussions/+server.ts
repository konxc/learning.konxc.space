import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc, isNull, inArray } from 'drizzle-orm';
import { sendNotification } from '$lib/server/notifications';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const lessonId = url.searchParams.get('lessonId');
	if (!lessonId) return json({ error: 'Lesson ID required' }, { status: 400 });

	try {
		// Fetch top-level discussions for this lesson
		const rawDiscussions = await db
			.select({
				id: schema.discussion.id,
				content: schema.discussion.content,
				title: schema.discussion.title,
				upvotes: schema.discussion.upvotes,
				isPinned: schema.discussion.isPinned,
				createdAt: schema.discussion.createdAt,
				updatedAt: schema.discussion.updatedAt,
				userId: schema.discussion.userId,
				parentId: schema.discussion.parentId,
				lessonId: schema.discussion.lessonId,
				courseId: schema.discussion.courseId,
				user: {
					username: schema.user.username,
					fullName: schema.user.fullName,
					avatarUrl: schema.user.avatarUrl,
					role: schema.user.role
				}
			})
			.from(schema.discussion)
			.innerJoin(schema.user, eq(schema.discussion.userId, schema.user.id))
			.where(and(eq(schema.discussion.lessonId, lessonId), isNull(schema.discussion.parentId)))
			.orderBy(desc(schema.discussion.isPinned), desc(schema.discussion.createdAt));

		if (rawDiscussions.length === 0) return json({ discussions: [] });

		// Fetch replies for first 10 discussions
		const topIds = rawDiscussions.slice(0, 10).map((d) => d.id);

		const rawReplies = await db
			.select({
				id: schema.discussion.id,
				content: schema.discussion.content,
				title: schema.discussion.title,
				upvotes: schema.discussion.upvotes,
				isPinned: schema.discussion.isPinned,
				createdAt: schema.discussion.createdAt,
				updatedAt: schema.discussion.updatedAt,
				userId: schema.discussion.userId,
				parentId: schema.discussion.parentId,
				lessonId: schema.discussion.lessonId,
				courseId: schema.discussion.courseId,
				user: {
					username: schema.user.username,
					fullName: schema.user.fullName,
					avatarUrl: schema.user.avatarUrl,
					role: schema.user.role
				}
			})
			.from(schema.discussion)
			.innerJoin(schema.user, eq(schema.discussion.userId, schema.user.id))
			.where(inArray(schema.discussion.parentId, topIds))
			.orderBy(schema.discussion.createdAt);

		// Group replies by parentId
		const repliesMap = new Map<string, typeof rawReplies>();
		for (const reply of rawReplies) {
			const pid = reply.parentId!;
			if (!repliesMap.has(pid)) repliesMap.set(pid, []);
			repliesMap.get(pid)!.push(reply);
		}

		const result = rawDiscussions.map((d) => ({
			...d,
			replies: repliesMap.get(d.id) ?? []
		}));

		return json({ discussions: result });
	} catch (e) {
		console.error('Discussion API error:', e);
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

		// Notify parent author on reply
		if (parentId) {
			const parentRows = await db
				.select({ userId: schema.discussion.userId })
				.from(schema.discussion)
				.where(eq(schema.discussion.id, parentId))
				.limit(1);

			const parentUserId = parentRows[0]?.userId;
			if (parentUserId && parentUserId !== locals.user.id) {
				try {
					await sendNotification({
						userId: parentUserId,
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

		// Notify mentor on new top-level discussion
		if (!parentId && courseId) {
			const courseRows = await db
				.select({ mentorId: schema.course.mentorId, title: schema.course.title })
				.from(schema.course)
				.where(eq(schema.course.id, courseId))
				.limit(1);

			const course = courseRows[0];
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
		const discRows = await db
			.select({ upvotes: schema.discussion.upvotes, userId: schema.discussion.userId })
			.from(schema.discussion)
			.where(eq(schema.discussion.id, discussionId))
			.limit(1);

		const discussion = discRows[0];
		if (!discussion) return json({ error: 'Discussion not found' }, { status: 404 });

		if (discussion.userId === locals.user.id) {
			return json({ error: 'Cannot vote on your own discussion' }, { status: 400 });
		}

		if (action === 'upvote') {
			await db
				.update(schema.discussion)
				.set({ upvotes: (discussion.upvotes ?? 0) + 1 })
				.where(eq(schema.discussion.id, discussionId));
		} else if (action === 'remove' && (discussion.upvotes ?? 0) > 0) {
			await db
				.update(schema.discussion)
				.set({ upvotes: Math.max(0, (discussion.upvotes ?? 0) - 1) })
				.where(eq(schema.discussion.id, discussionId));
		}

		return json({ success: true, action });
	} catch (e) {
		console.error('Vote error:', e);
		return json({ error: 'Failed to process vote' }, { status: 500 });
	}
};
