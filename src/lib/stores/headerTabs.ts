import { writable } from 'svelte/store';

export interface HeaderTab {
	label: string;
	id: string;
}

export const headerTabsConfig = writable<{
	tabs: HeaderTab[];
	activeTab: string;
	onTabSelect: (tabId: string) => void;
} | null>(null);
