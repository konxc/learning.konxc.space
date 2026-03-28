import type { User } from './db/schema';

export type UserRole = 'user' | 'mentor' | 'admin' | 'bd' | 'facilitator' | 'owner' | 'member';

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

export function isMentor(user: User | null): boolean {
	return hasRole(user, ['mentor', 'admin']);
}

export function isFacilitator(user: User | null): boolean {
	return hasRole(user, ['facilitator', 'mentor', 'admin']);
}

export function isUser(user: User | null): boolean {
	return user !== null;
}

export interface NavItem {
	label: string;
	href: string;
	icon?: string;
	category?: 'dashboard' | 'learning' | 'management' | 'admin' | 'crm';
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

	// Personal context - base navigation
	const baseNav: NavItem[] = [
		{
			label: 'Overview',
			href: '/app/overview',
			icon: '📊',
			category: 'dashboard'
		},
		{
			label: 'Settings',
			href: '/app/settings/organization',
			icon: '⚙️',
			category: 'management'
		}
	];

	if (role === 'admin') {
		return [
			...baseNav,
			{
				label: 'Browse Courses',
				href: '/app/courses',
				icon: '🔍',
				category: 'learning'
			},
			{
				label: 'My Courses',
				href: '/app/my-courses',
				icon: '📖',
				category: 'learning'
			},
			{
				label: 'My Progress',
				href: '/app/my-progress',
				icon: '📈',
				category: 'learning'
			},
			{
				label: 'Weekly Checkpoints',
				href: '/app/checkpoints',
				icon: '✅',
				category: 'learning'
			},
			{
				label: 'Leaderboard',
				href: '/app/leaderboard',
				icon: '🏆',
				category: 'learning'
			},
			{
				label: 'Manage Courses',
				href: '/app/admin/courses',
				icon: '📚',
				category: 'admin'
			},
			{
				label: 'Discount Coupons',
				href: '/app/admin/coupons',
				icon: '🎫',
				category: 'admin'
			},
			{
				label: 'User Management',
				href: '/app/admin/users',
				icon: '👥',
				category: 'admin'
			},
			{
				label: 'Mentor Applications',
				href: '/app/admin/mentor-applications',
				icon: '📝',
				category: 'admin',
				badgeColor: 'yellow'
			},
			{
				label: 'Payment Verification',
				href: '/app/admin/payments',
				icon: '💳',
				category: 'admin'
			},
			{
				label: 'Manage Batches',
				href: '/app/admin/cohorts',
				icon: '📅',
				category: 'admin'
			},
			{
				label: 'Partners',
				href: '/app/admin/partner',
				icon: '🏢',
				category: 'admin'
			},
			{
				label: 'Reports',
				href: '/app/admin/reports',
				icon: '📊',
				category: 'admin'
			},
			{
				label: 'Course Reviews',
				href: '/app/admin/reviews',
				icon: '⭐',
				category: 'admin'
			},
			{
				label: 'Broadcast Message',
				href: '/app/mentor/broadcast',
				icon: '📢',
				category: 'admin'
			},
			{
				label: 'Plugin Management',
				href: '/app/admin/plugins',
				icon: '🧩',
				category: 'admin'
			},
			{
				label: 'CRM Waiting List',
				href: '/app/crm/waiting-list',
				icon: '⏳',
				category: 'crm'
			}
		];
	}

	if (role === 'bd') {
		return [
			...baseNav,
			{
				label: 'CRM Waiting List',
				href: '/app/crm/waiting-list',
				icon: '⏳',
				category: 'crm'
			}
		];
	}

	if (role === 'mentor') {
		return [
			...baseNav,
			{
				label: 'Browse Courses',
				href: '/app/courses',
				icon: '🔍',
				category: 'learning'
			},
			{
				label: 'My Courses',
				href: '/app/my-courses',
				icon: '📖',
				category: 'learning'
			},
			{
				label: 'My Progress',
				href: '/app/my-progress',
				icon: '📈',
				category: 'learning'
			},
			{
				label: 'Weekly Checkpoints',
				href: '/app/checkpoints',
				icon: '✅',
				category: 'learning'
			},
			{
				label: 'Course Management',
				href: '/app/mentor/courses',
				icon: '🎓',
				category: 'management'
			},
			{
				label: 'My Students',
				href: '/app/mentor/students',
				icon: '👨‍🎓',
				category: 'management'
			},
			{
				label: 'Broadcast Message',
				href: '/app/mentor/broadcast',
				icon: '📢',
				category: 'management'
			}
		];
	}

	if (role === 'facilitator') {
		return [
			...baseNav,
			{
				label: 'Browse Courses',
				href: '/app/courses',
				icon: '🔍',
				category: 'learning'
			},
			{
				label: 'My Courses',
				href: '/app/my-courses',
				icon: '📖',
				category: 'learning'
			},
			{
				label: 'My Progress',
				href: '/app/my-progress',
				icon: '📈',
				category: 'learning'
			},
			{
				label: 'Weekly Checkpoints',
				href: '/app/checkpoints',
				icon: '✅',
				category: 'learning'
			},
			{
				label: 'My Batches',
				href: '/app/facilitator/cohorts',
				icon: '📅',
				category: 'management'
			}
		];
	}

	return [
		...baseNav,
		{
			label: 'Browse Courses',
			href: '/app/courses',
			icon: '🔍',
			category: 'learning'
		},
		{
			label: 'My Courses',
			href: '/app/my-courses',
			icon: '📖',
			category: 'learning'
		},
		{
			label: 'My Progress',
			href: '/app/my-progress',
			icon: '📈',
			category: 'learning'
		},
		{
			label: 'Weekly Checkpoints',
			href: '/app/checkpoints',
			icon: '✅',
			category: 'learning'
		},
		{
			label: 'Leaderboard',
			href: '/app/leaderboard',
			icon: '🏆',
			category: 'learning'
		},
		{
			label: 'Affiliate Dashboard',
			href: '/app/affiliate',
			icon: '💰',
			category: 'learning'
		},
		{
			label: 'Apply as Mentor',
			href: '/app/apply-mentor',
			icon: '🚀',
			category: 'learning'
		},
		{
			label: 'Application Status',
			href: '/app/my-mentor-application',
			icon: '📋',
			category: 'learning'
		}
	];
}

// Organization-specific navigation based on org role
function getOrgNavItems(orgRole: string, context: WorkspaceContext): NavItem[] {
	// Base org navigation - shared by all org members
	const baseOrgNav: NavItem[] = [
		{
			label: 'Org Dashboard',
			href: '/app/overview',
			icon: '📊',
			category: 'dashboard'
		}
	];

	// Learning items (for all members)
	const learningNav: NavItem[] = [
		{
			label: 'Browse Courses',
			href: '/app/courses',
			icon: '🔍',
			category: 'learning'
		},
		{
			label: 'My Courses',
			href: '/app/my-courses',
			icon: '📖',
			category: 'learning'
		},
		{
			label: 'My Progress',
			href: '/app/my-progress',
			icon: '📈',
			category: 'learning'
		},
		{
			label: 'Weekly Checkpoints',
			href: '/app/checkpoints',
			icon: '✅',
			category: 'learning'
		}
	];

	// Org Owner navigation
	if (orgRole === 'owner') {
		return [
			...baseOrgNav,
			...learningNav,
			// Organization Management
			{
				label: 'Organization Settings',
				href: '/app/settings/organization',
				icon: '⚙️',
				category: 'management'
			},
			{
				label: 'Member Management',
				href: '/app/settings/organization',
				icon: '👥',
				category: 'management'
			},
			{
				label: 'Billing & Plans',
				href: '/app/settings/billing',
				icon: '💳',
				category: 'management'
			},
			// Course Management
			{
				label: 'Course Builder',
				href: '/app/mentor/courses',
				icon: '🎓',
				category: 'admin'
			},
			{
				label: 'Course Reviews',
				href: '/app/admin/reviews',
				icon: '⭐',
				category: 'admin'
			},
			// Cohort Management
			{
				label: 'Manage Cohorts',
				href: '/app/admin/cohorts',
				icon: '📅',
				category: 'admin'
			},
			// Analytics
			{
				label: 'Analytics & Reports',
				href: '/app/admin/reports',
				icon: '📊',
				category: 'admin'
			},
			// Broadcast
			{
				label: 'Broadcast Message',
				href: '/app/mentor/broadcast',
				icon: '📢',
				category: 'admin'
			}
		];
	}

	// Org Admin navigation
	if (orgRole === 'admin') {
		return [
			...baseOrgNav,
			...learningNav,
			// Organization Management
			{
				label: 'Organization Settings',
				href: '/app/settings/organization',
				icon: '⚙️',
				category: 'management'
			},
			{
				label: 'Member Management',
				href: '/app/settings/organization',
				icon: '👥',
				category: 'management'
			},
			// Course Management
			{
				label: 'Course Builder',
				href: '/app/mentor/courses',
				icon: '🎓',
				category: 'admin'
			},
			{
				label: 'Course Reviews',
				href: '/app/admin/reviews',
				icon: '⭐',
				category: 'admin'
			},
			// Cohort Management
			{
				label: 'Manage Cohorts',
				href: '/app/admin/cohorts',
				icon: '📅',
				category: 'admin'
			},
			// Analytics
			{
				label: 'Analytics & Reports',
				href: '/app/admin/reports',
				icon: '📊',
				category: 'admin'
			},
			// Broadcast
			{
				label: 'Broadcast Message',
				href: '/app/mentor/broadcast',
				icon: '📢',
				category: 'admin'
			}
		];
	}

	// Creator navigation (Course creators)
	if (orgRole === 'creator') {
		return [
			...baseOrgNav,
			...learningNav,
			// Course Management
			{
				label: 'Course Builder',
				href: '/app/mentor/courses',
				icon: '🎓',
				category: 'management'
			},
			{
				label: 'My Students',
				href: '/app/mentor/students',
				icon: '👨‍🎓',
				category: 'management'
			},
			{
				label: 'Broadcast Message',
				href: '/app/mentor/broadcast',
				icon: '📢',
				category: 'management'
			},
			// Analytics
			{
				label: 'Course Analytics',
				href: '/app/admin/reports',
				icon: '📊',
				category: 'admin'
			}
		];
	}

	// Facilitator navigation
	if (orgRole === 'facilitator') {
		return [
			...baseOrgNav,
			...learningNav,
			// Cohort Management
			{
				label: 'My Cohorts',
				href: '/app/admin/cohorts',
				icon: '📅',
				category: 'management'
			},
			{
				label: 'Student Progress',
				href: '/app/mentor/students',
				icon: '👨‍🎓',
				category: 'management'
			},
			{
				label: 'Broadcast Message',
				href: '/app/mentor/broadcast',
				icon: '📢',
				category: 'management'
			}
		];
	}

	// Regular member navigation (basic access)
	return [
		...baseOrgNav,
		...learningNav,
		{
			label: 'Leaderboard',
			href: '/app/leaderboard',
			icon: '🏆',
			category: 'learning'
		}
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
		learning: 'Learning',
		management: 'Organization Control',
		admin: 'Administration',
		crm: 'CRM',
		other: 'Other'
	};

	return Object.entries(groups).map(([category, items]) => ({
		label: categoryLabels[category] || category,
		items
	}));
}

// Organization-specific permission types
export type OrgPermission = 
	| 'org:read'           // View org settings
	| 'org:update'         // Update org settings
	| 'org:delete'         // Delete org (owner only)
	| 'org:billing'        // Manage billing
	| 'member:read'        // View members
	| 'member:create'      // Add/invite members
	| 'member:update'      // Update member roles
	| 'member:delete'      // Remove members
	| 'course:create'      // Create courses
	| 'course:update'      // Update any course
	| 'course:delete'      // Delete courses
	| 'course:publish'     // Publish courses
	| 'cohort:create'      // Create cohorts
	| 'cohort:update'      // Update cohorts
	| 'analytics:view'     // View analytics
	| 'billing:manage';    // Manage billing

// Permission matrix for organization roles
const orgPermissions: Record<string, OrgPermission[]> = {
	owner: [
		'org:read', 'org:update', 'org:delete',
		'org:billing',
		'member:read', 'member:create', 'member:update', 'member:delete',
		'course:create', 'course:update', 'course:delete', 'course:publish',
		'cohort:create', 'cohort:update',
		'analytics:view',
		'billing:manage'
	],
	admin: [
		'org:read', 'org:update',
		'member:read', 'member:create', 'member:update', 'member:delete',
		'course:create', 'course:update', 'course:delete', 'course:publish',
		'cohort:create', 'cohort:update',
		'analytics:view'
	],
	creator: [
		'org:read',
		'member:read',
		'course:create', 'course:update', 'course:publish',
		'analytics:view'
	],
	facilitator: [
		'org:read',
		'member:read',
		'cohort:create', 'cohort:update',
		'analytics:view'
	],
	member: [
		'org:read',
		'member:read'
	]
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
