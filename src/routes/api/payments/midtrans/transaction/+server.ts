import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { createSnapTransaction } from '$lib/server/payments/midtrans';
import { validateCoupon, applyCoupon } from '$lib/server/coupon';

export const POST: RequestHandler = async (event) => {
	const user = await requireAuth(event);
	const data = await event.request.json().catch(() => ({} as any));
	const courseId = data.courseId as string | undefined;
	const couponCode = (data.couponCode as string | undefined) || undefined;

	if (!courseId) {
		return new Response(JSON.stringify({ error: 'courseId is required' }), { status: 400 });
	}

	// Ensure course exists
	const courseRows = await db
		.select()
		.from(schema.course)
		.where(eq(schema.course.id, courseId))
		.limit(1);
	if (courseRows.length === 0) {
		return new Response(JSON.stringify({ error: 'Course not found' }), { status: 404 });
	}
	const course = courseRows[0];

	// Check existing active or pending enrollment to prevent duplicates
	const existing = await db
		.select()
		.from(schema.enrollment)
		.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.courseId, courseId)))
		.limit(1);
	if (existing.length > 0 && existing[0].status === 'active') {
		return new Response(JSON.stringify({ error: 'Already enrolled' }), { status: 400 });
	}

	let finalPrice = course.price;
	let couponId: string | null = null;
	let discountAmount = 0;

	if (couponCode) {
		const validation = await validateCoupon(couponCode, course.price, courseId);
		if (!validation.isValid) {
			return new Response(JSON.stringify({ error: validation.error || 'Invalid coupon' }), { status: 400 });
		}
		finalPrice = validation.finalPrice;
		discountAmount = validation.discountAmount;
		couponId = validation.coupon!.id;
	}

	// If final price is zero, instantly enroll without Midtrans
	if (finalPrice === 0) {
		const enrollmentId = crypto.randomUUID();
		await db.insert(schema.enrollment).values({
			id: enrollmentId,
			userId: user.id,
			courseId: course.id,
			couponId,
			status: 'active',
			activatedAt: new Date()
		});
		if (couponId) await applyCoupon(couponId, user.id, course.id, course.price, discountAmount);
		return new Response(
			JSON.stringify({ method: 'free', enrollmentId, redirect_url: '/dashboard' }),
			{ status: 200 }
		);
	}

	// Create/ensure pending enrollment
	let enrollmentId = existing[0]?.id ?? crypto.randomUUID();
	if (!existing.length) {
		await db.insert(schema.enrollment).values({
			id: enrollmentId,
			userId: user.id,
			courseId: course.id,
			couponId,
			status: 'pending'
		});
	}

	// Create transaction in Midtrans
	const snap = await createSnapTransaction({
		orderId: enrollmentId,
		amount: finalPrice,
		customer: {
			firstName: user.fullName || user.username,
			email: user.email || undefined,
			phone: user.phone || undefined
		},
		itemDetails: [
			{ id: course.id, price: finalPrice, quantity: 1, name: course.title }
		],
		expiryMinutes: 60
	});

	return new Response(
		JSON.stringify({
			enrollmentId,
			snapToken: snap.token,
			redirect_url: snap.redirect_url
		}),
		{ status: 200 }
	);
};
