import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async ({ params, locals }) => {
	const mentor = await requireAuth({ user: locals.user });
	const { id } = params;

	const course = await db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
		.limit(1);

	if (course.length === 0) {
		throw redirect(303, '/app/mentor/courses');
	}

	return { course: course[0] };
};

export const actions: Actions = {
	updateSettings: async ({ request, params, locals }) => {
		const mentor = await requireAuth({ user: locals.user });
		const { id } = params;

		const course = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, id), eq(schema.course.mentorId, mentor.id)))
			.limit(1);

		if (course.length === 0) return actionFailure(403, 'Unauthorized');

		const formData = await request.formData();
		const visibility = formData.get('visibility') as string;
		const affiliateEnabled = formData.get('affiliate') === 'on';
		const discussionEnabled = formData.get('discussion') === 'on';
		const performanceEnabled = formData.get('performance') === 'on';

		const featuresConfig = JSON.stringify({
			affiliate: affiliateEnabled,
			discussion: discussionEnabled,
			performance: performanceEnabled
		});

		const validVisibilities = ['draft', 'public', 'internal', 'invite_only'];
		if (!validVisibilities.includes(visibility)) {
			return actionFailure(400, 'Invalid visibility value');
		}

		await db
			.update(schema.course)
			.set({ visibility, featuresConfig, updatedAt: new Date() })
			.where(eq(schema.course.id, id));

		return actionSuccess({ message: 'Pengaturan kursus disimpan.' });
	}
} satisfies Actions;
