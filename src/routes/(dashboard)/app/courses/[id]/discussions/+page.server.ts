import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const courseId = event.params.id;

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
		throw redirect(303, `/app/courses/${courseId}`);
	}

	// Get course details
	const course = await db
		.select({ id: schema.course.id, title: schema.course.title })
		.from(schema.course)
		.where(eq(schema.course.id, courseId))
		.limit(1);

	if (!course[0]) {
		throw redirect(303, '/app/courses');
	}

	// Get discussions (top-level only, not replies)
	const discussions = await db
		.select({
			id: schema.discussion.id,
			title: schema.discussion.title,
			content: schema.discussion.content,
			upvotes: schema.discussion.upvotes,
			isPinned: schema.discussion.isPinned,
			createdAt: schema.discussion.createdAt,
			user: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName
			},
			replyCount: (
				db
					.select({ count: schema.discussion.id })
					.from(schema.discussion)
					.where(eq(schema.discussion.parentId, schema.discussion.id)) as any
			)._.as('reply_count')
		})
		.from(schema.discussion)
		.innerJoin(schema.user, eq(schema.discussion.userId, schema.user.id))
		.where(and(eq(schema.discussion.courseId, courseId), isNull(schema.discussion.parentId)))
		.orderBy(desc(schema.discussion.isPinned), desc(schema.discussion.createdAt));

	// Get reply counts separately
	const discussionsWithReplies = await Promise.all(
		discussions.map(async (d) => {
			const replies = await db
				.select({ id: schema.discussion.id })
				.from(schema.discussion)
				.where(eq(schema.discussion.parentId, d.id));
			return { ...d, replyCount: replies.length };
		})
	);

	return { course: course[0], discussions: discussionsWithReplies };
};

export const actions: Actions = {
	create: async (event) => {
		const user = await requireAuth(event);
		const courseId = event.params.id;

		const formData = await event.request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;

		if (!title?.trim() || !content?.trim()) {
			return fail(400, { error: 'Title and content are required.' });
		}

		const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.discussion).values({
			id,
			userId: user.id,
			courseId,
			title: title.trim(),
			content: content.trim(),
			upvotes: 0,
			isPinned: false,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return { success: true };
	},

	reply: async (event) => {
		const user = await requireAuth(event);
		const courseId = event.params.id;

		const formData = await event.request.formData();
		const parentId = formData.get('parentId') as string;
		const content = formData.get('content') as string;

		if (!parentId || !content?.trim()) {
			return fail(400, { error: 'Content is required.' });
		}

		const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		await db.insert(schema.discussion).values({
			id,
			userId: user.id,
			courseId,
			parentId,
			content: content.trim(),
			upvotes: 0,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return { success: true };
	},

	upvote: async (event) => {
		const user = await requireAuth(event);

		const formData = await event.request.formData();
		const discussionId = formData.get('discussionId') as string;

		if (!discussionId) {
			return fail(400, { error: 'Discussion ID required.' });
		}

		const discussion = await db
			.select({ upvotes: schema.discussion.upvotes })
			.from(schema.discussion)
			.where(eq(schema.discussion.id, discussionId))
			.limit(1);

		if (discussion[0]) {
			await db
				.update(schema.discussion)
				.set({ upvotes: discussion[0].upvotes + 1 })
				.where(eq(schema.discussion.id, discussionId));
		}

		return { success: true };
	}
};
