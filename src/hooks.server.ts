import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

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

	try {
		const { session, user } = await auth.validateSessionToken(sessionToken);

		if (session) {
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			auth.deleteSessionTokenCookie(event);
		}

		event.locals.user = user;
		event.locals.session = session;
		return resolve(event);
	} catch (e) {
		// Fallback bila DB belum siap/migrasi belum dijalankan
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
};

const handleTheme: Handle = async ({ event, resolve }) => {
	// Get theme from cookie (set by client) - for SSR hydration
	const theme = event.cookies.get('nk-theme');

	// If we have explicit theme from cookie, inject class directly in HTML for instant application
	// This is faster than waiting for JavaScript to run
	if (theme === 'dark' || theme === 'light') {
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				if (html.includes('class=""')) {
					// Direct injection - no JavaScript needed, zero FOUC
					return html.replace('class=""', theme === 'dark' ? 'class="dark"' : 'class=""');
				}
				return html;
			}
		});
	}

	// For 'system' or no theme, let inline script in app.html handle it
	// (The inline script runs before body renders)
	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth, handleTheme);
