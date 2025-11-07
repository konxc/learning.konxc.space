import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { checkCourseCompletion } from '$lib/server/completion';

export const POST: RequestHandler = async (event) => {
	const user = await requireAuth(event);
	const courseId = event.params.courseId;

	// Verify enrollment
	const enrollment = await db
		.select()
		.from(schema.enrollment)
		.where(
			and(
				eq(schema.enrollment.userId, user.id),
				eq(schema.enrollment.courseId, courseId),
				eq(schema.enrollment.status, 'active')
			)
		)
		.limit(1);

	if (enrollment.length === 0) {
		throw error(403, 'You are not enrolled in this course');
	}

	// Check if already completed
	if (enrollment[0].completedAt) {
		// Return existing certificate
		const existingCertificate = await db
			.select()
			.from(schema.certificate)
			.where(and(eq(schema.certificate.userId, user.id), eq(schema.certificate.courseId, courseId)))
			.limit(1);

		if (existingCertificate.length > 0) {
			return json({
				success: true,
				certificateId: existingCertificate[0].id,
				alreadyIssued: true
			});
		}
	}

	// Check completion requirements
	const completionCheck = await checkCourseCompletion(user.id, courseId);

	if (!completionCheck.isComplete) {
		return json(
			{
				success: false,
				message: 'Course requirements not met',
				missing: completionCheck.missing,
				progress: completionCheck.progress
			},
			{ status: 400 }
		);
	}

	// Generate certificate
	const certificateId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
	const year = new Date().getFullYear();
	const randomHash = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(8)));
	const serial = `NK-${year}-${randomHash}`;

	await db.insert(schema.certificate).values({
		id: certificateId,
		userId: user.id,
		courseId: courseId,
		serial
	});

	// Update enrollment completion date
	await db
		.update(schema.enrollment)
		.set({
			completedAt: new Date()
		})
		.where(
			and(
				eq(schema.enrollment.userId, user.id),
				eq(schema.enrollment.courseId, courseId)
			)
		);

	return json({
		success: true,
		certificateId,
		serial
	});
};

