<script lang="ts">
	import ProfileMenu from './ProfileMenu.svelte';
	import { TEXT, COLOR } from '$lib/config/design';
	import { getPageMetadata } from '$lib/stores/pageMetadata';
	import type { Theme } from '$lib/stores/theme';

	interface User {
		fullName?: string | null;
		username?: string;
		email?: string | null;
		avatarUrl?: string | null;
		role?: string;
	}

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
		user: User | null;
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
	<div class="mx-auto flex max-w-screen-2xl items-center">
		<!-- Sidebar alignment spacer (matches sidebar width) -->
		<div class={`hidden shrink-0 md:block ${sidebarCollapsed ? 'w-16' : 'w-64'}`}></div>

		<!-- Main Header Content: Title + Profile Menu -->
		<div
			class="flex min-h-[56px] w-full flex-1 items-center justify-between gap-4 px-4 py-3 md:px-6"
		>
			<!-- Page Title & Description -->
			<div class="flex min-w-0 flex-1 items-center">
				{#if $pageMetadataStore.title}
					<div class="min-w-0 flex-1">
						<h1 class={`${TEXT.h3} ${COLOR.textPrimary} line-clamp-1 leading-tight font-semibold`}>
							{$pageMetadataStore.title}
						</h1>
						{#if $pageMetadataStore.description}
							<p class={`${TEXT.small} ${COLOR.textSecondary} mt-0.5 line-clamp-1 leading-tight`}>
								{$pageMetadataStore.description}
							</p>
						{:else}
							<!-- Spacer untuk konsistensi tinggi saat tidak ada description -->
							<div class="mt-0.5 h-4"></div>
						{/if}
					</div>
				{:else}
					<!-- Spacer untuk konsistensi tinggi saat tidak ada title -->
					<div class="min-w-0 flex-1">
						<div class="h-6"></div>
						<div class="mt-0.5 h-4"></div>
					</div>
				{/if}
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
