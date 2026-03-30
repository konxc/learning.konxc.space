import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
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

	// Update transaction status
	await db
		.update(schema.transaction)
		.set({ status: newStatus === 'active' ? 'success' : newStatus })
		.where(eq(schema.transaction.id, order_id));

	// Then update enrollment via the transaction's enrollmentId
	await db
		.update(schema.enrollment)
		.set({
			status: newStatus,
			activatedAt: newStatus === 'active' ? new Date() : null
		})
		.where(eq(schema.enrollment.id, transaction[0].enrollmentId));

	console.log(
		`[Webhook] Updated enrollment ${transaction[0].enrollmentId} to status: ${newStatus}`
	);

	return new Response('ok');
};
