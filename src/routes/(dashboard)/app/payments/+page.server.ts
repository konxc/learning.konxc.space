import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { actionSuccess, actionFailure } from '$lib/server/actions';
import { snap } from '$lib/server/midtrans';
import { MIDTRANS_CLIENT_KEY } from '$env/static/private';
import { validateCoupon, applyCoupon } from '$lib/server/coupon';

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
		.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.status, 'pending')));

	// Get payment proofs for these enrollments
	const paymentProofs = await db
		.select()
		.from(schema.paymentProof)
		.where(eq(schema.paymentProof.userId, user.id));

	const proofMap = new Map(paymentProofs.map((p) => [p.courseId, p]));

	return {
		enrollments: enrollments.map((e) => ({
			...e,
			paymentProof: proofMap.get(e.courseId)
		})),
		selectedCourseId: courseId,
		midtransClientKey: MIDTRANS_CLIENT_KEY
	};
};

export const actions: Actions = {
	uploadProof: async ({ request, locals, url }) => {
		const user = await requireAuth(locals);

		const formData = await request.formData();
		const courseId = formData.get('courseId') as string;
		const dataBase64 = formData.get('dataBase64') as string;
		const mime = formData.get('mime') as string;
		const size = parseInt(formData.get('size') as string);

		if (!courseId || !dataBase64 || !mime || !size) {
			return actionFailure(400, 'Missing required fields');
		}

		// Validate size (max 1MB after compression)
		if (size > 1024 * 1024) {
			return actionFailure(400, 'File size exceeds 1MB limit');
		}

		// Validate mime type
		if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime)) {
			return actionFailure(400, 'Only JPEG, PNG, or WebP images are allowed');
		}

		// Verify enrollment exists and is pending
		const enrollment = await db
			.select()
			.from(schema.enrollment)
			.where(
				and(
					eq(schema.enrollment.userId, user.id),
					eq(schema.enrollment.courseId, courseId),
					eq(schema.enrollment.status, 'pending')
				)
			)
			.limit(1);

		if (enrollment.length === 0) {
			return actionFailure(404, 'Enrollment not found');
		}

		// Check if proof already exists
		const existingProof = await db
			.select()
			.from(schema.paymentProof)
			.where(
				and(eq(schema.paymentProof.userId, user.id), eq(schema.paymentProof.courseId, courseId))
			)
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

		throw redirect(303, '/app/payments?success=uploaded');
	},

	createOnlineTransaction: async ({ request, locals, url }) => {
		const user = await requireAuth(locals);
		const formData = await request.formData();
		const courseId = formData.get('courseId') as string;
		const couponCodeInput = (formData.get('couponCode') as string) || '';

		if (!courseId) {
			return actionFailure(400, 'Course ID is required');
		}

		// 1. Get Course details
		const courseResult = await db
			.select()
			.from(schema.course)
			.where(eq(schema.course.id, courseId))
			.limit(1);

		const course = courseResult[0];

		if (!course) {
			console.error('Course not found:', courseId);
			return actionFailure(404, 'Kursus tidak ditemukan');
		}

		if (!course.price || course.price <= 0) {
			console.error('Invalid course price:', course.price);
			return actionFailure(400, 'Kursus ini tidak dapat dibeli secara online');
		}

		// 2. Apply coupon if provided
		let finalAmount = course.price;
		let couponData: { id: string; discountAmount: number } | null = null;

		if (couponCodeInput) {
			const couponResult = await validateCoupon(couponCodeInput, course.price, courseId);
			if (couponResult.isValid && couponResult.coupon) {
				finalAmount = couponResult.finalPrice;
				couponData = {
					id: couponResult.coupon.id,
					discountAmount: couponResult.discountAmount
				};
			}
		}

		// 3. Generate Order ID
		const orderId = `NC-${encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(5))).toUpperCase()}`;
		const baseUrl = url.origin;

		// 4. Create Midtrans Transaction
		const parameter = {
			transaction_details: {
				order_id: orderId,
				gross_amount: finalAmount
			},
			customer_details: {
				first_name: user.fullName || user.username,
				email: user.email,
				phone: user.phone
			},
			item_details: [
				{
					id: course.id,
					price: finalAmount,
					quantity: 1,
					name: course.title
				}
			],
			callbacks: {
				finish: `${baseUrl}/app/payments?status=success&orderId=${orderId}`,
				error: `${baseUrl}/app/payments?status=error`,
				unfinish: `${baseUrl}/app/payments?status=pending`
			}
		};

		try {
			const transactionRecord = await snap.createTransaction(parameter);

			// 5. Save Transaction to DB
			await db.insert(schema.transaction).values({
				id: orderId,
				userId: user.id,
				courseId: course.id,
				amount: finalAmount,
				snapToken: transactionRecord.token,
				snapUrl: transactionRecord.redirect_url,
				status: 'pending'
			});

			// 6. Record coupon usage if applied
			if (couponData) {
				await applyCoupon(
					couponData.id,
					user.id,
					courseId,
					course.price,
					couponData.discountAmount
				);
			}

			return actionSuccess({
				data: {
					orderId,
					snapToken: transactionRecord.token,
					redirectUrl: transactionRecord.redirect_url
				}
			});
		} catch (e) {
			console.error('Midtrans Error:', e);
			return actionFailure(500, 'Gagal membuat transaksi pembayaran');
		}
	}
} satisfies Actions;
