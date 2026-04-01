import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

const VALID_TRACKS = ['creator', 'seller', 'affiliate'];

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { enrollmentId, newTrack } = await request.json();

	if (!enrollmentId || !newTrack) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	if (!VALID_TRACKS.includes(newTrack)) {
		return json({ error: 'Invalid track' }, { status: 400 });
	}

	try {
		// Verify enrollment belongs to user
		const [enrollment] = await db
			.select()
			.from(schema.enrollment)
			.where(
				and(eq(schema.enrollment.id, enrollmentId), eq(schema.enrollment.userId, locals.user.id))
			)
			.limit(1);

		if (!enrollment) {
			return json({ error: 'Enrollment not found' }, { status: 404 });
		}

		if (enrollment.status !== 'active') {
			return json({ error: 'Can only switch track for active enrollments' }, { status: 400 });
		}

		// Update track
		await db
			.update(schema.enrollment)
			.set({ track: newTrack })
			.where(eq(schema.enrollment.id, enrollmentId));

		return json({ success: true, track: newTrack });
	} catch (e) {
		console.error(e);
		return json({ error: 'Failed to switch track' }, { status: 500 });
	}
};
