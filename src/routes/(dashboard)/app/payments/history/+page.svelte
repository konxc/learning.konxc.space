<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		settlement: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		failure: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
		cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
		pending_proof: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
	};

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: Date | null) {
		if (!date) return '-';
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(date));
	}

	function formatStatus(status: string) {
		const labels: Record<string, string> = {
			pending: 'Pending',
			success: 'Paid',
			settlement: 'Paid',
			failure: 'Failed',
			cancelled: 'Cancelled',
			pending_proof: 'Pending Review',
			approved: 'Approved',
			rejected: 'Rejected'
		};
		return labels[status] || status;
	}
</script>

<svelte:head>
	<title>Payment History - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Payment History"
		description="View your transaction and payment proof history"
	/>

	<!-- Transactions -->
	<PageSection>
		<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Transactions</h2>

		{#if data.transactions.length === 0}
			<div class="py-10 text-center">
				<p class={`${TEXT.body} ${COLOR.textMuted}`}>No transactions yet</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class={`border-b ${COLOR.cardBorder}`}>
							<th class={`px-4 py-3 text-left ${TEXT.small} font-semibold ${COLOR.textMuted}`}
								>Date</th
							>
							<th class={`px-4 py-3 text-left ${TEXT.small} font-semibold ${COLOR.textMuted}`}
								>Course</th
							>
							<th class={`px-4 py-3 text-left ${TEXT.small} font-semibold ${COLOR.textMuted}`}
								>Amount</th
							>
							<th class={`px-4 py-3 text-left ${TEXT.small} font-semibold ${COLOR.textMuted}`}
								>Method</th
							>
							<th class={`px-4 py-3 text-left ${TEXT.small} font-semibold ${COLOR.textMuted}`}
								>Status</th
							>
						</tr>
					</thead>
					<tbody>
						{#each data.transactions as tx}
							<tr class={`border-b ${COLOR.cardBorder}`}>
								<td class={`px-4 py-3 ${TEXT.body} ${COLOR.textMuted}`}>
									{formatDate(tx.createdAt)}
								</td>
								<td class={`px-4 py-3 ${TEXT.body} ${COLOR.textPrimary}`}>
									{tx.course?.title || 'N/A'}
								</td>
								<td class={`px-4 py-3 ${TEXT.body} font-semibold ${COLOR.textPrimary}`}>
									{formatCurrency(tx.amount)}
								</td>
								<td class={`px-4 py-3 ${TEXT.body} ${COLOR.textMuted} capitalize`}>
									{tx.paymentType || 'N/A'}
								</td>
								<td class="px-4 py-3">
									<span
										class={`rounded-full px-2 py-1 ${TEXT.small} font-semibold ${statusColors[tx.status]}`}
									>
										{formatStatus(tx.status)}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</PageSection>

	<!-- Payment Proofs -->
	<PageSection>
		<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Payment Proofs</h2>

		{#if data.paymentProofs.length === 0}
			<div class="py-10 text-center">
				<p class={`${TEXT.body} ${COLOR.textMuted}`}>No payment proofs submitted</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each data.paymentProofs as proof}
					<div
						class={`flex items-center justify-between rounded-lg border p-4 ${COLOR.cardBorder}`}
					>
						<div>
							<p class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>
								{proof.course.title}
							</p>
							<p class={`${TEXT.small} ${COLOR.textMuted}`}>
								Submitted: {formatDate(proof.createdAt)}
							</p>
						</div>
						<span
							class={`rounded-full px-3 py-1 ${TEXT.small} font-semibold ${statusColors[proof.status]}`}
						>
							{formatStatus(proof.status)}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	</PageSection>

	<!-- Back Link -->
	<div class="mt-6 text-center">
		<a href="/app/payments" class={`${COLOR.accent} ${TEXT.body} hover:underline`}>
			← Back to Payments
		</a>
	</div>
</PageWrapper>
