import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { actionSuccess, actionFailure } from '$lib/server/actions';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/auth/signin');
	return {};
};

export const actions: Actions = {
	create: async (event) => {
		const user = event.locals.user;
		if (!user) return actionFailure(401, 'Unauthorized');

		const formData = await event.request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const price = parseInt(formData.get('price') as string) || 0;
		const category = (formData.get('category') as string) || 'general';

		if (!title || !description) {
			return actionFailure(400, 'Title and description are required');
		}

		const courseId = crypto.randomUUID();
		await db.insert(schema.course).values({
			id: courseId,
			title,
			description,
			price,
			category,
			status: 'draft',
			mentorId: user.id,
			createdBy: user.id
		});

		throw redirect(303, `/app/mentor/courses/${courseId}`);
	}
};
