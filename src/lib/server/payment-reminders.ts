import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, lt, isNull } from 'drizzle-orm';
import { sendNotification } from '$lib/server/notifications';

/**
 * Check for pending payments older than specified days and send reminders
 */
export async function sendPaymentReminders(daysOld: number = 3): Promise<number> {
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - daysOld);

	// Find pending enrollments without recent notifications
	const pendingEnrollments = await db
		.select({
			id: schema.enrollment.id,
			userId: schema.enrollment.userId,
			courseId: schema.enrollment.courseId,
			courseTitle: schema.course.title,
			enrolledAt: schema.enrollment.enrolledAt
		})
		.from(schema.enrollment)
		.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.where(
			and(eq(schema.enrollment.status, 'pending'), lt(schema.enrollment.enrolledAt, cutoffDate))
		);

	let reminderCount = 0;

	for (const enrollment of pendingEnrollments) {
		try {
			await sendNotification({
				userId: enrollment.userId,
				type: 'reminder',
				title: 'Pembayaran Belum Selesai',
				message: `Pembayaran untuk kursus "${enrollment.courseTitle}" belum dikonfirmasi. Silakan selesaikan pembayaran atau hubungi admin.`,
				link: `/app/learning`,
				channel: 'notification'
			});
			reminderCount++;
		} catch (error) {
			console.error(`Failed to send reminder for enrollment ${enrollment.id}:`, error);
		}
	}

	return reminderCount;
}

/**
 * Cancel expired Midtrans transactions
 */
export async function cancelExpiredTransactions(expiryHours: number = 24): Promise<number> {
	const cutoffDate = new Date();
	cutoffDate.setHours(cutoffDate.getHours() - expiryHours);

	const expiredTransactions = await db
		.select()
		.from(schema.transaction)
		.where(
			and(eq(schema.transaction.status, 'pending'), lt(schema.transaction.createdAt, cutoffDate))
		);

	let cancelCount = 0;

	for (const tx of expiredTransactions) {
		try {
			await db
				.update(schema.transaction)
				.set({ status: 'expired' })
				.where(eq(schema.transaction.id, tx.id));

			// Update associated enrollment if courseId exists
			if (tx.courseId) {
				await db
					.update(schema.enrollment)
					.set({ status: 'expired' })
					.where(
						and(
							eq(schema.enrollment.userId, tx.userId),
							eq(schema.enrollment.courseId, tx.courseId),
							eq(schema.enrollment.status, 'pending')
						)
					);
			}

			cancelCount++;
		} catch (error) {
			console.error(`Failed to cancel transaction ${tx.id}:`, error);
		}
	}

	return cancelCount;
}
