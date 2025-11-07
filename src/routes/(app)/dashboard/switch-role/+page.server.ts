import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/middleware';
import { logAudit } from '$lib/server/audit';

const ACTIVE_ROLE_COOKIE = 'active-role';

export const load: PageServerLoad = async (event) => {
	// Only admin can switch roles
	const user = await requireAdmin(event);

	const requestedRole = event.url.searchParams.get('role');
	const validRoles = ['admin', 'mentor', 'siswa', 'user'];

	// Get current active role before changing it
	const currentActiveRole = event.cookies.get(ACTIVE_ROLE_COOKIE) || user.role || 'admin';

	if (requestedRole && validRoles.includes(requestedRole)) {
		// Only set cookie if different from current
		if (currentActiveRole !== requestedRole) {
			// Set active role cookie for emulation
			event.cookies.set(ACTIVE_ROLE_COOKIE, requestedRole, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Log audit event for role switching
			await logAudit(event, 'switch_role', {
				userId: user.id,
				from: currentActiveRole,
				to: requestedRole
			});
		}
	} else if (requestedRole === null || requestedRole === '') {
		// Clear active role cookie (reset to base role)
		if (currentActiveRole !== user.role) {
			event.cookies.delete(ACTIVE_ROLE_COOKIE, { path: '/' });
			await logAudit(event, 'switch_role', {
				userId: user.id,
				from: currentActiveRole,
				to: user.role || 'admin'
			});
		}
	}

	// Redirect back to referer or dashboard
	const referer = event.request.headers.get('referer') || '/dashboard';
	throw redirect(303, referer);
};

