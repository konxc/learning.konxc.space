import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyMidtransSignature } from '$lib/server/payments/midtrans';

// Midtrans will POST JSON notifications here
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	// Expected fields
	const order_id: string = body.order_id;
	const transaction_status: string = body.transaction_status; // capture | settlement | pending | deny | cancel | expire | refund | chargeback
	const status_code: string = body.status_code;
	const gross_amount: string = body.gross_amount; // string value
	const signature_key: string = body.signature_key;

	// Verify signature
	const isValid = verifyMidtransSignature({
		order_id,
		status_code,
		gross_amount,
		signature_key
	});
	if (!isValid) {
		return new Response('invalid-signature', { status: 401 });
	}

	// Map status to enrollment status
	let newStatus: 'active' | 'pending' | 'cancelled' = 'pending';
	if (transaction_status === 'settlement' || transaction_status === 'capture') newStatus = 'active';
	if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') newStatus = 'cancelled';

	// Update enrollment
	await db
		.update(schema.enrollment)
		.set({
			status: newStatus,
			activatedAt: newStatus === 'active' ? new Date() : undefined
		})
		.where(eq(schema.enrollment.id, order_id));

	return new Response('ok');
};
