import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
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
	const user = await requireAuth(event);
	const orgId = event.params.id;

	// Verify user is owner or admin
	const membership = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id))
		)
		.limit(1);

	if (membership.length === 0 || !['owner', 'admin'].includes(membership[0].role)) {
		throw redirect(303, `/app/organizations/${orgId}`);
	}

	// Get organization
	const org = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.id, orgId))
		.limit(1);

	if (!org[0]) {
		throw redirect(303, '/app/organizations');
	}

	return {
		organization: org[0],
		currentPlan: org[0].planType,
		planPrices: PLAN_PRICES
	};
};

export const actions: Actions = {
	upgrade: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;

		const formData = await event.request.formData();
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

		// Save transaction
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
		const user = await requireAuth(event);
		const orgId = event.params.id;

		// Verify owner
		const membership = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, user.id)
				)
			)
			.limit(1);

		if (membership.length === 0 || membership[0].role !== 'owner') {
			return actionFailure(403, 'Only owner can downgrade.');
		}

		await db
			.update(schema.organization)
			.set({ planType: 'free', updatedAt: new Date() })
			.where(eq(schema.organization.id, orgId));

		return actionSuccess({ message: 'Plan downgraded to free.' });
	}
};
