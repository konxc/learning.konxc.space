import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, isNull, and } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw error(401, 'Unauthorized');

	const courseId = url.searchParams.get('courseId');

	// Base query for top-level discussions
	let discussionsQuery = db
		.select({
			id: schema.discussion.id,
			title: schema.discussion.title,
			content: schema.discussion.content,
			upvotes: schema.discussion.upvotes,
			isPinned: schema.discussion.isPinned,
			createdAt: schema.discussion.createdAt,
			courseId: schema.discussion.courseId,
			userId: schema.discussion.userId,
			user: {
				username: schema.user.username,
				fullName: schema.user.fullName,
				role: schema.user.role
			}
		})
		.from(schema.discussion)
		.innerJoin(schema.user, eq(schema.discussion.userId, schema.user.id))
		.where(isNull(schema.discussion.parentId))
		.orderBy(desc(schema.discussion.isPinned), desc(schema.discussion.createdAt));

	// Apply course filter if provided
	if (courseId) {
		discussionsQuery = db
			.select({
				id: schema.discussion.id,
				title: schema.discussion.title,
				content: schema.discussion.content,
				upvotes: schema.discussion.upvotes,
				isPinned: schema.discussion.isPinned,
				createdAt: schema.discussion.createdAt,
				courseId: schema.discussion.courseId,
				userId: schema.discussion.userId,
				user: {
					username: schema.user.username,
					fullName: schema.user.fullName,
					role: schema.user.role
				}
			})
			.from(schema.discussion)
			.innerJoin(schema.user, eq(schema.discussion.userId, schema.user.id))
			.where(and(isNull(schema.discussion.parentId), eq(schema.discussion.courseId, courseId)))
			.orderBy(desc(schema.discussion.isPinned), desc(schema.discussion.createdAt));
	}

	const discussions = await discussionsQuery;

	// Get user's enrolled courses for filtering and posting
	const enrollments = await db
		.select({
			id: schema.course.id,
			title: schema.course.title
		})
		.from(schema.enrollment)
		.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.where(eq(schema.enrollment.userId, locals.user.id));

	return {
		discussions,
		enrolledCourses: enrollments,
		currentCourseId: courseId
	};
};

export const actions: Actions = {
	createDiscussion: async ({ locals, request }) => {
		if (!locals.user) throw error(401, 'Unauthorized');

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;
		const courseId = formData.get('courseId') as string;

		if (!title || !content) {
			return fail(400, { error: 'Title and content are required' });
		}

		const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		try {
			await db.insert(schema.discussion).values({
				id,
				userId: locals.user.id,
				title,
				content,
				courseId: courseId === 'general' ? null : courseId,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			return { success: true };
		} catch (e) {
			console.error('Error creating discussion:', e);
			return fail(500, { error: 'Internal Server Error' });
		}
	}
};
