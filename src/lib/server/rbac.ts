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
			label: 'Ringkasan',
			href: '/dashboard/overview',
			icon: '📊',
			category: 'dashboard'
		}
	];

	if (role === 'admin') {
		return [
			...baseNav,
			{
				label: 'Kelola Kursus',
				href: '/dashboard/admin/courses',
				icon: '📚',
				category: 'admin'
			},
			{
				label: 'Kupon Diskon',
				href: '/dashboard/admin/coupons',
				icon: '🎫',
				category: 'admin'
			},
			{
				label: 'Manajemen Pengguna',
				href: '/dashboard/admin/users',
				icon: '👥',
				category: 'admin'
			},
			{
				label: 'Pendaftaran Mentor',
				href: '/dashboard/admin/mentor-applications',
				icon: '📝',
				category: 'admin',
				badgeColor: 'yellow'
			},
			{
				label: 'Verifikasi Pembayaran',
				href: '/dashboard/admin/payments',
				icon: '💳',
				category: 'admin'
			},
			{
				label: 'Daftar Tunggu CRM',
				href: '/dashboard/crm/waiting-list',
				icon: '⏳',
				category: 'crm'
			}
		];
	}

	if (role === 'bd') {
		return [
			...baseNav,
			{
				label: 'Daftar Tunggu CRM',
				href: '/dashboard/crm/waiting-list',
				icon: '⏳',
				category: 'crm'
			}
		];
	}

	if (role === 'mentor') {
		return [
			...baseNav,
			{
				label: 'Jelajahi Kursus',
				href: '/dashboard/courses',
				icon: '🔍',
				category: 'learning'
			},
			{
				label: 'Kursus Saya',
				href: '/dashboard/my-courses',
				icon: '📖',
				category: 'learning'
			},
			{
				label: 'Manajemen Kursus',
				href: '/dashboard/mentor/courses',
				icon: '🎓',
				category: 'management'
			},
			{
				label: 'Daftar Siswa',
				href: '/dashboard/mentor/students',
				icon: '👨‍🎓',
				category: 'management'
			}
		];
	}

	// User role - can browse, enroll, and apply to be mentor
	return [
		...baseNav,
		{
			label: 'Jelajahi Kursus',
			href: '/dashboard/courses',
			icon: '🔍',
			category: 'learning'
		},
		{
			label: 'Kursus Saya',
			href: '/dashboard/my-courses',
			icon: '📖',
			category: 'learning'
		},
		{
			label: 'Daftar Mentor',
			href: '/dashboard/apply-mentor',
			icon: '🚀',
			category: 'learning'
		},
		{
			label: 'Status Lamaran',
			href: '/dashboard/my-mentor-application',
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
