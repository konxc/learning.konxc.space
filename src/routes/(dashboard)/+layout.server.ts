import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getNavItemsForRole } from '$lib/server/rbac';
import { db } from '$lib/server/db';
import { eq, desc, and } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

const ACTIVE_ROLE_COOKIE = 'active-role';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	// Redirect to login if not authenticated
	if (!locals.user) {
		throw redirect(303, '/auth/signin?redirect=' + url.pathname);
	}

	// Get active role from cookie (for admin role emulation)
	// Only admin users can have an activeRole different from their actual role
	const cookieRole = cookies.get(ACTIVE_ROLE_COOKIE);
	const baseRole = locals.user.role || 'user';
	let activeRole: string = baseRole;

	// Only allow role switching if user is admin
	if (locals.user.role === 'admin' && cookieRole) {
		// Validate that cookieRole is a valid role for emulation
		// Allowed roles: admin, mentor, siswa (mapped to 'user'), user
		if (['admin', 'mentor', 'siswa', 'user'].includes(cookieRole)) {
			// Keep cookie value as-is for display purposes
			// Map to 'user' only when calling getNavItemsForRole
			activeRole = cookieRole;
		}
	}

	// Get role-based navigation based on activeRole (emulated role)
	// Map 'siswa' to 'user' for rbac system compatibility
	const roleForNav = activeRole === 'siswa' ? 'user' : activeRole;
	const navItems = getNavItemsForRole(roleForNav);

	// Get unread notifications
	let notifications: any[] = [];
	let unreadCount = 0;
	try {
		notifications = await db
			.select()
			.from(schema.notification)
			.where(eq(schema.notification.userId, locals.user.id))
			.orderBy(desc(schema.notification.createdAt))
			.limit(10);
		
		unreadCount = notifications.filter(n => !n.read).length;
	} catch (e) {
		// Notification table might not exist yet
	}

	return {
		user: locals.user,
		navItems,
		activeRole,
		notifications,
		unreadCount
	};
};
