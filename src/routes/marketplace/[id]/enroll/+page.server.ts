import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async (event) => {
        const courseId = event.params.id;
        const redirectUrl = `/marketplace/${courseId}/enroll`;

        // Check if user is logged in
        if (!event.locals.user) {
            // Redirect to login with return URL
            throw redirect(302, `/auth/login?redirect=${redirectUrl}`);
        }

        // If logged in, redirect to dashboard enroll (which handles the actual enrollment)
        throw redirect(302, `/dashboard/courses/${courseId}/enroll`);
    }
} satisfies Actions;
