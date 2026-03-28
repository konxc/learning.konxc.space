import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getNavItemsForRole } from '$lib/server/rbac';
import { db } from '$lib/server/db';
import { eq, desc, and } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

const ACTIVE_ROLE_COOKIE = 'active-role';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	const user = locals.user;
	// Redirect to login if not authenticated
	if (!user) {
		throw redirect(303, '/auth/signin?redirect=' + url.pathname);
	}

	// 1. Get user's organizations
	const userOrgs = await db
		.select({
			id: schema.organization.id,
			name: schema.organization.name,
			slug: schema.organization.slug,
			logoUrl: schema.organization.logoUrl,
			brandColor: schema.organization.brandColor,
			planType: schema.organization.planType,
			role: schema.organizationMember.role
		})
		.from(schema.organization)
		.innerJoin(
			schema.organizationMember,
			eq(schema.organization.id, schema.organizationMember.orgId)
		)
		.where(eq(schema.organizationMember.userId, user.id));

	// 2. Determine active workspace context
	let activeWorkspaceId = cookies.get('active-workspace') || user.lastWorkspaceId || 'personal';

	// Validate workspace membership
	let activeOrg = null;
	if (activeWorkspaceId !== 'personal') {
		activeOrg = userOrgs.find((o) => o.id === activeWorkspaceId);
		if (!activeOrg) {
			activeWorkspaceId = 'personal';
		}
	}

	// 3. Get role-based context across workspace
	// If in personal workspace, use standard role
	// If in organization, use the member's role in that organization
	const effectiveRole =
		activeWorkspaceId === 'personal' ? user.role : activeOrg?.role || user.role;

	// Get active role from cookie (for admin role emulation)
	// Only admin users can have an activeRole different from their actual role
	const cookieRole = cookies.get(ACTIVE_ROLE_COOKIE);
	const baseRole = user.role || 'user';
	let activeRole: string = baseRole;

	// Only allow role switching if user is admin
	if (user.role === 'admin' && cookieRole) {
		// Validate that cookieRole is a valid role for emulation
		// Allowed roles: admin, mentor, siswa (mapped to 'user'), user
		if (['admin', 'mentor', 'siswa', 'user'].includes(cookieRole)) {
			// Keep cookie value as-is for display purposes
			// Map to 'user' only when calling getNavItemsForRole
			activeRole = cookieRole;
		}
	}

	// Get role-based navigation based on effectiveRole
	const navItems = getNavItemsForRole(effectiveRole);

	// Get unread notifications
	let notifications: any[] = [];
	let unreadCount = 0;
	try {
		notifications = await db
			.select()
			.from(schema.notification)
			.where(eq(schema.notification.userId, user.id))
			.orderBy(desc(schema.notification.createdAt))
			.limit(10);

		unreadCount = notifications.filter((n) => !n.read).length;
	} catch (e) {
		// Notification table might not exist yet
	}

	return {
		user: user,
		navItems,
		activeRole,
		effectiveRole,
		notifications,
		unreadCount,
		workspaces: {
			organizations: userOrgs,
			activeId: activeWorkspaceId,
			activeOrg
		}
	};
};
