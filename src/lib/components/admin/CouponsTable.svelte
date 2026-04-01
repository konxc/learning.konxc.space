<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import ActionButton from '$lib/components/ui/ActionButton.svelte';
	import type { TableColumn } from '$lib/types/table';
	import { COLOR, RADIUS, TRANSITION } from '$lib/config/design';
	import { formatDateTime } from '$lib/utils/format';
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
			await goto('/app/admin/coupons', { invalidateAll: true });
		} catch (error) {
			console.error('Failed to duplicate:', error);
		}
	}

	async function handleToggleStatus(couponId: string, currentStatus: boolean) {
		try {
			await onToggleStatus(couponId, currentStatus);
			await goto('/app/admin/coupons', { invalidateAll: true });
		} catch (error) {
			console.error('Failed to toggle:', error);
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
					class={`${RADIUS.small} bg-gray-50 px-2 py-1 font-mono text-sm font-semibold dark:bg-neutral-800 ${COLOR.accent}`}
				>
					{entry.code}
				</code>
				<button
					type="button"
					class={`inline-flex items-center justify-center ${RADIUS.small} bg-gray-100 p-1.5 text-xs dark:bg-neutral-800 ${COLOR.textSecondary} ${TRANSITION.all} hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:hover:bg-neutral-700 ${
						copiedCode === entry.code
							? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
							: ''
					}`}
					title="Copy code"
					onclick={() => onCopyCode(entry.code)}
				>
					{#if copiedCode === entry.code}
						<Icon name="check" size={14} />
					{:else}
						<Icon name="copy" size={14} />
					{/if}
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
				<ActionButton
					variant="primary"
					icon="edit"
					label="Edit"
					href="/app/admin/coupons/edit/{entry.id}"
				/>
				<ActionButton
					variant="neutral"
					icon="copy"
					label="Copy"
					title="Duplicate coupon"
					onclick={() => handleDuplicate(entry.id)}
				/>
				<button
					type="button"
					class={`inline-flex items-center gap-1.5 ${RADIUS.small} px-2.5 py-1.5 text-xs font-semibold ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
						!entry.isActive
							? 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 focus-visible:ring-green-600/70 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
							: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-600/70 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
					}`}
					onclick={() => handleToggleStatus(entry.id, entry.isActive)}
				>
					<Icon name={entry.isActive ? 'x' : 'check'} size={14} />
					{entry.isActive ? 'Deactivate' : 'Activate'}
				</button>
			</div>
		{/if}
	{/snippet}
</DataTable>
