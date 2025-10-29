import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
    await requireAdmin(event);

    // Get all courses
    const courses = await db.select().from(schema.course);

    return {
        courses
    };
};
