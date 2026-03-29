<script lang="ts">
	import { page } from '$app/stores';
	import { COLOR, RADIUS, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import type { NavItem, NavGroup } from '$lib/server/rbac';
	import Logo from './Logo.svelte';
	import WorkspaceSwitcher from './WorkspaceSwitcher.svelte';
	import RoleSegmentedControl from './RoleSegmentedControl.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	function groupNavItems(items: NavItem[]): NavGroup[] {
		const groups: Record<string, NavItem[]> = {};
		items.forEach((item) => {
			const category = item.category || 'other';
			if (!groups[category]) groups[category] = [];
			groups[category].push(item);
		});

		const categoryLabels: Record<string, string> = {
			dashboard: '',
			workspace: 'Workspace',
			learning: 'Learning',
			management: 'Management',
			platform: 'Platform Admin',
			admin: 'Administration',
			crm: 'CRM',
			other: 'Other'
		};

		return Object.entries(groups).map(([category, items]) => ({
			label: categoryLabels[category] ?? category, // Use ?? instead of || so '' is preserved
			items
		}));
	}

	export interface SidebarProps {
		items: NavItem[];
		activeRole?: string | null;
		effectiveRole?: string | null;
		availableRoles?: string[];
		config?: {
			collapsible?: boolean;
			grouped?: boolean;
			searchable?: boolean;
			showBadges?: boolean;
		};
		isCollapsed?: boolean;
		onToggle?: () => void;
		workspaces?: {
			organizations: any[];
			activeId: string;
			activeOrg: any;
		};
	}

	let {
		items,
		activeRole,
		effectiveRole,
		availableRoles = [],
		config = {},
		isCollapsed = $bindable(false),
		onToggle,
		workspaces
	}: SidebarProps = $props();
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
		{ label: 'Dashboard', href: '/app', icon: 'dashboard', category: 'dashboard' },
		{ label: 'My Courses', href: '/app/my-courses', icon: 'book-open', category: 'learning' },
		{ label: 'Certificates', href: '/app/certificates', icon: 'graduation', category: 'learning' },
		{ label: 'Manage Courses', href: '/app/admin/courses', icon: 'book', category: 'admin' },
		{ label: 'Users', href: '/app/admin/users', icon: 'users', category: 'admin' },
		{
			label: 'Mentor Applications',
			href: '/app/admin/mentor-applications',
			icon: 'file-text',
			category: 'admin',
			badge: '2',
			badgeColor: 'yellow'
		},
		{ label: 'Coupons', href: '/app/admin/coupons', icon: 'coupon', category: 'admin' },
		{ label: 'Payment Proofs', href: '/app/admin/payments', icon: 'credit-card', category: 'admin' },
		{ label: 'CRM: Waiting List', href: '/app/crm/waiting-list', icon: 'clock', category: 'crm' }
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

	const currentPathname = $derived($page.url?.pathname ?? '');

	function isActive(href: string): boolean {
		if (!currentPathname) return false;
		if (href === '/app') return currentPathname === '/app';
		return (
			currentPathname === href ||
			currentPathname.startsWith(href + '/') ||
			currentPathname.startsWith(href + '?') ||
			href.startsWith(currentPathname + '/')
		);
	}

	$effect(() => {
		if (!collapsible || !currentPathname) return;
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
		<!-- Top Header: Logo -->
		<div
			class={`flex items-center justify-center px-6 py-5 ${isCollapsed ? 'scale-90 transition-transform' : ''}`}
		>
			<Logo size={isCollapsed ? 'sm' : 'md'} showText={!isCollapsed} />
		</div>

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
									class={`flex w-full items-center justify-between ${RADIUS.small} mt-4 px-2 py-2 ${TEXT.small} font-semibold ${COLOR.textMuted} opacity-70 ${TRANSITION.colors} hover:opacity-100 dark:hover:text-gray-100`}
								>
									<span class="flex items-center gap-2">
										<span class="h-1 w-1 rounded-full bg-blue-600/30"></span>
										{group.label}
									</span>
									<svg
										class={`h-3 w-3 ${TRANSITION.all} ${isGroupCollapsed ? 'rotate-0 opacity-40' : 'rotate-90 opacity-100'}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2.5"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							{:else}
								<div
									class={`${TEXT.small} font-semibold ${COLOR.textMuted} mt-4 flex items-center gap-2 px-2 py-2 opacity-70`}
								>
									<span class="h-1 w-1 rounded-full bg-blue-600/30"></span>
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
										class={`sidebar-item group relative flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} ${RADIUS.small} py-2.5 ${TEXT.button} ${TRANSITION.all} ${
											active
												? `${COLOR.textPrimary} bg-white font-bold shadow-xs ring-1 ring-gray-200/50 dark:bg-blue-950/20 dark:ring-blue-500/20`
												: `${COLOR.textSecondary} hover:bg-white/50 hover:text-gray-900 hover:shadow-xs dark:hover:bg-neutral-800/40 dark:hover:text-gray-100`
										} focus:ring-2 focus:ring-blue-500/50 focus:outline-none`}
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
											<span class="sidebar-icon shrink-0" aria-hidden="true">
												<Icon name={item.icon} size={18} strokeWidth={1.75} />
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

		<!-- Workspace Switcher at the Bottom -->
		{#if workspaces}
			<div class={`px-3 pt-2 pb-4 border-t border-gray-100 dark:border-neutral-800 ${isCollapsed ? 'px-2' : ''}`}>
				<WorkspaceSwitcher {workspaces} fullWidth={true} {isCollapsed} />
			</div>
		{/if}
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
