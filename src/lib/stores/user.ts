import { writable } from 'svelte/store';
import type { User } from '$lib/types/user';
import type { UserRole } from '$lib/constants/roles';

export interface UserState {
  user: User | null;
  role: UserRole | null;
}

export const userState = writable<UserState>({ user: null, role: null });

export function setUser(user: User | null) {
  userState.update((s) => ({ ...s, user }));
}

export function setRole(role: UserRole | null) {
  userState.update((s) => ({ ...s, role }));
}


