<script lang="ts">
	import ProfileMenu from './ProfileMenu.svelte';
	import { TEXT, COLOR, SPACING } from '$lib/config/design';
	import { getPageMetadata } from '$lib/stores/pageMetadata';
	import type { Theme } from '$lib/stores/theme';
	import type { User as DbUser } from '$lib/server/db/schema';
	import DashboardBreadcrumb from './DashboardBreadcrumb.svelte';
	import { enhance } from '$app/forms';

	type HeaderUser = Partial<DbUser> & { avatarUrl?: string | null; notifications?: any[]; unreadCount?: number };

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
		sidebarCollapsed = false,
		notifications = [],
		unreadCount = 0
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
		notifications?: any[];
		unreadCount?: number;
	} = $props();

	const pageMetadataStore = getPageMetadata();
	
	let showNotifications = $state(false);
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
				<!-- Notifications Bell -->
				{#if notifications !== undefined}
					<div class="relative">
						<button
							onclick={() => (showNotifications = !showNotifications)}
							class="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
						>
							🔔
							{#if unreadCount && unreadCount > 0}
								<span class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
									{unreadCount > 9 ? '9+' : unreadCount}
								</span>
							{/if}
						</button>
						
						{#if showNotifications}
							<div class="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg">
								<div class="border-b border-gray-100 px-4 py-3">
									<h3 class="font-bold text-gray-900">Notifications</h3>
								</div>
								<div class="max-h-96 overflow-y-auto">
									{#if notifications && notifications.length > 0}
										{#each notifications as notif}
											<a
												href={notif.link || '#'}
												class="block border-b border-gray-50 px-4 py-3 hover:bg-gray-50 {!notif.read ? 'bg-blue-50' : ''}"
											>
												<p class="text-sm font-medium text-gray-900">{notif.title}</p>
												<p class="text-xs text-gray-500 mt-0.5">{notif.message}</p>
												<p class="text-xs text-gray-400 mt-1">
													{new Date(notif.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
												</p>
											</a>
										{/each}
									{:else}
										<div class="px-4 py-8 text-center text-sm text-gray-500">
											No notifications
										</div>
									{/if}
								</div>
								{#if notifications && notifications.length > 0}
									<a href="/app/notifications" class="block border-t border-gray-100 px-4 py-3 text-center text-sm font-medium text-blue-600 hover:bg-gray-50">
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
</header>
