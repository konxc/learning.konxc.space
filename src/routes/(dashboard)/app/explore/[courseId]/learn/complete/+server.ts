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

	// Update enrollment completion date AND status (for badge system)
	await db
		.update(schema.enrollment)
		.set({
			status: 'completed',
			completedAt: new Date()
		})
		.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.courseId, courseId)));

	// Trigger badge checking for course completion
	const { checkAndAwardBadges } = await import('$lib/server/badge');
	await checkAndAwardBadges(user.id);

	// Send certificate email
	try {
		const { sendEmail } = await import('$lib/server/email');
		const courseData = await db.query.course.findFirst({
			where: eq(schema.course.id, courseId)
		});
		
		if (courseData) {
			await sendEmail(user.email!, 'certificate', {
				name: user.fullName || user.username,
				courseName: courseData.title,
				serial: serial,
				viewUrl: `${event.url.origin}/app/learning/certificates/${certificateId}`,
				verifyUrl: `${event.url.origin}/certificate/${serial}`
			});
		}
	} catch (e) {
		console.error('Failed to send certificate email:', e);
	}

	return json({
		success: true,
		certificateId,
		serial
	});
};
