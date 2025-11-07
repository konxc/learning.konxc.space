<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import type { TableColumn } from '$lib/types/table';
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import { formatDateTime } from '$lib/utils/format';
	import type { MentorApplicationStatus } from '$lib/constants/mentor-applications';
	import { MENTOR_APPLICATION_STATUS_LABELS } from '$lib/constants/mentor-applications';

	interface MentorApplicationEntry {
		id: string;
		fullName: string;
		email: string;
		expertise: string;
		yearsExperience: number;
		status: string;
		createdAt: Date | string;
		user?: {
			username: string;
			role: string;
		};
	}

	let {
		entries,
		columns,
		columnVisibility,
		isColumnVisible,
		statusLabels
	}: {
		entries: MentorApplicationEntry[];
		columns: TableColumn[];
		columnVisibility: Record<string, boolean>;
		isColumnVisible: (key: string) => boolean;
		statusLabels: Record<'all' | MentorApplicationStatus, string>;
	} = $props();

	function getStatusBadgeClass(status: string): string {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
			case 'approved':
				return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
			case 'rejected':
				return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
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
	emptyStateMessage="Tidak ada aplikasi mentor yang sesuai dengan filter."
>
	{#snippet cell(key, entry: MentorApplicationEntry, index)}
		{#if key === 'name'}
			<div class="flex flex-col">
				<span class="font-medium">{entry.fullName}</span>
				{#if entry.user?.username}
					<span class="text-xs text-gray-500 dark:text-gray-400">@{entry.user.username}</span>
				{/if}
			</div>
		{:else if key === 'email'}
			{entry.email}
		{:else if key === 'expertise'}
			{entry.expertise}
		{:else if key === 'experience'}
			{entry.yearsExperience} {entry.yearsExperience === 1 ? 'year' : 'years'}
		{:else if key === 'status'}
			<span
				class={`inline-block px-3 py-1 ${RADIUS.badge} text-xs capitalize ${getStatusBadgeClass(
					entry.status
				)}`}
			>
				{statusLabels[entry.status as MentorApplicationStatus] || entry.status}
			</span>
		{:else if key === 'applied'}
			{formatDateTime(entry.createdAt)}
		{:else if key === 'actions'}
			<a
				href={`/dashboard/admin/mentor-applications/review/${entry.id}`}
				class={`inline-flex items-center gap-1.5 ${RADIUS.button} ${COLOR.accentBg} px-3 py-1.5 ${TEXT.button} font-medium text-white ${TRANSITION.all} hover:opacity-90 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:focus-visible:ring-blue-500/70`}
			>
				👁️ Review
			</a>
		{/if}
	{/snippet}
</DataTable>
