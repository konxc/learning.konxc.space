import { requireAuth } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';

	// Map role
	const role = parentData.effectiveRole || user.role;
	const isAdminContext = ['admin', 'owner'].includes(role);

	if (!isAdminContext) {
		throw error(403, 'Forbidden');
	}

	// Filter users by workspace membership
	let query;
	if (activeWorkspaceId === 'personal') {
		// Global admin view all users
		query = db
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
		// Org admin view only org members
		query = db
			.select({
				id: schema.user.id,
				username: schema.user.username,
				email: schema.user.email,
				fullName: schema.user.fullName,
				role: schema.organizationMember.role, // Use role in org
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

	const users = await query;

	return {
		users
	};
};
