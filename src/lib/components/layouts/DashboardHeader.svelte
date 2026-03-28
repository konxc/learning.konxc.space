<script lang="ts">
	import ProfileMenu from './ProfileMenu.svelte';
	import { TEXT, COLOR, SPACING, RADIUS } from '$lib/config/design';
	import { getPageMetadata } from '$lib/stores/pageMetadata';
	import type { Theme } from '$lib/stores/theme';
	import type { User as DbUser } from '$lib/server/db/schema';
	import DashboardBreadcrumb from './DashboardBreadcrumb.svelte';
	import { enhance } from '$app/forms';

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
		roleAccordionRef,
		sidebarCollapsed = false,
		notifications = [],
		unreadCount = 0,
		workspaces = { organizations: [], activeId: 'personal', activeOrg: null }
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
		roleAccordionRef?: HTMLDetailsElement | null;
		sidebarCollapsed?: boolean;
		notifications?: any[];
		unreadCount?: number;
		workspaces?: {
			organizations: any[];
			activeId: string;
			activeOrg: any;
		};
	} = $props();

	const pageMetadataStore = getPageMetadata();

	let showNotifications = $state(false);
</script>

<header
	class={`sticky top-0 z-30 border-b border-gray-200/60 bg-white/95 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-900/95 transition-[padding] duration-300 ${sidebarCollapsed ? 'pl-16' : 'pl-64'}`}
>
	<div class="flex items-center">
		<!-- Main Header Content: Title + Profile Menu -->
		<div
			class={`flex min-h-[56px] w-full flex-1 items-center justify-between gap-4 px-4 md:px-6 py-3`}
		>
			<!-- Left Side: Toggle + Breadcrumb -->
			<div class="flex min-w-0 items-center gap-3">
				<!-- Enhanced Sidebar Toggle -->
				<button
					type="button"
					onclick={onSidebarToggle}
					aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					class={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:border-blue-500/50 hover:bg-blue-50 hover:text-blue-600 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-blue-400/50 dark:hover:bg-blue-900/40 dark:hover:text-blue-400`}
				>
					<div class="absolute inset-0 scale-75 rounded-lg bg-blue-500/0 opacity-0 blur-xl transition-all group-hover:scale-125 group-hover:bg-blue-500/10 group-hover:opacity-100"></div>
					<svg 
						class={`relative z-10 h-5 w-5 transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${sidebarCollapsed ? 'rotate-180' : ''}`} 
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

				<div class="hidden lg:block h-4 w-px bg-zinc-200 dark:bg-zinc-800"></div>
				<DashboardBreadcrumb />
			</div>

			<!-- Right Side Actions -->
			<div class="flex flex-1 items-center justify-end gap-3 lg:gap-4">
				<!-- Search Trigger / Command Palette Trigger -->
				<button
					type="button"
					onclick={() => {
						const isMac = navigator.platform.toUpperCase().includes('MAC');
						window.dispatchEvent(new KeyboardEvent('keydown', { 
							key: 'k', 
							[isMac ? 'metaKey' : 'ctrlKey']: true,
							bubbles: true 
						}));
					}}
					class={`hidden md:flex items-center gap-2 px-3 py-1.5 h-9 w-64 ${RADIUS.small} border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-all text-left group dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:hover:border-zinc-600`}
				>
					<span class="text-sm text-zinc-500 dark:text-zinc-400">🔍</span>
					<span class="text-xs font-medium text-zinc-400 flex-1 truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Cari menu...</span>
					<kbd class="hidden lg:inline-flex items-center gap-1 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-black tracking-widest text-zinc-400 uppercase dark:border-zinc-700 dark:bg-zinc-900">
						{(() => {
							if (typeof navigator === 'undefined') return '⌘K';
							return navigator.platform.toUpperCase().includes('MAC') ? '⌘ K' : 'Ctrl K';
						})()}
					</kbd>
				</button>

				<div class="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>


			<!-- Right Actions -->
			<div class="flex shrink-0 items-center gap-1.5">
				<!-- Notifications Bell -->
				{#if notifications !== undefined}
					<div class="relative">
						<button
							onclick={() => (showNotifications = !showNotifications)}
							class="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
						>
							🔔
							{#if unreadCount && unreadCount > 0}
								<span
									class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
								>
									{unreadCount > 9 ? '9+' : unreadCount}
								</span>
							{/if}
						</button>

						{#if showNotifications}
							<div
								class="absolute top-full right-0 z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg"
							>
								<div class="border-b border-gray-100 px-4 py-3">
									<h3 class="font-bold text-gray-900">Notifications</h3>
								</div>
								<div class="max-h-96 overflow-y-auto">
									{#if notifications && notifications.length > 0}
										{#each notifications as notif}
											<a
												href={notif.link || '#'}
												class="block border-b border-gray-50 px-4 py-3 hover:bg-gray-50 {!notif.read
													? 'bg-blue-50'
													: ''}"
											>
												<p class="text-sm font-medium text-gray-900">{notif.title}</p>
												<p class="mt-0.5 text-xs text-gray-500">{notif.message}</p>
												<p class="mt-1 text-xs text-gray-400">
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
										<div class="px-4 py-8 text-center text-sm text-gray-500">No notifications</div>
									{/if}
								</div>
								{#if notifications && notifications.length > 0}
									<a
										href="/app/notifications"
										class="block border-t border-gray-100 px-4 py-3 text-center text-sm font-medium text-blue-600 hover:bg-gray-50"
									>
										View All Notifications
									</a>
								{/if}
							</div>
						{/if}
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
					{roleAccordionRef}
				/>
			</div>
		</div>
	</div>
</div>
</header>
