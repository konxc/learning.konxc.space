<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import type { TableColumn } from '$lib/types/table';
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import StatusSelect from './StatusSelect.svelte';
	import { formatDateTime } from '$lib/utils/format';
	import type { WaitingListStatus } from '$lib/constants/waiting-list';

	interface WaitingListEntry {
		id: string;
		fullName: string;
		email: string;
		phone?: string | null;
		interest?: string | null;
		source?: string | null;
		status: string;
		createdAt: Date | string;
		notes?: string | null;
	}

	let {
		entries,
		columns,
		columnVisibility,
		isColumnVisible,
		statusLabels,
		onNotesClick
	}: {
		entries: WaitingListEntry[];
		columns: TableColumn[];
		columnVisibility: Record<string, boolean>;
		isColumnVisible: (key: string) => boolean;
		statusLabels: Record<WaitingListStatus, string>;
		onNotesClick: (entry: WaitingListEntry) => void;
	} = $props();
</script>

<DataTable
	{entries}
	{columns}
	{columnVisibility}
	{isColumnVisible}
	emptyStateMessage="Tidak ada entries yang sesuai dengan filter."
>
	{#snippet cell(key, entry: WaitingListEntry, index)}
		{#if key === 'name'}
			{entry.fullName}
		{:else if key === 'email'}
			{entry.email}
		{:else if key === 'phone'}
			{entry.phone || '-'}
		{:else if key === 'interest'}
			{entry.interest || '-'}
		{:else if key === 'source'}
			{entry.source || '-'}
		{:else if key === 'createdAt'}
			{formatDateTime(entry.createdAt)}
		{:else if key === 'status'}
			<StatusSelect entryId={entry.id} currentStatus={entry.status} {statusLabels} />
		{:else if key === 'actions'}
			<button
				type="button"
				class={`inline-flex items-center gap-1.5 ${RADIUS.button} border border-gray-300 bg-white px-3 py-1.5 ${TEXT.button} ${COLOR.textPrimary} ${TRANSITION.all} hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-300`}
				data-id={entry.id}
				onclick={() => onNotesClick(entry)}
			>
				📝 Notes
			</button>
		{/if}
	{/snippet}
</DataTable>
