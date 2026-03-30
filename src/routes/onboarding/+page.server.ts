import { fail, redirect, isRedirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/signin');
	}

	const user = locals.user;
	const invitedOrgId = url.searchParams.get('org');
	const invitedRole = url.searchParams.get('role');

	// Bridge logic for students with existing enrollments
	if (user.role === 'user' && !user.onboardingCompleted) {
		const existingEnrollment = await db.query.enrollment.findFirst({
			where: eq(schema.enrollment.userId, user.id)
		});

		if (existingEnrollment) {
			await db
				.update(schema.user)
				.set({ onboardingCompleted: true })
				.where(eq(schema.user.id, user.id));
			throw redirect(303, '/app');
		}
	}

	// Redirect to dashboard if onboarding already completed (for mentor/facilitator)
	if ((user.role === 'mentor' || user.role === 'facilitator') && user.onboardingCompleted) {
		throw redirect(303, '/app');
	}

	// For Mentors - Load application status
	let mentorData = null;
	if (user.role === 'mentor') {
		mentorData = await db.query.mentorApplication.findFirst({
			where: eq(schema.mentorApplication.userId, user.id)
		});
	}

	// For Facilitators - Load available organizations
	let organizations: Array<{ id: string; name: string; slug: string }> = [];
	if (user.role === 'facilitator') {
		// If invited to a specific org, only load that org
		if (invitedOrgId) {
			const invitedOrg = await db
				.select({
					id: schema.organization.id,
					name: schema.organization.name,
					slug: schema.organization.slug
				})
				.from(schema.organization)
				.where(eq(schema.organization.id, invitedOrgId))
				.limit(1);

			if (invitedOrg.length > 0) {
				organizations = invitedOrg;
			} else {
				// Org not found — strip invalid param and redirect
				throw redirect(303, '/onboarding');
			}
		} else if (user.role === 'facilitator') {
			// No specific invitation - load all available orgs for facilitator
			organizations = await db
				.select({
					id: schema.organization.id,
					name: schema.organization.name,
					slug: schema.organization.slug
				})
				.from(schema.organization);
		}
	}

	return {
		role: user.role,
		mentorData,
		organizations,
		invitedOrgId,
		invitedRole
	};
};

export const actions: Actions = {
	// Save user preferences (telemetry data)
	savePreferences: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const goals = formData.get('goals') as string; // JSON array string
		const interests = formData.get('interests') as string; // JSON array string
		const experienceLevel = formData.get('experienceLevel') as string;
		const learningSchedule = formData.get('learningSchedule') as string;
		const notificationPrefs = formData.get('notificationPrefs') as string; // JSON array string

		try {
			// Check if user preferences already exist
			const existing = await db.query.userPreferences.findFirst({
				where: eq(schema.userPreferences.userId, user.id)
			});

			if (existing) {
				// Update existing preferences
				await db
					.update(schema.userPreferences)
					.set({
						goals: goals || '[]',
						interests: interests || '[]',
						experienceLevel,
						learningSchedule,
						notificationPrefs: notificationPrefs || '[]',
						updatedAt: new Date()
					})
					.where(eq(schema.userPreferences.userId, user.id));
			} else {
				// Insert new preferences
				await db.insert(schema.userPreferences).values({
					userId: user.id,
					goals: goals || '[]',
					interests: interests || '[]',
					experienceLevel,
					learningSchedule,
					notificationPrefs: notificationPrefs || '[]'
				});
			}

			// Mark onboarding as complete
			await db
				.update(schema.user)
				.set({ onboardingCompleted: true })
				.where(eq(schema.user.id, user.id));

			throw redirect(303, '/app');
		} catch (error) {
			if (isRedirect(error)) throw error;
			console.error('Failed to save preferences:', error);
			return fail(500, { error: 'Gagal menyimpan preferensi' });
		}
	},

	// Complete onboarding for facilitators (organization selection)
	completeOnboarding: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const organizationId = formData.get('organizationId') as string | null;

		try {
			// If facilitator, add them to the organization
			if (user.role === 'facilitator' && organizationId) {
				// Check if already a member
				const existingMember = await db.query.organizationMember.findFirst({
					where: (fields, operators) =>
						operators.and(
							operators.eq(fields.orgId, organizationId),
							operators.eq(fields.userId, user.id)
						)
				});

				if (!existingMember) {
					await db.insert(schema.organizationMember).values({
						id: generateId(),
						orgId: organizationId,
						userId: user.id,
						role: 'facilitator'
					});
				}
			}

			// Mark onboarding as complete
			await db
				.update(schema.user)
				.set({ onboardingCompleted: true })
				.where(eq(schema.user.id, user.id));

			throw redirect(303, '/app');
		} catch (error) {
			if (isRedirect(error)) throw error;
			console.error('Failed to complete onboarding:', error);
			return fail(500, { error: 'Terjadi kesalahan saat menyelesaikan onboarding' });
		}
	},

	redirectToSettings: async ({ locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		// Mark onboarding as complete and redirect to settings
		try {
			await db
				.update(schema.user)
				.set({ onboardingCompleted: true })
				.where(eq(schema.user.id, user.id));

			throw redirect(303, '/app/settings');
		} catch (error) {
			if (isRedirect(error)) throw error;
			console.error('Failed to redirect to settings:', error);
			return fail(500, { error: 'Terjadi kesalahan' });
		}
	}
};

function generateId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}
