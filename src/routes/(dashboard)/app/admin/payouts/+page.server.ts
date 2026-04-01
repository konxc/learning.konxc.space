import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, gt, desc, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { actionSuccess, actionFailure } from '$lib/server/actions';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	if (!['admin', 'owner'].includes(user.role)) {
		throw error(403, 'Forbidden');
	}

	// Get all affiliate accounts with pending payouts
	const pendingAccounts = await db
		.select({
			account: schema.affiliateAccount,
			user: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email
			}
		})
		.from(schema.affiliateAccount)
		.innerJoin(schema.user, eq(schema.affiliateAccount.userId, schema.user.id))
		.where(gt(schema.affiliateAccount.pendingPayout, 0))
		.orderBy(desc(schema.affiliateAccount.pendingPayout));

	// Get recently processed payouts (all accounts with paidOut > 0)
	const processedAccounts = await db
		.select({
			account: schema.affiliateAccount,
			user: {
				id: schema.user.id,
				username: schema.user.username,
				fullName: schema.user.fullName,
				email: schema.user.email
			}
		})
		.from(schema.affiliateAccount)
		.innerJoin(schema.user, eq(schema.affiliateAccount.userId, schema.user.id))
		.where(gt(schema.affiliateAccount.paidOut, 0))
		.orderBy(desc(schema.affiliateAccount.paidOut))
		.limit(20);

	// Summary stats
	const allAccounts = await db.select().from(schema.affiliateAccount);
	const totalPending = allAccounts.reduce((sum, a) => sum + (a.pendingPayout ?? 0), 0);
	const totalPaid = allAccounts.reduce((sum, a) => sum + (a.paidOut ?? 0), 0);

	return {
		pendingAccounts,
		processedAccounts,
		stats: {
			totalPending,
			totalPaid,
			totalAccounts: allAccounts.length
		}
	};
};

export const actions: Actions = {
	approvePayout: async (event) => {
		const user = await requireAuth(event);

		if (!['admin', 'owner'].includes(user.role)) {
			throw error(403, 'Forbidden');
		}

		const formData = await event.request.formData();
		const accountId = formData.get('accountId') as string;
		const amountStr = formData.get('amount') as string;

		if (!accountId || !amountStr) {
			return actionFailure(400, 'Account ID and amount are required');
		}

		const amount = parseInt(amountStr, 10);
		if (!Number.isFinite(amount) || amount <= 0) {
			return actionFailure(400, 'Invalid amount');
		}

		// Get current account
		const account = await db
			.select()
			.from(schema.affiliateAccount)
			.where(eq(schema.affiliateAccount.id, accountId))
			.limit(1);

		if (!account[0]) {
			return actionFailure(404, 'Account not found');
		}

		const currentPending = account[0].pendingPayout ?? 0;
		if (amount > currentPending) {
			return actionFailure(400, 'Amount exceeds pending payout');
		}

		// Process payout
		await db
			.update(schema.affiliateAccount)
			.set({
				pendingPayout: currentPending - amount,
				paidOut: (account[0].paidOut ?? 0) + amount,
				updatedAt: new Date()
			})
			.where(eq(schema.affiliateAccount.id, accountId));

		// Notify the affiliate
		await db.insert(schema.notification).values({
			id: crypto.randomUUID(),
			userId: account[0].userId,
			type: 'system',
			title: 'Payout Disetujui',
			message: `Payout sebesar Rp ${amount.toLocaleString('id-ID')} telah disetujui dan sedang diproses. Mohon tunggu 1-3 hari kerja untuk transfer.`,
			link: '/app/affiliate',
			read: false
		});

		return actionSuccess({ message: 'Payout approved' });
	}
} satisfies Actions;
