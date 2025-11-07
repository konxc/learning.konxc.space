import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { sessionCookieName, validateSessionToken } from '$lib/server/auth';
import { logAudit } from '$lib/server/audit';

const ACTIVE_ROLE_COOKIE = 'active-role';

export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get(sessionCookieName);
	if (!token) throw redirect(303, '/auth/signin');

	const { user } = await validateSessionToken(token);
	if (!user) throw redirect(303, '/auth/signin');

	const requestedRole = event.url.searchParams.get('role');

	// Hanya admin yang boleh mengganti activeRole
	if (user.role !== 'admin') {
		throw redirect(303, '/dashboard');
	}

  if (requestedRole && ['admin', 'mentor', 'siswa'].includes(requestedRole)) {
    event.cookies.set(ACTIVE_ROLE_COOKIE, requestedRole, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    });
    await logAudit(event, 'switch_role', { userId: user.id, to: requestedRole });
  }

	const back = event.request.headers.get('referer') ?? '/dashboard';
	throw redirect(303, back);
};
