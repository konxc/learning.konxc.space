// Hook sederhana untuk mendapatkan role aktif dari user
import { derived } from 'svelte/store';
import { userState } from '$lib/stores/user';
import { DEFAULT_ROLE } from '$lib/constants/roles';

export const activeRole = derived(userState, ($s) => $s.role ?? DEFAULT_ROLE);


