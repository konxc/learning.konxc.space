import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		return { membership: null, organization: null };
	}

	const orgId = params.id;

	// Get organization
	const [organization] = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.id, orgId))
		.limit(1);

	if (!organization) {
		return { membership: null, organization: null };
	}

	// Get membership
	const [membership] = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(
				eq(schema.organizationMember.orgId, orgId),
				eq(schema.organizationMember.userId, locals.user.id)
			)
		)
		.limit(1);

	return {
		membership: membership ?? null,
		organization
	};
};
