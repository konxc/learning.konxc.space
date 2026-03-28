import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

interface WhatsAppMessage {
	to: string;
	type: string;
	template?: {
		name: string;
		language: { code: string };
		components?: any[];
	};
	text?: { body: string };
}

const MESSAGE_TEMPLATES: Record<string, { template: string; language: string }> = {
	welcome: {
		template: 'hello_message',
		language: 'id'
	},
	enrollment: {
		template: 'enrollment_confirmation',
		language: 'id'
	},
	reminder: {
		template: 'learning_reminder',
		language: 'id'
	},
	grade: {
		template: 'submission_graded',
		language: 'id'
	},
	certificate: {
		template: 'certificate_ready',
		language: 'id'
	},
	action_required: {
		template: 'action_required',
		language: 'id'
	}
};

export async function sendWhatsAppNotification(
	phoneNumber: string,
	templateName: keyof typeof MESSAGE_TEMPLATES,
	variables: Record<string, string> = {}
): Promise<{ success: boolean; error?: string; messageId?: string }> {
	if (!WHATSAPP_API_URL || !WHATSAPP_TOKEN) {
		console.log('[WhatsApp] WhatsApp not configured, skipping notification');
		return { success: false, error: 'WhatsApp not configured' };
	}

	const template = MESSAGE_TEMPLATES[templateName];
	if (!template) {
		return { success: false, error: `Unknown template: ${templateName}` };
	}

	const messageId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

	try {
		const response = await fetch(`${WHATSAPP_API_URL}/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				messaging_product: 'whatsapp',
				to: phoneNumber.replace(/^0/, '62'),
				type: 'template',
				template: {
					name: template.template,
					language: { code: template.language },
					components: Object.keys(variables).map((key) => ({
						type: 'body',
						parameters: [{ type: 'text', text: variables[key] }]
					}))
				}
			})
		});

		const result = await response.json();

		if (!response.ok) {
			console.error('[WhatsApp] Error sending message:', result);
			await logWhatsAppMessage(phoneNumber, templateName, 'failed', result.error?.message || 'Unknown error');
			return { success: false, error: result.error?.message || 'Failed to send WhatsApp message' };
		}

		console.log('[WhatsApp] Message sent successfully:', result.messages?.[0]?.id);
		await logWhatsAppMessage(phoneNumber, templateName, 'sent', undefined, result.messages?.[0]?.id);
		return { success: true, messageId: result.messages?.[0]?.id };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('[WhatsApp] Exception sending message:', errorMessage);
		await logWhatsAppMessage(phoneNumber, templateName, 'failed', errorMessage);
		return { success: false, error: errorMessage };
	}
}

async function logWhatsAppMessage(
	to: string,
	type: string,
	status: 'sent' | 'failed',
	error?: string,
	messageId?: string
) {
	const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
	
	try {
		await db.insert(schema.whatsappLog).values({
			id,
			to,
			type,
			status,
			error,
			messageId,
			createdAt: new Date()
		});
	} catch (e) {
		console.error('[WhatsApp] Failed to log message:', e);
	}
}

export async function getUserPhoneNumber(userId: string): Promise<string | null> {
	const user = await db
		.select({ phone: schema.user.phone })
		.from(schema.user)
		.where(eq(schema.user.id, userId))
		.limit(1);

	return user[0]?.phone || null;
}

export async function sendEnrollmentNotification(userId: string, courseName: string) {
	const phone = await getUserPhoneNumber(userId);
	if (!phone) return;

	await sendWhatsAppNotification(phone, 'enrollment', {
		courseName
	});
}

export async function sendGradeNotification(userId: string, courseName: string, score: string) {
	const phone = await getUserPhoneNumber(userId);
	if (!phone) return;

	await sendWhatsAppNotification(phone, 'grade', {
		courseName,
		score
	});
}

export async function sendCertificateNotification(userId: string, courseName: string) {
	const phone = await getUserPhoneNumber(userId);
	if (!phone) return;

	await sendWhatsAppNotification(phone, 'certificate', {
		courseName
	});
}

export async function sendReminderNotification(userId: string, courseName: string, daysSince: string) {
	const phone = await getUserPhoneNumber(userId);
	if (!phone) return;

	await sendWhatsAppNotification(phone, 'reminder', {
		courseName,
		daysSince
	});
}
