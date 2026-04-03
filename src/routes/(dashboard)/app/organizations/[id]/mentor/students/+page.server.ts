import { requireAuth } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) throw error(401, 'Unauthorized');

	const { membership } = await event.parent();
	if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
		throw error(403, 'Forbidden: Mentor access required for this organization');
	}

	const orgId = membership.orgId;

	// Get the filters if provided
	const courseId = event.url.searchParams.get('course');
	const cohortId = event.url.searchParams.get('cohort');
	const track = event.url.searchParams.get('track');

	// Get courses assigned to mentor within this organization
	const mentorCourses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title
		})
		.from(schema.course)
		.where(and(eq(schema.course.orgId, orgId), eq(schema.course.mentorId, user.id)));

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

	// Get cohorts for mentor's courses within this organization
	const cohorts = await db
		.select({
			id: schema.cohort.id,
			name: schema.cohort.name,
			courseId: schema.cohort.courseId
		})
		.from(schema.cohort)
		.innerJoin(schema.course, eq(schema.cohort.courseId, schema.course.id))
		.where(
			and(
				eq(schema.course.orgId, orgId),
				courseId ? eq(schema.cohort.courseId, courseId) : undefined
			)
		);

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

	// Apply filters - all must include orgId and mentor check
	const conditions = [eq(schema.course.orgId, orgId), eq(schema.course.mentorId, user.id)];

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
