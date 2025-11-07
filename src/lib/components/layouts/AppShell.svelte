<script lang="ts">
	import { page } from '$app/stores';
	import Toaster from '$lib/components/Toaster.svelte';
	import { toasts } from '$lib/stores/toast';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import Sidebar from './Sidebar.svelte';
	import DashboardHeader from './DashboardHeader.svelte';
	import DashboardBreadcrumb from './DashboardBreadcrumb.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { initTheme, setTheme, getStoredTheme, applyTheme, type Theme } from '$lib/stores/theme';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import type { NavItem } from '$lib/server/rbac';
	import { createPageMetadata } from '$lib/stores/pageMetadata';

	export interface AppShellData {
		user?: {
			fullName?: string | null;
			username?: string;
			email?: string | null;
			avatarUrl?: string | null;
			role?: string;
		} | null;
		navItems: NavItem[];
		activeRole?: string | null;
	}

	let { data, children }: { data: AppShellData; children: Snippet } = $props();

	let theme = $state<Theme>('system');
	let sidebarCollapsed = $state(false);

	// Create page metadata context for children components
	createPageMetadata();

	// Refs untuk profile menu dan accordions
	let profileDetailsRef: HTMLDetailsElement | undefined = $state(undefined);
	let themeAccordionRef: HTMLDetailsElement | undefined = $state(undefined);
	let roleAccordionRef: HTMLDetailsElement | null = $state(null);

	onMount(() => {
		// Initialize sidebar state from data attribute (set by inline script)
		if (typeof document !== 'undefined') {
			const attr = document.documentElement.getAttribute('data-sidebar-collapsed');
			sidebarCollapsed = attr === 'true';
		}

		initTheme();
		theme = getStoredTheme();

		// Listen for system theme changes
		if (typeof window !== 'undefined') {
			const m = window.matchMedia('(prefers-color-scheme: dark)');
			const handler = () => {
				if (getStoredTheme() === 'system') {
					theme = 'system';
					applyTheme('system');
				}
			};
			m.addEventListener('change', handler);
		}
	});

	function handleThemeChange(newTheme: Theme, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		theme = newTheme;
		setTheme(newTheme);
	}

	// Handle accordion toggle - handler kosong, tidak ada action khusus
	function handleAccordionToggle(accordionType: 'theme' | 'role', e: Event) {
		// Tidak ada action khusus yang diperlukan
	}

	// Handle profile menu toggle - handler kosong, tidak ada action khusus
	function handleProfileToggle(e: Event) {
		// Tidak ada action khusus yang diperlukan
	}

	// Computed color-scheme meta value based on theme
	const colorScheme = $derived(theme === 'system' ? 'light dark' : theme);
</script>

<svelte:head>
	<meta name="color-scheme" content={colorScheme} />
</svelte:head>

<div class={`min-h-screen ${COLOR.bg} ${COLOR.textPrimary} antialiased`}>
	<Toaster messages={$toasts} />
	<DashboardHeader
		user={data.user ?? null}
		{theme}
		activeRole={data.activeRole ?? null}
		onThemeChange={handleThemeChange}
		onProfileToggle={handleProfileToggle}
		onAccordionToggle={handleAccordionToggle}
		{profileDetailsRef}
		{themeAccordionRef}
		{roleAccordionRef}
		{sidebarCollapsed}
	/>

	<div class={`mx-auto flex max-w-screen-2xl`}>
		<!-- Enhanced Sidebar Component -->
		<Sidebar
			items={data.navItems}
			config={{
				collapsible: true,
				grouped: true,
				searchable: true,
				showBadges: true
			}}
			bind:isCollapsed={sidebarCollapsed}
		/>

		<main
			id="main-content"
			class="min-w-0 flex-1 overflow-x-hidden scroll-smooth {sidebarCollapsed
				? 'md:ml-16'
				: 'md:ml-64'} ${TRANSITION.all}"
		>
			<!-- Skip to content link for accessibility -->
			<a
				href="#main-content"
				class={`sr-only no-underline focus:not-sr-only focus:absolute focus:top-[72px] focus:left-2 focus:z-50 ${RADIUS.button} ${COLOR.accentBg} focus:px-4 focus:py-2 focus:text-white ${TEXT.button} ${ELEVATION.card} focus:outline-none`}
				>Skip to main content</a
			>

			<div class="mx-auto min-h-[calc(100vh-56px)] w-full max-w-screen-2xl">
				<DashboardBreadcrumb />

				<!-- Page Content -->
				<div class="min-h-[calc(100vh-116px)] pb-6 md:pb-8">
					<div class="w-full">
						{@render children?.()}
					</div>
				</div>
			</div>
		</main>
	</div>

	<CommandPalette items={data.navItems} />
</div>

<style>
	/* Print styles */
	@media print {
		.skip-to-content-link {
			display: none;
		}
	}
</style>
