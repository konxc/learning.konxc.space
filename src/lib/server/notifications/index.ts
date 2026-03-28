import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { sendEmail } from '$lib/server/email';
import {
	sendWhatsAppNotification,
	getUserPhoneNumber
} from '$lib/server/notifications/whatsapp';

export type NotificationChannel = 'email' | 'whatsapp' | 'both' | 'notification';

interface SendNotificationOptions {
	userId: string;
	type: 'welcome' | 'enrollment' | 'grade' | 'certificate' | 'reminder' | 'action_required' | 'broadcast';
	title: string;
	message: string;
	link?: string;
	emailData?: Record<string, string>;
	whatsappData?: Record<string, string>;
	channel?: NotificationChannel;
}

export async function sendNotification(options: SendNotificationOptions): Promise<{
	emailSent?: boolean;
	whatsappSent?: boolean;
	emailError?: string;
	whatsappError?: string;
}> {
	const {
		userId,
		type,
		title,
		message,
		link,
		emailData = {},
		whatsappData = {},
		channel = 'both'
	} = options;

	const results: {
		emailSent?: boolean;
		whatsappSent?: boolean;
		emailError?: string;
		whatsappError?: string;
	} = {};

	if (channel === 'email' || channel === 'both') {
		const emailResult = await sendEmailInternal(userId, type, emailData);
		results.emailSent = emailResult.success;
		results.emailError = emailResult.error;
	}

	if (channel === 'whatsapp' || channel === 'both') {
		const phone = await getUserPhoneNumber(userId);
		if (phone) {
			const whatsappResult = await sendWhatsAppNotification(phone, type, whatsappData);
			results.whatsappSent = whatsappResult.success;
			results.whatsappError = whatsappResult.error;
		} else {
			results.whatsappError = 'User phone number not found';
		}
	}

	await createInAppNotification(userId, type, title, message, link);

	return results;
}

async function sendEmailInternal(
	userId: string,
	type: string,
	data: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
	const user = await db
		.select({ email: schema.user.email, fullName: schema.user.fullName })
		.from(schema.user)
		.where(eq(schema.user.id, userId))
		.limit(1);

	if (!user[0]?.email) {
		return { success: false, error: 'User email not found' };
	}

	const sendResult = await sendEmail(user[0].email, type as any, {
		...data,
		name: user[0].fullName || 'Student'
	});

	return sendResult;
}

export async function createInAppNotification(
	userId: string,
	type: string,
	title: string,
	message: string,
	link?: string
): Promise<void> {
	const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

	await db.insert(schema.notification).values({
		id,
		userId,
		type,
		title,
		message,
		link,
		read: false,
		createdAt: new Date()
	});
}

export async function getUnreadNotifications(userId: string) {
	return db
		.select()
		.from(schema.notification)
		.where(eq(schema.notification.userId, userId))
		.orderBy(desc(schema.notification.createdAt))
		.limit(20);
}

export async function markNotificationRead(id: string) {
	await db
		.update(schema.notification)
		.set({ read: true })
		.where(eq(schema.notification.id, id));
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
	const result = await db
		.select({ count: schema.notification.id })
		.from(schema.notification)
		.where(eq(schema.notification.userId, userId));

	return result.length;
}
