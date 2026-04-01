import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, count, desc } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Get organizations user is a member of
	const memberships = await db
		.select({
			id: schema.organizationMember.id,
			role: schema.organizationMember.role,
			createdAt: schema.organizationMember.createdAt,
			organization: {
				id: schema.organization.id,
				name: schema.organization.name,
				slug: schema.organization.slug,
				logoUrl: schema.organization.logoUrl,
				brandColor: schema.organization.brandColor,
				planType: schema.organization.planType,
				createdAt: schema.organization.createdAt
			}
		})
		.from(schema.organizationMember)
		.innerJoin(schema.organization, eq(schema.organizationMember.orgId, schema.organization.id))
		.where(eq(schema.organizationMember.userId, user.id))
		.orderBy(desc(schema.organizationMember.createdAt));

	// Get member counts for each org
	const orgCounts: Record<string, number> = {};
	for (const m of memberships) {
		const result = await db
			.select({ count: count() })
			.from(schema.organizationMember)
			.where(eq(schema.organizationMember.orgId, m.organization.id));
		orgCounts[m.organization.id] = Number(result[0]?.count || 0);
	}

	// Get course counts for each org
	const courseCounts: Record<string, number> = {};
	for (const m of memberships) {
		const result = await db
			.select({ count: count() })
			.from(schema.course)
			.where(eq(schema.course.orgId, m.organization.id));
		courseCounts[m.organization.id] = Number(result[0]?.count || 0);
	}

	// Check if user has pending invitations
	const pendingInvitations = await db
		.select({
			id: schema.organizationInvitation.id,
			role: schema.organizationInvitation.role,
			createdAt: schema.organizationInvitation.createdAt,
			organization: {
				name: schema.organization.name,
				logoUrl: schema.organization.logoUrl
			}
		})
		.from(schema.organizationInvitation)
		.innerJoin(schema.organization, eq(schema.organizationInvitation.orgId, schema.organization.id))
		.where(eq(schema.organizationInvitation.email, user.email || ''));

	return {
		memberships,
		orgCounts,
		courseCounts,
		pendingInvitations
	};
};
