import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import { eq, and, isNotNull, count, desc, asc, like, or } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { awardPoints, updateStreak, checkAndAwardBadges } from '$lib/server/gamification';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const tab = event.url.searchParams.get('tab') || 'courses';

	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';

	const baseQueryOptions = { userId: user.id, activeWorkspaceId };

	switch (tab) {
		case 'courses':
			return loadCourses(event, baseQueryOptions);
		case 'progress':
			return loadProgress(event, baseQueryOptions);
		case 'checkpoints':
			return loadCheckpoints(event, baseQueryOptions);
		case 'certificates':
			return loadCertificates(event, baseQueryOptions);
		default:
			return loadCourses(event, baseQueryOptions);
	}
};

async function loadCourses(
	event: Parameters<PageServerLoad>[0],
	{ userId, activeWorkspaceId }: { userId: string; activeWorkspaceId: string }
) {
	const q = event.url.searchParams.get('q');

	let whereClause = eq(schema.enrollment.userId, userId);
	if (q) {
		whereClause = and(whereClause, like(schema.course.title, `%${q}%`)) as any;
	}

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
		.where(whereClause);

	if (activeWorkspaceId !== 'personal') {
		let workspaceWhere = and(
			eq(schema.enrollment.userId, userId),
			eq(schema.course.orgId, activeWorkspaceId)
		);
		if (q) {
			workspaceWhere = and(workspaceWhere, like(schema.course.title, `%${q}%`)) as any;
		}

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
			.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
			.where(workspaceWhere);
	}

	const enrollments = await query;

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

	const paymentProofs = await db
		.select({
			courseId: schema.paymentProof.courseId,
			status: schema.paymentProof.status
		})
		.from(schema.paymentProof)
		.where(eq(schema.paymentProof.userId, userId));

	const proofMap = new Map(paymentProofs.map((p) => [p.courseId, p.status]));

	const courseIds = enrollments.map((e) => e.course.id);
	const progressMap = new Map<string, { totalLessons: number; completedLessons: number }>();

	if (courseIds.length > 0) {
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
						eq(schema.lessonProgress.userId, userId),
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

	return { tab: 'courses', enrollments: enrichedEnrollments };
}

async function loadProgress(
	event: Parameters<PageServerLoad>[0],
	{ userId }: { userId: string; activeWorkspaceId: string }
) {
	const q = event.url.searchParams.get('q');

	let whereClause = eq(schema.enrollment.userId, userId);
	if (q) {
		whereClause = and(whereClause, like(schema.course.title, `%${q}%`)) as any;
	}

	const enrollments = await db
		.select({
			id: schema.enrollment.id,
			status: schema.enrollment.status,
			track: schema.enrollment.track,
			enrolledAt: schema.enrollment.enrolledAt,
			completedAt: schema.enrollment.completedAt,
			cohortId: schema.enrollment.cohortId,
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
		.where(whereClause);

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

	const coursesWithProgress = await Promise.all(
		enrollments.map(async (enrollment) => {
			const totalLessons = await db
				.select({ count: count(schema.lesson.id) })
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.where(eq(schema.module.courseId, enrollment.course.id));

			const completedLessons = await db
				.select({ count: count(schema.lessonProgress.id) })
				.from(schema.lessonProgress)
				.where(
					and(
						eq(schema.lessonProgress.userId, userId),
						eq(schema.lessonProgress.courseId, enrollment.course.id),
						isNotNull(schema.lessonProgress.completedAt)
					)
				);

			const total = totalLessons[0]?.count || 0;
			const completed = completedLessons[0]?.count || 0;
			const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

			return {
				...enrollment,
				cohortName: enrollment.cohortId ? (cohortMap.get(enrollment.cohortId) ?? null) : null,
				totalLessons: total,
				completedLessons: completed,
				progressPercent: percent
			};
		})
	);

	const submissions = await db
		.select({
			id: schema.submission.id,
			type: schema.submission.type,
			score: schema.submission.score,
			createdAt: schema.submission.createdAt,
			lessonTitle: schema.lesson.title,
			courseTitle: schema.course.title,
			gradedAt: schema.submissionGrade.gradedAt,
			feedback: schema.submissionGrade.feedback
		})
		.from(schema.submission)
		.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
		.leftJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
		.leftJoin(schema.submissionGrade, eq(schema.submission.id, schema.submissionGrade.submissionId))
		.where(eq(schema.submission.userId, userId))
		.orderBy(desc(schema.submission.createdAt))
		.limit(10);

	const totalCourses = coursesWithProgress.length;
	const completedCourses = coursesWithProgress.filter((e) => e.status === 'completed').length;
	const inProgressCourses = coursesWithProgress.filter(
		(e) => e.status === 'active' && e.progressPercent > 0
	).length;
	const totalLessonsCompleted = coursesWithProgress.reduce((sum, c) => sum + c.completedLessons, 0);

	const gradedSubmissions = submissions.filter((s) => s.score !== null);
	const avgScore =
		gradedSubmissions.length > 0
			? Math.round(
					gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length
				)
			: 0;
	const passedQuizzes = gradedSubmissions.filter((s) => (s.score || 0) >= 70).length;

	const certificates = await db
		.select({
			id: schema.certificate.id,
			serial: schema.certificate.serial,
			issuedAt: schema.certificate.issuedAt,
			courseTitle: schema.course.title
		})
		.from(schema.certificate)
		.innerJoin(schema.course, eq(schema.certificate.courseId, schema.course.id))
		.where(eq(schema.certificate.userId, userId))
		.orderBy(desc(schema.certificate.issuedAt));

	const userXP = await db
		.select()
		.from(schema.userXP)
		.where(eq(schema.userXP.userId, userId))
		.limit(1);

	return {
		tab: 'progress',
		enrollments: coursesWithProgress,
		submissions,
		certificates,
		stats: {
			totalCourses,
			completedCourses,
			inProgressCourses,
			totalLessonsCompleted,
			avgScore,
			passedQuizzes,
			totalSubmissions: submissions.length
		},
		xp: userXP[0] || null
	};
}

async function loadCheckpoints(
	event: Parameters<PageServerLoad>[0],
	{ userId }: { userId: string; activeWorkspaceId: string }
) {
	const q = event.url.searchParams.get('q');

	let enrollmentWhere = and(
		eq(schema.enrollment.userId, userId),
		eq(schema.enrollment.status, 'active')
	);
	if (q) {
		enrollmentWhere = and(
			enrollmentWhere,
			or(like(schema.course.title, `%${q}%`), like(schema.cohort.name, `%${q}%`))
		) as any;
	}

	const enrollments = await db
		.select({
			id: schema.enrollment.id,
			courseId: schema.enrollment.courseId,
			cohortId: schema.enrollment.cohortId,
			track: schema.enrollment.track,
			courseTitle: schema.course.title,
			cohortName: schema.cohort.name
		})
		.from(schema.enrollment)
		.leftJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.leftJoin(schema.cohort, eq(schema.enrollment.cohortId, schema.cohort.id))
		.where(enrollmentWhere);

	const checkpointsWithSubmissions = [];

	for (const enrollment of enrollments) {
		if (!enrollment.cohortId) continue;

		const checkpoints = await db
			.select()
			.from(schema.checkpoint)
			.where(
				and(
					eq(schema.checkpoint.cohortId, enrollment.cohortId),
					eq(schema.checkpoint.isActive, true)
				)
			)
			.orderBy(asc(schema.checkpoint.weekNumber));

		for (const checkpoint of checkpoints) {
			const submission = await db
				.select()
				.from(schema.checkpointSubmission)
				.where(
					and(
						eq(schema.checkpointSubmission.checkpointId, checkpoint.id),
						eq(schema.checkpointSubmission.userId, userId)
					)
				)
				.limit(1);

			// Submission history: all attempts for this checkpoint
			const submissionHistory = await db
				.select({
					id: schema.submission.id,
					score: schema.submission.score,
					createdAt: schema.submission.createdAt,
					feedback: schema.submissionGrade.feedback,
					gradedAt: schema.submissionGrade.gradedAt,
					gradeScore: schema.submissionGrade.score
				})
				.from(schema.submission)
				.leftJoin(
					schema.submissionGrade,
					eq(schema.submission.id, schema.submissionGrade.submissionId)
				)
				.where(and(eq(schema.submission.userId, userId), eq(schema.submission.type, 'assignment')))
				.orderBy(desc(schema.submission.createdAt))
				.limit(5);

			checkpointsWithSubmissions.push({
				...checkpoint,
				courseId: enrollment.courseId,
				courseTitle: enrollment.courseTitle,
				cohortName: enrollment.cohortName,
				track: enrollment.track,
				submission: submission[0] || null,
				submissionHistory
			});
		}
	}

	checkpointsWithSubmissions.sort((a, b) => {
		const titleA = a.courseTitle || '';
		const titleB = b.courseTitle || '';
		if (titleA !== titleB) return titleA.localeCompare(titleB);
		return a.weekNumber - b.weekNumber;
	});

	const stats = {
		total: checkpointsWithSubmissions.length,
		completed: checkpointsWithSubmissions.filter((c) => c.submission?.completed).length,
		pending: checkpointsWithSubmissions.filter((c) => !c.submission?.completed).length
	};

	return { tab: 'checkpoints', checkpoints: checkpointsWithSubmissions, stats };
}

async function loadCertificates(
	event: Parameters<PageServerLoad>[0],
	{ userId }: { userId: string; activeWorkspaceId: string }
) {
	const q = event.url.searchParams.get('q');

	let whereClause = eq(schema.certificate.userId, userId);
	if (q) {
		whereClause = and(whereClause, like(schema.course.title, `%${q}%`)) as any;
	}

	const certificates = await db
		.select({
			id: schema.certificate.id,
			serial: schema.certificate.serial,
			issuedAt: schema.certificate.issuedAt,
			courseTitle: schema.course.title,
			courseId: schema.course.id
		})
		.from(schema.certificate)
		.innerJoin(schema.course, eq(schema.certificate.courseId, schema.course.id))
		.where(whereClause)
		.orderBy(desc(schema.certificate.issuedAt));

	return { tab: 'certificates', certificates };
}

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		const user = await requireAuth(locals);

		const formData = await request.formData();
		const checkpointId = formData.get('checkpointId') as string;
		const notes = formData.get('notes') as string;

		if (!checkpointId) {
			return { success: false, error: 'Checkpoint ID required' };
		}

		const existing = await db
			.select()
			.from(schema.checkpointSubmission)
			.where(
				and(
					eq(schema.checkpointSubmission.checkpointId, checkpointId),
					eq(schema.checkpointSubmission.userId, user.id)
				)
			)
			.limit(1);

		if (existing.length > 0) {
			await db
				.update(schema.checkpointSubmission)
				.set({
					notes,
					completed: true,
					submittedAt: new Date()
				})
				.where(eq(schema.checkpointSubmission.id, existing[0].id));
		} else {
			const id = crypto.randomUUID();
			await db.insert(schema.checkpointSubmission).values({
				id,
				checkpointId,
				userId: user.id,
				notes,
				completed: true,
				submittedAt: new Date()
			});
		}

		// Award gamification points
		try {
			await awardPoints(user.id, 'checkpoint_submit');
			await updateStreak(user.id);
			await checkAndAwardBadges(user.id);
		} catch {
			// Gamification errors should not block submission
		}

		return { success: true };
	}
};
