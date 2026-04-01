import { COLOR } from '$lib/config/design';

export interface RoleColor {
	text: string;
	bg: string;
	bgMuted: string;
	border: string;
}

const defaultRoleColor: RoleColor = {
	text: COLOR.textMuted,
	bg: 'bg-zinc-100 dark:bg-zinc-800',
	bgMuted: 'bg-zinc-50/50 dark:bg-zinc-900/30',
	border: 'border-zinc-200/50 dark:border-zinc-700/50'
};

export function useRoleColor(role: string | null | undefined): RoleColor {
	if (!role) return defaultRoleColor;

	switch (role) {
		case 'admin':
			return COLOR.roleAdmin;
		case 'mentor':
			return COLOR.roleMentor;
		case 'bd':
			return COLOR.roleBd;
		case 'user':
			return COLOR.roleUser;
		default:
			return defaultRoleColor;
	}
}

export function getRoleColor(role: string | null | undefined): RoleColor {
	return useRoleColor(role);
}