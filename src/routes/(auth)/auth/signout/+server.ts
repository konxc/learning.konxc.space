import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	invalidateSession,
	deleteSessionTokenCookie,
	sessionCookieName,
	validateSessionToken
} from '$lib/server/auth';
import { logAudit } from '$lib/server/audit';

export const POST: RequestHandler = async (event) => {
	const token = event.cookies.get(sessionCookieName);

	// Validate session before invalidating
	if (token) {
		const { session, user } = await validateSessionToken(token);

		if (session) {
			// Invalidate session in database
			await invalidateSession(session.id);

			// Log audit if user exists
			if (user) {
				await logAudit(event, 'logout', { userId: user.id });
			}
		}
	}

	// Delete session cookie
	deleteSessionTokenCookie(event);

	// Redirect to sign in page
	throw redirect(303, '/auth/signin');
};
