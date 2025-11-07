import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ locals, url }) => {
    const user = await requireAuth(locals);

    const courseId = url.searchParams.get('courseId');

    // Get pending enrollments
    const enrollments = await db
        .select({
            id: schema.enrollment.id,
            courseId: schema.enrollment.courseId,
            course: {
                id: schema.course.id,
                title: schema.course.title,
                price: schema.course.price
            }
        })
        .from(schema.enrollment)
        .innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
        .where(and(
            eq(schema.enrollment.userId, user.id),
            eq(schema.enrollment.status, 'pending')
        ));

    // Get payment proofs for these enrollments
    const paymentProofs = await db
        .select()
        .from(schema.paymentProof)
        .where(eq(schema.paymentProof.userId, user.id));

    const proofMap = new Map(paymentProofs.map(p => [p.courseId, p]));

    return {
        enrollments: enrollments.map(e => ({
            ...e,
            paymentProof: proofMap.get(e.courseId)
        })),
        selectedCourseId: courseId
    };
};

export const actions: Actions = {
    uploadProof: async ({ request, locals }) => {
        const user = await requireAuth(locals);

        const formData = await request.formData();
        const courseId = formData.get('courseId') as string;
        const dataBase64 = formData.get('dataBase64') as string;
        const mime = formData.get('mime') as string;
        const size = parseInt(formData.get('size') as string);

        if (!courseId || !dataBase64 || !mime || !size) {
            return fail(400, { error: 'Missing required fields' });
        }

        // Validate size (max 1MB after compression)
        if (size > 1024 * 1024) {
            return fail(400, { error: 'File size exceeds 1MB limit' });
        }

        // Validate mime type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime)) {
            return fail(400, { error: 'Only JPEG, PNG, or WebP images are allowed' });
        }

        // Verify enrollment exists and is pending
        const enrollment = await db
            .select()
            .from(schema.enrollment)
            .where(and(
                eq(schema.enrollment.userId, user.id),
                eq(schema.enrollment.courseId, courseId),
                eq(schema.enrollment.status, 'pending')
            ))
            .limit(1);

        if (enrollment.length === 0) {
            return fail(404, { error: 'Enrollment not found' });
        }

        // Check if proof already exists
        const existingProof = await db
            .select()
            .from(schema.paymentProof)
            .where(and(
                eq(schema.paymentProof.userId, user.id),
                eq(schema.paymentProof.courseId, courseId)
            ))
            .limit(1);

        const proofId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

        if (existingProof.length > 0) {
            // Update existing proof
            await db
                .update(schema.paymentProof)
                .set({
                    dataBase64,
                    mime,
                    size,
                    status: 'pending',
                    notes: null
                })
                .where(eq(schema.paymentProof.id, existingProof[0].id));
        } else {
            // Create new proof
            await db.insert(schema.paymentProof).values({
                id: proofId,
                userId: user.id,
                courseId,
                dataBase64,
                mime,
                size,
                status: 'pending'
            });
        }

        throw redirect(303, '/dashboard/payments?success=uploaded');
    }
} satisfies Actions;

