<script lang="ts">
	import ProfileMenu from './ProfileMenu.svelte';
	import NotificationsDropdown from '$lib/components/ui/NotificationsDropdown.svelte';
	import {
		TEXT,
		COLOR,
		SPACING,
		RADIUS,
		TRANSITION,
		ELEVATION,
		Z_INDEX,
		FOCUS,
		NOTIFICATION_DOT
	} from '$lib/config/design';
	import { getPageMetadata } from '$lib/stores/pageMetadata';
	import type { Theme } from '$lib/stores/theme';
	import type { User as DbUser } from '$lib/server/db/schema';
	import type { Workspace } from '$lib/types/layout';
	import DashboardBreadcrumb from './DashboardBreadcrumb.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { useRoleColor } from '$lib/utils/useRoleColor';

	type HeaderUser = Partial<DbUser> & {
		avatarUrl?: string | null;
		notifications?: any[];
		unreadCount?: number;
		workspaces?: Workspace;
	};

	let {
		user,
		theme,
		activeRole,
		onThemeChange,
		onProfileToggle,
		onAccordionToggle,
		onSidebarToggle,
		profileDetailsRef,
		themeAccordionRef,
		sidebarCollapsed = false,
		notifications = [],
		unreadCount = 0,
		workspaces = { organizations: [], activeId: 'personal', activeOrg: null },
		availableRoles = [],
		breadcrumbs,
		actions
	}: {
		user: HeaderUser | null;
		theme: Theme;
		activeRole?: string | null;
		onThemeChange: (theme: Theme, e: MouseEvent) => void;
		onProfileToggle?: (e: Event) => void;
		onAccordionToggle?: (accordionType: 'theme' | 'role', e: Event) => void;
		onSidebarToggle?: () => void;
		profileDetailsRef?: HTMLDetailsElement;
		themeAccordionRef?: HTMLDetailsElement;
		sidebarCollapsed?: boolean;
		notifications?: any[];
		unreadCount?: number;
		workspaces?: {
			organizations: any[];
			activeId: string;
			activeOrg: any;
		};
		availableRoles?: string[];
		breadcrumbs?: import('svelte').Snippet;
		actions?: import('svelte').Snippet;
	} = $props();

	let currentRoleColor = $derived(useRoleColor(activeRole));

	const pageMetadataStore = getPageMetadata();

	let showNotifications = $state(false);
	let liveUnreadCount = $state(unreadCount);

	// Sync dari prop — AppShell sudah handle SSE dan update unreadCount
	$effect(() => {
		liveUnreadCount = unreadCount;
	});

	// Tab selection handler for PageData-driven tabs
	function handleTabSelect(tabId: string) {
		const url = new URL($page.url);
		if (tabId === 'profile' || !tabId) {
			url.searchParams.delete('tab');
		} else {
			url.searchParams.set('tab', tabId);
		}
		goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true });
	}
</script>

<header
	class={`cubic-bezier(0.32, 0.72, 0, 1) sticky top-0 ${Z_INDEX.header} border-b-[0.5px] ${COLOR.cardBorder} ${COLOR.card} transition-all duration-300 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}
>
	<div class="flex min-h-[56px] items-center px-4 py-3 md:px-6">
		<!-- Left Side: Toggle + Breadcrumb -->
		<div class="relative z-10 flex shrink-0 items-center">
			<!-- Enhanced Sidebar Toggle -->
			<button
				type="button"
				onclick={onSidebarToggle}
				aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				class={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${COLOR.cardBorder} ${COLOR.surface} ${COLOR.textSecondary} shadow-sm transition-all hover:border-blue-500/50 hover:bg-blue-50 hover:text-blue-600 active:scale-95 dark:hover:border-blue-400/50 dark:hover:bg-blue-900/40 dark:hover:text-blue-400`}
			>
				<div
					class="absolute inset-0 scale-75 rounded-lg bg-blue-500/0 opacity-0 blur-xl transition-all group-hover:scale-125 group-hover:bg-blue-500/10 group-hover:opacity-100"
				></div>
				<svg
					class={`cubic-bezier(0.34, 1.56, 0.64, 1) relative z-10 h-5 w-5 transition-transform duration-500 ${sidebarCollapsed ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M11 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
			</button>

			<div class="mx-3 h-4 w-px ${COLOR.neutral}"></div>
			{#if breadcrumbs}
				{@render breadcrumbs()}
			{:else}
				<DashboardBreadcrumb />
			{/if}
		</div>

		<!-- Center Content: Navigation Tabs -->
		<div class="mx-auto">
			{#if $page.data.headerTabs}
				<nav
					class="scrollbar-hide flex items-center gap-8 overflow-x-auto overflow-y-hidden py-1"
					aria-label="Tabs"
				>
					{#each $page.data.headerTabs.tabs as tab}
						{@const active = $page.data.headerTabs.activeTab === tab.id}
						<button
							type="button"
							onclick={() => handleTabSelect(tab.id)}
							class={`relative px-1 py-1 whitespace-nowrap ${TEXT.button} ${TRANSITION.colors} ${
								active ? COLOR.textPrimary : `${COLOR.textMuted} hover:${COLOR.textSecondary}`
							}`}
							aria-current={active ? 'page' : undefined}
						>
							{tab.label}
							{#if active}
								<div
									class="absolute right-0 -bottom-[12px] left-0 h-0.5 bg-neutral-900 dark:bg-white"
								></div>
							{/if}
						</button>
					{/each}
				</nav>
			{/if}
		</div>

		<!-- Right Side Actions -->
		<div class="relative z-10 flex shrink-0 items-center gap-3 lg:gap-4">
			{#if actions}
				{@render actions()}
			{/if}
			<!-- Search Trigger / Command Palette Trigger -->
			<button
				type="button"
				onclick={() => {
					const isMac = navigator.platform.toUpperCase().includes('MAC');
					window.dispatchEvent(
						new KeyboardEvent('keydown', {
							key: 'k',
							[isMac ? 'metaKey' : 'ctrlKey']: true,
							bubbles: true
						})
					);
				}}
				class={`group hidden h-9 w-64 items-center gap-2 border ${COLOR.cardBorder} ${COLOR.bg} px-3 py-1.5 text-left transition-all hover:border-zinc-300 hover:${COLOR.surface} md:flex dark:hover:border-zinc-600 ${RADIUS.small}`}
			>
				<span class="text-sm text-zinc-500 dark:text-zinc-400">🔍</span>
				<span
					class="flex-1 truncate text-xs font-medium text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
					>Cari menu...</span
				>
				<kbd
					class="hidden items-center gap-1 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-black tracking-widest text-zinc-400 uppercase lg:inline-flex dark:border-zinc-700 dark:bg-zinc-900"
				>
					{(() => {
						if (typeof navigator === 'undefined') return '⌘K';
						return navigator.platform.toUpperCase().includes('MAC') ? '⌘ K' : 'Ctrl K';
					})()}
				</kbd>
			</button>

			<div class="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>

			<!-- Notifications & Profile -->
			<div class="flex shrink-0 items-center gap-1.5">
				<!-- Notifications Bell -->
				{#if notifications !== undefined}
					<div class="relative">
						<button
							onclick={() => (showNotifications = !showNotifications)}
							class={`relative rounded-full p-2 ${COLOR.textSecondary} transition-colors ${COLOR.surfaceHover}`}
							aria-label="Notifikasi"
						>
							🔔
							{#if liveUnreadCount > 0}
								<span
									class={`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ${NOTIFICATION_DOT.red} text-[10px] font-bold text-white shadow-sm`}
								>
									{liveUnreadCount > 9 ? '9+' : liveUnreadCount}
								</span>
							{/if}
						</button>

						<NotificationsDropdown
							notifications={notifications as any[]}
							unreadCount={liveUnreadCount}
							show={showNotifications}
							onClose={() => (showNotifications = false)}
						/>
					</div>
				{/if}

				{#if activeRole && activeRole !== 'user' && currentRoleColor}
					<div
						class={`flex items-center gap-1.5 ${currentRoleColor.bgMuted} ${currentRoleColor.border} border ${RADIUS.badge} px-2 py-0.5 ${TRANSITION.all}`}
					>
						<span class={`h-2 w-2 ${currentRoleColor.bg} ${RADIUS.badge}`}></span>
						<span class={`${TEXT.small} ${currentRoleColor.text} font-bold capitalize`}>
							{activeRole === 'bd' ? 'Business Dev' : activeRole}
						</span>
					</div>
				{/if}

				<ProfileMenu
					{user}
					{theme}
					{activeRole}
					{onThemeChange}
					{onProfileToggle}
					{onAccordionToggle}
					{profileDetailsRef}
					{themeAccordionRef}
					{availableRoles}
				/>
			</div>
		</div>
	</div>
</header>
