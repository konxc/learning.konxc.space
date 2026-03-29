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

/**
 * Parse onboarding metadata from JSON string
 * Returns structured onboarding state for each role
 */
function parseOnboardingMetadata(metadata: string | null): {
	student?: { completed: boolean; track?: string };
	mentor?: { completed: boolean; profileComplete?: boolean };
	facilitator?: { completed: boolean; orgId?: string };
} {
	if (!metadata) return {};
	try {
		return JSON.parse(metadata);
	} catch {
		return {};
	}
}

/**
 * Check if user has completed onboarding for a specific role context
 */
function hasRoleOnboardingCompleted(
	userRole: string,
	onboardingCompleted: boolean,
	metadata: string | null
): boolean {
	// Legacy single flag check
	if (onboardingCompleted) return true;

	// Check metadata-based multi-role onboarding
	const meta = parseOnboardingMetadata(metadata);

	switch (userRole) {
		case 'user':
			return meta.student?.completed ?? false;
		case 'mentor':
			return meta.mentor?.completed ?? false;
		case 'facilitator':
			return meta.facilitator?.completed ?? false;
		default:
			return false;
	}
}

const handleOnboarding: Handle = async ({ event, resolve }) => {
	// Skip onboarding check for public routes
	if (
		event.url.pathname.startsWith('/auth') ||
		event.url.pathname.startsWith('/prototype') ||
		event.url.pathname.startsWith('/onboarding') ||
		event.url.pathname.startsWith('/marketplace') ||
		event.url.pathname.startsWith('/public') ||
		event.url.pathname === '/' ||
		event.url.pathname === '/health'
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

	// Whitelist Platform Governance roles (admin/bd can access without onboarding)
	if (user.role === 'admin' || user.role === 'bd') {
		return resolve(event);
	}

	// Legacy check for old users - sync enrollment status
	if (user.role === 'user' && !user.onboardingCompleted) {
		const enrollment = await db.query.enrollment.findFirst({
			where: eq(schema.enrollment.userId, user.id)
		});

		if (enrollment) {
			// Legacy student has enrollments - mark as completed
			await db
				.update(schema.user)
				.set({
					onboardingCompleted: true,
					onboardingMetadata: JSON.stringify({
						student: { completed: true, track: enrollment.track || null }
					})
				})
				.where(eq(schema.user.id, user.id));

			// Update locals for this request
			if (event.locals.user) {
				event.locals.user.onboardingCompleted = true;
			}
			return resolve(event);
		}
	}

	// Multi-role onboarding check
	const hasCompleted = hasRoleOnboardingCompleted(
		user.role,
		user.onboardingCompleted ?? false,
		user.onboardingMetadata
	);

	if (!hasCompleted) {
		// Redirect to onboarding page
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
