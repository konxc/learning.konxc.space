<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { toast } from '$lib/stores/toastStore';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { filterEntities, countByStatus } from '$lib/utils/filter';
	import { WAITING_LIST_STATUS_LABELS } from '$lib/constants/waiting-list';
	import { WAITING_LIST_COLUMNS } from '$lib/constants/waiting-list-columns';
	import DashboardTablePage from '$lib/components/layouts/DashboardTablePage.svelte';
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import NotesModal from '$lib/components/crm/NotesModal.svelte';
	import WaitingListTable from '$lib/components/crm/WaitingListTable.svelte';
	import ExportButton from '$lib/components/crm/ExportButton.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Dashboard list state management
	const listState = useDashboardListState({
		columns: WAITING_LIST_COLUMNS,
		storageKey: 'crm-waiting-list',
		filterParam: 'status',
		defaultFilter: 'all',
		filterStatusField: 'status',
		searchFields: ['fullName', 'email', 'phone']
	});

	// Local state for notes modal
	let showNotesModal = $state<{ id: string; notes: string | null } | null>(null);

	// Filtered entries based on search and status
	const filteredEntries = $derived(
		filterEntities(data.entries, listState.searchQuery, listState.filter || 'all', {
			searchFields: ['fullName', 'email', 'phone'],
			statusField: 'status'
		})
	);

	// Count entries by status
	const statusCounts = $derived(countByStatus(data.entries, 'status'));

	// Filter options for StatusFilter component
	const filterOptions = $derived([
		{ value: 'all', label: 'All', count: statusCounts.all ?? 0 },
		{ value: 'new', label: 'New', count: statusCounts.new ?? 0 },
		{ value: 'contacted', label: 'Contacted', count: statusCounts.contacted ?? 0 },
		{ value: 'qualified', label: 'Qualified', count: statusCounts.qualified ?? 0 },
		{ value: 'converted', label: 'Converted', count: statusCounts.converted ?? 0 },
		{ value: 'archived', label: 'Archived', count: statusCounts.archived ?? 0 }
	]);

	// Modal handlers
	function openNotesModal(entry: { id: string; notes?: string | null }) {
		showNotesModal = { id: entry.id, notes: entry.notes ?? null };
	}

	function closeNotesModal() {
		showNotesModal = null;
	}

	// Show toast messages for form results
	let processedFormKey = $state('');
	$effect(() => {
		const key = `${form?.error ?? ''}${form?.success ?? ''}${form?.message ?? ''}`;
		if (!key || key === processedFormKey) return;
		processedFormKey = key;
		if (form?.error && form?.success === false) {
			toast.error(form.error);
		} else if (form?.success && form?.message) {
			toast.success(form.message);
		}
	});
</script>

<DashboardTablePage
	title="Waiting List Management"
	description="Manage and monitor all prospective customers registered in the waiting list"
	headTitle="CRM: Waiting List - Naik Kelas"
	bind:searchQuery={listState.searchQuery}
	columns={WAITING_LIST_COLUMNS}
	onVisibilityChange={listState.handleVisibilityChange}
	storageKey="crm-waiting-list"
	filteredCount={filteredEntries.length}
	totalCount={data.entries.length}
	searchPlaceholder="Cari nama, email, atau HP..."
>
	{#snippet filters()}
		<div class="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
			<StatusFilter
				options={filterOptions}
				bind:active={listState.filter}
				onChange={listState.setFilter}
			/>
			<ExportButton />
		</div>
	{/snippet}

	{#snippet children()}
		<WaitingListTable
			entries={filteredEntries}
			columns={WAITING_LIST_COLUMNS}
			columnVisibility={listState.columnVisibility}
			isColumnVisible={listState.isColumnVisible}
			statusLabels={WAITING_LIST_STATUS_LABELS}
			onNotesClick={openNotesModal}
		/>
	{/snippet}
</DashboardTablePage>

<!-- Notes Modal -->
<NotesModal
	isOpen={!!showNotesModal}
	entryId={showNotesModal?.id || ''}
	notes={showNotesModal?.notes || ''}
	onClose={closeNotesModal}
/>
