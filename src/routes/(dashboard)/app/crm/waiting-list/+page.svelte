<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageQuick from '$lib/components/layouts/PageQuick.svelte';
	import { toast } from '$lib/stores/toast';
	import NotesModal from '$lib/components/crm/NotesModal.svelte';
	import WaitingListFilters from '$lib/components/crm/WaitingListFilters.svelte';
	import WaitingListTable from '$lib/components/crm/WaitingListTable.svelte';
	import WaitingListSearchBar from '$lib/components/crm/WaitingListSearchBar.svelte';
	import ResultsSummary from '$lib/components/crm/ResultsSummary.svelte';
	import ColumnFilter from '$lib/components/crm/ColumnFilter.svelte';
	import {
		WAITING_LIST_STATUSES,
		WAITING_LIST_STATUS_LABELS,
		type WaitingListStatus
	} from '$lib/constants/waiting-list';
	import {
		WAITING_LIST_COLUMNS,
		getDefaultColumnVisibility
	} from '$lib/constants/waiting-list-columns';
	import { filterEntries, countEntriesByStatus } from '$lib/utils/waiting-list-filters';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { updateQueryParam } from '$lib/utils/url-params';
	import {
		setToVisibilityRecord,
		isColumnVisible as checkColumnVisible
	} from '$lib/utils/column-visibility';
	import ExportButton from '$lib/components/crm/ExportButton.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Filter state
	let searchQuery = $state('');
	let showNotesModal = $state<{ id: string; notes: string | null } | null>(null);
	let columnFilterRef: ColumnFilter | null = $state(null);

	// Status filter state synced with URL query parameter
	let statusFilter = $state<WaitingListStatus | ''>('');

	// Initialize from URL on mount
	onMount(() => {
		const param = $page.url.searchParams.get('status');
		if (param && WAITING_LIST_STATUSES.includes(param as WaitingListStatus)) {
			statusFilter = param as WaitingListStatus;
		} else {
			statusFilter = '';
		}
	});

	// Sync with URL changes (e.g., browser back/forward)
	$effect(() => {
		const param = $page.url.searchParams.get('status');
		if (param && WAITING_LIST_STATUSES.includes(param as WaitingListStatus)) {
			if (statusFilter !== param) {
				statusFilter = param as WaitingListStatus;
			}
		} else if (statusFilter !== '') {
			statusFilter = '';
		}
	});

	// Function to update URL query parameter when status filter changes
	async function updateStatusFilter(newStatus: WaitingListStatus | '') {
		statusFilter = newStatus;
		await updateQueryParam($page.url, 'status', newStatus || null, goto);
	}

	// Column definitions (from constants)
	const tableColumns = WAITING_LIST_COLUMNS;

	// Column visibility state
	let columnVisibility = $state<Record<string, boolean>>(getDefaultColumnVisibility());

	// Callback to update visibility from ColumnFilter
	function handleVisibilityChange(visibleColumns: Set<string>) {
		columnVisibility = setToVisibilityRecord(visibleColumns, tableColumns);
	}

	// Helper to check if column is visible
	function isColumnVisible(key: string): boolean {
		return checkColumnVisible(key, columnVisibility);
	}

	// Filtered entries based on search and status
	const filteredEntries = $derived(filterEntries(data.entries, searchQuery, statusFilter));

	// Count entries by status
	const statusCounts = $derived(countEntriesByStatus(data.entries, WAITING_LIST_STATUSES));

	// Modal handlers
	function openNotesModal(entry: { id: string; notes?: string | null }) {
		showNotesModal = { id: entry.id, notes: entry.notes ?? null };
	}

	function closeNotesModal() {
		showNotesModal = null;
	}

	// Show toast messages for form results
	$effect(() => {
		if (form?.error && form?.success === false) {
			toast.error(form.error);
		} else if (form?.success && form?.message) {
			toast.success(form.message);
		}
	});
</script>

<svelte:head>
	<title>CRM: Waiting List - Naik Kelas</title>
</svelte:head>

<!-- Status Filter Buttons and Export - Outside PageWrapper for full-width control -->
<PageQuick padding={true}>
	<div class="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
		<WaitingListFilters
			bind:statusFilter
			{statusCounts}
			onStatusFilterChange={(value) => updateStatusFilter(value as WaitingListStatus | '')}
		/>
		<ExportButton />
	</div>
</PageQuick>

<PageWrapper>
	<PageHeader
		title="Waiting List Management"
		description="Kelola dan pantau semua calon customer yang mendaftar di waiting list"
	/>

	<!-- Results Summary with Search and Column Filter -->
	<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div class="min-w-0 flex-1 md:max-w-xs">
			<ResultsSummary filteredCount={filteredEntries.length} totalCount={data.entries.length} />
		</div>

		<WaitingListSearchBar
			bind:searchQuery
			columns={tableColumns}
			bind:columnFilterRef
			storageKey="waiting-list-columns"
			onVisibilityChange={handleVisibilityChange}
		/>
	</div>

	<!-- Waiting List Table -->
	<WaitingListTable
		entries={filteredEntries}
		columns={tableColumns}
		{columnVisibility}
		{isColumnVisible}
		statusLabels={WAITING_LIST_STATUS_LABELS}
		onNotesClick={openNotesModal}
	/>
</PageWrapper>

<!-- Notes Modal -->
<NotesModal
	isOpen={!!showNotesModal}
	entryId={showNotesModal?.id || ''}
	notes={showNotesModal?.notes || ''}
	onClose={closeNotesModal}
/>
