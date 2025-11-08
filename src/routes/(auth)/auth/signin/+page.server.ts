import { hashPassword, verifyPassword } from '$lib/server/password';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as schema from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { actionFailure } from '$lib/server/actions';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return actionFailure(
				400,
				'Invalid username (min 3, max 31 characters, alphanumeric only)'
			);
		}
		if (!validatePassword(password)) {
			return actionFailure(400, 'Invalid password (min 6, max 255 characters)');
		}

		const results = await db.select().from(table.user).where(eq(table.user.username, username));

		const existingUser = results.at(0);
		if (!existingUser) {
			return actionFailure(400, 'Incorrect username or password');
		}

		const validPassword = await verifyPassword(existingUser.passwordHash, password);
		if (!validPassword) {
			return actionFailure(400, 'Incorrect username or password');
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		// Check for redirect URL
		const redirectUrl = event.url.searchParams.get('redirect');
		if (redirectUrl) {
			throw redirect(302, redirectUrl);
		}

		// Skip onboarding check for admin and bd roles
		if (existingUser.role === 'admin' || existingUser.role === 'bd') {
			throw redirect(302, '/dashboard');
		}

		// Check if user has any enrollments, redirect to onboarding if not
		const enrollments = await db.query.enrollment.findFirst({
			where: eq(schema.enrollment.userId, existingUser.id)
		});

		if (!enrollments) {
			throw redirect(302, '/onboarding');
		}

		throw redirect(302, '/dashboard');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return actionFailure(400, 'Invalid username');
		}
		if (!validatePassword(password)) {
			return actionFailure(400, 'Invalid password');
		}

		const userId = generateUserId();
		const passwordHash = await hashPassword(password);

		try {
			await db.insert(table.user).values({ id: userId, username, passwordHash });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			// Check for redirect URL
			const redirectUrl = event.url.searchParams.get('redirect');
			if (redirectUrl) {
				return redirect(302, redirectUrl);
			}
		} catch {
			return actionFailure(500, 'An error has occurred');
		}
		return redirect(302, '/dashboard');
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
