import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
    const courseId = params.id;

    // Get course with mentor info
    const courses = await db
        .select({
            course: {
                id: schema.course.id,
                title: schema.course.title,
                description: schema.course.description,
                thumbnailUrl: schema.course.thumbnailUrl,
                price: schema.course.price,
                duration: schema.course.duration,
                status: schema.course.status,
                createdAt: schema.course.createdAt,
                updatedAt: schema.course.updatedAt
            },
            mentor: {
                id: schema.user.id,
                username: schema.user.username,
                fullName: schema.user.fullName,
                email: schema.user.email
            }
        })
        .from(schema.course)
        .leftJoin(schema.user, eq(schema.course.mentorId, schema.user.id))
        .where(eq(schema.course.id, courseId))
        .limit(1);

    if (courses.length === 0) {
        return {
            course: null,
            mentor: null,
            isEnrolled: false
        };
    }

    const courseData = courses[0];

    // Check if user is enrolled in this specific course
    let isEnrolled = false;
    if (locals.user) {
        const enrollments = await db
            .select()
            .from(schema.enrollment)
            .where(
                and(
                    eq(schema.enrollment.userId, locals.user.id),
                    eq(schema.enrollment.courseId, courseId)
                )
            )
            .limit(1);

        isEnrolled = enrollments.length > 0;
    }

    return {
        course: courseData.course,
        mentor: courseData.mentor,
        isEnrolled
    };
};
