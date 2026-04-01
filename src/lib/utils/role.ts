/**
 * Role-related utility functions
 */

export function getRoleLabel(role: string | null | undefined): string {
	if (!role) return '';
	const roleMap: Record<string, string> = {
		admin: 'Admin',
		mentor: 'Mentor',
		siswa: 'Siswa',
		user: 'Siswa',
		facilitator: 'Facilitator',
		bd: 'Business Dev'
	};
	return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
}

export function getRoleColorClass(role: string | null | undefined): string {
	switch (role) {
		case 'admin':
			return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/50';
		case 'mentor':
			return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/50';
		case 'bd':
			return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/50';
		default:
			return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/50 dark:border-indigo-800/50';
	}
}
