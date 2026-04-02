<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import {
		COLOR,
		TEXT,
		RADIUS,
		ELEVATION,
		TRANSITION,
		SPACING,
		STATUS,
		TABLE,
		ACTION,
		TAB
	} from '$lib/config/design';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectedIds = $state<string[]>([]);

	const allIds = $derived(data.proofs.map((p) => p.id));
	const allSelected = $derived(selectedIds.length === allIds.length && allIds.length > 0);
	const someSelected = $derived(selectedIds.length > 0);

	function toggleAll() {
		if (allSelected) {
			selectedIds = [];
		} else {
			selectedIds = [...allIds];
		}
	}

	function toggleOne(id: string) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((x) => x !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	let statusFilter = $state(data.filters.status);
	let dateFrom = $state(data.filters.dateFrom);
	let dateTo = $state(data.filters.dateTo);

	function applyFilter() {
		const params = new URLSearchParams();
		if (statusFilter) params.set('status', statusFilter);
		if (dateFrom) params.set('dateFrom', dateFrom);
		if (dateTo) params.set('dateTo', dateTo);
		goto(`?${params.toString()}`);
	}

	function resetFilter() {
		statusFilter = 'pending';
		dateFrom = '';
		dateTo = '';
		goto('?status=pending');
	}

	function getStatusToken(status: string) {
		switch (status) {
			case 'approved':
				return STATUS.success;
			case 'rejected':
				return STATUS.error;
			case 'pending':
				return STATUS.pending;
			default:
				return STATUS.neutral;
		}
	}

	function getStatusLabel(status: string) {
		const labels: Record<string, string> = {
			pending: 'Pending',
			approved: 'Approved',
			rejected: 'Rejected'
		};
		return labels[status] ?? status;
	}

	function formatDate(date: Date | string) {
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(
			new Date(date)
		);
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	const statusTabs = [
		{ value: 'all', label: 'Semua' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'approved', label: 'Approved' },
		{ value: 'rejected', label: 'Rejected' }
	];
</script>

<svelte:head>
	<title>Payment Management - Admin</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Payment Management"
		description="Verifikasi dan kelola semua bukti pembayaran"
	/>

	<!-- Stats Cards -->
	<PageSection>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.base} p-5`}>
				<p class={`${TEXT.small} ${COLOR.textMuted} mb-1`}>TOTAL REVENUE HARI INI</p>
				<p class={`${TEXT.h2} ${COLOR.textPrimary}`}>{formatCurrency(data.stats.revenueToday)}</p>
				<div class={`mt-2 flex gap-3 text-xs ${COLOR.textMuted}`}>
					<span>Midtrans: {formatCurrency(data.stats.revenueMidtrans)}</span>
					<span>Manual: {formatCurrency(data.stats.revenueManual)}</span>
				</div>
			</div>
			<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.base} p-5`}>
				<p class={`${TEXT.small} ${COLOR.textMuted} mb-1`}>PENDING</p>
				<p class={`${TEXT.h2} text-amber-600 dark:text-amber-400`}>{data.stats.totalPending}</p>
				<p class={`mt-2 text-xs ${COLOR.textMuted}`}>Menunggu verifikasi</p>
			</div>
			<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.base} p-5`}>
				<p class={`${TEXT.small} ${COLOR.textMuted} mb-1`}>APPROVED HARI INI</p>
				<p class={`${TEXT.h2} text-emerald-600 dark:text-emerald-400`}>
					{data.stats.approvedToday}
				</p>
				<p class={`mt-2 text-xs ${COLOR.textMuted}`}>Rejected: {data.stats.rejectedToday}</p>
			</div>
		</div>
	</PageSection>

	<!-- Filter Bar -->
	<PageSection>
		<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.base} p-4`}>
			<div class="flex flex-wrap items-end gap-3">
				<div class="flex gap-1">
					{#each statusTabs as tab}
						<button
							type="button"
							onclick={() => {
								statusFilter = tab.value;
								applyFilter();
							}}
							class={`${RADIUS.button} px-3 py-1.5 ${TEXT.button} ${TRANSITION.colors} ${statusFilter === tab.value ? TAB.active : TAB.inactive}`}
						>
							{tab.label}
						</button>
					{/each}
				</div>

				<div class="flex flex-1 flex-wrap items-end gap-2">
					<div class="flex flex-col gap-1">
						<label class={`${TEXT.small} ${COLOR.textMuted}`} for="dateFrom">Dari</label>
						<input
							id="dateFrom"
							type="date"
							bind:value={dateFrom}
							class={`${RADIUS.input} border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800`}
						/>
					</div>
					<div class="flex flex-col gap-1">
						<label class={`${TEXT.small} ${COLOR.textMuted}`} for="dateTo">Sampai</label>
						<input
							id="dateTo"
							type="date"
							bind:value={dateTo}
							class={`${RADIUS.input} border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800`}
						/>
					</div>
					<button
						type="button"
						onclick={applyFilter}
						class={`${COLOR.accentBg} ${RADIUS.button} px-4 py-1.5 text-sm font-semibold text-white ${TRANSITION.colors} hover:opacity-90`}
					>
						Filter
					</button>
					<button
						type="button"
						onclick={resetFilter}
						class={`${RADIUS.button} border border-zinc-300 bg-white px-4 py-1.5 text-sm font-semibold dark:border-zinc-600 dark:bg-zinc-800 ${TRANSITION.colors}`}
					>
						Reset
					</button>
				</div>

				<form method="POST" action="?/exportCSV">
					<input type="hidden" name="dateFrom" value={dateFrom} />
					<input type="hidden" name="dateTo" value={dateTo} />
					<button
						type="submit"
						class={`${RADIUS.button} border border-zinc-300 bg-white px-4 py-1.5 text-sm font-semibold dark:border-zinc-600 dark:bg-zinc-800 ${TRANSITION.colors} hover:bg-zinc-50 dark:hover:bg-zinc-700`}
					>
						Export CSV
					</button>
				</form>
			</div>
		</div>
	</PageSection>

	<!-- Bulk Action Bar -->
	{#if someSelected}
		<div
			class={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 ${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} flex items-center gap-4 px-6 py-3`}
		>
			<span class={`${TEXT.body} ${COLOR.textPrimary} font-semibold`}>
				{selectedIds.length} dipilih
			</span>
			<form
				method="POST"
				action="?/bulkApprove"
				use:enhance={() => {
					return async ({ update }) => {
						selectedIds = [];
						await update();
					};
				}}
			>
				<input type="hidden" name="proofIds" value={selectedIds.join(',')} />
				<button
					type="submit"
					class={`${ACTION.approve} ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${TRANSITION.colors}`}
				>
					Approve Selected ({selectedIds.length})
				</button>
			</form>
			<button
				type="button"
				onclick={() => (selectedIds = [])}
				class={`${RADIUS.button} border border-zinc-300 px-3 py-2 text-sm ${TRANSITION.colors} hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800`}
			>
				Batal
			</button>
		</div>
	{/if}

	<!-- Table -->
	<PageSection>
		{#if form && !form.success}
			<div
				class={`mb-4 ${RADIUS.card} p-3 ${COLOR.error} border ${COLOR.errorBorder}`}
				role="alert"
			>
				{form.error}
			</div>
		{/if}
		{#if form?.success}
			<div
				class={`mb-4 ${RADIUS.card} p-3 ${COLOR.success} border ${COLOR.successBorder}`}
				role="alert"
			>
				{form.message}
			</div>
		{/if}

		{#if data.proofs.length === 0}
			<div class="py-16 text-center">
				<p class={`${TEXT.body} ${COLOR.textMuted}`}>Tidak ada bukti pembayaran ditemukan</p>
			</div>
		{:else}
			<div
				class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.base} overflow-hidden`}
			>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class={TABLE.thead}>
							<tr class={`border-b ${TABLE.theadBorder}`}>
								<th class="w-10 px-4 py-3">
									<input
										type="checkbox"
										checked={allSelected}
										onchange={toggleAll}
										aria-label="Select all"
										class="h-4 w-4 rounded border-zinc-300 accent-blue-600"
									/>
								</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Bukti</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Student</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Kursus</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Tanggal</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Status</th>
								<th class={`px-4 py-3 text-left ${TEXT.small} ${COLOR.textMuted}`}>Aksi</th>
							</tr>
						</thead>
						<tbody class={`divide-y ${TABLE.divider}`}>
							{#each data.proofs as proof}
								{@const statusToken = getStatusToken(proof.status)}
								<tr class={TABLE.rowHover}>
									<td class="px-4 py-3">
										<input
											type="checkbox"
											checked={selectedIds.includes(proof.id)}
											onchange={() => toggleOne(proof.id)}
											aria-label="Select row"
											class="h-4 w-4 rounded border-zinc-300 accent-blue-600"
										/>
									</td>

									<td class="px-4 py-3">
										{#if proof.dataBase64}
											<img
												src={`data:${proof.mime};base64,${proof.dataBase64}`}
												alt="Bukti pembayaran"
												class={`h-12 w-12 object-cover ${RADIUS.small} border border-zinc-200 dark:border-zinc-700`}
											/>
										{:else}
											<div
												class={`flex h-12 w-12 items-center justify-center ${RADIUS.small} bg-zinc-100 dark:bg-zinc-800`}
											>
												<svg
													class="h-5 w-5 text-zinc-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
											</div>
										{/if}
									</td>

									<td class="px-4 py-3">
										<p class={`${TEXT.body} font-medium ${COLOR.textPrimary}`}>
											{proof.user.fullName || proof.user.username}
										</p>
										{#if proof.user.email}
											<p class={`text-xs ${COLOR.textMuted}`}>{proof.user.email}</p>
										{/if}
									</td>

									<td class={`px-4 py-3 ${TEXT.body} ${COLOR.textPrimary}`}>
										{proof.course.title}
									</td>

									<td class={`px-4 py-3 text-sm ${COLOR.textMuted}`}>
										{formatDate(proof.createdAt)}
									</td>

									<td class="px-4 py-3">
										<span
											class={`inline-flex items-center ${RADIUS.badge} border px-2.5 py-1 ${TEXT.small} font-semibold ${statusToken.bg} ${statusToken.text} ${statusToken.border}`}
										>
											{getStatusLabel(proof.status)}
										</span>
									</td>

									<td class="px-4 py-3">
										<div class="flex items-center gap-2">
											{#if proof.status === 'pending'}
												<form method="POST" action="?/approve" use:enhance>
													<input type="hidden" name="proofId" value={proof.id} />
													<button
														type="submit"
														class={`${ACTION.approve} ${RADIUS.button} px-3 py-1.5 text-xs font-semibold ${TRANSITION.colors}`}
													>
														Approve
													</button>
												</form>
												<form method="POST" action="?/reject" use:enhance>
													<input type="hidden" name="proofId" value={proof.id} />
													<button
														type="submit"
														class={`${ACTION.reject} ${RADIUS.button} px-3 py-1.5 text-xs font-semibold ${TRANSITION.colors}`}
													>
														Reject
													</button>
												</form>
											{/if}
											<a
												href="/app/admin/payments/view/{proof.id}"
												class={`${RADIUS.button} border border-zinc-300 px-3 py-1.5 text-xs font-semibold dark:border-zinc-600 ${TRANSITION.colors} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
											>
												Detail
											</a>
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
</PageWrapper>
