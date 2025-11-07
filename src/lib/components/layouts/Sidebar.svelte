<script lang="ts">
	import { page } from '$app/stores';
	import { COLOR, RADIUS, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import type { NavItem, NavGroup } from '$lib/server/rbac';
	import Logo from './Logo.svelte';

	function groupNavItems(items: NavItem[]): NavGroup[] {
		const groups: Record<string, NavItem[]> = {};
		items.forEach((item) => {
			const category = item.category || 'other';
			if (!groups[category]) groups[category] = [];
			groups[category].push(item);
		});

		const categoryLabels: Record<string, string> = {
			dashboard: 'Dashboard',
			learning: 'Learning',
			management: 'Management',
			admin: 'Administration',
			crm: 'CRM',
			other: 'Other'
		};

		return Object.entries(groups).map(([category, items]) => ({
			label: categoryLabels[category] || category,
			items
		}));
	}

	export interface SidebarProps {
		items: NavItem[];
		config?: {
			collapsible?: boolean;
			grouped?: boolean;
			searchable?: boolean;
			showBadges?: boolean;
		};
		isCollapsed?: boolean;
		onToggle?: () => void;
	}

	let { items, config = {}, isCollapsed = $bindable(false), onToggle }: SidebarProps = $props();
	const { collapsible = true, grouped = true, searchable = true, showBadges = true } = config;

	// Sync state dengan localStorage dan data attribute
	$effect(() => {
		if (typeof window === 'undefined') return;
		const value = String(isCollapsed);
		localStorage.setItem('sidebar-collapsed', value);
		document.documentElement.setAttribute('data-sidebar-collapsed', value);
	});

	function handleToggle() {
		isCollapsed = !isCollapsed;
		onToggle?.();
	}

	const mockItems: NavItem[] = [
		{ label: 'Dashboard', href: '/dashboard', icon: '📊', category: 'dashboard' },
		{ label: 'My Courses', href: '/dashboard/my-courses', icon: '📚', category: 'learning' },
		{ label: 'Certificates', href: '/dashboard/certificates', icon: '🎓', category: 'learning' },
		{ label: 'Manage Courses', href: '/dashboard/admin/courses', icon: '📖', category: 'admin' },
		{ label: 'Users', href: '/dashboard/admin/users', icon: '👥', category: 'admin' },
		{
			label: 'Mentor Applications',
			href: '/dashboard/admin/mentor-applications',
			icon: '📝',
			category: 'admin',
			badge: '2',
			badgeColor: 'yellow'
		},
		{ label: 'Coupons', href: '/dashboard/admin/coupons', icon: '🎫', category: 'admin' },
		{ label: 'Payment Proofs', href: '/dashboard/admin/payments', icon: '💳', category: 'admin' },
		{ label: 'CRM: Waiting List', href: '/dashboard/crm/waiting-list', icon: '⏳', category: 'crm' }
	];

	const allItems = items.length > 0 ? items : mockItems;
	let searchQuery = $state('');
	let searchInputValue = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function handleSearchInput(value: string) {
		searchInputValue = value;
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			searchQuery = value;
		}, 250);
	}

	const filteredItems = $derived(
		searchQuery
			? allItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
			: allItems
	);

	const navGroups = $derived(grouped ? groupNavItems(filteredItems) : [{ items: filteredItems }]);
	let collapsedGroups = $state<Set<string>>(new Set());

	function toggleGroup(category: string) {
		const newSet = new Set(collapsedGroups);
		if (newSet.has(category)) {
			newSet.delete(category);
		} else {
			newSet.add(category);
		}
		collapsedGroups = newSet;
	}

	function isActive(href: string): boolean {
		if (!$page.url) return false;
		const pathname = $page.url.pathname;
		if (href === '/dashboard') return pathname === '/dashboard';
		return pathname === href || pathname.startsWith(href + '/');
	}

	$effect(() => {
		if (!collapsible || !$page.url) return;
		const newGroups = new Set(collapsedGroups);
		let changed = false;
		navGroups.forEach((group) => {
			const hasActive = group.items.some((item) => isActive(item.href));
			if (hasActive && group.label && newGroups.has(group.label)) {
				newGroups.delete(group.label);
				changed = true;
			}
		});
		if (changed) collapsedGroups = newGroups;
	});
</script>

<aside
	class="sidebar-container fixed top-0 left-0 hidden h-screen overflow-x-hidden overflow-y-auto border-r border-gray-200/60 bg-white/95 backdrop-blur-sm md:block dark:border-neutral-800/60 dark:bg-neutral-900/95 ${ELEVATION.base} z-40 transition-[width] duration-300 ease-out {isCollapsed
		? 'w-16'
		: 'w-64'}"
	aria-label="Sidebar navigation"
	role="navigation"
>
	<div class="flex h-full flex-col">
		<!-- Logo Section -->
		<div
			class="flex items-center {isCollapsed
				? 'flex-col justify-center gap-2'
				: 'justify-between'} border-b border-gray-200/60 px-3 py-3 dark:border-neutral-800/60"
		>
			{#if !isCollapsed}
				<div class="ml-4">
					<Logo size="md" showText={true} />
				</div>
				<button
					type="button"
					onclick={handleToggle}
					aria-label="Collapse sidebar"
					class={`${RADIUS.button} p-1.5 ${COLOR.textSecondary} ${TRANSITION.all} hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:hover:bg-neutral-800`}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
				</button>
			{:else}
				<Logo size="sm" showText={false} />
				<button
					type="button"
					onclick={handleToggle}
					aria-label="Expand sidebar"
					class={`w-full ${RADIUS.button} p-2 ${COLOR.textSecondary} bg-blue-50/50 dark:bg-blue-950/20 ${TRANSITION.all} hover:bg-blue-100 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:hover:bg-blue-950/30`}
				>
					<svg class="mx-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 5l7 7m0 0l-7 7m7-7H6"
						/>
					</svg>
				</button>
			{/if}
		</div>

		<!-- Search Bar -->
		{#if searchable && !isCollapsed}
			<div class="border-b border-gray-200/60 p-2 dark:border-neutral-800/60">
				<input
					type="text"
					placeholder="Cari menu..."
					value={searchInputValue}
					class={`w-full ${RADIUS.input} border border-gray-300 px-3 py-2 dark:border-neutral-600 ${TEXT.small} ${COLOR.textPrimary} bg-white outline-none dark:bg-neutral-800 ${TRANSITION.all} placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:placeholder:text-neutral-500 dark:hover:border-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/50`}
					oninput={(e) => handleSearchInput((e.target as HTMLInputElement).value)}
				/>
			</div>
		{/if}

		<!-- Navigation -->
		<nav class="sidebar-nav flex-1 space-y-2 overflow-y-auto p-3" aria-label="Main navigation">
			{#if filteredItems.length === 0 && !isCollapsed}
				<div class={`px-3 py-8 text-center ${TEXT.small} ${COLOR.textMuted}`}>
					<p>{searchQuery ? 'Tidak ada hasil ditemukan' : 'Tidak ada menu tersedia'}</p>
				</div>
			{:else}
				{#each navGroups as group}
					{@const groupKey = group.label || 'default'}
					{@const isGroupCollapsed = collapsible && collapsedGroups.has(groupKey)}
					<div class="sidebar-group space-y-1">
						{#if grouped && group.label && !isCollapsed}
							{#if collapsible}
								<button
									type="button"
									onclick={() => toggleGroup(groupKey)}
									class={`flex w-full items-center justify-between ${RADIUS.small} px-2 py-1.5 ${TEXT.small} font-semibold tracking-wider uppercase ${COLOR.textMuted} ${TRANSITION.colors} hover:text-gray-900 dark:hover:text-gray-100`}
								>
									<span>{group.label}</span>
									<svg
										class={`h-4 w-4 ${TRANSITION.all} ${isGroupCollapsed ? 'rotate-0' : 'rotate-90'}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							{:else}
								<div
									class={`${TEXT.small} font-semibold tracking-wider uppercase ${COLOR.textMuted} px-2 py-1.5`}
								>
									{group.label}
								</div>
							{/if}
						{/if}

						{#if isCollapsed || !isGroupCollapsed}
							<div class="space-y-0.5">
								{#each group.items as item}
									{@const active = isActive(item.href)}
									<a
										href={item.href}
										class={`sidebar-item group relative flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-2.5 px-2.5'} ${RADIUS.small} py-2 ${TEXT.button} ${TRANSITION.all} ${
											active
												? `${COLOR.textPrimary} bg-blue-50 font-semibold shadow-sm dark:bg-blue-950/30`
												: `${COLOR.textSecondary} hover:bg-gray-100/80 hover:text-gray-900 dark:hover:bg-neutral-800/60 dark:hover:text-gray-100`
										} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1`}
										aria-current={active ? 'page' : undefined}
										title={isCollapsed ? item.label : undefined}
									>
										{#if active}
											<span
												class="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 shadow-sm dark:bg-blue-400"
												aria-hidden="true"
											></span>
										{/if}
										{#if item.icon}
											<span class="sidebar-icon shrink-0 text-base leading-none" aria-hidden="true">
												{item.icon}
											</span>
										{/if}
										{#if !isCollapsed}
											<span class="sidebar-label flex-1 truncate">{item.label}</span>
											{#if item.badge && showBadges}
												<span
													class={`sidebar-badge shrink-0 rounded-full px-1.5 py-0.5 ${TEXT.small} leading-none font-medium ${
														item.badgeColor === 'red'
															? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
															: item.badgeColor === 'green'
																? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
																: item.badgeColor === 'yellow'
																	? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400'
																	: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
													}`}
												>
													{item.badge}
												</span>
											{/if}
											{#if active}
												<span
													class="absolute right-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 opacity-60 dark:bg-blue-400"
													aria-hidden="true"
												></span>
											{/if}
										{:else if item.badge && showBadges}
											<span
												class={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ${TEXT.small} leading-none text-white ${
													item.badgeColor === 'red'
														? 'bg-red-500'
														: item.badgeColor === 'green'
															? 'bg-green-500'
															: item.badgeColor === 'yellow'
																? 'bg-yellow-500'
																: 'bg-blue-500'
												}`}
												aria-label={`${item.badge} notifications`}
											>
												{item.badge}
											</span>
										{/if}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</nav>
	</div>
</aside>

<style>
	/* Prevent flicker: CSS reads from data attribute set by inline script */
	:global(html[data-sidebar-collapsed='true'] .sidebar-container) {
		width: 4rem;
	}
	:global(html[data-sidebar-collapsed='false'] .sidebar-container),
	:global(html:not([data-sidebar-collapsed]) .sidebar-container) {
		width: 16rem;
	}

	.sidebar-container::-webkit-scrollbar {
		width: 6px;
	}
	.sidebar-container::-webkit-scrollbar-track {
		background: transparent;
	}
	.sidebar-container::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 3px;
	}
	.sidebar-container::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.15);
	}
	@media (prefers-color-scheme: dark) {
		.sidebar-container::-webkit-scrollbar-thumb {
			background: rgba(255, 255, 255, 0.15);
		}
		.sidebar-container::-webkit-scrollbar-thumb:hover {
			background: rgba(255, 255, 255, 0.25);
		}
	}

	.sidebar-item::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		opacity: 0;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.04), rgba(147, 51, 234, 0.04));
		transition: opacity 0.2s ease-out;
		pointer-events: none;
	}
	.sidebar-item:hover::before {
		opacity: 1;
	}
	.sidebar-item:active {
		transform: scale(0.98);
	}

	@media (prefers-reduced-motion: reduce) {
		.sidebar-item,
		.sidebar-item::before,
		.sidebar-container {
			transition: none;
		}
	}
</style>
