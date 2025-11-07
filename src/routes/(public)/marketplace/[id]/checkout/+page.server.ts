import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const load: PageServerLoad = async ({ params, locals }) => {
	const courseId = params.id;

	if (!locals.user) {
		throw redirect(302, `/auth/signin?redirect=/marketplace/${courseId}/checkout`);
	}

	// Provide client key to client for Snap.js
	return {
		courseId,
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
		} catch {}

		const res = await fetch('/api/payments/midtrans/transaction', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ courseId, couponCode })
		});

		if (!res.ok) {
			const err = await res.json().catch(() => ({} as any));
			return fail(res.status, { error: err.error || 'Gagal membuat transaksi' });
		}

		const data = await res.json();
		return {
			success: true,
			...data
		};
	}
};
