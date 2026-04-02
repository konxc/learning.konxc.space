import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { requireAuth } from '$lib/server/middleware';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { sendNotification } from '$lib/server/notifications';
import type { RequestHandler } from './$types';

// Per PLATFORM_ARCHITECTURE_BRIEF.md:
// - Platform admin (user.role = 'admin') can send broadcasts globally
// - Org mentors/admins can send broadcasts to their org's courses/cohorts
// - mentor/facilitator are ORG-LEVEL roles, NOT platform-level

/**
 * Check if user can send broadcasts:
 * 1. Platform admin can send to anyone
 * 2. Org mentor/admin/owner can send to their org's courses/cohorts
 */
async function canUserSendBroadcast(
	userId: string,
	userRole: string,
	targetCourseId?: string,
	targetCohortId?: string
): Promise<boolean> {
	// Platform admin can always send broadcasts
	if (userRole === 'admin') {
		return true;
	}

	// For org-level access, check organization membership
	if (targetCourseId || targetCohortId) {
		// Get the org from the target course (cohort links to course, course links to org)
		let orgId: string | null = null;

		if (targetCourseId) {
			const course = await db
				.select({ orgId: schema.course.orgId })
				.from(schema.course)
				.where(eq(schema.course.id, targetCourseId))
				.limit(1);
			orgId = course[0]?.orgId || null;
		} else if (targetCohortId) {
			// Cohort -> Course -> Org
			const cohortWithCourse = await db
				.select({ orgId: schema.course.orgId })
				.from(schema.cohort)
				.innerJoin(schema.course, eq(schema.cohort.courseId, schema.course.id))
				.where(eq(schema.cohort.id, targetCohortId))
				.limit(1);
			orgId = cohortWithCourse[0]?.orgId || null;
		}

		if (orgId) {
			// Check if user has org-level permission (mentor, admin, or owner)
			const membership = await db
				.select({ role: schema.organizationMember.role })
				.from(schema.organizationMember)
				.where(
					and(
						eq(schema.organizationMember.userId, userId),
						eq(schema.organizationMember.orgId, orgId),
						inArray(schema.organizationMember.role, ['mentor', 'admin', 'owner'])
					)
				)
				.limit(1);

			return membership.length > 0;
		}
	}

	return false;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = await requireAuth(locals);

	const data = await request.json();
	const { title, content, targetRole, targetCohortId, targetCourseId, sentVia } = data;

	if (!title || !content) {
		return json({ error: 'Title and content are required' }, { status: 400 });
	}

	// Check permission based on architecture
	const hasPermission = await canUserSendBroadcast(
		user.id,
		user.role,
		targetCourseId,
		targetCohortId
	);

	if (!hasPermission) {
		return json(
			{ error: 'Unauthorized - you can only broadcast to your organization' },
			{ status: 403 }
		);
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

	// Send notifications with rate limiting
	let successCount = 0;
	let failCount = 0;

	// Rate limiting: max 100 recipients per broadcast request
	const MAX_RECIPIENTS = 100;
	if (uniqueRecipients.length > MAX_RECIPIENTS) {
		return json(
			{
				error: `Too many recipients. Maximum is ${MAX_RECIPIENTS} per request.`,
				received: uniqueRecipients.length,
				max: MAX_RECIPIENTS
			},
			{ status: 400 }
		);
	}

	// Process in batches to prevent blocking
	const BATCH_SIZE = 10;
	const DELAY_MS = 100; // 100ms delay between batches

	for (let i = 0; i < uniqueRecipients.length; i += BATCH_SIZE) {
		const batch = uniqueRecipients.slice(i, i + BATCH_SIZE);

		await Promise.allSettled(
			batch.map(async (recipient) => {
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
			})
		);

		// Small delay between batches to prevent overwhelming the notification service
		if (i + BATCH_SIZE < uniqueRecipients.length) {
			await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
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

	// Platform admin can see all broadcasts
	// Org mentors/admins see only broadcasts sent by them
	const isAdmin = user.role === 'admin';

	let broadcasts;

	if (isAdmin) {
		// Admin sees all broadcasts
		broadcasts = await db
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
	} else {
		// Non-admin users see only their own broadcasts
		broadcasts = await db
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
			.where(eq(schema.broadcastMessage.senderId, user.id))
			.orderBy(schema.broadcastMessage.createdAt)
			.limit(50);
	}

	return json({ broadcasts });
};
