import { redirect } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, sum } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	const links = await db
		.select()
		.from(schema.affiliateLink)
		.where(eq(schema.affiliateLink.userId, user.id))
		.orderBy(desc(schema.affiliateLink.createdAt));

	const sales = await db
		.select()
		.from(schema.affiliateSale)
		.where(eq(schema.affiliateSale.userId, user.id))
		.orderBy(desc(schema.affiliateSale.createdAt))
		.limit(20);

	const stats = await db
		.select({
			totalSales: sum(schema.affiliateSale.saleAmount),
			totalCommission: sum(schema.affiliateSale.commissionAmount)
		})
		.from(schema.affiliateSale)
		.where(eq(schema.affiliateSale.userId, user.id));

	const platformStats = await db
		.select({
			platform: schema.affiliateSale.platform,
			count: schema.affiliateSale.id,
			total: sum(schema.affiliateSale.saleAmount)
		})
		.from(schema.affiliateSale)
		.where(eq(schema.affiliateSale.userId, user.id))
		.groupBy(schema.affiliateSale.platform);

	return {
		links,
		sales,
		stats: {
			totalSales: stats[0]?.totalSales || 0,
			totalCommission: stats[0]?.totalCommission || 0,
			linkCount: links.length,
			saleCount: sales.length
		},
		platformStats
	};
};

export const actions: Actions = {
	addLink: async ({ request, locals }) => {
		const user = await requireAuth(locals);

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const platform = formData.get('platform') as string;
		const url = formData.get('url') as string;
		const productPrice = formData.get('productPrice') as string;
		const commissionRate = formData.get('commissionRate') as string;

		if (!name || !platform || !url) {
			return { success: false, error: 'Name, platform, and URL are required' };
		}

		const id = crypto.randomUUID();
		await db.insert(schema.affiliateLink).values({
			id,
			userId: user.id,
			name,
			platform,
			url,
			productPrice: productPrice ? parseInt(productPrice) : null,
			commissionRate: commissionRate ? parseInt(commissionRate) : null,
			status: 'active'
		});

		return { success: true };
	},

	addSale: async ({ request, locals }) => {
		const user = await requireAuth(locals);

		const formData = await request.formData();
		const affiliateLinkId = formData.get('affiliateLinkId') as string;
		const productName = formData.get('productName') as string;
		const platform = formData.get('platform') as string;
		const saleAmount = formData.get('saleAmount') as string;
		const commissionAmount = formData.get('commissionAmount') as string;
		const transactionId = formData.get('transactionId') as string;
		const notes = formData.get('notes') as string;

		if (!productName || !platform || !saleAmount) {
			return { success: false, error: 'Product name, platform, and amount are required' };
		}

		const amount = parseInt(saleAmount);
		const commission = commissionAmount ? parseInt(commissionAmount) : Math.round(amount * 0.1);

		const id = crypto.randomUUID();
		await db.insert(schema.affiliateSale).values({
			id,
			userId: user.id,
			affiliateLinkId: affiliateLinkId || null,
			productName,
			platform,
			saleAmount: amount,
			commissionAmount: commission,
			commissionRate: Math.round((commission / amount) * 100),
			transactionId: transactionId || null,
			notes: notes || null,
			status: 'confirmed',
			recordedAt: new Date()
		});

		return { success: true };
	},

	deleteLink: async ({ request, locals }) => {
		const user = await requireAuth(locals);

		const formData = await request.formData();
		const linkId = formData.get('linkId') as string;

		if (!linkId) {
			return { success: false, error: 'Link ID required' };
		}

		await db
			.update(schema.affiliateLink)
			.set({ status: 'inactive' })
			.where(eq(schema.affiliateLink.id, linkId));

		return { success: true };
	}
};
