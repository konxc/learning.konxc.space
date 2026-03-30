import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: string;
	type: ToastType;
	text: string;
	timeoutMs?: number;
}

function createToastStore() {
	const { subscribe, update, set } = writable<Toast[]>([]);

	function push(t: Omit<Toast, 'id'> & { id?: string }) {
		const id = t.id ?? crypto.randomUUID();
		const toast: Toast = { id, timeoutMs: 3500, ...t };
		update((arr) => [...arr, toast]);
		const timeout = toast.timeoutMs ?? 3500;
		if (timeout > 0) setTimeout(() => dismiss(id), timeout);
		return id;
	}

	function dismiss(id: string) {
		update((arr) => arr.filter((t) => t.id !== id));
	}

	function clear() {
		set([]);
	}

	return { subscribe, push, dismiss, clear };
}

export const toasts = createToastStore();

export const toast = {
	success: (text: string, id?: string) => toasts.push({ type: 'success', text, id }),
	error: (text: string, id?: string) => toasts.push({ type: 'error', text, id }),
	info: (text: string, id?: string) => toasts.push({ type: 'info', text, id }),
	warning: (text: string, id?: string) => toasts.push({ type: 'warning', text, id }),
	clear: () => toasts.clear()
};
