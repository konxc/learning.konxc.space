<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION, STATUS, TABLE } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: Date | string) {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(date));
	}

	function getStatusToken(status: string) {
		switch (status) {
			case 'settlement':
			case 'success':
			case 'approved':
				return STATUS.success;
			case 'pending':
				return STATUS.pending;
			case 'failed':
			case 'failure':
			case 'rejected':
				return STATUS.error;
			case 'expired':
			case 'cancelled':
				return STATUS.neutral;
			default:
				return STATUS.neutral;
		}
	}

	function getStatusLabel(status: string) {
		const labels: Record<string, string> = {
			pending: 'Pending',
			settlement: 'Paid',
			success: 'Paid',
			approved: 'Approved',
			failed: 'Failed',
			failure: 'Failed',
			rejected: 'Rejected',
			expired: 'Expired',
			cancelled: 'Cancelled'
		};
		return labels[status] ?? status;
	}

	function getMethodLabel(type: string | null) {
		if (!type) return 'Manual Transfer';
		return 'Midtrans';
	}

	function downloadReceipt(entry: {
		id: string;
		date: Date;
		courseTitle: string | null;
		amount: number;
		status: string;
	}) {
		const text = [
			'NAIK KELAS \u2014 RECEIPT',
			'=====================',
			`Tanggal: ${formatDate(entry.date)}`,
			`Kursus: ${entry.courseTitle ?? '-'}`,
			`Amount: Rp ${entry.amount.toLocaleString('id-ID')}`,
			`Status: ${getStatusLabel(entry.status)}`,
			`Order ID: ${entry.id}`
		].join('\n');

		const blob = new Blob([text], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `receipt-${entry.id}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Riwayat Pembayaran - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Riwayat Pembayaran"
		description="Lihat semua transaksi dan bukti pembayaran kamu"
	/>

	<PageSection>
		{#if data.combined.length === 0}
			<div class="py-16 text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
				>
					<svg class="h-8 w-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<p class={`${TEXT.body} ${COLOR.textMuted}`}>Belum ada riwayat pembayaran</p>
				<a
					href="/app/payments"
					class={`mt-4 inline-block ${COLOR.accent} ${TRANSITION.colors} hover:underline`}
				>
					Mulai Pembayaran
				</a>
			</div>
		{:else}
			<div
				class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.base} overflow-hidden`}
			>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class={TABLE.thead}>
							<tr class={`border-b ${TABLE.theadBorder}`}>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Tanggal</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Kursus</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Metode</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Amount</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Status</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Aksi</th>
							</tr>
						</thead>
						<tbody class={`divide-y ${TABLE.divider}`}>
							{#each data.combined as entry}
								{@const statusToken = getStatusToken(entry.status)}
								<tr class={TABLE.rowHover}>
									<td class={`px-4 py-3 text-sm ${COLOR.textMuted}`}>
										{formatDate(entry.date)}
									</td>

									<td class={`px-4 py-3 ${TEXT.body} ${COLOR.textPrimary}`}>
										{entry.courseTitle ?? '-'}
									</td>

									<td class={`px-4 py-3 text-sm ${COLOR.textMuted}`}>
										{entry.type === 'midtrans' ? 'Midtrans' : 'Manual Transfer'}
									</td>

									<td class={`px-4 py-3 ${TEXT.body} font-semibold ${COLOR.textPrimary}`}>
										{formatCurrency(entry.amount)}
									</td>

									<td class="px-4 py-3">
										<span
											class={`inline-flex items-center ${RADIUS.badge} border px-2.5 py-1 ${TEXT.small} font-semibold ${statusToken.bg} ${statusToken.text} ${statusToken.border}`}
										>
											{getStatusLabel(entry.status)}
										</span>
									</td>

									<td class="px-4 py-3">
										<div class="flex flex-col gap-2">
											<!-- Rejected proof: tampilkan alasan + tombol upload ulang -->
											{#if entry.type === 'manual' && entry.status === 'rejected'}
												<div class="space-y-1">
													{#if entry.notes}
														<p class={`text-xs ${COLOR.textMuted}`}>
															Alasan: <span class="text-rose-600 dark:text-rose-400"
																>{entry.notes}</span
															>
														</p>
													{/if}
													<a
														href="/app/payments?courseId={entry.courseId}"
														class={`inline-flex items-center gap-1 ${RADIUS.button} bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ${TRANSITION.colors} hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50`}
													>
														Upload Ulang
													</a>
												</div>
											{/if}

											<!-- Download receipt untuk paid/approved -->
											{#if ['settlement', 'success', 'approved'].includes(entry.status)}
												<button
													type="button"
													onclick={() => downloadReceipt(entry)}
													class={`inline-flex items-center gap-1 ${RADIUS.button} border border-zinc-300 px-3 py-1.5 text-xs font-semibold dark:border-zinc-600 ${TRANSITION.colors} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
												>
													<svg
														class="h-3.5 w-3.5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
														/>
													</svg>
													Download Receipt
												</button>
											{/if}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</PageSection>

	<div class="mt-4 text-center">
		<a
			href="/app/payments"
			class={`${COLOR.accent} ${TEXT.body} ${TRANSITION.colors} hover:underline`}
		>
			← Kembali ke Pembayaran
		</a>
	</div>
</PageWrapper>
