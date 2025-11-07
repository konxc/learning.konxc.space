/**
 * Utility functions for filtering users
 */

export interface User {
	id: string;
	username: string;
	fullName?: string | null;
	email?: string | null;
	role: string;
	onboardingCompleted: boolean | null;
	createdAt: Date | string;
}

/**
 * Check if a user matches the search query
 */
export function matchesUserSearch(user: User, query: string): boolean {
	if (!query) return true;
	const lowerQuery = query.toLowerCase();
	return (
		user.username.toLowerCase().includes(lowerQuery) ||
		(user.fullName?.toLowerCase().includes(lowerQuery) ?? false) ||
		(user.email?.toLowerCase().includes(lowerQuery) ?? false)
	);
}

/**
 * Check if a user matches the role filter
 */
export function matchesUserRole(user: User, filter: string): boolean {
	return !filter || filter === 'all' || user.role === filter;
}

/**
 * Filter users based on search query and role filter
 */
export function filterUsers<T extends User>(
	users: T[],
	searchQuery: string,
	roleFilter: string
): T[] {
	return users.filter(
		(user) => matchesUserSearch(user, searchQuery) && matchesUserRole(user, roleFilter)
	);
}

/**
 * Count users by role
 */
export function countUsersByRole<T extends { role: string }>(
	users: T[],
	roles: string[]
): Record<string, number> {
	const counts: Record<string, number> = {
		all: users.length,
		...Object.fromEntries(roles.map((role) => [role, 0]))
	};

	users.forEach((user) => {
		if (user.role in counts) {
			counts[user.role]++;
		}
	});

	return counts;
}

