<script lang="ts">
	import type { PageData } from './$types';
	import { toast } from '$lib/stores/toastStore';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { filterEntities, countByField, buildFilterOptions } from '$lib/utils/filter';
	import { USER_COLUMNS } from '$lib/constants/user-columns';
	import DashboardTablePage from '$lib/components/layouts/DashboardTablePage.svelte';
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import UsersTable from '$lib/components/admin/UsersTable.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { COLOR, RADIUS, TEXT } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let selectedUser = $state<PageData['users'][0] | null>(null);
	let showEditModal = $state(false);
	let showRoleModal = $state(false);

	const listState = useDashboardListState({
		columns: USER_COLUMNS,
		storageKey: 'admin-users',
		filterParam: 'role',
		defaultFilter: 'all',
		filterStatusField: 'role',
		searchFields: ['username', 'fullName', 'email']
	});

	const filteredUsers = $derived(
		filterEntities(data.users, listState.searchQuery, listState.filter, {
			searchFields: ['username', 'fullName', 'email'],
			statusField: 'role'
		})
	);

	const roleCounts = $derived(countByField(data.users, 'role'));

	const filterOptions = $derived(
		buildFilterOptions(roleCounts, {
			all: 'All',
			admin: 'Admins',
			mentor: 'Mentors',
			user: 'Users'
		})
	);

	function handleEdit(userId: string) {
		selectedUser = data.users.find((u) => u.id === userId) ?? null;
		if (selectedUser) showEditModal = true;
	}

	function handleChangeRole(userId: string) {
		selectedUser = data.users.find((u) => u.id === userId) ?? null;
		if (selectedUser) showRoleModal = true;
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

<!-- Edit User Modal -->
<Modal isOpen={showEditModal} title="Edit User Details" onClose={() => (showEditModal = false)}>
	{#if selectedUser}
		<form
			method="POST"
			action="?/updateUser"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						toast.success('User updated successfully');
						showEditModal = false;
						await invalidateAll();
					} else {
						toast.error('Failed to update user');
					}
				};
			}}
			class="space-y-4"
		>
			<input type="hidden" name="userId" value={selectedUser.id} />
			<Input label="Full Name" name="fullName" value={selectedUser.fullName ?? ''} required />
			<Input label="Email" name="email" type="email" value={selectedUser.email ?? ''} required />
			<Input label="Phone" name="phone" value={selectedUser.phone ?? ''} />
			<div class="flex justify-end gap-3 pt-4">
				<Button variant="ghost" onclick={() => (showEditModal = false)}>Cancel</Button>
				<Button type="submit" variant="primary">Save Changes</Button>
			</div>
		</form>
	{/if}
</Modal>

<!-- Change Role Modal -->
<Modal isOpen={showRoleModal} title="Change User Role" onClose={() => (showRoleModal = false)}>
	{#if selectedUser}
		<form
			method="POST"
			action="?/changeRole"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						toast.success('Role updated successfully');
						showRoleModal = false;
						await invalidateAll();
					} else {
						toast.error('Failed to update role');
					}
				};
			}}
			class="space-y-4"
		>
			<input type="hidden" name="userId" value={selectedUser.id} />
			<input type="hidden" name="activeWorkspaceId" value={data.activeWorkspaceId} />
			<div class="space-y-2">
				<label for="newRole" class={`block text-sm font-medium ${COLOR.textPrimary}`}>
					Platform Role
				</label>
				<select
					id="newRole"
					name="newRole"
					class={`w-full ${RADIUS.input} border px-3 py-2 text-sm outline-none focus:border-blue-500 ${COLOR.cardBorder} ${COLOR.card}`}
				>
					<option value="user" selected={selectedUser.role === 'user'}>User</option>
					<option value="bd" selected={selectedUser.role === 'bd'}>Business Development</option>
					<option value="admin" selected={selectedUser.role === 'admin'}>Admin</option>
				</select>
				<p class="text-xs text-zinc-500 dark:text-zinc-400">
					Note: Mentor/Facilitator roles are managed at organization level
				</p>
			</div>
			<div class="flex justify-end gap-3 pt-4">
				<Button variant="ghost" onclick={() => (showRoleModal = false)}>Cancel</Button>
				<Button type="submit" variant="primary">Update Role</Button>
			</div>
		</form>
	{/if}
</Modal>
