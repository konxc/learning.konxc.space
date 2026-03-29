// Global user roles (platform-wide)
export const ROLES = ['admin', 'bd', 'mentor', 'user'] as const;
export type UserRole = (typeof ROLES)[number];

// Role alias for UI display
export const ROLE_ALIASES: Record<string, string> = {
	user: 'Siswa',
	mentor: 'Mentor',
	bd: 'Business Development',
	admin: 'Admin'
};

// Default role when not detected/determined
export const DEFAULT_ROLE: UserRole = 'user';
