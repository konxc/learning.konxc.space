/**
 * Shared type definitions for layout components
 */

export interface Workspace {
	organizations: Organization[];
	activeId: string;
	activeOrg: Organization | null;
}

export interface Organization {
	id: string;
	name: string;
	logoUrl?: string | null;
	brandColor?: string | null;
	planType?: 'free' | 'pro' | 'enterprise';
	role?: string;
}

export interface NavItem {
	label: string;
	href: string;
	icon?: string;
	category?: string;
	badge?: number | string;
	badgeColor?: 'blue' | 'red' | 'green' | 'yellow';
}

export interface NavGroup {
	label?: string;
	items: NavItem[];
}

export interface User {
	id: string;
	username: string;
	fullName?: string | null;
	email?: string | null;
	role: string;
	avatarUrl?: string | null;
	onboardingCompleted?: boolean | null;
	createdAt?: Date | string;
}

export interface Notification {
	id: string;
	title: string;
	message: string;
	link?: string;
	read?: boolean;
	createdAt: string | Date;
}

export interface PageData {
	user?: User | null;
	navItems: NavItem[];
	activeRole?: string | null;
	effectiveRole?: string | null;
	availableRoles?: string[];
	workspaces?: Workspace;
}
