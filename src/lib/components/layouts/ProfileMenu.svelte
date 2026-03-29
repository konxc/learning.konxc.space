<script lang="ts">
	import { RADIUS, TEXT, COLOR, TRANSITION, ELEVATION } from '$lib/config/design';
	import { m } from '$lib/paraglide/messages.js';
	import ProfileMenuSummary from './ProfileMenuSummary.svelte';
	import ProfileUserInfo from './ProfileUserInfo.svelte';
	import ThemeAccordion from './ThemeAccordion.svelte';
	import RoleSwitcherAccordion from './RoleSwitcherAccordion.svelte';
	import type { Theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';
	import type { User as DbUser } from '$lib/server/db/schema';

	type ProfileMenuUser = Partial<DbUser> & {
		avatarUrl?: string | null;
	};

	let {
		user,
		theme,
		activeRole,
		availableRoles = [],
		onThemeChange,
		onProfileToggle,
		onAccordionToggle,
		profileDetailsRef,
		themeAccordionRef
	}: {
		user: ProfileMenuUser | null;
		theme: Theme;
		activeRole?: string | null;
		availableRoles?: string[];
		onThemeChange: (theme: Theme, e: MouseEvent) => void;
		onProfileToggle?: (e: Event) => void;
		onAccordionToggle?: (accordionType: 'theme' | 'role', e: Event) => void;
		profileDetailsRef?: HTMLDetailsElement;
		themeAccordionRef?: HTMLDetailsElement;
	} = $props();

	let menuContainerRef: HTMLDivElement | null = $state(null);
	let roleAccordionRef: HTMLDetailsElement | undefined = $state(undefined);

	// Click outside handler untuk menutup profile menu
	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!profileDetailsRef || !menuContainerRef || !profileDetailsRef.open) return;

			const target = event.target as Node | null;
			if (!target) return;

			// Cek apakah klik di luar menu container
			if (!menuContainerRef.contains(target)) {
				profileDetailsRef.open = false;
			}
		}

		// Gunakan capture phase untuk menangkap semua klik
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});
</script>

<div class="relative" bind:this={menuContainerRef}>
	<details bind:this={profileDetailsRef} class="group" ontoggle={onProfileToggle}>
		<ProfileMenuSummary {user} {activeRole} />
		<div
			class={`absolute right-0 z-50 mt-4 min-w-[280px] ${RADIUS.card} border border-zinc-200/50 bg-white/95 p-3 ${ELEVATION.card} backdrop-blur-xl [-webkit-backdrop-filter:blur(16px)] dark:border-zinc-800/50 dark:bg-zinc-900/95`}
		>
			<ProfileUserInfo {user} {activeRole} />

			<ThemeAccordion
				{theme}
				{onThemeChange}
				accordionRef={themeAccordionRef}
				onToggle={(e) => onAccordionToggle?.('theme', e)}
			/>

			<RoleSwitcherAccordion
				{user}
				{activeRole}
				accordionRef={roleAccordionRef}
				onToggle={(e) => onAccordionToggle?.('role', e)}
			/>

			<!-- Menu Items -->
			<a
				href="/app/settings"
				class={`block no-underline ${RADIUS.small} px-3 py-2 ${TEXT.button} ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 dark:hover:bg-neutral-800 dark:hover:text-gray-100`}
			>
				<span class="mr-2" aria-hidden="true">⚙️</span>
				{m.settings()}
			</a>
			<form
				method="POST"
				action="/auth/signout"
				use:enhance={() => {
					return async ({ update }) => {
						toast.info('Sedang keluar...');
						await update();
					};
				}}
			>
				<button
					type="submit"
					class={`w-full no-underline ${RADIUS.small} px-3 py-2 text-left ${TEXT.button} ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-1 dark:hover:bg-red-950/20 dark:hover:text-red-400`}
				>
					<span class="mr-2" aria-hidden="true">🚪</span>
					{m.logout()}
				</button>
			</form>
		</div>
	</details>
</div>
