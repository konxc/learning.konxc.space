<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageQuick from '$lib/components/layouts/PageQuick.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { updateQueryParam } from '$lib/utils/url-params';
	import {
		setToVisibilityRecord,
		isColumnVisible as checkColumnVisible
	} from '$lib/utils/column-visibility';
	import {
		filterPaymentProofs,
		countPaymentProofsByStatus
	} from '$lib/utils/payment-proof-filters';
	import {
		PAYMENT_PROOF_COLUMNS,
		getDefaultPaymentProofColumnVisibility
	} from '$lib/constants/payment-proof-columns';
	import { PAYMENT_PROOF_STATUSES, type PaymentProofStatus } from '$lib/constants/payment-proofs';
	import PaymentProofFilters from '$lib/components/admin/PaymentProofFilters.svelte';
	import PaymentProofsTable from '$lib/components/admin/PaymentProofsTable.svelte';
	import WaitingListSearchBar from '$lib/components/crm/WaitingListSearchBar.svelte';
	import ResultsSummary from '$lib/components/crm/ResultsSummary.svelte';
	import ColumnFilter from '$lib/components/crm/ColumnFilter.svelte';

	let { data }: { data: PageData } = $props();

	// Filter state
	let searchQuery = $state('');
	let statusFilter = $state<'all' | PaymentProofStatus>('all');
	let columnFilterRef: ColumnFilter | null = $state(null);

	// Initialize status filter from URL query parameter on mount
	onMount(() => {
		const param = $page.url.searchParams.get('status');
		if (param && PAYMENT_PROOF_STATUSES.includes(param as PaymentProofStatus)) {
			statusFilter = param as PaymentProofStatus;
		} else {
			statusFilter = 'all';
		}
	});

	// Sync with URL changes (e.g., browser back/forward)
	$effect(() => {
		const param = $page.url.searchParams.get('status');
		if (param && PAYMENT_PROOF_STATUSES.includes(param as PaymentProofStatus)) {
			if (statusFilter !== param) {
				statusFilter = param as PaymentProofStatus;
			}
		} else if (statusFilter !== 'all') {
			statusFilter = 'all';
		}
	});

	// Function to update URL query parameter when status filter changes
	async function updateStatusFilter(newStatus: 'all' | PaymentProofStatus) {
		statusFilter = newStatus;
		await updateQueryParam($page.url, 'status', newStatus === 'all' ? null : newStatus, goto);
	}

	// Column definitions (from constants)
	const tableColumns = PAYMENT_PROOF_COLUMNS;

	// Column visibility state
	let columnVisibility = $state<Record<string, boolean>>(getDefaultPaymentProofColumnVisibility());

	// Callback to update visibility from ColumnFilter
	function handleVisibilityChange(visibleColumns: Set<string>) {
		columnVisibility = setToVisibilityRecord(visibleColumns, tableColumns);
	}

	// Helper to check if column is visible
	function isColumnVisible(key: string): boolean {
		return checkColumnVisible(key, columnVisibility);
	}

	// Combine all proofs for filtering
	const allProofs = $derived([...data.pending, ...data.approved, ...data.rejected]);

	// Filtered proofs based on search and status
	const filteredProofs = $derived(filterPaymentProofs(allProofs, searchQuery, statusFilter));

	// Count proofs by status
	const statusCounts = $derived.by(() =>
		countPaymentProofsByStatus(allProofs, PAYMENT_PROOF_STATUSES)
	);
</script>

<svelte:head>
	<title>Payment Proof Management - Admin</title>
</svelte:head>

<!-- Status Filter - Outside PageWrapper for full-width control -->
<PageQuick padding={true}>
	<div class="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
		<PaymentProofFilters
			bind:statusFilter
			{statusCounts}
			onStatusFilterChange={(value) => updateStatusFilter(value as 'all' | PaymentProofStatus)}
		/>
	</div>
</PageQuick>

<PageWrapper>
	<PageHeader
		title="Payment Proof Management"
		description="Verifikasi dan kelola semua bukti pembayaran yang dikirim oleh users"
	/>

	<!-- Results Summary with Search and Column Filter -->
	<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div class="min-w-0 flex-1 md:max-w-xs">
			<ResultsSummary filteredCount={filteredProofs.length} totalCount={allProofs.length} />
		</div>

		<WaitingListSearchBar
			bind:searchQuery
			columns={tableColumns}
			bind:columnFilterRef
			storageKey="admin-payment-proofs-columns"
			onVisibilityChange={handleVisibilityChange}
			placeholder="Cari berdasarkan user, email, atau course..."
		/>
	</div>

	<!-- Payment Proofs Table -->
	{#if filteredProofs.length === 0 && allProofs.length === 0}
		<div
			class="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900"
		>
			<p class={COLOR.textSecondary}>Tidak ada bukti pembayaran.</p>
		</div>
	{:else}
		<PaymentProofsTable
			entries={filteredProofs}
			columns={tableColumns}
			{columnVisibility}
			{isColumnVisible}
		/>
	{/if}
</PageWrapper>
