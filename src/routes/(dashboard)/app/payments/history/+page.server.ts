import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Query transactions (Midtrans) with course info
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

	// Query payment proofs (manual transfer) with course info
	const proofs = await db
		.select({
			id: schema.paymentProof.id,
			status: schema.paymentProof.status,
			notes: schema.paymentProof.notes,
			createdAt: schema.paymentProof.createdAt,
			course: {
				id: schema.course.id,
				title: schema.course.title,
				price: schema.course.price
			}
		})
		.from(schema.paymentProof)
		.innerJoin(schema.course, eq(schema.paymentProof.courseId, schema.course.id))
		.where(eq(schema.paymentProof.userId, user.id))
		.orderBy(desc(schema.paymentProof.createdAt));

	// Combine and sort by date
	type TxEntry = {
		id: string;
		type: 'midtrans';
		date: Date;
		courseId: string | null;
		courseTitle: string | null;
		amount: number;
		status: string;
		paymentType: string | null;
		notes: null;
	};

	type ProofEntry = {
		id: string;
		type: 'manual';
		date: Date;
		courseId: string;
		courseTitle: string;
		amount: number;
		status: string;
		paymentType: null;
		notes: string | null;
	};

	const combined: (TxEntry | ProofEntry)[] = [
		...transactions.map(
			(t): TxEntry => ({
				id: t.id,
				type: 'midtrans',
				date: new Date(t.createdAt),
				courseId: t.course?.id ?? null,
				courseTitle: t.course?.title ?? null,
				amount: t.amount,
				status: t.status,
				paymentType: t.paymentType,
				notes: null
			})
		),
		...proofs.map(
			(p): ProofEntry => ({
				id: p.id,
				type: 'manual',
				date: new Date(p.createdAt),
				courseId: p.course.id,
				courseTitle: p.course.title,
				amount: p.course.price,
				status: p.status,
				paymentType: null,
				notes: p.notes
			})
		)
	].sort((a, b) => b.date.getTime() - a.date.getTime());

	return {
		combined,
		transactions,
		paymentProofs: proofs
	};
};
