<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageQuick from '$lib/components/layouts/PageQuick.svelte';
	import { COLOR } from '$lib/config/design';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { updateQueryParam } from '$lib/utils/url-params';
	import {
		setToVisibilityRecord,
		isColumnVisible as checkColumnVisible
	} from '$lib/utils/column-visibility';
	import {
		filterMentorApplications,
		countMentorApplicationsByStatus
	} from '$lib/utils/mentor-application-filters';
	import {
		MENTOR_APPLICATION_COLUMNS,
		getDefaultMentorApplicationColumnVisibility
	} from '$lib/constants/mentor-application-columns';
	import {
		MENTOR_APPLICATION_STATUSES,
		MENTOR_APPLICATION_STATUS_LABELS,
		type MentorApplicationFilterType
	} from '$lib/constants/mentor-applications';
	import MentorApplicationFilters from '$lib/components/admin/MentorApplicationFilters.svelte';
	import MentorApplicationsTable from '$lib/components/admin/MentorApplicationsTable.svelte';
	import WaitingListSearchBar from '$lib/components/crm/WaitingListSearchBar.svelte';
	import ResultsSummary from '$lib/components/crm/ResultsSummary.svelte';
	import ColumnFilter from '$lib/components/crm/ColumnFilter.svelte';

	let { data }: { data: PageData } = $props();

	// Filter state
	let searchQuery = $state('');
	let statusFilter = $state<MentorApplicationFilterType>('all');
	let columnFilterRef: ColumnFilter | null = $state(null);

	// Initialize status filter from URL query parameter on mount
	onMount(() => {
		const param = $page.url.searchParams.get('status');
		if (
			param &&
			(['all', 'pending', 'approved', 'rejected'] as MentorApplicationFilterType[]).includes(
				param as MentorApplicationFilterType
			)
		) {
			statusFilter = param as MentorApplicationFilterType;
		} else {
			statusFilter = 'all';
		}
	});

	// Sync with URL changes (e.g., browser back/forward)
	$effect(() => {
		const param = $page.url.searchParams.get('status');
		if (
			param &&
			(['all', 'pending', 'approved', 'rejected'] as MentorApplicationFilterType[]).includes(
				param as MentorApplicationFilterType
			)
		) {
			if (statusFilter !== param) {
				statusFilter = param as MentorApplicationFilterType;
			}
		} else if (statusFilter !== 'all') {
			statusFilter = 'all';
		}
	});

	// Function to update URL query parameter when status filter changes
	async function updateStatusFilter(newStatus: MentorApplicationFilterType) {
		statusFilter = newStatus;
		await updateQueryParam($page.url, 'status', newStatus === 'all' ? null : newStatus, goto);
	}

	// Column definitions (from constants)
	const tableColumns = MENTOR_APPLICATION_COLUMNS;

	// Column visibility state
	let columnVisibility = $state<Record<string, boolean>>(
		getDefaultMentorApplicationColumnVisibility()
	);

	// Callback to update visibility from ColumnFilter
	function handleVisibilityChange(visibleColumns: Set<string>) {
		columnVisibility = setToVisibilityRecord(visibleColumns, tableColumns);
	}

	// Helper to check if column is visible
	function isColumnVisible(key: string): boolean {
		return checkColumnVisible(key, columnVisibility);
	}

	// Filtered applications based on search and status filter
	const filteredApplications = $derived(
		filterMentorApplications(data.applications, searchQuery, statusFilter)
	);

	// Count applications by status
	const statusCounts = $derived(
		countMentorApplicationsByStatus(data.applications, MENTOR_APPLICATION_STATUSES)
	);
</script>

<svelte:head>
	<title>Mentor Applications - Admin</title>
</svelte:head>

<!-- Status Filter - Outside PageWrapper for full-width control -->
<PageQuick padding={true}>
	<MentorApplicationFilters
		bind:statusFilter
		{statusCounts}
		onStatusFilterChange={(value) => updateStatusFilter(value as MentorApplicationFilterType)}
	/>
</PageQuick>

<PageWrapper>
	<PageHeader
		title="Mentor Applications"
		description="Review dan kelola aplikasi mentor yang masuk ke platform"
	/>

	<!-- Results Summary with Search and Column Filter -->
	<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div class="min-w-0 flex-1 md:max-w-xs">
			<ResultsSummary
				filteredCount={filteredApplications.length}
				totalCount={data.applications.length}
			/>
		</div>

		<WaitingListSearchBar
			bind:searchQuery
			columns={tableColumns}
			bind:columnFilterRef
			storageKey="admin-mentor-applications-columns"
			onVisibilityChange={handleVisibilityChange}
			placeholder="Cari aplikasi berdasarkan nama, email, atau expertise..."
		/>
	</div>

	<!-- Mentor Applications Table -->
	{#if filteredApplications.length === 0 && data.applications.length === 0}
		<div class="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
			<p class={COLOR.textSecondary}>No mentor applications found.</p>
		</div>
	{:else}
		<MentorApplicationsTable
			entries={filteredApplications}
			columns={tableColumns}
			{columnVisibility}
			{isColumnVisible}
			statusLabels={MENTOR_APPLICATION_STATUS_LABELS}
		/>
	{/if}
</PageWrapper>

