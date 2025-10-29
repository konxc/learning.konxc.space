import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './dashboard/$types';
import { getNavItemsForRole } from '$lib/server/rbac';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    // Redirect to login if not authenticated
    if (!locals.user) {
        throw redirect(303, '/auth/signin?redirect=' + url.pathname);
    }

    // Get role-based navigation
    const navItems = getNavItemsForRole(locals.user.role || 'user');

    return {
        user: locals.user,
        navItems
    };
};
