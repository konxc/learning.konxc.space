import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getNavItemsForRole, type WorkspaceContext } from '$lib/server/rbac';
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
	const baseRole = user.role || 'user';
	const effectiveRole = activeWorkspaceId === 'personal' ? baseRole : activeOrg?.role || baseRole;

	// 4. Determine available roles for the switcher
	let availableRoles: string[] = ['user'];
	if (baseRole === 'admin') {
		availableRoles = ['admin', 'bd', 'mentor', 'user'];
	} else if (baseRole === 'bd') {
		availableRoles = ['bd', 'user'];
	} else if (baseRole === 'mentor') {
		availableRoles = ['mentor', 'user'];
	} else if (baseRole === 'facilitator') {
		availableRoles = ['facilitator', 'user'];
	}

	// 5. Get active role from cookie
	const cookieRole = cookies.get(ACTIVE_ROLE_COOKIE);
	let activeRole: string = availableRoles.includes(baseRole) ? baseRole : availableRoles[0];

	// Allow role switching if user has multiple roles
	if (availableRoles.length > 1 && cookieRole) {
		if (availableRoles.includes(cookieRole)) {
			activeRole = cookieRole;
		}
	}

	// Internal mapping for navigation logic
	// 'learner' should be treated as 'user' for getNavItemsForRole
	const rbacRole = activeRole === 'learner' ? 'user' : activeRole;

	// Get role-based navigation based on rbacRole and workspace context
	const workspaceContext: WorkspaceContext = {
		isPersonal: activeWorkspaceId === 'personal',
		orgId: activeOrg?.id,
		orgName: activeOrg?.name,
		orgRole: activeOrg?.role
	};
	const navItems = getNavItemsForRole(rbacRole, workspaceContext);

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

	// 6. Update navItems with badges
	const enrichedNavItems = navItems.map((item) => {
		if (item.label === 'Notifications' && unreadCount > 0) {
			return { ...item, badge: unreadCount, badgeColor: 'red' as const };
		}
		return item;
	});

	return {
		user: user,
		navItems: enrichedNavItems,
		activeRole,
		availableRoles,
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
