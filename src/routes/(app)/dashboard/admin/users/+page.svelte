<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageQuick from '$lib/components/layouts/PageQuick.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, TRANSITION, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { updateQueryParam } from '$lib/utils/url-params';
	import {
		setToVisibilityRecord,
		isColumnVisible as checkColumnVisible
	} from '$lib/utils/column-visibility';
	import { filterUsers, countUsersByRole } from '$lib/utils/user-filters';
	import { USER_COLUMNS, getDefaultUserColumnVisibility } from '$lib/constants/user-columns';
	import UserFilters from '$lib/components/admin/UserFilters.svelte';
	import UsersTable from '$lib/components/admin/UsersTable.svelte';
	import WaitingListSearchBar from '$lib/components/crm/WaitingListSearchBar.svelte';
	import ResultsSummary from '$lib/components/crm/ResultsSummary.svelte';
	import ColumnFilter from '$lib/components/crm/ColumnFilter.svelte';

	let { data }: { data: PageData } = $props();

	// Filter state
	let searchQuery = $state('');
	let roleFilter = $state<'all' | 'admin' | 'mentor' | 'user'>('all');
	let columnFilterRef: ColumnFilter | null = $state(null);

	// Initialize role filter from URL query parameter on mount
	onMount(() => {
		const param = $page.url.searchParams.get('role');
		if (param === 'admin' || param === 'mentor' || param === 'user') {
			roleFilter = param;
		} else {
			roleFilter = 'all';
		}
	});

	// Sync with URL changes (e.g., browser back/forward)
	$effect(() => {
		const param = $page.url.searchParams.get('role');
		if (param === 'admin' || param === 'mentor' || param === 'user') {
			if (roleFilter !== param) {
				roleFilter = param;
			}
		} else if (roleFilter !== 'all') {
			roleFilter = 'all';
		}
	});

	// Function to update URL query parameter when role filter changes
	async function updateRoleFilter(newRole: 'all' | 'admin' | 'mentor' | 'user') {
		roleFilter = newRole;
		await updateQueryParam($page.url, 'role', newRole === 'all' ? null : newRole, goto);
	}

	// Column definitions (from constants)
	const tableColumns = USER_COLUMNS;

	// Column visibility state
	let columnVisibility = $state<Record<string, boolean>>(getDefaultUserColumnVisibility());

	// Callback to update visibility from ColumnFilter
	function handleVisibilityChange(visibleColumns: Set<string>) {
		columnVisibility = setToVisibilityRecord(visibleColumns, tableColumns);
	}

	// Helper to check if column is visible
	function isColumnVisible(key: string): boolean {
		return checkColumnVisible(key, columnVisibility);
	}

	// Filtered users based on search and role filter
	const filteredUsers = $derived(filterUsers(data.users, searchQuery, roleFilter));

	// Count users by role
	const roleCounts = $derived(countUsersByRole(data.users, ['admin', 'mentor', 'user']));

	// Action handlers (placeholder for now, can be extended later)
	function handleEdit(userId: string) {
		// TODO: Navigate to edit page or open modal
		toast.info('Edit user feature coming soon');
	}

	function handleChangeRole(userId: string) {
		// TODO: Open role change modal
		toast.info('Change role feature coming soon');
	}
</script>

<svelte:head>
	<title>User Management - Admin</title>
</svelte:head>

<!-- Role Filter - Outside PageWrapper for full-width control -->
<PageQuick padding={true}>
	<UserFilters
		bind:roleFilter
		{roleCounts}
		onRoleFilterChange={(value) => updateRoleFilter(value as 'all' | 'admin' | 'mentor' | 'user')}
	/>
</PageQuick>

<PageWrapper>
	<PageHeader
		title="User Management"
		description="Kelola semua users yang terdaftar di platform"
	/>

	<!-- Results Summary with Search and Column Filter -->
	<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div class="min-w-0 flex-1 md:max-w-xs">
			<ResultsSummary filteredCount={filteredUsers.length} totalCount={data.users.length} />
		</div>

		<WaitingListSearchBar
			bind:searchQuery
			columns={tableColumns}
			bind:columnFilterRef
			storageKey="admin-users-columns"
			onVisibilityChange={handleVisibilityChange}
			placeholder="Cari user berdasarkan username, nama, atau email..."
		/>
	</div>

	<!-- Users Table -->
	{#if filteredUsers.length === 0 && data.users.length === 0}
		<div class="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
			<p class={COLOR.textSecondary}>No users found.</p>
		</div>
	{:else}
		<UsersTable
			entries={filteredUsers}
			columns={tableColumns}
			{columnVisibility}
			{isColumnVisible}
			onEdit={handleEdit}
			onChangeRole={handleChangeRole}
		/>
	{/if}
</PageWrapper>

