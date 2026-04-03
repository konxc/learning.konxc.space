import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { requireOrgAdmin } from '$lib/server/middleware';
import {
	createSnapTransaction,
	type MidtransTransactionRequest
} from '$lib/server/payments/midtrans';
import { encodeBase32LowerCase } from '@oslojs/encoding';

// Plan pricing configuration (in IDR)
const PLAN_PRICES: Record<string, number> = {
	free: 0,
	pro: 99000,
	enterprise: 499000
};

export const load: PageServerLoad = async (event) => {
	const { organization } = await event.parent();
	const orgId = event.params.id;

	const membership = await requireOrgAdmin(event, orgId);

	if (!organization) throw error(404, 'Organization not found');

	return {
		organization,
		currentPlan: organization.planType,
		planPrices: PLAN_PRICES
	};
};

export const actions: Actions = {
	upgrade: async (event) => {
		const { locals, params, request } = event;
		const user = locals.user!;
		const orgId = params.id;

		// Verify membership via centralized helper
		const membership = await requireOrgAdmin(event, orgId);

		const formData = await request.formData();
		const planType = formData.get('planType') as string;

		if (!planType || !['pro', 'enterprise'].includes(planType)) {
			return actionFailure(400, 'Invalid plan type.');
		}

		const price = PLAN_PRICES[planType];
		if (!price) {
			return actionFailure(400, 'Invalid plan price.');
		}

		const transactionId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
		const orderId = `ORG-${orgId}-${Date.now()}`;

		const midtransRequest: MidtransTransactionRequest = {
			orderId,
			amount: price,
			customer: {
				email: user.email || undefined,
				firstName: user.fullName || user.username
			},
			itemDetails: [
				{
					id: planType,
					name: `Organization Plan - ${planType}`,
					price,
					quantity: 1
				}
			],
			expiryMinutes: 60
		};

		const snapResponse = await createSnapTransaction(midtransRequest);

		// Save transaction - explicitly link to orgId
		await db.insert(schema.transaction).values({
			id: transactionId,
			userId: user.id,
			orgId: orgId,
			amount: price,
			status: 'pending',
			paymentType: 'midtrans',
			snapToken: snapResponse.token,
			snapUrl: snapResponse.redirect_url,
			payload: JSON.stringify({ planType, orgId }),
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return actionSuccess({
			data: {
				message: 'Payment initiated',
				snapToken: snapResponse.token,
				redirectUrl: snapResponse.redirect_url
			}
		});
	},

	downgrade: async (event) => {
		const { params } = event;
		const orgId = params.id;

		// Verify ownership via centralized helper
		const membership = await requireOrgAdmin(event, orgId);

		if (membership.role !== 'owner') {
			return actionFailure(403, 'Only owner can downgrade.');
		}

		await db
			.update(schema.organization)
			.set({ planType: 'free', updatedAt: new Date() })
			.where(eq(schema.organization.id, orgId));

		return actionSuccess({ message: 'Plan downgraded to free.' });
	}
};
