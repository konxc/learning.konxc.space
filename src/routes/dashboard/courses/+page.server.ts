import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return { courses: [] };
    }

    // Get all published courses
    const courses = await db
        .select()
        .from(schema.course)
        .where(eq(schema.course.status, 'published'));

    return {
        courses
    };
};
