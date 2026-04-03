import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, cookies, url }) => {
	const { code } = params;

	if (!code) {
		throw redirect(302, '/app/explore');
	}

	// 1. Find the affiliate link by code
	const [link] = await db
		.select({
			id: schema.autoAffiliateLink.id,
			accountId: schema.autoAffiliateLink.accountId,
			isActive: schema.autoAffiliateLink.isActive
		})
		.from(schema.autoAffiliateLink)
		.where(eq(schema.autoAffiliateLink.code, code))
		.limit(1);

	if (link && link.isActive) {
		// 2. Set affiliate cookie (expires in 30 days)
		cookies.set('nk_affiliate_id', link.accountId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});

		// 3. Increment click count (non-blocking)
		db.update(schema.autoAffiliateLink)
			.set({ clickCount: (link as any).clickCount + 1 })
			.where(eq(schema.autoAffiliateLink.id, link.id))
			.catch(() => {});
	}

	// 4. Redirect to marketplace or the specific course if provided in query
	const redirectTo = url.searchParams.get('redirect') || '/app/explore';
	throw redirect(302, redirectTo);
};
