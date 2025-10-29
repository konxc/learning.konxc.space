import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const courseId = params.id;

    // Check if user is logged in
    if (!locals.user) {
        // Redirect to login with return URL
        throw redirect(
            302,
            `/auth/signin?redirect=/marketplace/${courseId}/checkout`
        );
    }

    // User is logged in, redirect to dashboard enrollment (existing flow)
    throw redirect(302, `/dashboard/courses/${courseId}/enroll`);
};

export const actions: Actions = {
    default: async ({ params, locals }) => {
        const courseId = params.id;

        // Check if user is logged in
        if (!locals.user) {
            // Redirect to login with return URL
            throw redirect(
                302,
                `/demo/lucia/login?redirect=/marketplace/${courseId}/checkout`
            );
        }

        // User is logged in, redirect to dashboard enrollment
        throw redirect(302, `/dashboard/courses/${courseId}/enroll`);
    }
};
