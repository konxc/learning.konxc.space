import { hashPassword } from '$lib/server/password';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { actionFailure } from '$lib/server/actions';

export const load: PageServerLoad = async (event) => {
    if (event.locals.user) {
        throw redirect(302, '/dashboard');
    }
    return {};
};

function generateUserId() {
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

function validateEmail(email: unknown): email is string {
    if (typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const fullName = formData.get('fullName');

        // Validation
        if (!validateUsername(username)) {
            return actionFailure(
                400,
                'Username tidak valid (min 3, max 31 karakter, huruf kecil, angka, underscore atau tanda hubung)'
            );
        }

        if (!validateEmail(email)) {
            return actionFailure(400, 'Email tidak valid');
        }

        if (!validatePassword(password)) {
            return actionFailure(400, 'Password minimal 6 karakter');
        }

        if (password !== confirmPassword) {
            return actionFailure(400, 'Password tidak cocok');
        }

        // Check if username already exists
        const existingUser = await db
            .select()
            .from(table.user)
            .where(eq(table.user.username, username))
            .limit(1);

        if (existingUser.length > 0) {
            return actionFailure(400, 'Username sudah digunakan');
        }

        // Check if email already exists
        if (email) {
            const existingEmail = await db
                .select()
                .from(table.user)
                .where(eq(table.user.email, email))
                .limit(1);

            if (existingEmail.length > 0) {
                return actionFailure(400, 'Email sudah terdaftar');
            }
        }

        // Create user
        const userId = generateUserId();
        const passwordHash = await hashPassword(password);

        try {
            await db.insert(table.user).values({
                id: userId,
                username,
                email,
                passwordHash,
                fullName: fullName && typeof fullName === 'string' ? fullName : null,
                role: 'user'
            });

            const sessionToken = auth.generateSessionToken();
            const session = await auth.createSession(sessionToken, userId);
            auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

            // Check if there's a redirect URL (for marketplace checkout flow)
            const redirectUrl = event.url.searchParams.get('redirect');
            if (redirectUrl) {
                throw redirect(302, redirectUrl);
            }

            // Redirect to onboarding if not completed, otherwise dashboard
            throw redirect(302, '/onboarding');
        } catch (err) {
            if (err instanceof Error && err.message.includes('redirect')) {
                throw err;
            }
            return actionFailure(500, 'Terjadi kesalahan. Silakan coba lagi.');
        }
    }
};
