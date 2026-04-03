import { requireAuth } from '$lib/server/middleware';
import { checkHasOrgRole } from '$lib/server/org-context';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);

	// Check if user is a mentor in any organization
	const isMentor = user.role === 'admin' || (await checkHasOrgRole(user.id, 'mentor'));
	
	// If user is a mentor, redirect to their org-scoped mentor dashboard
	if (isMentor) {
		const memberships = await db
			.select({ orgId: schema.organizationMember.orgId })
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.userId, user.id),
					eq(schema.organizationMember.role, 'mentor')
				)
			)
			.limit(1);
		
		if (memberships.length > 0) {
			throw redirect(302, `/app/organizations/${memberships[0].orgId}/mentor/courses`);
		}
	}

	// Get latest application by user
	const applications = await db
		.select()
		.from(schema.mentorApplication)
		.where(eq(schema.mentorApplication.userId, user.id))
		.orderBy(desc(schema.mentorApplication.createdAt))
		.limit(1);

	const application = applications[0] || null;

	return {
		user,
		application,
		isMentor
	};
};
