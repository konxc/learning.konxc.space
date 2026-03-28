import type { User } from './db/schema';

export type UserRole = 'user' | 'mentor' | 'admin' | 'bd';

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

export function getNavItemsForRole(role: string): NavItem[] {
	const baseNav: NavItem[] = [
		{
			label: 'Overview',
			href: '/app/overview',
			icon: '📊',
			category: 'dashboard'
		}
	];

	if (role === 'admin') {
		return [
			...baseNav,
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
			}
		];
	}

	// User role - can browse, enroll, and apply to be mentor
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
		management: 'Management',
		admin: 'Administration',
		crm: 'CRM',
		other: 'Other'
	};

	return Object.entries(groups).map(([category, items]) => ({
		label: categoryLabels[category] || category,
		items
	}));
}
