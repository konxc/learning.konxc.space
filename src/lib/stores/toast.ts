import { writable } from 'svelte/store';

export type Toast = {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
  timeoutMs?: number;
};

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function push(t: Omit<Toast, 'id'>) {
    const id = crypto.randomUUID();
    const toast: Toast = { id, timeoutMs: 3500, ...t };
    update((arr) => [...arr, toast]);
    const timeout = toast.timeoutMs ?? 3500;
    if (timeout > 0) setTimeout(() => dismiss(id), timeout);
    return id;
  }

  function dismiss(id: string) {
    update((arr) => arr.filter((t) => t.id !== id));
  }

  return { subscribe, push, dismiss };
}

export const toasts = createToastStore();
export const toast = {
  success: (text: string) => toasts.push({ type: 'success', text }),
  error: (text: string) => toasts.push({ type: 'error', text }),
  info: (text: string) => toasts.push({ type: 'info', text })
};


