import type { LayoutServerLoad } from './$types';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { sessionCookieName, validateSessionToken } from '$lib/server/auth';

const ACTIVE_ROLE_COOKIE = 'active-role';

function getActiveRole(event: RequestEvent, fallbackRole: string | null): string | null {
	const cookieRole = event.cookies.get(ACTIVE_ROLE_COOKIE);
	if (cookieRole) return cookieRole;
	return fallbackRole;
}

export const load: LayoutServerLoad = async (event) => {
	const token = event.cookies.get(sessionCookieName);

	if (!token) {
		throw redirect(303, '/auth/signin');
	}

	const { session, user } = await validateSessionToken(token);

	if (!session || !user) {
		// Bersihkan cookie jika sesi invalid/expired
		event.cookies.delete(sessionCookieName, { path: '/' });
		throw redirect(303, '/auth/signin');
	}

	// Derive roles array dari kolom user.role (admin|mentor|siswa)
	const baseRole = user.role ?? 'siswa';
	const roles: string[] = [baseRole];

	// Admin dapat memiliki kemampuan switch peran (activeRole via cookie)
	const activeRole = getActiveRole(event, baseRole);

	// Proteksi rute admin
	if (event.url.pathname.startsWith('/admin') && activeRole !== 'admin') {
		throw redirect(303, '/dashboard');
	}

	return {
		user: {
			id: user.id,
			username: user.username,
			fullName: user.fullName,
			email: user.email,
			role: user.role
		},
		roles,
		activeRole
	};
};
