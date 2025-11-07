<script lang="ts">
	import AccordionMenu from './AccordionMenu.svelte';
	import type { AccordionMenuItem } from './AccordionMenu.svelte';
	import { invalidateAll } from '$app/navigation';

	interface User {
		role?: string;
	}

	let {
		user,
		activeRole,
		accordionRef,
		onToggle
	}: {
		user: User | null;
		activeRole?: string | null;
		accordionRef?: HTMLDetailsElement;
		onToggle?: (e: Event) => void;
	} = $props();

	const ACTIVE_ROLE_COOKIE = 'active-role';
	const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

	async function handleRoleSwitch(role: string, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (typeof document === 'undefined') return;

		// 1. Immediate client-side cookie update untuk instant feedback
		document.cookie = `${ACTIVE_ROLE_COOKIE}=${role}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;

		// 2. Sync dengan server untuk audit log (background, non-blocking)
		try {
			await fetch(`/dashboard/switch-role?role=${role}`, {
				method: 'GET',
				credentials: 'include'
			});
		} catch (error) {
			// Silent fail - cookie sudah set, bisa continue
			console.warn('Failed to sync role switch with server:', error);
		}

		// 3. Invalidate all data untuk refresh tanpa full reload
		await invalidateAll();
	}

	const roleItems: AccordionMenuItem[] = [
		{
			value: 'admin',
			label: 'Admin',
			icon: '👑',
			activeClasses:
				'bg-amber-50/40 font-medium text-amber-700 ring-1 ring-amber-200/50 dark:bg-amber-950/15 dark:text-amber-400 dark:ring-amber-800/30',
			inactiveClasses:
				'bg-amber-50/20 text-amber-700 hover:bg-amber-50/40 dark:bg-amber-950/10 dark:text-amber-400 dark:hover:bg-amber-950/15',
			onClick: (value, e) => handleRoleSwitch(value, e as MouseEvent)
		},
		{
			value: 'mentor',
			label: 'Mentor',
			icon: '🎓',
			activeClasses:
				'bg-blue-50/40 font-medium text-blue-700 ring-1 ring-blue-200/50 dark:bg-blue-950/15 dark:text-blue-400 dark:ring-blue-800/30',
			inactiveClasses:
				'bg-blue-50/20 text-blue-700 hover:bg-blue-50/40 dark:bg-blue-950/10 dark:text-blue-400 dark:hover:bg-blue-950/15',
			onClick: (value, e) => handleRoleSwitch(value, e as MouseEvent)
		},
		{
			value: 'siswa',
			label: 'Siswa',
			icon: '📚',
			activeClasses:
				'bg-teal-50/40 font-medium text-teal-700 ring-1 ring-teal-200/50 dark:bg-teal-950/15 dark:text-teal-400 dark:ring-teal-800/30',
			inactiveClasses:
				'bg-teal-50/20 text-teal-700 hover:bg-teal-50/40 dark:bg-teal-950/10 dark:text-teal-400 dark:hover:bg-teal-950/15',
			onClick: (value, e) => handleRoleSwitch(value, e as MouseEvent)
		}
	];
</script>

{#if user?.role === 'admin'}
	<AccordionMenu
		title="Switch Role"
		icon="🔄"
		items={roleItems}
		activeValue={activeRole || user?.role || ''}
		{accordionRef}
		{onToggle}
		groupName="role"
	/>
{/if}

