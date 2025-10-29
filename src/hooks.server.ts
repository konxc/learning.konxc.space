import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

const handleOnboarding: Handle = async ({ event, resolve }) => {
	// Skip onboarding check for public routes
	if (
		event.url.pathname.startsWith('/auth') ||
		event.url.pathname.startsWith('/prototype') ||
		event.url.pathname.startsWith('/onboarding') ||
		event.url.pathname.startsWith('/marketplace') ||
		event.url.pathname === '/'
	) {
		return resolve(event);
	}

	// Skip if not logged in
	if (!event.locals.user) {
		return resolve(event);
	}

	// Skip dashboard routes to prevent infinite redirect
	if (event.url.pathname.startsWith('/dashboard')) {
		return resolve(event);
	}

	// Check if user has any enrollments
	const enrollments = await db.query.enrollment.findFirst({
		where: eq(schema.enrollment.userId, event.locals.user.id)
	});

	// Redirect to onboarding if user has no enrollments
	if (!enrollments) {
		throw redirect(303, '/onboarding');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth, handleOnboarding);
