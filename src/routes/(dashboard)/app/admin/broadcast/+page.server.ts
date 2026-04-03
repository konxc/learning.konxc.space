import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import { organizationMember } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	// Find the first org where user has mentor/admin/owner role to redirect to broadcast
	const [membership] = await db
		.select({ orgId: organizationMember.orgId })
		.from(organizationMember)
		.where(
			or(
				eq(organizationMember.role, 'owner'),
				eq(organizationMember.role, 'admin'),
				eq(organizationMember.role, 'mentor')
			)
		)
		.limit(1);

	if (membership) {
		throw redirect(302, `/app/organizations/${membership.orgId}/mentor/broadcast`);
	}

	// If user has no org membership, redirect to orgs to create one
	throw redirect(302, '/app/organizations');
};
