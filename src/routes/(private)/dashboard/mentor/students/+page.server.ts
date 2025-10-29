import { requireMentor } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
    const mentor = await requireMentor(event);

    // Get the course filter if provided
    const courseId = event.url.searchParams.get('course');

    // Get courses assigned to mentor
    const mentorCourses = await db
        .select({
            id: schema.course.id
        })
        .from(schema.course)
        .where(eq(schema.course.mentorId, mentor.id));

    const courseIds = mentorCourses.map((c) => c.id);

    if (courseIds.length === 0) {
        return {
            students: [],
            courses: [],
            selectedCourse: null
        };
    }

    // Get enrollments for mentor's courses
    let students;

    if (courseId && courseIds.includes(courseId)) {
        // Filter by specific course if provided
        students = await db
            .select({
                id: schema.enrollment.id,
                status: schema.enrollment.status,
                enrolledAt: schema.enrollment.enrolledAt,
                completedAt: schema.enrollment.completedAt,
                student: {
                    id: schema.user.id,
                    username: schema.user.username,
                    fullName: schema.user.fullName,
                    email: schema.user.email
                },
                course: {
                    id: schema.course.id,
                    title: schema.course.title
                }
            })
            .from(schema.enrollment)
            .innerJoin(schema.user, eq(schema.enrollment.userId, schema.user.id))
            .innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
            .where(and(eq(schema.course.mentorId, mentor.id), eq(schema.enrollment.courseId, courseId)));
    } else {
        // Get all enrollments for mentor's courses
        students = await db
            .select({
                id: schema.enrollment.id,
                status: schema.enrollment.status,
                enrolledAt: schema.enrollment.enrolledAt,
                completedAt: schema.enrollment.completedAt,
                student: {
                    id: schema.user.id,
                    username: schema.user.username,
                    fullName: schema.user.fullName,
                    email: schema.user.email
                },
                course: {
                    id: schema.course.id,
                    title: schema.course.title
                }
            })
            .from(schema.enrollment)
            .innerJoin(schema.user, eq(schema.enrollment.userId, schema.user.id))
            .innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
            .where(eq(schema.course.mentorId, mentor.id));
    }

    // Get all courses for dropdown
    const courses = await db
        .select({
            id: schema.course.id,
            title: schema.course.title
        })
        .from(schema.course)
        .where(eq(schema.course.mentorId, mentor.id));

    return {
        students,
        courses,
        selectedCourse: courseId || null
    };
};
