import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getNavItemsForRole } from '$lib/server/rbac';

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

	return {
		user: locals.user,
		navItems,
		activeRole
	};
};
