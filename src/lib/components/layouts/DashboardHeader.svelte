<script lang="ts">
	import ProfileMenu from './ProfileMenu.svelte';
	import { TEXT, COLOR, SPACING, RADIUS, TRANSITION, ELEVATION } from '$lib/config/design';
	import { getPageMetadata } from '$lib/stores/pageMetadata';
	import type { Theme } from '$lib/stores/theme';
	import type { User as DbUser } from '$lib/server/db/schema';
	import DashboardBreadcrumb from './DashboardBreadcrumb.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let currentRoleColor = $state<{
		text: string;
		bg: string;
		bgMuted: string;
		border: string;
	} | null>(null);

	$effect(() => {
		switch (activeRole) {
			case 'admin':
				currentRoleColor = COLOR.roleAdmin;
				break;
			case 'mentor':
				currentRoleColor = COLOR.roleMentor;
				break;
			case 'bd':
				currentRoleColor = COLOR.roleBd;
				break;
			case 'user':
				currentRoleColor = COLOR.roleUser;
				break;
			default:
				currentRoleColor = {
					text: COLOR.textMuted,
					bg: 'bg-zinc-100 dark:bg-zinc-800',
					bgMuted: 'bg-zinc-50/50 dark:bg-zinc-900/30',
					border: 'border-zinc-200/50 dark:border-zinc-700/50'
				};
		}
	});

	type HeaderUser = Partial<DbUser> & {
		avatarUrl?: string | null;
		notifications?: any[];
		unreadCount?: number;
		workspaces?: {
			organizations: any[];
			activeId: string;
			activeOrg: any;
		};
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

	const pageMetadataStore = getPageMetadata();

	let showNotifications = $state(false);

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
	class={`cubic-bezier(0.32, 0.72, 0, 1) sticky top-0 z-30 border-b-[0.5px] border-zinc-200/50 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-900/70 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}
>
	<div class="flex min-h-[56px] items-center px-4 py-3 md:px-6">
		<!-- Left Side: Toggle + Breadcrumb -->
		<div class="relative z-10 flex shrink-0 items-center">
			<!-- Enhanced Sidebar Toggle -->
			<button
				type="button"
				onclick={onSidebarToggle}
				aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				class={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:border-blue-500/50 hover:bg-blue-50 hover:text-blue-600 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-blue-400/50 dark:hover:bg-blue-900/40 dark:hover:text-blue-400`}
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

			<div class="mx-3 h-4 w-px bg-zinc-200 dark:bg-zinc-800"></div>
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
								active
									? 'text-neutral-900 dark:text-white'
									: 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
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
				class={`group hidden h-9 w-64 items-center gap-2 border border-zinc-200 bg-zinc-50/50 px-3 py-1.5 text-left transition-all hover:border-zinc-300 hover:bg-white md:flex dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 ${RADIUS.small}`}
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
							class="relative rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
						>
							🔔
							{#if unreadCount && unreadCount > 0}
								<span
									class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm"
								>
									{unreadCount > 9 ? '9+' : unreadCount}
								</span>
							{/if}
						</button>

						{#if showNotifications}
							<div
								class={`absolute right-0 z-50 mt-2 w-80 ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.card} overflow-hidden`}
							>
								<div class="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
									<h3 class="font-bold text-zinc-900 dark:text-zinc-100">Notifications</h3>
								</div>
								<div class="relative max-h-96 overflow-y-auto">
									{#if notifications && notifications.length > 0}
										{#each notifications as notif}
											<a
												href={notif.link || '#'}
												class="block border-b border-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50 {!notif.read
													? 'bg-blue-50/50 dark:bg-blue-900/10'
													: ''}"
											>
												<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
													{notif.title}
												</p>
												<p class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
													{notif.message}
												</p>
												<p class="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
													{new Date(notif.createdAt).toLocaleDateString('id-ID', {
														day: 'numeric',
														month: 'short',
														hour: '2-digit',
														minute: '2-digit'
													})}
												</p>
											</a>
										{/each}
									{:else}
										<div class="px-4 py-10 text-center text-sm font-medium text-zinc-500">
											No notifications
										</div>
									{/if}
								</div>
								{#if notifications && notifications.length > 0}
									<a
										href="/app/notifications"
										class="block rounded-b-xl border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-center text-sm font-bold text-blue-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800"
									>
										View All Notifications
									</a>
								{/if}
							</div>
						{/if}
					</div>
				{/if}

				{#if activeRole && currentRoleColor}
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
