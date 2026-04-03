import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/middleware';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);
	throw redirect(302, '/app/mentor/broadcast');
};
