import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { actionFailure } from '$lib/server/actions';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { createNotification } from '$lib/server/notifications';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) throw error(401, 'Unauthorized');

	const { membership, organization } = await event.parent();
	if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
		throw error(403, 'Forbidden');
	}

	const orgId = organization.id;

	// In grading view, we show ALL submissions for courses in this organization
	const courseId = event.url.searchParams.get('courseId');

	const submissions = await db
		.select({
			id: schema.submission.id,
			userId: schema.submission.userId,
			courseId: schema.submission.courseId,
			lessonId: schema.submission.lessonId,
			type: schema.submission.type,
			payload: schema.submission.payload,
			score: schema.submission.score,
			createdAt: schema.submission.createdAt,
			studentName: schema.user.fullName,
			studentUsername: schema.user.username,
			courseTitle: schema.course.title,
			lessonTitle: schema.lesson.title,
			gradeId: schema.submissionGrade.id,
			gradeScore: schema.submissionGrade.score,
			gradeFeedback: schema.submissionGrade.feedback
		})
		.from(schema.submission)
		.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
		.innerJoin(schema.user, eq(schema.submission.userId, schema.user.id))
		.leftJoin(schema.lesson, eq(schema.submission.lessonId, schema.lesson.id))
		.leftJoin(schema.submissionGrade, eq(schema.submission.id, schema.submissionGrade.submissionId))
		.where(
			and(
				eq(schema.course.orgId, orgId),
				courseId ? eq(schema.submission.courseId, courseId) : undefined
			)
		)
		.orderBy(desc(schema.submission.createdAt));

	return { submissions, organization, membership };
};

export const actions: Actions = {
	bulkGrade: async (event) => {
		const { request, params, locals } = event;
		const user = locals.user;
		if (!user) throw error(401, 'Unauthorized');

		const { id: orgId } = params;

		// Verify membership
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
			throw error(403, 'Forbidden');
		}

		const formData = await request.formData();
		const gradesJson = formData.get('grades') as string;

		if (!gradesJson) return actionFailure(400, 'Data nilai tidak ditemukan');

		let grades: { submissionId: string; score: number; feedback?: string }[] = [];
		try {
			grades = JSON.parse(gradesJson);
		} catch (e) {
			return actionFailure(400, 'Format data nilai tidak valid');
		}

		for (const gradeItem of grades) {
			// CRITICAL: Verify each submissionId belongs to this organization
			const subResult = await db
				.select({ userId: schema.submission.userId })
				.from(schema.submission)
				.innerJoin(schema.course, eq(schema.submission.courseId, schema.course.id))
				.where(and(eq(schema.submission.id, gradeItem.submissionId), eq(schema.course.orgId, orgId)))
				.limit(1);

			if (subResult.length === 0) continue; // Skip unauthorized submissions

			const studentId = subResult[0].userId;

			// Upsert grade
			const existing = await db
				.select()
				.from(schema.submissionGrade)
				.where(eq(schema.submissionGrade.submissionId, gradeItem.submissionId))
				.limit(1);

			if (existing.length > 0) {
				await db
					.update(schema.submissionGrade)
					.set({
						score: gradeItem.score,
						feedback: gradeItem.feedback || null,
						gradedAt: new Date(),
						gradedBy: user.id
					})
					.where(eq(schema.submissionGrade.id, existing[0].id));
			} else {
				await db.insert(schema.submissionGrade).values({
					id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10))),
					submissionId: gradeItem.submissionId,
					gradedBy: user.id,
					score: gradeItem.score,
					feedback: gradeItem.feedback || null,
					gradedAt: new Date()
				});
			}

			// Notify student
			await createNotification({
				userId: studentId,
				type: 'grade',
				title: 'Submission Dinilai 📝',
				message: `Submission kamu telah dinilai (Bulk Update) dengan skor ${gradeItem.score}/100.`,
				link: '/app/learning?tab=checkpoints'
			});
		}

		return { success: true };
	}
};
