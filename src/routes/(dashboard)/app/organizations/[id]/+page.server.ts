import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;

	// Check membership
	const membership = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id))
		)
		.limit(1);

	if (membership.length === 0) {
		throw redirect(303, '/app/organizations');
	}

	// Get organization details
	const org = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.id, orgId))
		.limit(1);

	if (!org[0]) {
		throw redirect(303, '/app/organizations');
	}

	// Get member count
	const memberCount = await db
		.select({ count: count() })
		.from(schema.organizationMember)
		.where(eq(schema.organizationMember.orgId, orgId));

	// Get courses count
	const courseCount = await db
		.select({ count: count() })
		.from(schema.course)
		.where(eq(schema.course.orgId, orgId));

	// Get recent members
	const recentMembers = await db
		.select({
			id: schema.organizationMember.id,
			role: schema.organizationMember.role,
			createdAt: schema.organizationMember.createdAt,
			user: {
				fullName: schema.user.fullName,
				username: schema.user.username
			}
		})
		.from(schema.organizationMember)
		.innerJoin(schema.user, eq(schema.organizationMember.userId, schema.user.id))
		.where(eq(schema.organizationMember.orgId, orgId))
		.orderBy(schema.organizationMember.createdAt)
		.limit(5);

	return {
		organization: org[0],
		membership: membership[0],
		stats: {
			memberCount: Number(memberCount[0]?.count || 0),
			courseCount: Number(courseCount[0]?.count || 0)
		},
		recentMembers
	};
};
