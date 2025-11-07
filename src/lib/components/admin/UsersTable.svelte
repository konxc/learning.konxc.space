<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import type { TableColumn } from '$lib/types/table';
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import { formatDateTime } from '$lib/utils/format';

	interface UserEntry {
		id: string;
		username: string;
		fullName?: string | null;
		email?: string | null;
		role: string;
		onboardingCompleted: boolean;
		createdAt: Date | string;
	}

	let {
		entries,
		columns,
		columnVisibility,
		isColumnVisible,
		onEdit,
		onChangeRole
	}: {
		entries: UserEntry[];
		columns: TableColumn[];
		columnVisibility: Record<string, boolean>;
		isColumnVisible: (key: string) => boolean;
		onEdit?: (userId: string) => void;
		onChangeRole?: (userId: string) => void;
	} = $props();

	function getRoleBadgeClass(role: string): string {
		switch (role) {
			case 'admin':
				return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
			case 'mentor':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
			case 'user':
				return 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400';
			default:
				return 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400';
		}
	}
</script>

<DataTable
	{entries}
	{columns}
	{columnVisibility}
	{isColumnVisible}
	emptyStateMessage="Tidak ada users yang sesuai dengan filter."
>
	{#snippet cell(key, entry: UserEntry, index)}
		{#if key === 'username'}
			<span class="font-medium">{entry.username}</span>
		{:else if key === 'fullName'}
			{entry.fullName || '—'}
		{:else if key === 'email'}
			{entry.email || '—'}
		{:else if key === 'role'}
			<span
				class={`inline-block px-3 py-1 ${RADIUS.badge} text-xs capitalize ${getRoleBadgeClass(
					entry.role
				)}`}
			>
				{entry.role}
			</span>
		{:else if key === 'onboarding'}
			<span
				class={`inline-flex items-center gap-1.5 ${
					entry.onboardingCompleted
						? 'text-green-600 dark:text-green-400'
						: 'text-gray-600 dark:text-gray-400'
				}`}
			>
				{#if entry.onboardingCompleted}
					<span class="text-green-600 dark:text-green-400">✓</span>
				{/if}
				{entry.onboardingCompleted ? 'Completed' : 'Pending'}
			</span>
		{:else if key === 'joined'}
			{formatDateTime(entry.createdAt)}
		{:else if key === 'actions'}
			<div class="flex items-center gap-2">
				{#if onEdit}
					<button
						type="button"
						class={`inline-flex items-center gap-1.5 ${RADIUS.button} border border-gray-300 bg-white px-3 py-1.5 ${TEXT.button} ${COLOR.textPrimary} ${TRANSITION.all} hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-300`}
						onclick={() => onEdit(entry.id)}
					>
						✏️ Edit
					</button>
				{/if}
				{#if onChangeRole}
					<button
						type="button"
						class={`inline-flex items-center gap-1.5 ${RADIUS.button} border border-gray-300 bg-white px-3 py-1.5 ${TEXT.button} ${COLOR.textPrimary} ${TRANSITION.all} hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-gray-200 dark:hover:border-purple-500 dark:hover:bg-purple-900/30 dark:hover:text-purple-300`}
						onclick={() => onChangeRole(entry.id)}
					>
						🔄 Change Role
					</button>
				{/if}
			</div>
		{/if}
	{/snippet}
</DataTable>

