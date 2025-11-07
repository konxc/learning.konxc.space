import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	await requireAdmin(event);

	const { id } = event.params;

	// Get payment proof
	const proof = await db
		.select({
			dataBase64: schema.paymentProof.dataBase64,
			mime: schema.paymentProof.mime
		})
		.from(schema.paymentProof)
		.where(eq(schema.paymentProof.id, id))
		.limit(1);

	if (proof.length === 0) {
		return json({ error: 'Payment proof not found' }, { status: 404 });
	}

	return json({
		dataBase64: proof[0].dataBase64,
		mime: proof[0].mime
	});
};
