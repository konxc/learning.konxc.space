import { writable } from 'svelte/store';

export type ToasterType = 'success' | 'error' | 'info';

export interface ToasterMessage {
    id: string;
    text: string;
    type: ToasterType;
    duration?: number;
}

function createToaster() {
    const { subscribe, update, set } = writable<ToasterMessage[]>([]);

    return {
        subscribe,
        push(message: Omit<ToasterMessage, 'id'> & { id?: string }) {
            const id = message.id ?? crypto.randomUUID();
            const entry: ToasterMessage = { ...message, id };

            update((messages) => [...messages, entry]);

            if (entry.duration) {
                setTimeout(() => {
                    update((messages) => messages.filter((item) => item.id !== id));
                }, entry.duration);
            }

            return id;
        },
        remove(id: string) {
            update((messages) => messages.filter((message) => message.id !== id));
        },
        clear() {
            set([]);
        }
    };
}

export const toaster = createToaster();

