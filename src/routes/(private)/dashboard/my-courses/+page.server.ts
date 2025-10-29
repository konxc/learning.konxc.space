import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return { enrollments: [] };
    }

    // Get user's enrollments with course details
    const enrollments = await db
        .select({
            id: schema.enrollment.id,
            status: schema.enrollment.status,
            enrolledAt: schema.enrollment.enrolledAt,
            completedAt: schema.enrollment.completedAt,
            course: {
                id: schema.course.id,
                title: schema.course.title,
                description: schema.course.description,
                thumbnailUrl: schema.course.thumbnailUrl,
                duration: schema.course.duration
            }
        })
        .from(schema.enrollment)
        .innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
        .where(eq(schema.enrollment.userId, locals.user.id));

    return {
        enrollments
    };
};
