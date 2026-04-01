import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, and, asc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw error(401, 'Unauthorized');

	const discussionId = params.id;

	// Fetch discussion detail with user information via explicit join
	const discussionRows = await db
		.select({
			id: schema.discussion.id,
			content: schema.discussion.content,
			title: schema.discussion.title,
			upvotes: schema.discussion.upvotes,
			isPinned: schema.discussion.isPinned,
			createdAt: schema.discussion.createdAt,
			updatedAt: schema.discussion.updatedAt,
			userId: schema.discussion.userId,
			courseId: schema.discussion.courseId,
			lessonId: schema.discussion.lessonId,
			parentId: schema.discussion.parentId,
			user: {
				username: schema.user.username,
				fullName: schema.user.fullName,
				role: schema.user.role,
				avatarUrl: schema.user.avatarUrl
			},
			courseTitle: schema.course.title
		})
		.from(schema.discussion)
		.innerJoin(schema.user, eq(schema.discussion.userId, schema.user.id))
		.leftJoin(schema.course, eq(schema.discussion.courseId, schema.course.id))
		.where(eq(schema.discussion.id, discussionId))
		.limit(1);

	if (discussionRows.length === 0) throw error(404, 'Discussion not found');

	const row = discussionRows[0];
	const mainDiscussion = {
		...row,
		course: row.courseTitle ? { title: row.courseTitle } : null
	};

	// Fetch replies
	const replies = await db
		.select({
			id: schema.discussion.id,
			content: schema.discussion.content,
			upvotes: schema.discussion.upvotes,
			createdAt: schema.discussion.createdAt,
			userId: schema.discussion.userId,
			user: {
				username: schema.user.username,
				fullName: schema.user.fullName,
				role: schema.user.role
			}
		})
		.from(schema.discussion)
		.innerJoin(schema.user, eq(schema.discussion.userId, schema.user.id))
		.where(eq(schema.discussion.parentId, discussionId))
		.orderBy(asc(schema.discussion.createdAt));

	return {
		discussion: mainDiscussion,
		replies
	};
};

export const actions: Actions = {
	addReply: async ({ locals, request, params }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		const discussionId = params.id;
		const formData = await request.formData();
		const content = formData.get('content') as string;

		if (!content) return fail(400, { error: 'Content is required' });

		const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		try {
			await db.insert(schema.discussion).values({
				id,
				userId: locals.user.id,
				parentId: discussionId,
				content,
				courseId: null, // Inherit from parent logic?
				createdAt: new Date(),
				updatedAt: new Date()
			});

			return { success: true };
		} catch (e) {
			console.error('Error adding reply:', e);
			return fail(500, { error: 'Internal Server Error' });
		}
	},

	upvote: async ({ locals, params }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		const discussionId = params.id;

		try {
			// Basic upvote implementation (increment)
			// In production, we'd want a separate table to prevent double-voting
			const disc = await db.query.discussion.findFirst({
				where: eq(schema.discussion.id, discussionId)
			});

			if (disc) {
				await db
					.update(schema.discussion)
					.set({ upvotes: (disc.upvotes || 0) + 1 })
					.where(eq(schema.discussion.id, discussionId));
			}

			return { success: true };
		} catch (e) {
			console.error('Error upvoting:', e);
			return fail(500, { error: 'Internal Server Error' });
		}
	}
};
