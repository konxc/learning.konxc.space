import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { User } from './db/schema';
import { db } from './db';
import * as schema from './db/schema';
import { eq, and } from 'drizzle-orm';

export async function requireAuth(eventOrLocals: RequestEvent | { user: any }) {
	const user = 'locals' in eventOrLocals ? eventOrLocals.locals.user : eventOrLocals.user;

	if (!user) {
		throw redirect(303, '/auth/signin');
	}
	return user as User;
}

export async function requireRole(
	eventOrLocals: RequestEvent | { user: any },
	role: 'admin' | 'user'
) {
	const user = await requireAuth(eventOrLocals);

	if (role === 'admin' && user.role !== 'admin') {
		throw redirect(303, '/app');
	}

	return user;
}

/** Require user to have one of the specified roles */
export async function requireAnyRole(eventOrLocals: RequestEvent | { user: any }, roles: string[]) {
	const user = await requireAuth(eventOrLocals);

	if (!roles.includes(user.role)) {
		throw redirect(303, '/app');
	}

	return user;
}

export async function requireAdmin(eventOrLocals: RequestEvent | { user: any }) {
	return requireRole(eventOrLocals, 'admin');
}

/** Require platform admin — explicit alias for clarity */
export async function requirePlatformAdmin(eventOrLocals: RequestEvent | { user: any }) {
	const user = await requireAuth(eventOrLocals);
	if (user.role !== 'admin') throw redirect(303, '/app');
	return user;
}

// ─── Organization Permission Checks ───────────────────────────────────────────

export interface OrgMembership {
	id: string;
	orgId: string;
	userId: string;
	role: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Verify user is a member of an organization
 */
export async function requireOrgMember(event: RequestEvent, orgId: string): Promise<OrgMembership> {
	const user = await requireAuth(event);

	const [membership] = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id))
		)
		.limit(1);

	if (!membership) {
		throw redirect(303, '/app/organizations');
	}

	return membership as OrgMembership;
}

/**
 * Verify user has one of the specified org roles
 */
export async function requireOrgRole(
	event: RequestEvent,
	orgId: string,
	roles: string[]
): Promise<OrgMembership> {
	const membership = await requireOrgMember(event, orgId);

	if (!roles.includes(membership.role)) {
		throw redirect(303, `/app/organizations/${orgId}`);
	}

	return membership;
}

/**
 * Check if org membership has a specific role (non-throwing)
 */
export function hasOrgRole(membership: OrgMembership | null, roles: string[]): boolean {
	return membership !== null && roles.includes(membership.role);
}

/**
 * Common org role checks
 */
export function isOrgOwner(membership: OrgMembership | null): boolean {
	return hasOrgRole(membership, ['owner']);
}

export function isOrgAdmin(membership: OrgMembership | null): boolean {
	return hasOrgRole(membership, ['owner', 'admin']);
}
