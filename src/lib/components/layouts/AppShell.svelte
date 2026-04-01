<script lang="ts">
	import { page } from '$app/stores';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import Sidebar from './Sidebar.svelte';
	import DashboardHeader from './DashboardHeader.svelte';
	import DashboardBreadcrumb from './DashboardBreadcrumb.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { initTheme, setTheme, getStoredTheme, applyTheme, type Theme } from '$lib/stores/theme';
	import WorkspaceDropdown from './WorkspaceDropdown.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import type { NavItem } from '$lib/server/rbac';
	import { createPageMetadata } from '$lib/stores/pageMetadata';
	import { fly, fade } from 'svelte/transition';

	export interface AppShellData {
		user?: {
			fullName?: string | null;
			username?: string;
			email?: string | null;
			avatarUrl?: string | null;
			role?: string;
			notifications?: any[];
			unreadCount?: number;
		} | null;
		navItems: NavItem[];
		activeRole?: string | null;
		effectiveRole?: string | null;
		availableRoles?: string[];
		workspaces?: {
			organizations: any[];
			activeId: string;
			activeOrg: any;
		};
	}

	let { data, children }: { data: AppShellData; children: Snippet } = $props();

	let theme = $state<Theme>('system');
	let sidebarCollapsed = $state(false);
	let workspaceSwitcherOpen = $state(false);
	let triggerRect = $state<DOMRect | null>(null);

	// SSE-driven reactive unread count — starts from server-loaded value
	let liveUnreadCount = $state<number>(data.user?.unreadCount ?? 0);

	// Create page metadata context for children components
	createPageMetadata();

	// Refs untuk profile menu dan accordions
	let profileDetailsRef: HTMLDetailsElement | undefined = $state(undefined);
	let themeAccordionRef: HTMLDetailsElement | undefined = $state(undefined);

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

		// SSE: real-time notification count updates
		if (data.user) {
			let es: EventSource | null = null;
			let retryTimeout: ReturnType<typeof setTimeout> | null = null;

			function connect() {
				es = new EventSource('/api/notifications/stream');

				es.onmessage = (event) => {
					try {
						const payload = JSON.parse(event.data) as {
							unreadCount?: number;
							newNotifications?: { id: string; type: string; title: string; message: string }[];
						};
						if (typeof payload.unreadCount === 'number') {
							liveUnreadCount = payload.unreadCount;
						}
					} catch {
						// malformed event — ignore
					}
				};

				es.onerror = () => {
					es?.close();
					es = null;
					// Reconnect after 10 seconds
					retryTimeout = setTimeout(connect, 10000);
				};
			}

			connect();

			return () => {
				es?.close();
				if (retryTimeout) clearTimeout(retryTimeout);
			};
		}
	});

	function handleThemeChange(newTheme: Theme, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		theme = newTheme;
		setTheme(newTheme);
	}

	// Computed color-scheme meta value based on theme
	const colorScheme = $derived(theme === 'system' ? 'light dark' : theme);
</script>

<svelte:head>
	<meta name="color-scheme" content={colorScheme} />
</svelte:head>

<div class={`min-h-screen ${COLOR.bg} ${COLOR.textPrimary} antialiased`}>
	<DashboardHeader
		user={data.user ?? null}
		{theme}
		activeRole={data.activeRole ?? null}
		availableRoles={data.availableRoles ?? []}
		onThemeChange={handleThemeChange}
		{profileDetailsRef}
		{themeAccordionRef}
		{sidebarCollapsed}
		onSidebarToggle={() => {
			sidebarCollapsed = !sidebarCollapsed;
			if (workspaceSwitcherOpen) workspaceSwitcherOpen = false;
		}}
		notifications={data.user?.notifications}
		unreadCount={liveUnreadCount}
		workspaces={data.workspaces}
	/>

	<div class="flex">
		<!-- Enhanced Sidebar Component -->
		<Sidebar
			items={data.navItems}
			activeRole={data.activeRole ?? null}
			effectiveRole={data.effectiveRole ?? null}
			availableRoles={data.availableRoles ?? []}
			config={{
				collapsible: true,
				grouped: true,
				searchable: true,
				showBadges: true
			}}
			bind:isCollapsed={sidebarCollapsed}
			workspaces={data.workspaces}
			bind:workspaceSwitcherOpen
			bind:triggerRect
		/>

		<main
			id="main-content"
			class={`min-w-0 flex-1 overflow-x-hidden scroll-smooth transition-opacity duration-300 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'} ${TRANSITION.spring}`}
		>
			<!-- Skip to content link for accessibility -->
			<a
				href="#main-content"
				class={`sr-only no-underline focus:not-sr-only focus:absolute focus:top-[72px] focus:left-2 focus:z-50 ${RADIUS.button} ${COLOR.accentBg} focus:px-4 focus:py-2 focus:text-white ${TEXT.button} ${ELEVATION.card} focus:outline-none`}
				>Skip to main content</a
			>

			<div class="min-h-[calc(100vh-56px)] w-full">
				<!-- Page Content with Smooth Transition -->
				<div class="min-h-[calc(100vh-116px)] w-full px-4 pt-6 pb-10 sm:px-6 md:pt-8 lg:px-8">
					<div class="relative w-full">
						{#key $page.url.pathname}
							<div
								in:fly={{ y: 15, duration: 400, delay: 200, opacity: 0 }}
								out:fade={{ duration: 150 }}
								class="contents"
							>
								{@render children?.()}
							</div>
						{/key}
					</div>
				</div>
			</div>
		</main>
	</div>

	{#if workspaceSwitcherOpen && triggerRect && data.workspaces}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- Backdrop above header (z-30) and sidebar (z-40) to blur them -->
		<div
			class="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm"
			transition:fade={{ duration: 200 }}
			onclick={() => (workspaceSwitcherOpen = false)}
			role="button"
			tabindex="-1"
		></div>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- Trigger spacer: covers trigger button area, above backdrop, keeps it clear and clickable -->
		<div
			class="fixed z-51 cursor-pointer"
			style="left: {triggerRect.left}px; top: {triggerRect.top}px; width: {triggerRect.width}px; height: {triggerRect.height}px;"
			onclick={() => (workspaceSwitcherOpen = !workspaceSwitcherOpen)}
			role="button"
			tabindex="-1"
			aria-label="Tutup pemilih ruang kerja"
		></div>

		<WorkspaceDropdown
			workspaces={data.workspaces}
			{triggerRect}
			bind:isOpen={workspaceSwitcherOpen}
			isCollapsed={sidebarCollapsed}
		/>
	{/if}

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
