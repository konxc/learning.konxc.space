<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageQuick from '$lib/components/layouts/PageQuick.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, TRANSITION, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { updateQueryParam } from '$lib/utils/url-params';
	import {
		setToVisibilityRecord,
		isColumnVisible as checkColumnVisible
	} from '$lib/utils/column-visibility';
	import { filterCoupons, countCouponsByFilter } from '$lib/utils/coupon-filters';
	import { COUPON_COLUMNS, getDefaultCouponColumnVisibility } from '$lib/constants/coupon-columns';
	import { COUPON_FILTER_TYPES, type CouponFilterType } from '$lib/constants/coupons';
	import CouponFilters from '$lib/components/admin/CouponFilters.svelte';
	import CouponsTable from '$lib/components/admin/CouponsTable.svelte';
	import WaitingListSearchBar from '$lib/components/crm/WaitingListSearchBar.svelte';
	import ResultsSummary from '$lib/components/crm/ResultsSummary.svelte';
	import ColumnFilter from '$lib/components/crm/ColumnFilter.svelte';

	let { data }: { data: PageData } = $props();

	// Filter state
	let searchQuery = $state('');
	let filter = $state<CouponFilterType>('all');
	let columnFilterRef: ColumnFilter | null = $state(null);
	let copiedCode = $state<string | null>(null);

	// Initialize filter from URL query parameter on mount
	onMount(() => {
		const param = $page.url.searchParams.get('filter');
		if (param && COUPON_FILTER_TYPES.includes(param as CouponFilterType)) {
			filter = param as CouponFilterType;
		} else {
			filter = 'all';
		}
	});

	// Sync with URL changes (e.g., browser back/forward)
	$effect(() => {
		const param = $page.url.searchParams.get('filter');
		if (param && COUPON_FILTER_TYPES.includes(param as CouponFilterType)) {
			if (filter !== param) {
				filter = param as CouponFilterType;
			}
		} else if (filter !== 'all') {
			filter = 'all';
		}
	});

	// Function to update URL query parameter when filter changes
	async function updateFilter(newFilter: CouponFilterType) {
		filter = newFilter;
		await updateQueryParam($page.url, 'filter', newFilter === 'all' ? null : newFilter, goto);
	}

	// Column definitions (from constants)
	const tableColumns = COUPON_COLUMNS;

	// Column visibility state
	let columnVisibility = $state<Record<string, boolean>>(getDefaultCouponColumnVisibility());

	// Callback to update visibility from ColumnFilter
	function handleVisibilityChange(visibleColumns: Set<string>) {
		columnVisibility = setToVisibilityRecord(visibleColumns, tableColumns);
	}

	// Helper to check if column is visible
	function isColumnVisible(key: string): boolean {
		return checkColumnVisible(key, columnVisibility);
	}

	// Filtered coupons based on search and filter
	const filteredCoupons = $derived(filterCoupons(data.coupons, searchQuery, filter));

	// Count coupons by filter (need to count based on search too for accurate counts)
	const filterCounts = $derived.by(() => {
		const searchFiltered = data.coupons.filter((c) =>
			searchQuery === '' || c.code.toLowerCase().includes(searchQuery.toLowerCase())
		);
		return countCouponsByFilter(searchFiltered);
	});

	// Copy code handler
	async function copyCode(code: string) {
		try {
			await navigator.clipboard.writeText(code);
			copiedCode = code;
			setTimeout(() => {
				copiedCode = null;
			}, 2000);
			toast.success('Code copied to clipboard');
		} catch (err) {
			console.error('Failed to copy:', err);
			toast.error('Failed to copy code');
		}
	}

	// Duplicate handler
	async function duplicateCoupon(couponId: string) {
		try {
			const response = await fetch(`/dashboard/admin/coupons?action=duplicate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ couponId })
			});

			if (response.ok) {
				toast.success('Coupon duplicated successfully');
				await goto('/dashboard/admin/coupons', { invalidateAll: true });
			} else {
				toast.error('Failed to duplicate coupon');
			}
		} catch (err) {
			console.error('Failed to duplicate:', err);
			toast.error('Failed to duplicate coupon');
		}
	}

	// Toggle status handler
	async function toggleStatus(couponId: string, currentStatus: boolean) {
		try {
			const response = await fetch(`/dashboard/admin/coupons?action=toggle`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ couponId })
			});

			if (response.ok) {
				toast.success(`Coupon ${currentStatus ? 'deactivated' : 'activated'}`);
				await goto('/dashboard/admin/coupons', { invalidateAll: true });
			} else {
				toast.error('Failed to update coupon status');
			}
		} catch (err) {
			console.error('Failed to toggle:', err);
			toast.error('Failed to update coupon status');
		}
	}
</script>

<svelte:head>
	<title>Coupon Management - Admin</title>
</svelte:head>

<!-- Filter and Create Button - Outside PageWrapper for full-width control -->
<PageQuick padding={true}>
	<div class="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
		<CouponFilters
			bind:filter
			filterCounts={filterCounts}
			onFilterChange={(value) => updateFilter(value as CouponFilterType)}
		/>
		<a
			href="/dashboard/admin/coupons/create"
			class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
		>
			+ Create Coupon
		</a>
	</div>
</PageQuick>

<PageWrapper>
	<PageHeader
		title="Coupon Management"
		description="Kelola semua kode promo dan discount yang tersedia di platform"
	/>

	<!-- Results Summary with Search and Column Filter -->
	<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div class="min-w-0 flex-1 md:max-w-xs">
			<ResultsSummary filteredCount={filteredCoupons.length} totalCount={data.coupons.length} />
		</div>

		<WaitingListSearchBar
			bind:searchQuery
			columns={tableColumns}
			bind:columnFilterRef
			storageKey="admin-coupons-columns"
			onVisibilityChange={handleVisibilityChange}
			placeholder="Cari coupon berdasarkan code..."
		/>
	</div>

	<!-- Coupons Table -->
	{#if filteredCoupons.length === 0 && data.coupons.length === 0}
		<div class="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
			<p class={`mb-4 ${COLOR.textSecondary}`}>No coupons found. Create your first coupon!</p>
			<a
				href="/dashboard/admin/coupons/create"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} ${ELEVATION.hover}`}
			>
				+ Create Coupon
			</a>
		</div>
	{:else}
		<CouponsTable
			entries={filteredCoupons}
			columns={tableColumns}
			{columnVisibility}
			{isColumnVisible}
			{copiedCode}
			onCopyCode={copyCode}
			onDuplicate={duplicateCoupon}
			onToggleStatus={toggleStatus}
		/>
	{/if}
</PageWrapper>
