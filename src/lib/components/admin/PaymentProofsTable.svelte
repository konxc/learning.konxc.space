<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import type { TableColumn } from '$lib/types/table';
	import { COLOR, RADIUS, TEXT, TRANSITION, SPACING, ELEVATION } from '$lib/config/design';
	import { formatDateTime } from '$lib/utils/format';
	import { PAYMENT_PROOF_STATUS_LABELS } from '$lib/constants/payment-proofs';

	interface PaymentProofEntry {
		id: string;
		status: string;
		createdAt: Date | string;
		user: {
			fullName?: string | null;
			username?: string;
			email?: string | null;
		};
		course: {
			title: string;
			price: number;
		};
	}

	let {
		entries,
		columns,
		columnVisibility,
		isColumnVisible
	}: {
		entries: PaymentProofEntry[];
		columns: TableColumn[];
		columnVisibility: Record<string, boolean>;
		isColumnVisible: (key: string) => boolean;
	} = $props();

	function formatPrice(price: number): string {
		return `Rp ${price.toLocaleString('id-ID')}`;
	}

	function getStatusBadgeClass(status: string): string {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
			case 'approved':
				return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
			case 'rejected':
				return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
			default:
				return 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400';
		}
	}
</script>

<DataTable
	{entries}
	{columns}
	{columnVisibility}
	{isColumnVisible}
	emptyStateMessage="Tidak ada bukti pembayaran yang sesuai dengan filter."
>
	{#snippet cell(key, entry: PaymentProofEntry, index)}
		{#if key === 'user'}
			<div class="flex flex-col">
				<span class="font-medium">
					{entry.user.fullName || entry.user.username || '—'}
				</span>
				{#if entry.user.email}
					<span class="text-xs text-gray-500 dark:text-gray-400">{entry.user.email}</span>
				{/if}
			</div>
		{:else if key === 'course'}
			<span class="font-medium">{entry.course.title}</span>
		{:else if key === 'price'}
			{formatPrice(entry.course.price)}
		{:else if key === 'status'}
			<span
				class={`inline-flex items-center ${RADIUS.small} px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
					entry.status
				)}`}
			>
				{PAYMENT_PROOF_STATUS_LABELS[entry.status as keyof typeof PAYMENT_PROOF_STATUS_LABELS] ||
					entry.status}
			</span>
		{:else if key === 'uploaded'}
			{formatDateTime(entry.createdAt)}
		{:else if key === 'actions'}
			<a
				href="/dashboard/admin/payments/view/{entry.id}"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${TRANSITION.colors} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2`}
			>
				Lihat Detail
			</a>
		{/if}
	{/snippet}
</DataTable>
