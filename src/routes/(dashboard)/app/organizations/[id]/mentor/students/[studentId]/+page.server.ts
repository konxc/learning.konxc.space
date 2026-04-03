import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, isNotNull, count, inArray, sql } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { createNotification } from '$lib/server/notifications';
import { awardXP, checkAndAwardBadges } from '$lib/server/gamification';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) throw error(401, 'Unauthorized');

	const { membership, organization } = await event.parent();
	if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
		throw error(403, 'Forbidden');
	}

	const { studentId } = event.params;
	const orgId = organization.id;

	// Verify the student exists and belongs to this organization
	const studentResult = await db
		.select({
			id: schema.user.id,
			username: schema.user.username,
			fullName: schema.user.fullName,
			email: schema.user.email,
			createdAt: schema.user.createdAt
		})
		.from(schema.user)
		.innerJoin(schema.organizationMember, eq(schema.user.id, schema.organizationMember.userId))
		.where(and(eq(schema.user.id, studentId), eq(schema.organizationMember.orgId, orgId)))
		.limit(1);

	if (!studentResult[0]) {
		throw error(404, 'Student not found in this organization');
	}

	const student = studentResult[0];

	// Get all enrollments for this student within this organization
	const enrollments = await db
		.select({
			id: schema.enrollment.id,
			status: schema.enrollment.status,
			track: schema.enrollment.track,
			enrolledAt: schema.enrollment.enrolledAt,
			completedAt: schema.enrollment.completedAt,
			course: {
				id: schema.course.id,
				title: schema.course.title,
				thumbnailUrl: schema.course.thumbnailUrl,
				duration: schema.course.duration
			}
		})
		.from(schema.enrollment)
		.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.where(and(eq(schema.enrollment.userId, studentId), eq(schema.course.orgId, orgId)));

	// Build per-course progress details
	const courseProgress = await Promise.all(
		enrollments.map(async (enrollment) => {
			// Total lessons in this course (join with course/org for safety)
			const totalResult = await db
				.select({ total: count(schema.lesson.id) })
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.innerJoin(schema.course, eq(schema.module.courseId, schema.course.id))
				.where(and(eq(schema.module.courseId, enrollment.course.id), eq(schema.course.orgId, orgId)));

			// Completed lessons by this student
			const completedResult = await db
				.select({ completed: count(schema.lessonProgress.id) })
				.from(schema.lessonProgress)
				.where(
					and(
						eq(schema.lessonProgress.userId, studentId),
						eq(schema.lessonProgress.courseId, enrollment.course.id),
						isNotNull(schema.lessonProgress.completedAt)
					)
				);

			// Get individual lesson progress details
			const lessonDetails = await db
				.select({
					lesson: {
						id: schema.lesson.id,
						title: schema.lesson.title,
						order: schema.lesson.order
					},
					module: {
						id: schema.module.id,
						title: schema.module.title,
						order: schema.module.order
					},
					completedAt: schema.lessonProgress.completedAt,
					lastPositionMs: schema.lessonProgress.lastPositionMs
				})
				.from(schema.lesson)
				.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
				.leftJoin(
					schema.lessonProgress,
					and(
						eq(schema.lessonProgress.lessonId, schema.lesson.id),
						eq(schema.lessonProgress.userId, studentId)
					)
				)
				.where(eq(schema.module.courseId, enrollment.course.id))
				.orderBy(schema.module.order, schema.lesson.order);

			const totalLessons = Number(totalResult[0]?.total ?? 0);
			const completedLessons = Number(completedResult[0]?.completed ?? 0);
			const progressPercent =
				totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

			return {
				enrollment,
				totalLessons,
				completedLessons,
				progressPercent,
				lessonDetails
			};
		})
	);

	// Get submissions for this student in this organization
	const submissions = await db
		.select({
			id: schema.submission.id,
			type: schema.submission.type,
			payload: schema.submission.payload,
			metadata: schema.submission.metadata,
			score: schema.submission.score,
			createdAt: schema.submission.createdAt,
			lesson: {
				id: schema.lesson.id,
				title: schema.lesson.title
			},
			course: {
				id: schema.course.id,
				title: schema.course.title
			}
		})
		.from(schema.submission)
		.innerJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
		.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
		.where(and(eq(schema.submission.userId, studentId), eq(schema.course.orgId, orgId)))
		.orderBy(schema.submission.createdAt);

	// Get grades for submissions
	const subIds = submissions.map((s) => s.id);
	let grades: Record<string, typeof schema.submissionGrade.$inferSelect> = {};
	if (subIds.length > 0) {
		const gradesResult = await db
			.select()
			.from(schema.submissionGrade)
			.where(inArray(schema.submissionGrade.submissionId, subIds));
		for (const g of gradesResult) {
			grades[g.submissionId] = g;
		}
	}

	return {
		student,
		courseProgress,
		submissions: submissions.map((s) => ({
			...s,
			grade: grades[s.id] || null
		}))
	};
};

export const actions: Actions = {
	grade: async (event) => {
		const { locals, request, params } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const { id: orgId, studentId } = params;

		// Verify membership via event.parent() for safety if possible, or manual check with orgId
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
			throw error(403, 'Forbidden');
		}

		const formData = await request.formData();
		const submissionId = formData.get('submissionId') as string;
		const score = parseInt(formData.get('score') as string);
		const feedback = (formData.get('feedback') as string) || '';

		if (!submissionId || isNaN(score) || score < 0 || score > 100) {
			return fail(400, { error: 'Score must be between 0-100' });
		}

		// Verify submission belongs to the student AND it's in a course in this organization
		const submission = await db
			.select({
				id: schema.submission.id,
				userId: schema.submission.userId,
				courseId: schema.submission.courseId,
				lessonId: schema.submission.lessonId
			})
			.from(schema.submission)
			.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
			.where(
				and(
					eq(schema.submission.id, submissionId),
					eq(schema.submission.userId, studentId),
					eq(schema.course.orgId, orgId)
				)
			)
			.limit(1);

		if (!submission[0]) {
			return fail(403, { error: 'Submission not found in this organization context' });
		}

		// Check if grade already exists
		const existingGrade = await db
			.select()
			.from(schema.submissionGrade)
			.where(eq(schema.submissionGrade.submissionId, submissionId))
			.limit(1);

		if (existingGrade[0]) {
			await db
				.update(schema.submissionGrade)
				.set({
					score,
					feedback: feedback || null,
					gradedAt: new Date(),
					gradedBy: user.id
				})
				.where(eq(schema.submissionGrade.id, existingGrade[0].id));
		} else {
			await db.insert(schema.submissionGrade).values({
				id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10))),
				submissionId,
				gradedBy: user.id,
				score,
				feedback: feedback || null,
				gradedAt: new Date()
			});
		}

		// Award XP
		if (score >= 70) {
			await awardXP(studentId, 50, `Submission dinilai`);
			await checkAndAwardBadges(studentId, 'submission');
		}

		// Notify student - Fixed payload to match Interface
		await createNotification({
			userId: studentId,
			type: 'grade',
			title: 'Submission Dinilai 📝',
			message: `Submission kamu telah dinilai dengan skor ${score}/100.`,
			link: `/app/learning?tab=checkpoints`
		});

		return { success: true };
	}
};
