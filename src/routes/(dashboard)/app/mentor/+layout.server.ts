import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { organizationMember } from '$lib/server/db/schema';
import { and, eq, or } from 'drizzle-orm';

export const load = async ({ locals, url }) => {
	if (!locals.user) throw redirect(302, '/auth/signin');

	const [membership] = await db
		.select({ orgId: organizationMember.orgId })
		.from(organizationMember)
		.where(
			and(
				eq(organizationMember.userId, locals.user.id),
				or(
					eq(organizationMember.role, 'mentor'),
					eq(organizationMember.role, 'admin'),
					eq(organizationMember.role, 'owner')
				)
			)
		)
		.limit(1);

	if (membership) {
		const newPath = url.pathname.replace('/app/mentor', `/app/organizations/${membership.orgId}/mentor`);
		// If the root was requested, go to courses as default
		const finalPath = newPath === `/app/organizations/${membership.orgId}/mentor` 
			? `${newPath}/courses` 
			: newPath;
		throw redirect(302, finalPath);
	}

	throw redirect(302, '/app/overview');
};
