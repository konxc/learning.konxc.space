// Global user roles (platform-wide)
export const ROLES = ['admin', 'bd', 'mentor', 'user', 'facilitator'] as const;
export type UserRole = (typeof ROLES)[number];

// Organization roles (multi-tenant)
export const ORG_ROLES = ['owner', 'admin', 'creator', 'facilitator', 'member'] as const;
export type OrgRole = (typeof ORG_ROLES)[number];

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
	creator: 'Creator',
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
	admin: ['admin', 'bd', 'mentor', 'user', 'facilitator'],
	bd: ['bd', 'user'],
	mentor: ['mentor', 'user'],
	user: [],
	facilitator: ['facilitator', 'user']
};
