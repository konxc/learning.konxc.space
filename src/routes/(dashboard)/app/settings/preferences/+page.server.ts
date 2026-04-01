import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionSuccess, actionFailure } from '$lib/server/actions';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/auth/signin');

	const [preferences] = await db
		.select()
		.from(schema.userPreferences)
		.where(eq(schema.userPreferences.userId, locals.user.id))
		.limit(1);

	return {
		preferences: preferences ?? {
			goals: '[]',
			interests: '[]',
			experienceLevel: 'beginner',
			learningSchedule: 'flexible',
			notificationPrefs: '["email"]',
			focusMode: true
		}
	};
};

export const actions: Actions = {
	save: async (event) => {
		const user = await event.locals.user;
		if (!user) return actionFailure(401, 'Unauthorized');

		const formData = await event.request.formData();
		const goals = formData.get('goals') as string;
		const interests = formData.get('interests') as string;
		const experienceLevel = formData.get('experienceLevel') as string;
		const learningSchedule = formData.get('learningSchedule') as string;
		const notificationPrefs = formData.get('notificationPrefs') as string;
		const focusMode = formData.get('focusMode') === 'true';

		// Upsert preferences
		const existing = await db
			.select({ userId: schema.userPreferences.userId })
			.from(schema.userPreferences)
			.where(eq(schema.userPreferences.userId, user.id))
			.limit(1);

		if (existing[0]) {
			await db
				.update(schema.userPreferences)
				.set({
					goals,
					interests,
					experienceLevel,
					learningSchedule,
					notificationPrefs,
					focusMode,
					updatedAt: new Date()
				})
				.where(eq(schema.userPreferences.userId, user.id));
		} else {
			await db.insert(schema.userPreferences).values({
				userId: user.id,
				goals,
				interests,
				experienceLevel,
				learningSchedule,
				notificationPrefs,
				focusMode,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		}

		return actionSuccess();
	}
};
