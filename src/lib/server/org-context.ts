import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { organizationMember } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { OrgRole } from '$lib/constants/roles';

const ROLE_HIERARCHY: OrgRole[] = ['member', 'facilitator', 'mentor', 'admin', 'owner'];

export async function requireOrgMembership(
	userId: string,
	orgId: string,
	minRole: OrgRole = 'member'
) {
	const [membership] = await db
		.select()
		.from(organizationMember)
		.where(and(eq(organizationMember.userId, userId), eq(organizationMember.orgId, orgId)))
		.limit(1);

	if (!membership) throw redirect(302, '/app');

	const userRoleIndex = ROLE_HIERARCHY.indexOf(membership.role as OrgRole);
	const minRoleIndex = ROLE_HIERARCHY.indexOf(minRole);

	if (userRoleIndex < minRoleIndex) throw redirect(302, '/app');

	return membership;
}

export function getOrgRoleLevel(role: string): number {
	return ROLE_HIERARCHY.indexOf(role as OrgRole);
}

/**
 * Check if a user has any org membership with one of the specified roles.
 * Returns the first matching membership, or null.
 */
export async function checkHasOrgRole(
	userId: string,
	roles: OrgRole | OrgRole[]
): Promise<boolean> {
	const roleList = Array.isArray(roles) ? roles : [roles];

	const memberships = await db
		.select({ role: organizationMember.role })
		.from(organizationMember)
		.where(eq(organizationMember.userId, userId));

	return memberships.some((m) => roleList.includes(m.role as OrgRole));
}
