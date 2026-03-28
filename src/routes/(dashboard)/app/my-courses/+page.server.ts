import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, isNotNull, count } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return { enrollments: [] };
	}

	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';

	// Get user's enrollments with course details including track and cohort
	let query = db
		.select({
			id: schema.enrollment.id,
			status: schema.enrollment.status,
			enrolledAt: schema.enrollment.enrolledAt,
			activatedAt: schema.enrollment.activatedAt,
			completedAt: schema.enrollment.completedAt,
			track: schema.enrollment.track,
			cohortId: schema.enrollment.cohortId,
			course: {
				id: schema.course.id,
				title: schema.course.title,
				description: schema.course.description,
				thumbnailUrl: schema.course.thumbnailUrl,
				duration: schema.course.duration,
				price: schema.course.price,
				orgId: schema.course.orgId
			}
		})
		.from(schema.enrollment)
		.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.where(eq(schema.enrollment.userId, user.id));

	if (activeWorkspaceId !== 'personal') {
		query = db
			.select({
				id: schema.enrollment.id,
				status: schema.enrollment.status,
				enrolledAt: schema.enrollment.enrolledAt,
				activatedAt: schema.enrollment.activatedAt,
				completedAt: schema.enrollment.completedAt,
				track: schema.enrollment.track,
				cohortId: schema.enrollment.cohortId,
				course: {
					id: schema.course.id,
					title: schema.course.title,
					description: schema.course.description,
					thumbnailUrl: schema.course.thumbnailUrl,
					duration: schema.course.duration,
					price: schema.course.price,
					orgId: schema.course.orgId
				}
			})
			.from(schema.enrollment)
			.innerJoin(
				schema.course,
				and(
					eq(schema.enrollment.courseId, schema.course.id),
					eq(schema.course.orgId, activeWorkspaceId)
				)
			)
			.where(eq(schema.enrollment.userId, user.id));
	}

	const enrollments = await query;

	// Fetch cohort names for enrolled cohorts
	const cohortIds = [...new Set(enrollments.map((e) => e.cohortId).filter(Boolean))] as string[];
	const cohortMap = new Map<string, string>();
	for (const cohortId of cohortIds) {
		const cohort = await db
			.select({ id: schema.cohort.id, name: schema.cohort.name })
			.from(schema.cohort)
			.where(eq(schema.cohort.id, cohortId))
			.limit(1);
		if (cohort.length > 0) cohortMap.set(cohortId, cohort[0].name);
	}

	// Get payment proofs for pending enrollments
	const paymentProofs = await db
		.select({
			courseId: schema.paymentProof.courseId,
			status: schema.paymentProof.status
		})
		.from(schema.paymentProof)
		.where(eq(schema.paymentProof.userId, user.id));

	// Create a map of courseId -> payment proof status
	const proofMap = new Map(paymentProofs.map((p) => [p.courseId, p.status]));

	// Get all course IDs for enrolled courses
	const courseIds = enrollments.map((e) => e.course.id);

	// Build progress map per course
	const progressMap = new Map<string, { totalLessons: number; completedLessons: number }>();

	if (courseIds.length > 0) {
		// Get total lessons per course (via module join)
		for (const courseId of courseIds) {
			const totalResult = await db
				.select({ total: count(schema.lesson.id) })
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.where(eq(schema.module.courseId, courseId));

			const completedResult = await db
				.select({ completed: count(schema.lessonProgress.id) })
				.from(schema.lessonProgress)
				.where(
					and(
						eq(schema.lessonProgress.userId, user.id),
						eq(schema.lessonProgress.courseId, courseId),
						isNotNull(schema.lessonProgress.completedAt)
					)
				);

			progressMap.set(courseId, {
				totalLessons: totalResult[0]?.total ?? 0,
				completedLessons: completedResult[0]?.completed ?? 0
			});
		}
	}

	// Enhance enrollments with payment proof status and progress
	const enrichedEnrollments = enrollments.map((enrollment) => {
		const prog = progressMap.get(enrollment.course.id);
		const totalLessons = prog?.totalLessons ?? 0;
		const completedLessons = prog?.completedLessons ?? 0;
		const progressPercent =
			totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

		return {
			...enrollment,
			paymentProofStatus: proofMap.get(enrollment.course.id) || null,
			cohortName: enrollment.cohortId ? (cohortMap.get(enrollment.cohortId) ?? null) : null,
			progressPercent,
			completedLessons,
			totalLessons
		};
	});

	return {
		enrollments: enrichedEnrollments
	};
};
