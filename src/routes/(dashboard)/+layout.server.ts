import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getNavItemsForRole, type WorkspaceContext } from '$lib/server/rbac';
import { db } from '$lib/server/db';
import { eq, desc } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

const ACTIVE_ROLE_COOKIE = 'active-role';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(303, '/auth/signin?redirect=' + url.pathname);
	}

	// 1. Query org memberships with org details
	const orgMemberships = await db
		.select({
			orgId: schema.organizationMember.orgId,
			role: schema.organizationMember.role,
			orgName: schema.organization.name,
			orgSlug: schema.organization.slug,
			orgLogoUrl: schema.organization.logoUrl,
			brandColor: schema.organization.brandColor,
			planType: schema.organization.planType
		})
		.from(schema.organizationMember)
		.innerJoin(schema.organization, eq(schema.organizationMember.orgId, schema.organization.id))
		.where(eq(schema.organizationMember.userId, user.id));

	// Build userOrgs in the shape expected by existing UI components
	const userOrgs = orgMemberships.map((m) => ({
		id: m.orgId,
		name: m.orgName,
		slug: m.orgSlug,
		logoUrl: m.orgLogoUrl,
		brandColor: m.brandColor,
		planType: m.planType,
		role: m.role
	}));

	// 2. Determine activeOrgId:
	//    Priority: URL param orgId → cookie active-workspace → user.lastWorkspaceId → first org
	const urlOrgId = url.searchParams.get('orgId');
	const cookieWorkspace = cookies.get('active-workspace');

	let activeWorkspaceId: string;
	if (urlOrgId && orgMemberships.some((m) => m.orgId === urlOrgId)) {
		activeWorkspaceId = urlOrgId;
	} else if (cookieWorkspace && cookieWorkspace !== 'personal') {
		const valid = orgMemberships.some((m) => m.orgId === cookieWorkspace);
		activeWorkspaceId = valid ? cookieWorkspace : 'personal';
	} else if (user.lastWorkspaceId && user.lastWorkspaceId !== 'personal') {
		const valid = orgMemberships.some((m) => m.orgId === user.lastWorkspaceId);
		activeWorkspaceId = valid ? user.lastWorkspaceId : 'personal';
	} else if (orgMemberships.length > 0 && !cookieWorkspace) {
		// Default to first org only if no explicit personal preference set
		activeWorkspaceId = 'personal';
	} else {
		activeWorkspaceId = 'personal';
	}

	const activeOrg =
		activeWorkspaceId !== 'personal'
			? (userOrgs.find((o) => o.id === activeWorkspaceId) ?? null)
			: null;

	const activeOrgId = activeOrg?.id ?? null;

	// 3. Determine effectiveRole:
	//    - platform admin → 'admin'
	//    - platform bd → 'bd'
	//    - in org context → use org membership role
	//    - fallback → 'user'
	const baseRole = user.role || 'user';
	let effectiveRole: string;

	if (baseRole === 'admin') {
		effectiveRole = 'admin';
	} else if (baseRole === 'bd') {
		effectiveRole = 'bd';
	} else if (activeOrgId) {
		const membership = orgMemberships.find((m) => m.orgId === activeOrgId);
		effectiveRole = membership?.role ?? 'user';
	} else {
		effectiveRole = 'user';
	}

	// 4. Available roles for the switcher (platform-level only)
	let availableRoles: string[] = ['user'];
	if (baseRole === 'admin') {
		availableRoles = ['admin', 'bd', 'user'];
	} else if (baseRole === 'bd') {
		availableRoles = ['bd', 'user'];
	}

	// 5. Active role from cookie (for platform-level role switching)
	const cookieRole = cookies.get(ACTIVE_ROLE_COOKIE);
	let activeRole: string = availableRoles.includes(baseRole) ? baseRole : availableRoles[0];
	if (availableRoles.length > 1 && cookieRole && availableRoles.includes(cookieRole)) {
		activeRole = cookieRole;
	}

	// 6. Build nav items based on effective context
	const rbacRole = activeRole === 'learner' ? 'user' : activeRole;
	const workspaceContext: WorkspaceContext = {
		isPersonal: activeWorkspaceId === 'personal',
		orgId: activeOrg?.id,
		orgName: activeOrg?.name,
		orgRole: activeOrg?.role
	};
	const navItems = getNavItemsForRole(rbacRole, workspaceContext);

	// 7. Notifications
	let notifications: {
		id: string;
		type: string;
		title: string;
		message: string;
		link: string | null;
		read: boolean;
		createdAt: Date;
	}[] = [];
	let unreadCount = 0;
	try {
		notifications = await db
			.select()
			.from(schema.notification)
			.where(eq(schema.notification.userId, user.id))
			.orderBy(desc(schema.notification.createdAt))
			.limit(10);
		unreadCount = notifications.filter((n) => !n.read).length;
	} catch {
		// Notification table might not exist yet
	}

	// 8. Enrich nav items with badges
	const enrichedNavItems = navItems.map((item) => {
		if (item.label === 'Notifications' && unreadCount > 0) {
			return { ...item, badge: unreadCount, badgeColor: 'red' as const };
		}
		return item;
	});

	// 9. Pending grading count for mentor nav badge
	let pendingGradingCount = 0;
	try {
		const mentorMembership = orgMemberships.find(
			(m) => m.orgId === activeOrgId && m.role === 'mentor'
		);
		if (mentorMembership) {
			const mentorCourses = await db
				.select({ id: schema.course.id })
				.from(schema.course)
				.where(eq(schema.course.mentorId, user.id));

			if (mentorCourses.length > 0) {
				const { inArray: inArr, isNull: isNullFn, and: andFn } = await import('drizzle-orm');
				const courseIds = mentorCourses.map((c) => c.id);
				const pending = await db
					.select({ id: schema.submission.id })
					.from(schema.submission)
					.leftJoin(
						schema.submissionGrade,
						eq(schema.submission.id, schema.submissionGrade.submissionId)
					)
					.where(
						andFn(
							eq(schema.submission.type, 'assignment'),
							isNullFn(schema.submissionGrade.id),
							inArr(schema.submission.courseId, courseIds)
						)
					);
				pendingGradingCount = pending.length;
			}
		}
	} catch {
		// Non-blocking
	}

	const finalNavItems = enrichedNavItems.map((item) => {
		if (item.label === 'Grading' && pendingGradingCount > 0) {
			return { ...item, badge: pendingGradingCount, badgeColor: 'yellow' as const };
		}
		return item;
	});

	return {
		user,
		navItems: finalNavItems,
		activeRole,
		availableRoles,
		effectiveRole,
		activeOrgId,
		orgMemberships,
		notifications,
		unreadCount,
		pendingGradingCount,
		workspaces: {
			organizations: userOrgs,
			activeId: activeWorkspaceId,
			activeOrg
		}
	};
};
