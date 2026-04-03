import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const orgId = params.id;

	// Get organization
	const [organization] = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.id, orgId))
		.limit(1);

	if (!organization) throw error(404, 'Organization not found');
	
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

	if (!membership) throw error(403, 'Forbidden: You are not a member of this organization');

	return {
		membership,
		organization
	};
};
