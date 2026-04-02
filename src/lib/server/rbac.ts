import type { User } from './db/schema';
import {
	type UserRole,
	type OrgRole,
	type WorkspaceRole,
	ORG_ROLES,
	WORKSPACE_ROLES
} from '$lib/constants/roles';

export { type UserRole, type OrgRole, type WorkspaceRole, ORG_ROLES, WORKSPACE_ROLES };

export function hasRole(user: User | null, role: UserRole | UserRole[]): boolean {
	if (!user) return false;
	if (Array.isArray(role)) {
		return role.includes(user.role as UserRole);
	}
	return user.role === role;
}

export function isAdmin(user: User | null): boolean {
	return hasRole(user, 'admin');
}

/** Platform-level admin check */
export function isPlatformAdmin(user: User | null): boolean {
	return user?.role === 'admin';
}

/** Platform-level BD check */
export function isBD(user: User | null): boolean {
	return user?.role === 'bd';
}

// isMentor and isFacilitator are now only via org context
// Use hasOrgPermission() for org-level checks

export function isUser(user: User | null): boolean {
	return user !== null;
}

export interface NavItem {
	label: string;
	href: string;
	icon?: string;
	category?: 'dashboard' | 'workspace' | 'learning' | 'management' | 'admin' | 'platform' | 'crm';
	badge?: number | string;
	badgeColor?: 'blue' | 'red' | 'green' | 'yellow';
}

export interface NavGroup {
	label?: string;
	items: NavItem[];
}

export interface WorkspaceContext {
	isPersonal: boolean;
	orgId?: string;
	orgName?: string;
	orgRole?: string;
}

export function getNavItemsForRole(role: string, context?: WorkspaceContext): NavItem[] {
	// If in organization context, use org-specific navigation
	if (context && !context.isPersonal && context.orgRole) {
		return getOrgNavItems(context.orgRole, context);
	}

	const baseNav: NavItem[] = [
		{ label: 'Overview', href: '/app/overview', icon: 'dashboard', category: 'dashboard' }
	];

	const workspaceNav: NavItem[] = [
		{ label: 'Explore', href: '/app/explore', icon: 'search', category: 'workspace' },
		{
			label: 'My Learning',
			href: '/app/learning/courses',
			icon: 'book-open',
			category: 'workspace'
		},
		{ label: 'Forum', href: '/app/discussion', icon: 'message-square', category: 'workspace' },
		{ label: 'Achievements', href: '/app/achievements', icon: 'award', category: 'workspace' },
		{ label: 'Leaderboard', href: '/app/leaderboard', icon: 'trophy', category: 'workspace' },
		{ label: 'Organizations', href: '/app/organizations', icon: 'building', category: 'workspace' },
		{ label: 'Notifications', href: '/app/notifications', icon: 'bell', category: 'workspace' }
	];

	if (role === 'admin') {
		return [
			...baseNav,
			...workspaceNav,
			{ label: 'Course Builder', href: '/app/admin/courses', icon: 'hammer', category: 'platform' },
			{ label: 'Cohorts', href: '/app/admin/cohorts', icon: 'calendar', category: 'platform' },
			{ label: 'Users & Roles', href: '/app/admin/users', icon: 'users', category: 'platform' },
			{ label: 'Coupons', href: '/app/admin/coupons', icon: 'coupon', category: 'platform' },
			{
				label: 'Mentor Apps',
				href: '/app/admin/mentor-applications',
				icon: 'file-text',
				badgeColor: 'yellow',
				category: 'platform'
			},
			{ label: 'Payments', href: '/app/admin/payments', icon: 'credit-card', category: 'platform' },
			{ label: 'Payouts', href: '/app/admin/payouts', icon: 'wallet', category: 'platform' },
			{ label: 'Partners', href: '/app/admin/partner', icon: 'building', category: 'platform' },
			{ label: 'Reports', href: '/app/admin/reports', icon: 'chart', category: 'platform' },
			{ label: 'Reviews', href: '/app/admin/reviews', icon: 'star', category: 'platform' },
			{
				label: 'Broadcast',
				href: '/app/mentor/broadcast',
				icon: 'megaphone',
				category: 'platform'
			},
			{ label: 'Plugins', href: '/app/admin/plugins', icon: 'puzzle', category: 'platform' },
			{ label: 'Waiting List', href: '/app/crm/waiting-list', icon: 'clock', category: 'crm' }
		];
	}

	if (role === 'bd') {
		return [
			...baseNav,
			{ label: 'Waiting List', href: '/app/crm/waiting-list', icon: 'clock', category: 'crm' }
		];
	}

	// Default: regular user / learner
	return [
		...baseNav,
		...workspaceNav,
		{ label: 'Affiliate', href: '/app/affiliate', icon: 'wallet', category: 'workspace' }
	];
}

// Organization-specific navigation based on org role
function getOrgNavItems(orgRole: string, context: WorkspaceContext): NavItem[] {
	const orgId = context.orgId || '';

	const baseOrgNav: NavItem[] = [
		{
			label: 'Overview',
			href: `/app/organizations/${orgId}`,
			icon: 'building',
			category: 'dashboard'
		}
	];

	const learningNav: NavItem[] = [
		{ label: 'Explore', href: '/app/explore', icon: 'search', category: 'workspace' },
		{
			label: 'My Learning',
			href: '/app/learning/courses',
			icon: 'book-open',
			category: 'workspace'
		},
		{ label: 'Forum', href: '/app/discussion', icon: 'message-square', category: 'workspace' }
	];

	if (orgRole === 'owner' || orgRole === 'admin') {
		return [
			...baseOrgNav,
			...learningNav,
			{
				label: 'Members',
				href: `/app/organizations/${orgId}/members`,
				icon: 'users',
				category: 'management'
			},
			{
				label: 'Invite',
				href: `/app/organizations/${orgId}/invite`,
				icon: 'user-plus',
				category: 'management'
			},
			{
				label: 'Billing',
				href: `/app/organizations/${orgId}/billing`,
				icon: 'credit-card',
				category: 'management'
			},
			{
				label: 'Analytics',
				href: `/app/organizations/${orgId}/analytics`,
				icon: 'chart',
				category: 'management'
			},
			{
				label: 'Course Builder',
				href: '/app/mentor/courses',
				icon: 'hammer',
				category: 'platform'
			},
			{ label: 'Reviews', href: '/app/admin/reviews', icon: 'star', category: 'platform' },
			{ label: 'Cohorts', href: '/app/admin/cohorts', icon: 'calendar', category: 'platform' },
			{ label: 'Reports', href: '/app/admin/reports', icon: 'chart', category: 'platform' },
			{
				label: 'Broadcast',
				href: '/app/mentor/broadcast',
				icon: 'megaphone',
				category: 'platform'
			},
			{ label: 'Job Board', href: '/app/jobs/new', icon: 'briefcase', category: 'platform' },
			{
				label: 'Job Applications',
				href: '/app/jobs/applications',
				icon: 'file-text',
				category: 'platform'
			}
		];
	}

	if (orgRole === 'mentor') {
		return [
			...baseOrgNav,
			...learningNav,
			{
				label: 'My Courses',
				href: '/app/mentor/courses',
				icon: 'graduation',
				category: 'management'
			},
			{ label: 'Students', href: '/app/mentor/students', icon: 'users', category: 'management' },
			{
				label: 'Grading',
				href: '/app/mentor/grading',
				icon: 'check-square',
				category: 'management'
			},
			{
				label: 'Broadcast',
				href: '/app/mentor/broadcast',
				icon: 'megaphone',
				category: 'management'
			},
			{
				label: 'Analytics',
				href: `/app/organizations/${orgId}/analytics`,
				icon: 'chart',
				category: 'platform'
			}
		];
	}

	if (orgRole === 'facilitator') {
		return [
			...baseOrgNav,
			...learningNav,
			{
				label: 'My Batches',
				href: '/app/facilitator/cohorts',
				icon: 'calendar',
				category: 'management'
			},
			{ label: 'Students', href: '/app/mentor/students', icon: 'users', category: 'management' },
			{
				label: 'Broadcast',
				href: '/app/mentor/broadcast',
				icon: 'megaphone',
				category: 'management'
			}
		];
	}

	return [
		...baseOrgNav,
		...learningNav,
		{ label: 'Leaderboard', href: '/app/leaderboard', icon: 'trophy', category: 'workspace' },
		{ label: 'Job Board', href: '/app/jobs', icon: 'briefcase', category: 'workspace' }
	];
}

export function groupNavItems(items: NavItem[]): NavGroup[] {
	const groups: Record<string, NavItem[]> = {};

	items.forEach((item) => {
		const category = item.category || 'other';
		if (!groups[category]) {
			groups[category] = [];
		}
		groups[category].push(item);
	});

	const categoryLabels: Record<string, string> = {
		dashboard: '',
		workspace: 'Workspace Tasks',
		learning: 'Learning',
		management: 'Organization Settings',
		admin: 'Administration',
		platform: 'Platform Management',
		crm: 'Customer Relations',
		other: 'Other'
	};

	return Object.entries(groups).map(([category, items]) => ({
		label: categoryLabels[category] || category,
		items
	}));
}

// Organization-specific permission types
export type OrgPermission =
	| 'org:read' // View org settings
	| 'org:update' // Update org settings
	| 'org:delete' // Delete org (owner only)
	| 'org:billing' // Manage billing
	| 'member:read' // View members
	| 'member:create' // Add/invite members
	| 'member:update' // Update member roles
	| 'member:delete' // Remove members
	| 'course:create' // Create courses
	| 'course:update' // Update any course
	| 'course:delete' // Delete courses
	| 'course:publish' // Publish courses
	| 'cohort:create' // Create cohorts
	| 'cohort:update' // Update cohorts
	| 'analytics:view' // View analytics
	| 'billing:manage'; // Manage billing

// Permission matrix for organization roles
const orgPermissions: Record<string, OrgPermission[]> = {
	owner: [
		'org:read',
		'org:update',
		'org:delete',
		'org:billing',
		'member:read',
		'member:create',
		'member:update',
		'member:delete',
		'course:create',
		'course:update',
		'course:delete',
		'course:publish',
		'cohort:create',
		'cohort:update',
		'analytics:view',
		'billing:manage'
	],
	admin: [
		'org:read',
		'org:update',
		'member:read',
		'member:create',
		'member:update',
		'member:delete',
		'course:create',
		'course:update',
		'course:delete',
		'course:publish',
		'cohort:create',
		'cohort:update',
		'analytics:view'
	],
	mentor: [
		'org:read',
		'member:read',
		'course:create',
		'course:update',
		'course:publish',
		'analytics:view'
	],
	facilitator: ['org:read', 'member:read', 'cohort:create', 'cohort:update', 'analytics:view'],
	member: ['org:read', 'member:read']
};

export function hasOrgPermission(orgRole: string | null, permission: OrgPermission): boolean {
	if (!orgRole) return false;
	const permissions = orgPermissions[orgRole.toLowerCase()] || [];
	return permissions.includes(permission);
}

export function canManageOrg(orgRole: string | null): boolean {
	return hasOrgPermission(orgRole, 'org:update');
}

export function canManageMembers(orgRole: string | null): boolean {
	return hasOrgPermission(orgRole, 'member:create');
}

export function canCreateCourses(orgRole: string | null): boolean {
	return hasOrgPermission(orgRole, 'course:create');
}

export function canManageCourses(orgRole: string | null): boolean {
	return hasOrgPermission(orgRole, 'course:update');
}

export function canViewAnalytics(orgRole: string | null): boolean {
	return hasOrgPermission(orgRole, 'analytics:view');
}

export function getOrgPermissions(orgRole: string | null): OrgPermission[] {
	if (!orgRole) return [];
	return orgPermissions[orgRole.toLowerCase()] || [];
}
