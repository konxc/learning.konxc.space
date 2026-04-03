import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { actionSuccess, actionFailure } from '$lib/server/actions';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	if (!locals.user) throw redirect(302, '/auth/signin');

	const { membership } = await event.parent();
	return { membership };
};

export const actions: Actions = {
	create: async (event) => {
		const { locals, params, request } = event;
		const user = locals.user;
		if (!user) return actionFailure(401, 'Unauthorized');

		const orgId = params.id;

		// Verify membership
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, user.id)
				)
			)
			.limit(1);

		if (!membership || !['owner', 'admin', 'mentor'].includes(membership.role)) {
			return actionFailure(403, 'Unauthorized management access');
		}

		// Handle JSON POST from CourseWizard
		const contentType = request.headers.get('content-type');
		if (contentType === 'application/json') {
			const courseData = await request.json();
			const { title, description, track, category, price, visibility } = courseData;

			if (!title || !description) {
				return actionFailure(400, 'Title and description are required');
			}

			const courseId = crypto.randomUUID();
			await db.insert(schema.course).values({
				id: courseId,
				orgId,
				title,
				description,
				price: price || 0,
				category: category || 'general',
				status: 'draft',
				visibility: visibility || 'draft',
				mentorId: user.id,
				createdBy: user.id
			});

			return actionSuccess({ courseId });
		}

		// Fallback for form submission
		const formData = await request.formData();
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
			orgId,
			title,
			description,
			price,
			category,
			status: 'draft',
			mentorId: user.id,
			createdBy: user.id
		});

		throw redirect(303, `/app/organizations/${orgId}/mentor/courses/${courseId}/settings`);
	}
};
