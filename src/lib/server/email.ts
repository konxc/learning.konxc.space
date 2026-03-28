import { db } from './db';
import * as schema from './db/schema';
import { eq, desc } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';

const FROM_EMAIL = 'noreply@naikkelas.id';
const FROM_NAME = 'Naik Kelas by Koneksi';

interface EmailTemplate {
	subject: string;
	html: string;
	text: string;
}

const templates: Record<string, (data: Record<string, string>) => EmailTemplate> = {
	welcome: (data) => ({
		subject: 'Welcome to Naik Kelas! 🎓',
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #2563eb; margin: 0;">Naik Kelas 🎓</h1>
					<p style="color: #666; margin: 5px 0;">by Koneksi</p>
				</div>
				<div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
					<h2 style="margin-top: 0;">Welcome, ${data.name || 'Student'}!</h2>
					<p>Thank you for joining Naik Kelas. You're now part of a learning community focused on digital marketing skills.</p>
					<p>Here's what you can do next:</p>
					<ul>
						<li>Browse our courses</li>
						<li>Choose your track (Creator, Seller, or Affiliator)</li>
						<li>Start learning and submit your action tasks</li>
					</ul>
					<a href="${data.loginUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">Start Learning</a>
				</div>
				<p style="color: #888; font-size: 12px; text-align: center;">
					© 2026 Naik Kelas by Koneksi. All rights reserved.<br>
					In partnership with Yayasan ASIB
				</p>
			</body>
			</html>
		`,
		text: `Welcome to Naik Kelas! Thank you for joining. Start your learning journey at ${data.loginUrl}`
	}),

	enrollment: (data) => ({
		subject: `You're enrolled in ${data.courseName}! 📚`,
		html: `
			<!DOCTYPE html>
			<html>
			<head><meta charset="utf-8"></head>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #2563eb; margin: 0;">Naik Kelas 🎓</h1>
				</div>
				<div style="background: #f8fafc; border-radius: 12px; padding: 30px;">
					<h2 style="margin-top: 0;">Enrollment Confirmed! ✅</h2>
					<p>Hi ${data.name},</p>
					<p>You're now enrolled in <strong>${data.courseName}</strong>.</p>
					<div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
						<p style="margin: 0;"><strong>Track:</strong> ${data.track}</p>
						<p style="margin: 5px 0 0;"><strong>Batch:</strong> ${data.cohort || 'Open enrollment'}</p>
					</div>
					<a href="${data.learnUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Start Learning Now</a>
				</div>
				<p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">
					© 2026 Naik Kelas by Koneksi
				</p>
			</body>
			</html>
		`,
		text: `You're enrolled in ${data.courseName}! Start learning at ${data.learnUrl}`
	}),

	grade: (data) => ({
		subject: `Your submission has been graded! 📝`,
		html: `
			<!DOCTYPE html>
			<html>
			<head><meta charset="utf-8"></head>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #2563eb; margin: 0;">Naik Kelas 🎓</h1>
				</div>
				<div style="background: #f8fafc; border-radius: 12px; padding: 30px;">
					<h2 style="margin-top: 0;">Submission Graded! 📊</h2>
					<p>Hi ${data.name},</p>
					<p>Your submission for <strong>${data.lessonName}</strong> has been reviewed.</p>
					<div style="background: ${parseInt(data.score) >= 70 ? '#dcfce7' : '#fef3c7'}; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
						<p style="font-size: 36px; font-weight: bold; margin: 0; color: ${parseInt(data.score) >= 70 ? '#16a34a' : '#d97706'};">${data.score}/100</p>
					</div>
					${data.feedback ? `<p><strong>Feedback:</strong> ${data.feedback}</p>` : ''}
					<a href="${data.viewUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View Details</a>
				</div>
				<p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">
					© 2026 Naik Kelas by Koneksi
				</p>
			</body>
			</html>
		`,
		text: `Your submission for ${data.lessonName} scored ${data.score}/100. View details at ${data.viewUrl}`
	}),

	certificate: (data) => ({
		subject: `Congratulations! Your certificate is ready! 🏆`,
		html: `
			<!DOCTYPE html>
			<html>
			<head><meta charset="utf-8"></head>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #2563eb; margin: 0;">Naik Kelas 🎓</h1>
				</div>
				<div style="background: linear-gradient(135deg, #fef3c7, #dcfce7); border-radius: 12px; padding: 30px; text-align: center;">
					<h2 style="margin-top: 0;">🎉 Congratulations!</h2>
					<p>Hi ${data.name},</p>
					<p>You've completed <strong>${data.courseName}</strong>!</p>
					<p>Your certificate is now available.</p>
					<div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
						<p style="font-size: 14px; color: #666; margin: 0 0 5px;">Certificate ID</p>
						<p style="font-family: monospace; font-size: 16px; margin: 0;">${data.serial}</p>
					</div>
					<a href="${data.viewUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View Certificate</a>
					<p style="margin-top: 20px;"><a href="${data.verifyUrl}">Verify this certificate</a></p>
				</div>
				<p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">
					© 2026 Naik Kelas by Koneksi | In partnership with Yayasan ASIB
				</p>
			</body>
			</html>
		`,
		text: `Congratulations! You've completed ${data.courseName}. View your certificate at ${data.viewUrl}`
	}),

	reminder: (data) => ({
		subject: `Don't forget: Continue your learning journey 📚`,
		html: `
			<!DOCTYPE html>
			<html>
			<head><meta charset="utf-8"></head>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #2563eb; margin: 0;">Naik Kelas 🎓</h1>
				</div>
				<div style="background: #f8fafc; border-radius: 12px; padding: 30px;">
					<h2 style="margin-top: 0;">Ready to continue learning? 🚀</h2>
					<p>Hi ${data.name},</p>
					<p>${data.message || 'We noticed you haven\'t continued your course lately. Keep up the momentum!'}</p>
					<p><strong>Course:</strong> ${data.courseName}</p>
					<p><strong>Progress:</strong> ${data.progress}% complete</p>
					<a href="${data.continueUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Continue Learning</a>
				</div>
				<p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">
					© 2026 Naik Kelas by Koneksi
				</p>
			</body>
			</html>
		`,
		text: `Don't forget to continue your learning! Course: ${data.courseName}, Progress: ${data.progress}%`
	})
};

export async function sendEmail(
	to: string,
	type: keyof typeof templates,
	data: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
	const template = templates[type](data);
	const emailId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

	try {
		// Log the email attempt
		await db.insert(schema.emailLog).values({
			id: emailId,
			to,
			subject: template.subject,
			type,
			status: 'pending',
			createdAt: new Date()
		});

		// In production, you would integrate with an email service here
		// For now, we'll just log it as "sent" (simulating successful delivery)
		// Examples: SendGrid, Resend, AWS SES, Postmark, etc.

		// TODO: Replace with actual email service integration
		// const response = await fetch('https://api.sendgrid.com/v3/mail/send', { ... });
		
		console.log(`[EMAIL] Sending ${type} email to ${to}: ${template.subject}`);

		// Update status to sent
		await db
			.update(schema.emailLog)
			.set({ status: 'sent', sentAt: new Date() })
			.where(eq(schema.emailLog.id, emailId));

		return { success: true };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		
		// Log the error
		await db
			.update(schema.emailLog)
			.set({ status: 'failed', error: errorMessage })
			.where(eq(schema.emailLog.id, emailId));

	return { success: false, error: errorMessage };
	};
}

export async function createNotification(
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
