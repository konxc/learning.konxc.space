import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return { enrollments: [] };
	}

	// Get user's enrollments with course details
	const enrollments = await db
		.select({
			id: schema.enrollment.id,
			status: schema.enrollment.status,
			enrolledAt: schema.enrollment.enrolledAt,
			activatedAt: schema.enrollment.activatedAt,
			completedAt: schema.enrollment.completedAt,
			course: {
				id: schema.course.id,
				title: schema.course.title,
				description: schema.course.description,
				thumbnailUrl: schema.course.thumbnailUrl,
				duration: schema.course.duration,
				price: schema.course.price
			}
		})
		.from(schema.enrollment)
		.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
		.where(eq(schema.enrollment.userId, locals.user.id));

	// Get payment proofs for pending enrollments
	const paymentProofs = await db
		.select({
			courseId: schema.paymentProof.courseId,
			status: schema.paymentProof.status
		})
		.from(schema.paymentProof)
		.where(eq(schema.paymentProof.userId, locals.user.id));

	// Create a map of courseId -> payment proof status
	const proofMap = new Map(paymentProofs.map((p) => [p.courseId, p.status]));

	// Enhance enrollments with payment proof status
	const enrichedEnrollments = enrollments.map((enrollment) => ({
		...enrollment,
		paymentProofStatus: proofMap.get(enrollment.course.id) || null
	}));

	return {
		enrollments: enrichedEnrollments
	};
};
