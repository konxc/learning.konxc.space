// Platform-level roles (user.role)
export const PLATFORM_ROLES = ['admin', 'bd', 'user'] as const;
export type UserRole = (typeof PLATFORM_ROLES)[number];

// Organization-level roles (organization_member.role)
export const ORG_ROLES = ['owner', 'admin', 'mentor', 'facilitator', 'member'] as const;
export type OrgRole = (typeof ORG_ROLES)[number];

// Keep ROLES as alias for backward compat during migration
export const ROLES = PLATFORM_ROLES;

// Workspace roles (sub-division of organization)
export const WORKSPACE_ROLES = ['admin', 'member', 'viewer'] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

// Enrollment tracks (learning path per course)
export const TRACKS = ['creator', 'seller', 'affiliate'] as const;
export type Track = (typeof TRACKS)[number];

// Role alias for UI display
export const ROLE_ALIASES: Record<string, string> = {
	user: 'Siswa',
	mentor: 'Mentor',
	bd: 'Business Development',
	admin: 'Admin',
	facilitator: 'Facilitator',
	owner: 'Owner',
	member: 'Member',
	viewer: 'Viewer'
};

// Track aliases for UI display
export const TRACK_ALIASES: Record<string, string> = {
	creator: 'Content Creator',
	seller: 'E-Commerce Seller',
	affiliate: 'Affiliate Pro'
};

// Default role when not detected/determined
export const DEFAULT_ROLE: UserRole = 'user';

// Role hierarchy - which roles can be switched to from each base role
export const ROLE_SWITCH_MAP: Record<UserRole, UserRole[]> = {
	admin: ['admin', 'bd', 'user'],
	bd: ['bd', 'user'],
	user: []
};
