import { redirect } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, sum, sql, and, gte } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const tab = event.url.searchParams.get('tab') || 'links';

	// 30 hari ke belakang untuk grafik tren
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const [statsData, platformStats, trendData, affiliateAccount] = await Promise.all([
		db
			.select({
				totalSales: sum(schema.affiliateSale.saleAmount),
				totalCommission: sum(schema.affiliateSale.commissionAmount)
			})
			.from(schema.affiliateSale)
			.where(eq(schema.affiliateSale.userId, user.id)),
		db
			.select({
				platform: schema.affiliateSale.platform,
				count: schema.affiliateSale.id,
				total: sum(schema.affiliateSale.saleAmount)
			})
			.from(schema.affiliateSale)
			.where(eq(schema.affiliateSale.userId, user.id))
			.groupBy(schema.affiliateSale.platform),
		// Sales 30 hari terakhir untuk grafik tren
		db
			.select({
				date: sql<string>`date(${schema.affiliateSale.createdAt} / 1000, 'unixepoch')`,
				commission: sum(schema.affiliateSale.commissionAmount),
				sales: sum(schema.affiliateSale.saleAmount)
			})
			.from(schema.affiliateSale)
			.where(
				and(
					eq(schema.affiliateSale.userId, user.id),
					gte(schema.affiliateSale.createdAt, thirtyDaysAgo)
				)
			)
			.groupBy(sql`date(${schema.affiliateSale.createdAt} / 1000, 'unixepoch')`)
			.orderBy(sql`date(${schema.affiliateSale.createdAt} / 1000, 'unixepoch')`),
		// Affiliate account untuk payout info
		db
			.select()
			.from(schema.affiliateAccount)
			.where(eq(schema.affiliateAccount.userId, user.id))
			.limit(1)
	]);

	const [allLinks, allSales] = await Promise.all([
		db.select().from(schema.affiliateLink).where(eq(schema.affiliateLink.userId, user.id)),
		db.select().from(schema.affiliateSale).where(eq(schema.affiliateSale.userId, user.id))
	]);

	const [links, sales] =
		tab === 'links'
			? [
					await db
						.select()
						.from(schema.affiliateLink)
						.where(eq(schema.affiliateLink.userId, user.id))
						.orderBy(desc(schema.affiliateLink.createdAt)),
					[]
				]
			: tab === 'sales'
				? [
						[],
						await db
							.select()
							.from(schema.affiliateSale)
							.where(eq(schema.affiliateSale.userId, user.id))
							.orderBy(desc(schema.affiliateSale.createdAt))
							.limit(20)
					]
				: [[], []];

	// Build 30-day trend array (fill missing dates with 0)
	const trendMap = new Map<string, { commission: number; sales: number }>();
	for (const row of trendData) {
		trendMap.set(row.date, {
			commission: Number(row.commission ?? 0),
			sales: Number(row.sales ?? 0)
		});
	}
	const trend: { date: string; commission: number; sales: number }[] = [];
	for (let i = 29; i >= 0; i--) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		const key = d.toISOString().slice(0, 10);
		trend.push({ date: key, ...(trendMap.get(key) ?? { commission: 0, sales: 0 }) });
	}

	const account = affiliateAccount[0] ?? null;

	return {
		links,
		sales,
		stats: {
			totalSales: statsData[0]?.totalSales || 0,
			totalCommission: statsData[0]?.totalCommission || 0,
			linkCount: allLinks.length,
			saleCount: allSales.length
		},
		platformStats,
		trend,
		payout: account
			? {
					pendingPayout: account.pendingPayout ?? 0,
					paidOut: account.paidOut ?? 0,
					totalEarnings: account.totalEarnings ?? 0,
					bankName: account.bankName,
					bankAccountNumber: account.bankAccountNumber,
					bankAccountName: account.bankAccountName,
					tier: account.tier ?? 'bronze'
				}
			: null,
		tab
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

		// Update affiliate account totals
		if (affiliateLinkId) {
			// Find the affiliate link to get the account ID
			const affiliateLink = await db.query.affiliateLink.findFirst({
				where: eq(schema.affiliateLink.id, affiliateLinkId)
			});

			if (affiliateLink) {
				// Update the affiliate account totals
				await db
					.update(schema.affiliateAccount)
					.set({
						totalEarnings: sql`${schema.affiliateAccount.totalEarnings} + ${commission}`,
						pendingPayout: sql`${schema.affiliateAccount.pendingPayout} + ${commission}`,
						updatedAt: new Date()
					})
					.where(eq(schema.affiliateAccount.userId, user.id));
			}
		}

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
	},

	requestPayout: async ({ locals }) => {
		const user = await requireAuth(locals);

		const account = await db
			.select()
			.from(schema.affiliateAccount)
			.where(eq(schema.affiliateAccount.userId, user.id))
			.limit(1);

		if (!account[0]) {
			return { success: false, error: 'Affiliate account tidak ditemukan' };
		}

		const pending = account[0].pendingPayout ?? 0;
		const MINIMUM_PAYOUT = 100000;

		if (pending < MINIMUM_PAYOUT) {
			return {
				success: false,
				error: `Saldo minimum payout Rp 100.000. Saldo kamu: Rp ${pending.toLocaleString('id-ID')}`
			};
		}

		await db.insert(schema.notification).values({
			id: crypto.randomUUID(),
			userId: user.id,
			type: 'system',
			title: 'Permintaan Payout Diterima',
			message: `Permintaan payout Rp ${pending.toLocaleString('id-ID')} sedang diproses. Tim kami akan menghubungi dalam 1-3 hari kerja.`,
			read: false
		});

		return { success: true };
	}
};
