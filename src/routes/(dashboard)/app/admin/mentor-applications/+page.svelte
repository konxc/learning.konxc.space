<script lang="ts">
	import type { PageData } from './$types';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { filterEntities, countByStatus } from '$lib/utils/filter';
	import { MENTOR_APPLICATION_COLUMNS } from '$lib/constants/mentor-application-columns';
	import { MENTOR_APPLICATION_STATUS_LABELS } from '$lib/constants/mentor-applications';
	import DashboardTablePage from '$lib/components/layouts/DashboardTablePage.svelte';
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import MentorApplicationsTable from '$lib/components/admin/MentorApplicationsTable.svelte';

	let { data }: { data: PageData } = $props();

	// Dashboard list state management
	const listState = useDashboardListState({
		columns: MENTOR_APPLICATION_COLUMNS,
		storageKey: 'admin-mentor-applications',
		filterParam: 'status',
		defaultFilter: 'all',
		filterStatusField: 'status',
		searchFields: ['fullName', 'email', 'expertise', 'user.username']
	});

	// Filtered applications based on search and status filter
	const filteredApplications = $derived(
		filterEntities(data.applications, listState.searchQuery, listState.filter, {
			searchFields: ['fullName', 'email', 'expertise', 'user.username'],
			statusField: 'status'
		})
	);

	// Count applications by status
	const statusCounts = $derived(countByStatus(data.applications, 'status'));

	// Filter options for StatusFilter component
	const filterOptions = $derived([
		{ value: 'all', label: MENTOR_APPLICATION_STATUS_LABELS.all, count: statusCounts.all ?? 0 },
		{
			value: 'pending',
			label: MENTOR_APPLICATION_STATUS_LABELS.pending,
			count: statusCounts.pending ?? 0
		},
		{
			value: 'approved',
			label: MENTOR_APPLICATION_STATUS_LABELS.approved,
			count: statusCounts.approved ?? 0
		},
		{
			value: 'rejected',
			label: MENTOR_APPLICATION_STATUS_LABELS.rejected,
			count: statusCounts.rejected ?? 0
		}
	]);
</script>

<DashboardTablePage
	title="Mentor Applications"
	description="Review dan kelola aplikasi mentor yang masuk ke platform"
	headTitle="Mentor Applications - Admin"
	bind:searchQuery={listState.searchQuery}
	columns={MENTOR_APPLICATION_COLUMNS}
	onVisibilityChange={listState.handleVisibilityChange}
	storageKey="admin-mentor-applications"
	filteredCount={filteredApplications.length}
	totalCount={data.applications.length}
	searchPlaceholder="Cari aplikasi berdasarkan nama, email, atau expertise..."
>
	{#snippet filters()}
		<StatusFilter
			options={filterOptions}
			bind:active={listState.filter}
			onChange={listState.setFilter}
		/>
	{/snippet}

	{#snippet children()}
		<MentorApplicationsTable
			entries={filteredApplications}
			columns={MENTOR_APPLICATION_COLUMNS}
			columnVisibility={listState.columnVisibility}
			isColumnVisible={listState.isColumnVisible}
			statusLabels={MENTOR_APPLICATION_STATUS_LABELS}
		/>
	{/snippet}
</DashboardTablePage>
