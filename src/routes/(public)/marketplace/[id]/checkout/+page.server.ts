import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const courseId = params.id;

	if (!locals.user) {
		throw redirect(302, `/auth/signin?redirect=/marketplace/${courseId}/checkout`);
	}

	// Fetch course details for order summary
	const courses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			thumbnailUrl: schema.course.thumbnailUrl,
			price: schema.course.price,
			orgId: schema.course.orgId
		})
		.from(schema.course)
		.where(eq(schema.course.id, courseId))
		.limit(1);

	if (courses.length === 0) {
		throw redirect(302, '/marketplace');
	}

	return {
		course: courses[0],
		clientKey: privateEnv.MIDTRANS_CLIENT_KEY || publicEnv.PUBLIC_MIDTRANS_CLIENT_KEY || ''
	};
};

export const actions: Actions = {
	default: async ({ fetch, params, locals, request }) => {
		const courseId = params.id;
		if (!locals.user) {
			throw redirect(302, `/auth/signin?redirect=/marketplace/${courseId}/checkout`);
		}

		let couponCode: string | undefined;
		try {
			const form = await request.formData();
			couponCode = (form.get('couponCode') as string) || undefined;
		} catch (e) {
			console.warn('Failed to parse coupon code form:', e);
		}

		const res = await fetch('/api/payments/midtrans/transaction', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ courseId, couponCode })
		});

		if (!res.ok) {
			const err = await res.json().catch(() => ({}) as any);
			return actionFailure(res.status, err.error || 'Gagal membuat transaksi');
		}

		const transaction = await res.json();
		return actionSuccess({
			data: transaction
		});
	}
};
