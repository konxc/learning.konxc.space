import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateCoupon } from '$lib/server/coupon';

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { code, originalPrice, courseId } = await event.request.json();

	if (!code || typeof code !== 'string') {
		return json({ error: 'Coupon code is required' }, { status: 400 });
	}

	if (!originalPrice || typeof originalPrice !== 'number') {
		return json({ error: 'Original price is required' }, { status: 400 });
	}

	const result = await validateCoupon(code, originalPrice, courseId);

	return json(result);
};
