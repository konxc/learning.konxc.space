import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export async function createAffiliateAccountForUser(
	userId: string,
	orgId: string,
	role: 'mentor' | 'facilitator'
): Promise<{ accountId: string }> {
	const accountId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

	await db.insert(schema.affiliateAccount).values({
		id: accountId,
		userId,
		orgId,
		role,
		commissionRate: role === 'mentor' ? 25 : 15,
		isActive: true
	});

	const baseUrl = process.env.APP_URL || 'https://naikkelas.id';

	await db.insert(schema.autoAffiliateLink).values({
		id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10))),
		accountId,
		orgId,
		code: `${role}-${userId.slice(0, 8)}`,
		url: `${baseUrl}/ref/${role}-${userId.slice(0, 8)}`,
		isActive: true
	});

	return { accountId };
}

export async function getOrCreateAffiliateAccount(
	userId: string,
	orgId: string,
	role: 'mentor' | 'facilitator'
): Promise<string> {
	const existing = await db
		.select()
		.from(schema.affiliateAccount)
		.where(eq(schema.affiliateAccount.userId, userId))
		.limit(1);

	if (existing[0]) {
		return existing[0].id;
	}

	const result = await createAffiliateAccountForUser(userId, orgId, role);
	return result.accountId;
}
