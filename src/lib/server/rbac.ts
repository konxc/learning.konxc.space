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
			href: '/app/overview',
			icon: '📊',
			category: 'dashboard'
		}
	];

	if (role === 'admin') {
		return [
			...baseNav,
			{
				label: 'Kelola Kursus',
				href: '/app/admin/courses',
				icon: '📚',
				category: 'admin'
			},
			{
				label: 'Kupon Diskon',
				href: '/app/admin/coupons',
				icon: '🎫',
				category: 'admin'
			},
			{
				label: 'Manajemen Pengguna',
				href: '/app/admin/users',
				icon: '👥',
				category: 'admin'
			},
			{
				label: 'Pendaftaran Mentor',
				href: '/app/admin/mentor-applications',
				icon: '📝',
				category: 'admin',
				badgeColor: 'yellow'
			},
			{
				label: 'Verifikasi Pembayaran',
				href: '/app/admin/payments',
				icon: '💳',
				category: 'admin'
			},
			{
				label: 'Daftar Tunggu CRM',
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
				label: 'Daftar Tunggu CRM',
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
				label: 'Jelajahi Kursus',
				href: '/app/courses',
				icon: '🔍',
				category: 'learning'
			},
			{
				label: 'Kursus Saya',
				href: '/app/my-courses',
				icon: '📖',
				category: 'learning'
			},
			{
				label: 'Manajemen Kursus',
				href: '/app/mentor/courses',
				icon: '🎓',
				category: 'management'
			},
			{
				label: 'Daftar Siswa',
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
			label: 'Jelajahi Kursus',
			href: '/app/courses',
			icon: '🔍',
			category: 'learning'
		},
		{
			label: 'Kursus Saya',
			href: '/app/my-courses',
			icon: '📖',
			category: 'learning'
		},
		{
			label: 'Daftar Mentor',
			href: '/app/apply-mentor',
			icon: '🚀',
			category: 'learning'
		},
		{
			label: 'Status Lamaran',
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
