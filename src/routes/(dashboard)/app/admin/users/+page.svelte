<script lang="ts">
	import type { PageData } from './$types';
	import { toast } from '$lib/stores/toastStore';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { filterEntities, countByField } from '$lib/utils/filter';
	import { USER_COLUMNS } from '$lib/constants/user-columns';
	import DashboardTablePage from '$lib/components/layouts/DashboardTablePage.svelte';
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import UsersTable from '$lib/components/admin/UsersTable.svelte';

	let { data }: { data: PageData } = $props();

	// Dashboard list state management (filter, search, column visibility)
	const listState = useDashboardListState({
		columns: USER_COLUMNS,
		storageKey: 'admin-users',
		filterParam: 'role',
		defaultFilter: 'all',
		filterStatusField: 'role',
		searchFields: ['username', 'fullName', 'email']
	});

	// Filtered users based on search and role filter
	const filteredUsers = $derived(
		filterEntities(data.users, listState.searchQuery, listState.filter, {
			searchFields: ['username', 'fullName', 'email'],
			statusField: 'role'
		})
	);

	// Count users by role
	const roleCounts = $derived(countByField(data.users, 'role'));

	// Filter options for StatusFilter component
	const filterOptions = $derived([
		{ value: 'all', label: 'All', count: roleCounts.all ?? 0 },
		{ value: 'admin', label: 'Admins', count: roleCounts.admin ?? 0 },
		{ value: 'mentor', label: 'Mentors', count: roleCounts.mentor ?? 0 },
		{ value: 'user', label: 'Users', count: roleCounts.user ?? 0 }
	]);

	// Action handlers
	function handleEdit(userId: string) {
		toast.info('Fitur edit pengguna segera hadir');
	}

	function handleChangeRole(userId: string) {
		toast.info('Fitur ubah peran segera hadir');
	}
</script>

<DashboardTablePage
	title="User Management"
	description="Manage all users registered on the platform"
	headTitle="User Management - Admin"
	bind:searchQuery={listState.searchQuery}
	columns={USER_COLUMNS}
	onVisibilityChange={listState.handleVisibilityChange}
	storageKey="admin-users"
	filteredCount={filteredUsers.length}
	totalCount={data.users.length}
	searchPlaceholder="Cari user berdasarkan username, nama, atau email..."
>
	{#snippet filters()}
		<StatusFilter
			options={filterOptions}
			bind:active={listState.filter}
			onChange={listState.setFilter}
		/>
	{/snippet}

	{#snippet children()}
		<UsersTable
			entries={filteredUsers}
			columns={USER_COLUMNS}
			columnVisibility={listState.columnVisibility}
			isColumnVisible={listState.isColumnVisible}
			onEdit={handleEdit}
			onChangeRole={handleChangeRole}
		/>
	{/snippet}
</DashboardTablePage>
