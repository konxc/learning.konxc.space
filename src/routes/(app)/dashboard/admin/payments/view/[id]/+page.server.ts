import type { Actions, PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAdmin(event);
	const proofId = event.params.id;

	// Get payment proof with user and course details
	const proof = await db
		.select({
			id: schema.paymentProof.id,
			status: schema.paymentProof.status,
			notes: schema.paymentProof.notes,
			createdAt: schema.paymentProof.createdAt,
			user: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email
			},
			course: {
				id: schema.course.id,
				title: schema.course.title,
				price: schema.course.price
			}
		})
		.from(schema.paymentProof)
		.innerJoin(schema.user, eq(schema.paymentProof.userId, schema.user.id))
		.innerJoin(schema.course, eq(schema.paymentProof.courseId, schema.course.id))
		.where(eq(schema.paymentProof.id, proofId))
		.limit(1);

	if (proof.length === 0) {
		error(404, 'Payment proof not found');
	}

	return {
		proof: proof[0]
	};
};

export const actions: Actions = {
	approve: async (event) => {
		await requireAdmin(event);

		const formData = await event.request.formData();
		const proofId = formData.get('proofId') as string;

		if (!proofId) {
			return fail(400, { error: 'Missing proof ID' });
		}

		// Get payment proof
		const proof = await db
			.select()
			.from(schema.paymentProof)
			.where(eq(schema.paymentProof.id, proofId))
			.limit(1);

		if (proof.length === 0) {
			return fail(404, { error: 'Payment proof not found' });
		}

		// Update proof status
		await db
			.update(schema.paymentProof)
			.set({ status: 'approved' })
			.where(eq(schema.paymentProof.id, proofId));

		// Activate enrollment
		await db
			.update(schema.enrollment)
			.set({
				status: 'active',
				activatedAt: new Date()
			})
			.where(
				and(
					eq(schema.enrollment.userId, proof[0].userId),
					eq(schema.enrollment.courseId, proof[0].courseId)
				)
			);

		return { success: true, message: 'Payment proof approved and enrollment activated' };
	},

	reject: async (event) => {
		await requireAdmin(event);

		const formData = await event.request.formData();
		const proofId = formData.get('proofId') as string;
		const notes = formData.get('notes') as string;

		if (!proofId) {
			return fail(400, { error: 'Missing proof ID' });
		}

		// Update proof status
		await db
			.update(schema.paymentProof)
			.set({
				status: 'rejected',
				notes: notes || null
			})
			.where(eq(schema.paymentProof.id, proofId));

		return { success: true, message: 'Payment proof rejected' };
	}
} satisfies Actions;
