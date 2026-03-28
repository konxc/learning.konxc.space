import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { requireAuth } from '$lib/server/middleware';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { sendNotification } from '$lib/server/notifications';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = await requireAuth(locals);

	// Only admin and mentor can send broadcasts
	if (user.role !== 'admin' && user.role !== 'mentor') {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	const data = await request.json();
	const { title, content, targetRole, targetCohortId, targetCourseId, sentVia } = data;

	if (!title || !content) {
		return json({ error: 'Title and content are required' }, { status: 400 });
	}

	// Build query to get recipients
	let recipients: { id: string; email: string | null; phone: string | null }[] = [];

	if (targetCohortId) {
		// Get students in this cohort
		recipients = await db
			.select({
				id: schema.user.id,
				email: schema.user.email,
				phone: schema.user.phone
			})
			.from(schema.enrollment)
			.innerJoin(schema.user, eq(schema.enrollment.userId, schema.user.id))
			.where(eq(schema.enrollment.cohortId, targetCohortId));
	} else if (targetCourseId) {
		// Get students in this course
		recipients = await db
			.select({
				id: schema.user.id,
				email: schema.user.email,
				phone: schema.user.phone
			})
			.from(schema.enrollment)
			.innerJoin(schema.user, eq(schema.enrollment.userId, schema.user.id))
			.where(eq(schema.enrollment.courseId, targetCourseId));
	} else if (targetRole) {
		// Get users by role
		recipients = await db
			.select({
				id: schema.user.id,
				email: schema.user.email,
				phone: schema.user.phone
			})
			.from(schema.user)
			.where(eq(schema.user.role, targetRole));
	} else {
		// Get all learners
		recipients = await db
			.select({
				id: schema.user.id,
				email: schema.user.email,
				phone: schema.user.phone
			})
			.from(schema.user)
			.where(eq(schema.user.role, 'user'));
	}

	// Remove duplicates
	const uniqueRecipients = recipients.filter(
		(r, index, self) => index === self.findIndex((r2) => r2.id === r.id)
	);

	// Save broadcast message
	const broadcastId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
	await db.insert(schema.broadcastMessage).values({
		id: broadcastId,
		senderId: user.id,
		title,
		content,
		targetRole: targetRole || null,
		targetCohortId: targetCohortId || null,
		targetCourseId: targetCourseId || null,
		sentVia: sentVia || 'notification',
		status: 'sent',
		recipientCount: uniqueRecipients.length,
		createdAt: new Date()
	});

	// Send notifications
	let successCount = 0;
	let failCount = 0;

	for (const recipient of uniqueRecipients) {
		try {
			if (sentVia === 'all' || sentVia === 'notification' || sentVia === 'whatsapp') {
				const channel =
					sentVia === 'whatsapp' ? 'whatsapp' : sentVia === 'all' ? 'both' : 'notification';
				await sendNotification({
					userId: recipient.id,
					type: 'broadcast',
					title,
					message: content,
					channel
				});
			}
			successCount++;
		} catch (e) {
			console.error(`Failed to send to ${recipient.id}:`, e);
			failCount++;
		}
	}

	return json({
		success: true,
		broadcastId,
		recipientCount: uniqueRecipients.length,
		successCount,
		failCount
	});
};

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = await requireAuth(locals);

	if (user.role !== 'admin' && user.role !== 'mentor') {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	const broadcasts = await db
		.select({
			id: schema.broadcastMessage.id,
			title: schema.broadcastMessage.title,
			content: schema.broadcastMessage.content,
			targetRole: schema.broadcastMessage.targetRole,
			targetCohortId: schema.broadcastMessage.targetCohortId,
			targetCourseId: schema.broadcastMessage.targetCourseId,
			sentVia: schema.broadcastMessage.sentVia,
			recipientCount: schema.broadcastMessage.recipientCount,
			createdAt: schema.broadcastMessage.createdAt,
			senderName: schema.user.fullName
		})
		.from(schema.broadcastMessage)
		.leftJoin(schema.user, eq(schema.broadcastMessage.senderId, schema.user.id))
		.orderBy(schema.broadcastMessage.createdAt)
		.limit(50);

	return json({ broadcasts });
};
