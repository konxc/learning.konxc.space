<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import type { Theme } from '$lib/stores/theme';
	import AccordionMenu from './AccordionMenu.svelte';
	import type { AccordionMenuItem } from './AccordionMenu.svelte';

	let {
		theme,
		onThemeChange,
		accordionRef,
		onToggle
	}: {
		theme: Theme;
		onThemeChange: (theme: Theme, e: MouseEvent) => void;
		accordionRef?: HTMLDetailsElement;
		onToggle?: (e: Event) => void;
	} = $props();

	const themeItems: AccordionMenuItem[] = [
		{
			value: 'light',
			label: 'Light',
			icon: '☀️',
			activeClasses:
				'bg-amber-50/40 font-medium text-amber-700 ring-1 ring-amber-200/50 dark:bg-amber-950/15 dark:text-amber-400 dark:ring-amber-800/30',
			inactiveClasses:
				'bg-amber-50/20 text-amber-700 hover:bg-amber-50/40 dark:bg-amber-950/10 dark:text-amber-400 dark:hover:bg-amber-950/15',
			onClick: (_, e) => {
				e.preventDefault();
				e.stopPropagation();
				onThemeChange('light', e as MouseEvent);
			}
		},
		{
			value: 'dark',
			label: 'Dark',
			icon: '🌙',
			activeClasses:
				'bg-indigo-50/40 font-medium text-indigo-700 ring-1 ring-indigo-200/50 dark:bg-indigo-950/15 dark:text-indigo-400 dark:ring-indigo-800/30',
			inactiveClasses:
				'bg-indigo-50/20 text-indigo-700 hover:bg-indigo-50/40 dark:bg-indigo-950/10 dark:text-indigo-400 dark:hover:bg-indigo-950/15',
			onClick: (_, e) => {
				e.preventDefault();
				e.stopPropagation();
				onThemeChange('dark', e as MouseEvent);
			}
		},
		{
			value: 'system',
			label: 'System',
			icon: '💻',
			activeClasses:
				'bg-gray-50/60 font-medium text-gray-700 ring-1 ring-gray-200/50 dark:bg-neutral-800/40 dark:text-gray-300 dark:ring-neutral-700/50',
			inactiveClasses:
				'bg-gray-50/30 text-gray-600 hover:bg-gray-50/60 dark:bg-neutral-800/20 dark:text-gray-400 dark:hover:bg-neutral-800/40',
			onClick: (_, e) => {
				e.preventDefault();
				e.stopPropagation();
				onThemeChange('system', e as MouseEvent);
			}
		}
	];
</script>

<AccordionMenu
	title={m.settings_theme?.() ?? 'Theme'}
	icon="🎨"
	items={themeItems}
	activeValue={theme}
	{accordionRef}
	{onToggle}
	groupName="theme"
/>
