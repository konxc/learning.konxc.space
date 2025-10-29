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
}

export function getNavItemsForRole(role: string): NavItem[] {
    const baseNav: NavItem[] = [{ label: 'Dashboard', href: '/dashboard' }];

    if (role === 'admin') {
        return [
            ...baseNav,
            { label: 'Manage Courses', href: '/dashboard/admin/courses' },
            { label: 'Coupons', href: '/dashboard/admin/coupons' },
            { label: 'Users', href: '/dashboard/admin/users' },
            { label: 'Mentor Applications', href: '/dashboard/admin/mentor-applications' },
            { label: 'CRM: Waiting List', href: '/dashboard/crm/waiting-list' }
        ];
    }

    if (role === 'bd') {
        return [
            ...baseNav,
            { label: 'CRM: Waiting List', href: '/dashboard/crm/waiting-list' }
        ];
    }

    if (role === 'mentor') {
        return [
            ...baseNav,
            { label: 'Browse Courses', href: '/dashboard/courses' },
            { label: 'My Enrollments', href: '/dashboard/my-courses' },
            { label: 'My Mentor Courses', href: '/dashboard/mentor/courses' },
            { label: 'Students', href: '/dashboard/mentor/students' }
        ];
    }

    // User role - can browse, enroll, and apply to be mentor
    return [
        ...baseNav,
        { label: 'Browse Courses', href: '/dashboard/courses' },
        { label: 'My Enrollments', href: '/dashboard/my-courses' },
        { label: 'Apply as Mentor', href: '/dashboard/apply-mentor' },
        { label: 'My Application', href: '/dashboard/my-mentor-application' }
    ];
}

