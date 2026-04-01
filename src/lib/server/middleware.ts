import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { User } from './db/schema';

export async function requireAuth(eventOrLocals: RequestEvent | { user: any }) {
	const user = 'locals' in eventOrLocals ? eventOrLocals.locals.user : eventOrLocals.user;

	if (!user) {
		throw redirect(303, '/auth/signin');
	}
	return user as User;
}

export async function requireRole(
	eventOrLocals: RequestEvent | { user: any },
	role: 'admin' | 'mentor' | 'user'
) {
	const user = await requireAuth(eventOrLocals);

	if (role === 'admin' && user.role !== 'admin') {
		throw redirect(303, '/app');
	}

	if (role === 'mentor' && !['mentor', 'admin'].includes(user.role)) {
		throw redirect(303, '/app');
	}

	return user;
}

/** Require user to have one of the specified roles */
export async function requireAnyRole(eventOrLocals: RequestEvent | { user: any }, roles: string[]) {
	const user = await requireAuth(eventOrLocals);

	if (!roles.includes(user.role)) {
		throw redirect(303, '/app');
	}

	return user;
}

export async function requireAdmin(eventOrLocals: RequestEvent | { user: any }) {
	return requireRole(eventOrLocals, 'admin');
}

export async function requireMentor(eventOrLocals: RequestEvent | { user: any }) {
	return requireRole(eventOrLocals, 'mentor');
}
