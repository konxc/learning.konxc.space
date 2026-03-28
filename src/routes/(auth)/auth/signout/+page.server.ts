import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import {
	invalidateSession,
	deleteSessionTokenCookie,
	sessionCookieName,
	validateSessionToken
} from '$lib/server/auth';
import { logAudit } from '$lib/server/audit';

export const actions: Actions = {
	default: async (event) => {
		const token = event.cookies.get(sessionCookieName);

		if (token) {
			const { session, user } = await validateSessionToken(token);

			if (session) {
				await invalidateSession(session.id);
				if (user) {
					await logAudit(event, 'logout', { userId: user.id });
				}
			}
		}

		deleteSessionTokenCookie(event);

		// Gunakan redirect 303 untuk POST actions
		throw redirect(303, '/auth/signin');
	}
};
