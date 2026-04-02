import { fail, redirect, isRedirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq, and, inArray } from 'drizzle-orm';

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

	// Determine effective role from org context (URL param) or org memberships
	let effectiveOrgRole: string | null = null;

	if (invitedOrgId && invitedRole) {
		// Verify the user actually has this role in the invited org
		const membership = await db.query.organizationMember.findFirst({
			where: and(
				eq(schema.organizationMember.userId, user.id),
				eq(schema.organizationMember.orgId, invitedOrgId)
			)
		});
		if (membership) {
			effectiveOrgRole = membership.role;
		}
	}

	// If no org context from URL, check if user has any mentor/facilitator org membership
	if (!effectiveOrgRole) {
		const orgMembership = await db.query.organizationMember.findFirst({
			where: and(
				eq(schema.organizationMember.userId, user.id),
				inArray(schema.organizationMember.role, ['mentor', 'facilitator', 'owner'])
			)
		});
		if (orgMembership) {
			effectiveOrgRole = orgMembership.role;
		}
	}

	// Redirect to dashboard if onboarding already completed and no special org role
	if (user.onboardingCompleted && !effectiveOrgRole) {
		throw redirect(303, '/app');
	}

	// For Mentors — Load application status
	let mentorData = null;
	if (effectiveOrgRole === 'mentor' || effectiveOrgRole === 'owner') {
		mentorData = await db.query.mentorApplication.findFirst({
			where: eq(schema.mentorApplication.userId, user.id)
		});
	}

	// For Facilitators — Load available organizations
	let organizations: Array<{ id: string; name: string; slug: string }> = [];
	if (effectiveOrgRole === 'facilitator') {
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
				throw redirect(303, '/onboarding');
			}
		} else {
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
		role: effectiveOrgRole || user.role,
		mentorData,
		organizations,
		invitedOrgId,
		invitedRole
	};
};

export const actions: Actions = {
	savePreferences: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const goals = formData.get('goals') as string;
		const interests = formData.get('interests') as string;
		const experienceLevel = formData.get('experienceLevel') as string;
		const learningSchedule = formData.get('learningSchedule') as string;
		const notificationPrefs = formData.get('notificationPrefs') as string;

		try {
			const existing = await db.query.userPreferences.findFirst({
				where: eq(schema.userPreferences.userId, user.id)
			});

			if (existing) {
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
				await db.insert(schema.userPreferences).values({
					userId: user.id,
					goals: goals || '[]',
					interests: interests || '[]',
					experienceLevel,
					learningSchedule,
					notificationPrefs: notificationPrefs || '[]'
				});
			}

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

	completeOnboarding: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const organizationId = formData.get('organizationId') as string | null;

		try {
			// If facilitator invited to an org, ensure membership exists
			if (organizationId) {
				const existingMember = await db.query.organizationMember.findFirst({
					where: and(
						eq(schema.organizationMember.orgId, organizationId),
						eq(schema.organizationMember.userId, user.id)
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
