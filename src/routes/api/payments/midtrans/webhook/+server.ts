import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import { verifyMidtransSignature } from '$lib/server/payments/midtrans';
import * as schema from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const order_id: string = body.order_id;
	const transaction_status: string = body.transaction_status;
	const status_code: string = body.status_code;
	const gross_amount: string = body.gross_amount;
	const signature_key: string = body.signature_key;

	const isValid = verifyMidtransSignature({
		order_id,
		status_code,
		gross_amount,
		signature_key
	});
	if (!isValid) {
		return new Response('invalid-signature', { status: 401 });
	}

	let newStatus: 'active' | 'pending' | 'cancelled' = 'pending';
	if (transaction_status === 'settlement' || transaction_status === 'capture') {
		newStatus = 'active';
	} else if (
		transaction_status === 'deny' ||
		transaction_status === 'cancel' ||
		transaction_status === 'expire'
	) {
		newStatus = 'cancelled';
	}

	// First, find the transaction by order_id
	const transaction = await db
		.select()
		.from(schema.transaction)
		.where(eq(schema.transaction.id, order_id))
		.limit(1);

	if (transaction.length === 0) {
		console.error(`[Webhook] Transaction not found: ${order_id}`);
		return new Response('transaction-not-found', { status: 404 });
	}

	const tx = transaction[0];

	// Update transaction status
	await db
		.update(schema.transaction)
		.set({ status: newStatus === 'active' ? 'success' : newStatus })
		.where(eq(schema.transaction.id, order_id));

	// Find and update enrollment
	// Only update if payment is successful
	if (newStatus === 'active') {
		// Parse payload to get enrollmentId
		const payload = tx.payload ? JSON.parse(tx.payload) : null;

		if (tx.courseId && payload?.enrollmentId) {
			// Course purchase - activate by enrollment ID
			await db
				.update(schema.enrollment)
				.set({
					status: 'active',
					activatedAt: new Date()
				})
				.where(eq(schema.enrollment.id, payload.enrollmentId));

			console.log(
				`[Webhook] Activated enrollment ${payload.enrollmentId} for course ${tx.courseId}`
			);
		} else if (tx.orgId) {
			// Organization plan upgrade - update org planType
			if (payload?.planType) {
				await db
					.update(schema.organization)
					.set({
						planType: payload.planType,
						updatedAt: new Date()
					})
					.where(eq(schema.organization.id, tx.orgId));

				console.log(`[Webhook] Updated organization ${tx.orgId} plan to: ${payload.planType}`);
			}
		}
	}

	// Log failed payments
	if (newStatus === 'cancelled' && tx.courseId) {
		const payload = tx.payload ? JSON.parse(tx.payload) : null;
		if (payload?.enrollmentId) {
			await db
				.update(schema.enrollment)
				.set({ status: 'failed' })
				.where(eq(schema.enrollment.id, payload.enrollmentId));

			console.log(`[Webhook] Marked enrollment ${payload.enrollmentId} as failed`);
		}
	}

	return new Response('ok');
};
