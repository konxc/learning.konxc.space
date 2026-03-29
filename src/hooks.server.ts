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
	if (event.url.pathname.startsWith('/app')) {
		return resolve(event);
	}

	// Pathfinder: Role-Aware Onboarding Protocol
	const user = event.locals.user;
	if (!user) return resolve(event);

	// Whitelist Platform Governance roles
	if (user.role === 'admin' || user.role === 'bd') {
		return resolve(event);
	}

	// Specialized Check for Onboarding Completion
	if (!user.onboardingCompleted) {
		// Legacy Handshake for Students (Role: 'user')
		// If they have enrollments, they have completed onboarding in the past
		if (user.role === 'user') {
			const enrollment = await db.query.enrollment.findFirst({
				where: eq(schema.enrollment.userId, user.id)
			});

			if (enrollment) {
				// Persistent synchronization for legacy students
				await db
					.update(schema.user)
					.set({ onboardingCompleted: true })
					.where(eq(schema.user.id, user.id));
				return resolve(event);
			}
		}

		// Specialized Onboarding Pathfinder Redirection
		throw redirect(303, '/onboarding');
	}

	return resolve(event);
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

export const handle: Handle = sequence(handleParaglide, handleAuth, handleOnboarding, handleTheme);
