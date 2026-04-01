<script lang="ts">
	import type { PageData } from './$types';
	import { COLOR, RADIUS, SPACING, TEXT, TRANSITION, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { matchesSearch, filterByActiveStatus, isActive, isExpired } from '$lib/utils/filter';
	import { COUPON_COLUMNS } from '$lib/constants/coupon-columns';
	import { type CouponFilterType } from '$lib/constants/coupons';
	import DashboardTablePage from '$lib/components/layouts/DashboardTablePage.svelte';
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import CouponsTable from '$lib/components/admin/CouponsTable.svelte';

	let { data }: { data: PageData } = $props();

	// Dashboard list state management
	const listState = useDashboardListState({
		columns: COUPON_COLUMNS,
		storageKey: 'admin-coupons',
		filterParam: 'filter',
		defaultFilter: 'all',
		searchFields: ['code']
	});

	// Local state for copy code feedback
	let copiedCode = $state<string | null>(null);

	// Filtered coupons based on search and filter (using custom logic)
	const filteredCoupons = $derived(
		data.coupons
			.filter((c) => matchesSearch(c, listState.searchQuery, ['code']))
			.filter((c) => {
				if (listState.filter === 'all') return true;
				if (listState.filter === 'active') return isActive(c);
				if (listState.filter === 'expired') return isExpired(c);
				return true;
			})
	);

	// Count coupons by filter
	const filterCounts = $derived.by(() => {
		const searchFiltered = data.coupons.filter(
			(c) =>
				listState.searchQuery === '' ||
				c.code.toLowerCase().includes(listState.searchQuery.toLowerCase())
		);
		return {
			all: searchFiltered.length,
			active: searchFiltered.filter((c) => isActive(c)).length,
			expired: searchFiltered.filter((c) => isExpired(c)).length
		};
	});

	// Filter options for StatusFilter component
	const filterOptions = $derived([
		{ value: 'all', label: 'All', count: filterCounts.all ?? 0 },
		{ value: 'active', label: 'Active', count: filterCounts.active ?? 0 },
		{ value: 'expired', label: 'Expired', count: filterCounts.expired ?? 0 }
	]);

	// Copy code handler
	async function copyCode(code: string) {
		try {
			await navigator.clipboard.writeText(code);
			copiedCode = code;
			setTimeout(() => {
				copiedCode = null;
			}, 2000);
			toast.success('Kode berhasil disalin ke clipboard');
		} catch (err) {
			console.error('Failed to copy:', err);
			toast.error('Gagal menyalin kode');
		}
	}

	// Duplicate handler
	async function duplicateCoupon(couponId: string) {
		try {
			const response = await fetch(`/app/admin/coupons?action=duplicate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ couponId })
			});

			if (response.ok) {
				toast.success('Kupon berhasil diduplikasi');
				await goto('/app/admin/coupons', { invalidateAll: true });
			} else {
				toast.error('Gagal menduplikasi kupon');
			}
		} catch (err) {
			console.error('Failed to duplicate:', err);
			toast.error('Gagal menduplikasi kupon');
		}
	}

	// Toggle status handler
	async function toggleStatus(couponId: string, currentStatus: boolean) {
		try {
			const response = await fetch(`/app/admin/coupons?action=toggle`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ couponId })
			});

			if (response.ok) {
				if (currentStatus) {
					toast.info('Kupon berhasil dinonaktifkan');
				} else {
					toast.success('Kupon berhasil diaktifkan');
				}
				await goto('/app/admin/coupons', { invalidateAll: true });
			} else {
				toast.error('Gagal mengubah status kupon');
			}
		} catch (err) {
			console.error('Failed to toggle:', err);
			toast.error('Gagal mengubah status kupon');
		}
	}
</script>

<DashboardTablePage
	title="Coupon Management"
	description="Manage all discount codes and promotional offers available on the platform"
	headTitle="Coupon Management - Admin"
	bind:searchQuery={listState.searchQuery}
	columns={COUPON_COLUMNS}
	onVisibilityChange={listState.handleVisibilityChange}
	storageKey="admin-coupons"
	filteredCount={filteredCoupons.length}
	totalCount={data.coupons.length}
	searchPlaceholder="Cari coupon berdasarkan code..."
>
	{#snippet filters()}
		<div class="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
			<StatusFilter
				options={filterOptions}
				bind:active={listState.filter}
				onChange={listState.setFilter}
			/>
			<a
				href="/app/admin/coupons/create"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
			>
				+ Create Coupon
			</a>
		</div>
	{/snippet}

	{#snippet children()}
		<CouponsTable
			entries={filteredCoupons}
			columns={COUPON_COLUMNS}
			columnVisibility={listState.columnVisibility}
			isColumnVisible={listState.isColumnVisible}
			{copiedCode}
			onCopyCode={copyCode}
			onDuplicate={duplicateCoupon}
			onToggleStatus={toggleStatus}
		/>
	{/snippet}
</DashboardTablePage>
