import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '$lib/server/middleware';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = await requireAuth(locals);
	const lessonId = url.searchParams.get('lessonId');
	const courseId = url.searchParams.get('courseId');

	if (!lessonId || !courseId) {
		return json({ error: 'lessonId and courseId are required' }, { status: 400 });
	}

	const note = await db
		.select()
		.from(schema.lessonNote)
		.where(
			and(
				eq(schema.lessonNote.userId, user.id),
				eq(schema.lessonNote.lessonId, lessonId),
				eq(schema.lessonNote.courseId, courseId)
			)
		)
		.limit(1);

	if (note.length === 0) {
		return json({ note: null });
	}

	return json({ note: note[0] });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = await requireAuth(locals);
	const data = await request.json();

	const { lessonId, courseId, content } = data;

	if (!lessonId || !courseId || !content) {
		return json({ error: 'lessonId, courseId, and content are required' }, { status: 400 });
	}

	const existing = await db
		.select()
		.from(schema.lessonNote)
		.where(
			and(
				eq(schema.lessonNote.userId, user.id),
				eq(schema.lessonNote.lessonId, lessonId),
				eq(schema.lessonNote.courseId, courseId)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(schema.lessonNote)
			.set({
				content,
				updatedAt: new Date()
			})
			.where(eq(schema.lessonNote.id, existing[0].id));

		return json({ success: true, noteId: existing[0].id });
	}

	const id = crypto.randomUUID();
	await db.insert(schema.lessonNote).values({
		id,
		userId: user.id,
		lessonId,
		courseId,
		content
	});

	return json({ success: true, noteId: id });
};
