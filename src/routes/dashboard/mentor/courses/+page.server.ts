import { requireMentor } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
    const mentor = await requireMentor(event);

    // Get courses assigned to this mentor
    const courses = await db
        .select({
            id: schema.course.id,
            title: schema.course.title,
            description: schema.course.description,
            thumbnailUrl: schema.course.thumbnailUrl,
            price: schema.course.price,
            duration: schema.course.duration,
            status: schema.course.status,
            createdAt: schema.course.createdAt
        })
        .from(schema.course)
        .where(eq(schema.course.mentorId, mentor.id));

    return {
        courses
    };
};
