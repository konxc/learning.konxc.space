<script lang="ts">
	import type { PageData } from './$types';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { filterEntities, countByStatus, buildFilterOptions } from '$lib/utils/filter';
	import { PAYMENT_PROOF_COLUMNS } from '$lib/constants/payment-proof-columns';
	import DashboardTablePage from '$lib/components/layouts/DashboardTablePage.svelte';
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import PaymentProofsTable from '$lib/components/admin/PaymentProofsTable.svelte';

	let { data }: { data: PageData } = $props();

	// Dashboard list state management
	const listState = useDashboardListState({
		columns: PAYMENT_PROOF_COLUMNS,
		storageKey: 'admin-payment-proofs',
		filterParam: 'status',
		defaultFilter: 'all',
		filterStatusField: 'status',
		searchFields: ['user.fullName', 'user.username', 'user.email', 'course.title']
	});

	// Filtered proofs based on search and status
	const filteredProofs = $derived(
		filterEntities(data.proofs, listState.searchQuery, listState.filter, {
			searchFields: ['user.fullName', 'user.username', 'user.email', 'course.title'],
			statusField: 'status'
		})
	);

	// Count proofs by status
	const statusCounts = $derived(countByStatus(data.proofs, 'status'));

	// Filter options for StatusFilter component
	const filterOptions = $derived(
		buildFilterOptions(statusCounts, {
			all: 'All',
			pending: 'Pending',
			approved: 'Approved',
			rejected: 'Rejected'
		})
	);
</script>

<DashboardTablePage
	title="Payment Proof Management"
	description="Verify and manage all payment proofs submitted by users"
	headTitle="Payment Proof Management - Admin"
	bind:searchQuery={listState.searchQuery}
	columns={PAYMENT_PROOF_COLUMNS}
	onVisibilityChange={listState.handleVisibilityChange}
	storageKey="admin-payment-proofs"
	filteredCount={filteredProofs.length}
	totalCount={data.proofs.length}
	searchPlaceholder="Cari berdasarkan user, email, atau course..."
>
	{#snippet filters()}
		<StatusFilter
			options={filterOptions}
			bind:active={listState.filter}
			onChange={listState.setFilter}
		/>
	{/snippet}

	{#snippet children()}
		<PaymentProofsTable
			entries={filteredProofs}
			columns={PAYMENT_PROOF_COLUMNS}
			columnVisibility={listState.columnVisibility}
			isColumnVisible={listState.isColumnVisible}
		/>
	{/snippet}
</DashboardTablePage>
