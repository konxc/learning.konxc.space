import { requireAuth } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const mentor = await requireAuth(event);

	// Get the filters if provided
	const courseId = event.url.searchParams.get('course');
	const cohortId = event.url.searchParams.get('cohort');
	const track = event.url.searchParams.get('track');

	// Get courses assigned to mentor
	const mentorCourses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title
		})
		.from(schema.course)
		.where(eq(schema.course.mentorId, mentor.id));

	const courseIds = mentorCourses.map((c) => c.id);

	if (courseIds.length === 0) {
		return {
			students: [],
			courses: [],
			cohorts: [],
			selectedCourse: null,
			selectedCohort: null,
			selectedTrack: null
		};
	}

	// Get cohorts for mentor's courses
	const cohorts = await db
		.select({
			id: schema.cohort.id,
			name: schema.cohort.name,
			courseId: schema.cohort.courseId
		})
		.from(schema.cohort)
		.where(courseId ? eq(schema.cohort.courseId, courseId) : undefined);

	// Build the query for students
	let studentsQuery = db
		.select({
			id: schema.enrollment.id,
			status: schema.enrollment.status,
			track: schema.enrollment.track,
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
			},
			cohort: {
				id: schema.cohort.id,
				name: schema.cohort.name
			}
		})
		.from(schema.enrollment)
		.innerJoin(schema.user, eq(schema.enrollment.userId, schema.user.id))
		.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.leftJoin(schema.cohort, eq(schema.enrollment.cohortId, schema.cohort.id));

	// Apply filters
	const conditions = [eq(schema.course.mentorId, mentor.id)];
	if (courseId && courseIds.includes(courseId)) {
		conditions.push(eq(schema.enrollment.courseId, courseId));
	}
	if (cohortId) {
		conditions.push(eq(schema.enrollment.cohortId, cohortId));
	}
	if (track) {
		conditions.push(eq(schema.enrollment.track, track));
	}

	const students = await studentsQuery.where(and(...conditions));

	return {
		students,
		courses: mentorCourses,
		cohorts,
		selectedCourse: courseId || null,
		selectedCohort: cohortId || null,
		selectedTrack: track || null
	};
};
