import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { User } from './db/schema';

export async function requireAuth(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(303, '/auth/signin');
    }
    return event.locals.user;
}

export async function requireRole(event: RequestEvent, role: 'admin' | 'mentor' | 'user') {
    const user = await requireAuth(event);

    if (role === 'admin' && user.role !== 'admin') {
        throw redirect(303, '/dashboard');
    }

    if (role === 'mentor' && !['mentor', 'admin'].includes(user.role)) {
        throw redirect(303, '/dashboard');
    }

    return user;
}

export async function requireAdmin(event: RequestEvent) {
    return requireRole(event, 'admin');
}

export async function requireMentor(event: RequestEvent) {
    return requireRole(event, 'mentor');
}
