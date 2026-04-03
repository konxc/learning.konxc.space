import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const { locals, params } = event;
	const user = locals.user;
	if (!user) throw error(401, 'Unauthorized');

	const { membership, organization } = await event.parent();

	const orgId = params.id;
	if (!membership || !organization) {
		throw redirect(303, '/app/organizations');
	}

	// Get member count
	const [memberCount] = await db
		.select({ count: count() })
		.from(schema.organizationMember)
		.where(eq(schema.organizationMember.orgId, orgId));

	// Get courses count
	const [courseCount] = await db
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
		organization,
		membership,
		stats: {
			memberCount: Number(memberCount?.count || 0),
			courseCount: Number(courseCount?.count || 0)
		},
		recentMembers
	};
};
