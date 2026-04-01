<script lang="ts">
	import type { PageData } from './$types';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { filterEntities, countByStatus } from '$lib/utils/filter';
	import { PAYMENT_PROOF_COLUMNS } from '$lib/constants/payment-proof-columns';
	import { type PaymentProofStatus } from '$lib/constants/payment-proofs';
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

	// Combine all proofs for filtering
	const allProofs = $derived([...data.pending, ...data.approved, ...data.rejected]);

	// Filtered proofs based on search and status
	const filteredProofs = $derived(
		filterEntities(allProofs, listState.searchQuery, listState.filter, {
			searchFields: ['user.fullName', 'user.username', 'user.email', 'course.title'],
			statusField: 'status'
		})
	);

	// Count proofs by status
	const statusCounts = $derived(countByStatus(allProofs, 'status'));

	// Filter options for StatusFilter component
	const filterOptions = $derived([
		{ value: 'all', label: 'All', count: statusCounts.all ?? 0 },
		{ value: 'pending', label: 'Pending', count: statusCounts.pending ?? 0 },
		{ value: 'approved', label: 'Approved', count: statusCounts.approved ?? 0 },
		{ value: 'rejected', label: 'Rejected', count: statusCounts.rejected ?? 0 }
	]);
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
	totalCount={allProofs.length}
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
