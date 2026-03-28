<script lang="ts">
	import ProfileMenu from './ProfileMenu.svelte';
	import { TEXT, COLOR, SPACING } from '$lib/config/design';
	import { getPageMetadata } from '$lib/stores/pageMetadata';
	import type { Theme } from '$lib/stores/theme';
	import type { User as DbUser } from '$lib/server/db/schema';
	import DashboardBreadcrumb from './DashboardBreadcrumb.svelte';

	type HeaderUser = Partial<DbUser> & { avatarUrl?: string | null };

	let {
		user,
		theme,
		activeRole,
		onThemeChange,
		onProfileToggle,
		onAccordionToggle,
		profileDetailsRef,
		themeAccordionRef,
		roleAccordionRef,
		sidebarCollapsed = false
	}: {
		user: HeaderUser | null;
		theme: Theme;
		activeRole?: string | null;
		onThemeChange: (theme: Theme, e: MouseEvent) => void;
		onProfileToggle?: (e: Event) => void;
		onAccordionToggle?: (accordionType: 'theme' | 'role', e: Event) => void;
		profileDetailsRef?: HTMLDetailsElement;
		themeAccordionRef?: HTMLDetailsElement;
		roleAccordionRef?: HTMLDetailsElement | null;
		sidebarCollapsed?: boolean;
	} = $props();

	const pageMetadataStore = getPageMetadata();
</script>

<header
	class="sticky top-0 z-30 border-b border-gray-200/60 bg-white/95 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-900/95"
>
	<div class="flex items-center">
		<!-- Sidebar alignment spacer (matches sidebar width) -->
		<div class={`hidden shrink-0 md:block ${sidebarCollapsed ? 'w-16' : 'w-64'}`}></div>

		<!-- Main Header Content: Title + Profile Menu -->
		<div
			class={`flex min-h-[56px] w-full flex-1 items-center justify-between gap-4 ${SPACING.page.split(' ').filter((p) => p.startsWith('px') || p.includes(':px')).join(' ')} py-3`}
		>
			<!-- Breadcrumb Navigation -->
			<div class="flex min-w-0 flex-1 items-center">
				<DashboardBreadcrumb />
			</div>

			<!-- Right Actions -->
			<div class="flex shrink-0 items-center gap-1.5">
				<ProfileMenu
					{user}
					{theme}
					{activeRole}
					{onThemeChange}
					{onProfileToggle}
					{onAccordionToggle}
					{profileDetailsRef}
					{themeAccordionRef}
					{roleAccordionRef}
				/>
			</div>
		</div>
	</div>
</header>
