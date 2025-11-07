<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import type { TableColumn } from '$lib/types/table';
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import { formatDateTime } from '$lib/utils/format';
	import { toast } from '$lib/stores/toast';
	import { goto } from '$app/navigation';

	interface CouponEntry {
		id: string;
		code: string;
		type: string;
		discountType?: string | null;
		discountValue?: number | null;
		maxUses?: number | null;
		currentUses: number;
		validUntil?: Date | string | null;
		isActive: boolean;
		creator?: {
			username: string;
		};
	}

	let {
		entries,
		columns,
		columnVisibility,
		isColumnVisible,
		copiedCode,
		onCopyCode,
		onDuplicate,
		onToggleStatus
	}: {
		entries: CouponEntry[];
		columns: TableColumn[];
		columnVisibility: Record<string, boolean>;
		isColumnVisible: (key: string) => boolean;
		copiedCode: string | null;
		onCopyCode: (code: string) => void;
		onDuplicate: (couponId: string) => Promise<void>;
		onToggleStatus: (couponId: string, currentStatus: boolean) => Promise<void>;
	} = $props();

	function formatDiscount(coupon: CouponEntry): string {
		if (coupon.type === 'free') {
			return 'Free course';
		}
		if (coupon.discountType === 'percentage') {
			return `${coupon.discountValue}%`;
		}
		return `Rp ${(coupon.discountValue || 0).toLocaleString('id-ID')}`;
	}

	function formatUsage(coupon: CouponEntry): string {
		if (coupon.maxUses) {
			return `${coupon.currentUses} / ${coupon.maxUses}`;
		}
		return coupon.currentUses.toString();
	}

	async function handleDuplicate(couponId: string) {
		if (!confirm('Duplicate this coupon? A new code will be generated.')) return;
		try {
			await onDuplicate(couponId);
			toast.success('Coupon duplicated successfully');
			await goto('/dashboard/admin/coupons', { invalidateAll: true });
		} catch (error) {
			console.error('Failed to duplicate:', error);
			toast.error('Failed to duplicate coupon');
		}
	}

	async function handleToggleStatus(couponId: string, currentStatus: boolean) {
		try {
			await onToggleStatus(couponId, currentStatus);
			toast.success(`Coupon ${currentStatus ? 'deactivated' : 'activated'}`);
			await goto('/dashboard/admin/coupons', { invalidateAll: true });
		} catch (error) {
			console.error('Failed to toggle:', error);
			toast.error('Failed to update coupon status');
		}
	}
</script>

<DataTable
	{entries}
	{columns}
	{columnVisibility}
	{isColumnVisible}
	emptyStateMessage="Tidak ada coupons yang sesuai dengan filter."
>
	{#snippet cell(key, entry: CouponEntry, index)}
		{#if key === 'code'}
			<div class="flex items-center gap-2">
				<code
					class={`${RADIUS.small} px-2 py-1 bg-gray-50 font-mono text-sm font-semibold dark:bg-neutral-800 ${COLOR.accent}`}
				>
					{entry.code}
				</code>
				<button
					type="button"
					class={`inline-flex items-center ${RADIUS.small} px-2 py-1 text-xs bg-gray-100 dark:bg-neutral-800 ${COLOR.textSecondary} ${TRANSITION.all} hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:hover:bg-neutral-700 ${
						copiedCode === entry.code
							? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
							: ''
					}`}
					title="Copy code"
					onclick={() => onCopyCode(entry.code)}
				>
					{copiedCode === entry.code ? '✓' : '📋'}
				</button>
			</div>
		{:else if key === 'type'}
			<span
				class={`inline-block px-3 py-1 ${RADIUS.badge} text-xs capitalize ${
					entry.type === 'free'
						? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
						: 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400'
				}`}
			>
				{entry.type}
			</span>
		{:else if key === 'discount'}
			{formatDiscount(entry)}
		{:else if key === 'usage'}
			{formatUsage(entry)}
		{:else if key === 'validUntil'}
			{#if entry.validUntil}
				{formatDateTime(entry.validUntil)}
			{:else}
				<span class={COLOR.textMuted}>No expiry</span>
			{/if}
		{:else if key === 'status'}
			<span
				class={`inline-block px-3 py-1 ${RADIUS.badge} text-xs capitalize ${
					entry.isActive
						? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
						: 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400'
				}`}
			>
				{entry.isActive ? 'Active' : 'Inactive'}
			</span>
		{:else if key === 'createdBy'}
			<span class={COLOR.textSecondary}>{entry.creator?.username || '—'}</span>
		{:else if key === 'actions'}
			<div class="flex flex-wrap items-center gap-2">
				<a
					href="/dashboard/admin/coupons/edit/{entry.id}"
					class={`inline-flex items-center ${RADIUS.small} px-3 py-1.5 text-xs ${COLOR.accentBg} text-white ${TRANSITION.all} hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
				>
					Edit
				</a>
				<button
					type="button"
					class={`inline-flex items-center ${RADIUS.small} px-3 py-1.5 text-xs ${COLOR.accentBg} text-white ${TRANSITION.all} hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
					title="Duplicate coupon"
					onclick={() => handleDuplicate(entry.id)}
				>
					📋 Copy
				</button>
				<button
					type="button"
					class={`inline-flex items-center ${RADIUS.small} px-3 py-1.5 text-xs font-semibold ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
						!entry.isActive
							? 'bg-green-100 text-green-800 hover:opacity-90 focus-visible:ring-green-600/70 dark:bg-green-900/50 dark:text-green-300'
							: 'bg-red-100 text-red-800 hover:opacity-90 focus-visible:ring-red-600/70 dark:bg-red-900/50 dark:text-red-300'
					}`}
					onclick={() => handleToggleStatus(entry.id, entry.isActive)}
				>
					{entry.isActive ? 'Deactivate' : 'Activate'}
				</button>
			</div>
		{/if}
	{/snippet}
</DataTable>
