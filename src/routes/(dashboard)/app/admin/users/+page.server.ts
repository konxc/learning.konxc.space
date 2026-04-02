import { requireAuth } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

// Platform roles - per PLATFORM_ARCHITECTURE_BRIEF.md
const PLATFORM_ROLES = ['admin', 'bd', 'user'] as const;
type PlatformRole = (typeof PLATFORM_ROLES)[number];

// Org roles - mentor/facilitator are ONLY org-level, never platform-level
const ORG_ROLES = ['owner', 'admin', 'mentor', 'facilitator', 'member'] as const;

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';
	const role = parentData.effectiveRole || user.role;
	const isAdminContext = ['admin', 'owner'].includes(role);

	if (!isAdminContext) {
		throw error(403, 'Forbidden');
	}

	let users;
	if (activeWorkspaceId === 'personal') {
		users = await db
			.select({
				id: schema.user.id,
				username: schema.user.username,
				email: schema.user.email,
				fullName: schema.user.fullName,
				role: schema.user.role,
				phone: schema.user.phone,
				onboardingCompleted: schema.user.onboardingCompleted,
				createdAt: schema.user.createdAt
			})
			.from(schema.user)
			.orderBy(schema.user.createdAt);
	} else {
		users = await db
			.select({
				id: schema.user.id,
				username: schema.user.username,
				email: schema.user.email,
				fullName: schema.user.fullName,
				role: schema.organizationMember.role,
				phone: schema.user.phone,
				onboardingCompleted: schema.user.onboardingCompleted,
				createdAt: schema.user.createdAt
			})
			.from(schema.user)
			.innerJoin(
				schema.organizationMember,
				and(
					eq(schema.organizationMember.userId, schema.user.id),
					eq(schema.organizationMember.orgId, activeWorkspaceId)
				)
			)
			.orderBy(schema.user.createdAt);
	}

	return { users, activeWorkspaceId };
};

export const actions: Actions = {
	updateUser: async (event) => {
		const currentUser = await requireAuth(event);

		// Re-check admin from user's own role (actions can't call event.parent())
		if (!['admin'].includes(currentUser.role)) {
			throw error(403, 'Forbidden');
		}

		const formData = await event.request.formData();
		const userId = formData.get('userId') as string;
		const fullName = formData.get('fullName') as string;
		const emailVal = formData.get('email') as string;
		const phone = formData.get('phone') as string;

		if (!userId) return { success: false, error: 'User ID is required' };

		try {
			await db
				.update(schema.user)
				.set({ fullName, email: emailVal, phone })
				.where(eq(schema.user.id, userId));

			return { success: true };
		} catch (e) {
			return { success: false, error: 'Failed to update user' };
		}
	},

	changeRole: async (event) => {
		const currentUser = await requireAuth(event);

		if (!['admin'].includes(currentUser.role)) {
			throw error(403, 'Forbidden');
		}

		const formData = await event.request.formData();
		const userId = formData.get('userId') as string;
		const newRole = formData.get('newRole') as string;
		const activeWorkspaceId = (formData.get('activeWorkspaceId') as string) || 'personal';

		if (!userId || !newRole) return { success: false, error: 'User ID and Role are required' };

		// Validate role based on context (per PLATFORM_ARCHITECTURE_BRIEF.md)
		if (activeWorkspaceId === 'personal') {
			// Platform role - must be one of: admin, bd, user
			// mentor and facilitator are ORG-LEVEL roles only, never platform-level
			if (!PLATFORM_ROLES.includes(newRole as PlatformRole)) {
				return {
					success: false,
					error: `Invalid platform role. Must be one of: ${PLATFORM_ROLES.join(', ')}`
				};
			}
		} else {
			// Org role - must be one of: owner, admin, mentor, facilitator, member
			if (!(ORG_ROLES as readonly string[]).includes(newRole)) {
				return {
					success: false,
					error: `Invalid organization role. Must be one of: ${ORG_ROLES.join(', ')}`
				};
			}
		}

		try {
			if (activeWorkspaceId === 'personal') {
				await db.update(schema.user).set({ role: newRole }).where(eq(schema.user.id, userId));
			} else {
				await db
					.update(schema.organizationMember)
					.set({ role: newRole })
					.where(
						and(
							eq(schema.organizationMember.userId, userId),
							eq(schema.organizationMember.orgId, activeWorkspaceId)
						)
					);
			}

			return { success: true };
		} catch (e) {
			return { success: false, error: 'Failed to update role' };
		}
	}
};
