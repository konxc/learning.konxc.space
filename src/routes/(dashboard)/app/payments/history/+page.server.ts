import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, isNotNull } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get user's transactions with course info
	const transactions = await db
		.select({
			id: schema.transaction.id,
			amount: schema.transaction.amount,
			status: schema.transaction.status,
			paymentType: schema.transaction.paymentType,
			createdAt: schema.transaction.createdAt,
			course: {
				id: schema.course.id,
				title: schema.course.title
			}
		})
		.from(schema.transaction)
		.leftJoin(schema.course, eq(schema.transaction.courseId, schema.course.id))
		.where(eq(schema.transaction.userId, user.id))
		.orderBy(desc(schema.transaction.createdAt));

	// Get payment proofs
	const paymentProofs = await db
		.select({
			id: schema.paymentProof.id,
			status: schema.paymentProof.status,
			createdAt: schema.paymentProof.createdAt,
			course: {
				title: schema.course.title
			}
		})
		.from(schema.paymentProof)
		.innerJoin(schema.course, eq(schema.paymentProof.courseId, schema.course.id))
		.where(eq(schema.paymentProof.userId, user.id))
		.orderBy(desc(schema.paymentProof.createdAt));

	return {
		transactions,
		paymentProofs
	};
};
