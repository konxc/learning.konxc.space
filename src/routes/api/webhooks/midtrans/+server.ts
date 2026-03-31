import { json } from '@sveltejs/kit';
import { core } from '$lib/server/midtrans';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const notification = await request.json();

		// 1. Verify notification with Midtrans (prevent spoofing)
		let statusResponse = await core.transaction.notification(notification);

		const orderId = statusResponse.order_id;
		const transactionStatus = statusResponse.transaction_status;
		const fraudStatus = statusResponse.fraud_status;

		console.log(
			`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`
		);

		// 2. Find transaction in our DB
		const tx = await db.query.transaction.findFirst({
			where: eq(schema.transaction.id, orderId)
		});

		if (!tx) {
			return json({ message: 'Transaction not found' }, { status: 404 });
		}

		// 3. Update transaction status
		let updatedStatus = 'pending';
		if (transactionStatus === 'capture') {
			if (fraudStatus === 'challenge') {
				updatedStatus = 'challenge';
			} else if (fraudStatus === 'accept') {
				updatedStatus = 'settlement';
			}
		} else if (transactionStatus === 'settlement') {
			updatedStatus = 'settlement';
		} else if (
			transactionStatus === 'cancel' ||
			transactionStatus === 'deny' ||
			transactionStatus === 'expire'
		) {
			updatedStatus = 'failure';
		} else if (transactionStatus === 'pending') {
			updatedStatus = 'pending';
		}

		await db
			.update(schema.transaction)
			.set({
				status: updatedStatus,
				payload: JSON.stringify(statusResponse),
				updatedAt: new Date()
			})
			.where(eq(schema.transaction.id, orderId));

		// 4. If settled, activate enrollment or update org plan
		if (updatedStatus === 'settlement') {
			if (tx.courseId) {
				const courseId = tx.courseId as string;
				await db
					.update(schema.enrollment)
					.set({
						status: 'active',
						activatedAt: new Date()
					})
					.where(
						and(eq(schema.enrollment.userId, tx.userId), eq(schema.enrollment.courseId, courseId))
					);

				console.log(`Enrollment activated for user ${tx.userId} in course ${courseId}`);
			} else if (tx.orgId) {
				// Organization plan upgrade
				const payload = tx.payload ? JSON.parse(tx.payload) : null;
				if (payload?.planType) {
					await db
						.update(schema.organization)
						.set({
							planType: payload.planType,
							updatedAt: new Date()
						})
						.where(eq(schema.organization.id, tx.orgId as string));

					console.log(`Organization ${tx.orgId} plan upgraded to: ${payload.planType}`);
				}
			}
		}

		return json({ message: 'OK' });
	} catch (e) {
		console.error('Webhook Error:', e);
		return json({ message: 'Internal Server Error' }, { status: 500 });
	}
};
