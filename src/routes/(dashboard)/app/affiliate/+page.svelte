<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PlanLimiter from '$lib/components/app/PlanLimiter.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import SalesTrendChart from '$lib/components/app/affiliate/SalesTrendChart.svelte';
	import AffiliateLinkCard from '$lib/components/app/affiliate/AffiliateLinkCard.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION, SPACING, STATUS } from '$lib/config/design';
	import { enhance } from '$app/forms';
	import { formToast } from '$lib/utils/formEnhance';
	import { toast } from '$lib/stores/toastStore';

	let { data }: { data: PageData } = $props();
	const currentPlan = data.workspaces?.activeOrg?.planType ?? 'free';

	const tabs = [
		{ label: '🔗 Affiliate Links', value: 'links' },
		{ label: '💰 Sales & Commission', value: 'sales' },
		{ label: '🏦 Payout', value: 'payout' }
	];

	const MINIMUM_PAYOUT = 100_000;

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}

	// ── Links tab: filter by marketplace ──────────────────────────────
	let linkFilter = $state('');
	const filteredLinks = $derived(
		linkFilter ? data.links.filter((l) => l.platform === linkFilter) : data.links
	);

	// ── Sales tab: client-side pagination + filters ───────────────────
	let salesPage = $state(1);
	const SALES_PER_PAGE = 20;
	let salesMarketplace = $state('');
	let salesStatus = $state('');
	let salesDateFrom = $state('');
	let salesDateTo = $state('');

	const filteredSales = $derived(() => {
		let s = data.sales ?? [];
		if (salesMarketplace) s = s.filter((x) => x.platform === salesMarketplace);
		if (salesStatus) s = s.filter((x) => x.status === salesStatus);
		if (salesDateFrom) s = s.filter((x) => new Date(x.createdAt) >= new Date(salesDateFrom));
		if (salesDateTo)
			s = s.filter((x) => new Date(x.createdAt) <= new Date(salesDateTo + 'T23:59:59'));
		return s;
	});

	const totalSalesPages = $derived(Math.max(1, Math.ceil(filteredSales().length / SALES_PER_PAGE)));
	const pagedSales = $derived(
		filteredSales().slice((salesPage - 1) * SALES_PER_PAGE, salesPage * SALES_PER_PAGE)
	);

	// Reset page when filters change
	$effect(() => {
		salesMarketplace;
		salesStatus;
		salesDateFrom;
		salesDateTo;
		salesPage = 1;
	});

	// ── CSV export (client-side) ──────────────────────────────────────
	function exportCSV() {
		const rows = filteredSales();
		const header = ['ID', 'Produk', 'Platform', 'Jumlah', 'Komisi', 'Status', 'Tanggal'];
		const lines = rows.map((r) =>
			[
				r.id,
				`"${r.productName}"`,
				r.platform,
				r.saleAmount,
				r.commissionAmount ?? 0,
				r.status,
				new Date(r.createdAt).toLocaleDateString('id-ID')
			].join(',')
		);
		const csv = [header.join(','), ...lines].join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `affiliate-sales-${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	let requestingPayout = $state(false);
	let showPayoutConfirm = $state(false);
</script>

<svelte:head>
	<title>Affiliate Dashboard — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Affiliate Dashboard" description="Track your affiliate links and sales" />

	<PlanLimiter requiredPlan="pro" {currentPlan} featureName="Affiliate Dashboard">
		<!-- Stats Cards -->
		<div class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
			<StatCard
				value={formatCurrency(Number(data.stats.totalSales))}
				label="Total Penjualan"
				variant="success"
			/>
			<StatCard
				value={formatCurrency(Number(data.stats.totalCommission))}
				label="Total Komisi"
				variant="accent"
			/>
			<StatCard value={data.stats.linkCount} label="Affiliate Links" variant="default" />
			<StatCard value={data.stats.saleCount} label="Total Transaksi" variant="warning" />
		</div>

		<!-- Trend Chart -->
		{#if data.trend && data.trend.length > 0}
			<div class="mb-6">
				<SalesTrendChart data={data.trend} />
			</div>
		{/if}

		<!-- Tabs -->
		<Tabs {tabs} queryParam="tab" />

		<!-- ── LINKS TAB ── -->
		{#if data.tab === 'links'}
			<!-- Filter bar -->
			<div class="mb-4 flex flex-wrap items-center gap-3">
				<select
					bind:value={linkFilter}
					class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-2 text-sm ${COLOR.textPrimary} outline-none focus:border-blue-500`}
					aria-label="Filter by marketplace"
				>
					<option value="">Semua Platform</option>
					<option value="shopee">🛒 Shopee</option>
					<option value="tokopedia">🛍️ Tokopedia</option>
					<option value="tiktok_shop">🎵 TikTok Shop</option>
					<option value="lazada">📦 Lazada</option>
					<option value="other">🔗 Other</option>
				</select>
				<span class={`text-xs ${COLOR.textMuted}`}>{filteredLinks.length} link</span>
			</div>

			<!-- Add Link Form -->
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} mb-6 p-6`}
			>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>➕ Tambah Affiliate Link</h3>
				<form
					method="POST"
					action="?/addLink"
					use:enhance={formToast({
						success: 'Affiliate link berhasil ditambahkan',
						error: 'Gagal menambahkan affiliate link',
						withUpdate: false,
						onSuccess: () => window.location.reload()
					})}
					class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5"
				>
					<input
						type="text"
						name="name"
						required
						placeholder="Nama Produk"
						class={`${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body} outline-none focus:border-blue-600`}
					/>
					<select
						name="platform"
						required
						class={`${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body} outline-none focus:border-blue-600`}
					>
						<option value="">Pilih Platform</option>
						<option value="shopee">🛒 Shopee</option>
						<option value="tokopedia">🛍️ Tokopedia</option>
						<option value="tiktok_shop">🎵 TikTok Shop</option>
						<option value="lazada">📦 Lazada</option>
						<option value="other">🔗 Other</option>
					</select>
					<input
						type="url"
						name="url"
						required
						placeholder="URL Produk"
						class={`${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body} outline-none focus:border-blue-600`}
					/>
					<input
						type="number"
						name="productPrice"
						placeholder="Harga (Rp)"
						class={`${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body} outline-none focus:border-blue-600`}
					/>
					<button
						type="submit"
						class={`${RADIUS.button} ${COLOR.accentBg} py-2 ${TEXT.button} font-bold text-white`}
					>
						Tambah
					</button>
				</form>
			</div>

			<!-- Links Grid -->
			{#if filteredLinks.length > 0}
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each filteredLinks as link}
						<div class="relative">
							<AffiliateLinkCard {link} />
							<form
								method="POST"
								action="?/deleteLink"
								class="absolute top-3 right-3"
								use:enhance={formToast({
									success: 'Link dihapus',
									error: 'Gagal menghapus',
									withUpdate: false,
									onSuccess: () => window.location.reload()
								})}
							>
								<input type="hidden" name="linkId" value={link.id} />
								<button
									type="submit"
									class="rounded-lg bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
									aria-label="Hapus link"
								>
									✕
								</button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<div class={`${RADIUS.card} border-2 border-dashed ${COLOR.cardBorder} p-12 text-center`}>
					<p class="mb-2 text-3xl">🔗</p>
					<p class={`${COLOR.textSecondary}`}>Belum ada affiliate link. Tambahkan di atas!</p>
				</div>
			{/if}

			<!-- ── SALES TAB ── -->
		{:else if data.tab === 'sales'}
			<!-- Filter bar -->
			<div
				class={`mb-4 flex flex-wrap items-center gap-3 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}
			>
				<select
					bind:value={salesMarketplace}
					class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-1.5 text-sm ${COLOR.textPrimary} outline-none focus:border-blue-500`}
					aria-label="Filter marketplace"
				>
					<option value="">Semua Platform</option>
					<option value="shopee">Shopee</option>
					<option value="tokopedia">Tokopedia</option>
					<option value="tiktok_shop">TikTok Shop</option>
					<option value="lazada">Lazada</option>
					<option value="other">Other</option>
				</select>
				<select
					bind:value={salesStatus}
					class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-1.5 text-sm ${COLOR.textPrimary} outline-none focus:border-blue-500`}
					aria-label="Filter status"
				>
					<option value="">Semua Status</option>
					<option value="confirmed">Confirmed</option>
					<option value="pending">Pending</option>
					<option value="cancelled">Cancelled</option>
				</select>
				<input
					type="date"
					bind:value={salesDateFrom}
					class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-1.5 text-sm ${COLOR.textPrimary} outline-none focus:border-blue-500`}
					aria-label="Dari tanggal"
				/>
				<input
					type="date"
					bind:value={salesDateTo}
					class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-1.5 text-sm ${COLOR.textPrimary} outline-none focus:border-blue-500`}
					aria-label="Sampai tanggal"
				/>
				<button
					onclick={exportCSV}
					class={`ml-auto ${RADIUS.button} border ${COLOR.cardBorder} px-4 py-1.5 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
				>
					⬇ Export CSV
				</button>
			</div>

			<!-- Sales Table -->
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}
			>
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead>
							<tr
								class="border-b border-zinc-100 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-800/50"
							>
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Produk</th
								>
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Platform</th
								>
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Penjualan</th
								>
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Komisi</th
								>
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Status</th
								>
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Tanggal</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-zinc-50 dark:divide-zinc-800">
							{#each pagedSales as sale}
								<tr class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
									<td class="px-5 py-3">
										<p class={`text-sm font-semibold ${COLOR.textPrimary}`}>{sale.productName}</p>
									</td>
									<td class="px-5 py-3">
										<span class={`text-xs capitalize ${COLOR.textSecondary}`}
											>{sale.platform.replace('_', ' ')}</span
										>
									</td>
									<td class="px-5 py-3 font-semibold text-blue-600 dark:text-blue-400">
										{formatCurrency(sale.saleAmount)}
									</td>
									<td class="px-5 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
										{formatCurrency(sale.commissionAmount ?? 0)}
									</td>
									<td class="px-5 py-3">
										<span
											class={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
												sale.status === 'confirmed'
													? `${STATUS.success.bg} ${STATUS.success.text}`
													: sale.status === 'pending'
														? `${STATUS.warning.bg} ${STATUS.warning.text}`
														: `${STATUS.neutral.bg} ${STATUS.neutral.text}`
											}`}
										>
											{sale.status}
										</span>
									</td>
									<td class="px-5 py-3">
										<span class={`text-xs ${COLOR.textMuted}`}>
											{new Date(sale.createdAt).toLocaleDateString('id-ID')}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					{#if pagedSales.length === 0}
						<div class="p-8 text-center">
							<p class={`${COLOR.textSecondary}`}>Tidak ada data penjualan.</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Pagination -->
			{#if totalSalesPages > 1}
				<div class="mt-4 flex items-center justify-center gap-2">
					<button
						onclick={() => (salesPage = Math.max(1, salesPage - 1))}
						disabled={salesPage <= 1}
						class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800`}
						aria-label="Halaman sebelumnya"
					>
						← Prev
					</button>
					<span class={`text-sm ${COLOR.textMuted}`}>{salesPage} / {totalSalesPages}</span>
					<button
						onclick={() => (salesPage = Math.min(totalSalesPages, salesPage + 1))}
						disabled={salesPage >= totalSalesPages}
						class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800`}
						aria-label="Halaman berikutnya"
					>
						Next →
					</button>
				</div>
			{/if}

			<!-- ── PAYOUT TAB ── -->
		{:else if data.tab === 'payout'}
			{#if data.payout}
				<div class="grid gap-6 md:grid-cols-2">
					<!-- Payout Summary -->
					<div
						class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}
					>
						<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>💳 Saldo Komisi</h3>
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class={`text-sm ${COLOR.textSecondary}`}>Pending Payout</span>
								<span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
									{formatCurrency(data.payout.pendingPayout)}
								</span>
							</div>
							<div class="flex items-center justify-between">
								<span class={`text-sm ${COLOR.textSecondary}`}>Total Sudah Dibayar</span>
								<span class={`text-sm font-semibold ${COLOR.textPrimary}`}
									>{formatCurrency(data.payout.paidOut)}</span
								>
							</div>
							<div class="flex items-center justify-between">
								<span class={`text-sm ${COLOR.textSecondary}`}>Total Earnings</span>
								<span class={`text-sm font-semibold ${COLOR.textPrimary}`}
									>{formatCurrency(data.payout.totalEarnings)}</span
								>
							</div>
							<div class="my-2 h-px bg-zinc-200 dark:bg-zinc-700"></div>
							<div class="flex items-center justify-between">
								<span class={`text-sm ${COLOR.textSecondary}`}>Tier</span>
								<span
									class={`${RADIUS.badge} bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700 capitalize dark:bg-orange-900/30 dark:text-orange-300`}
								>
									{data.payout.tier}
								</span>
							</div>
						</div>

						<!-- Confirm dialog -->
						{#if showPayoutConfirm}
							<div
								class={`mt-4 ${RADIUS.card} border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-950/20`}
							>
								<p class="mb-3 text-sm font-semibold text-amber-800 dark:text-amber-300">
									Konfirmasi request payout {formatCurrency(data.payout.pendingPayout)}?
								</p>
								<div class="flex gap-2">
									<form
										method="POST"
										action="?/requestPayout"
										use:enhance={() => {
											requestingPayout = true;
											return async ({ result }) => {
												requestingPayout = false;
												showPayoutConfirm = false;
												if (result.type === 'success') {
													toast.success('Permintaan payout berhasil dikirim!');
												} else if (result.type === 'failure') {
													const errData = result.data as Record<string, unknown> | undefined;
													toast.error(String(errData?.error ?? 'Gagal request payout'));
												}
											};
										}}
									>
										<button
											type="submit"
											disabled={requestingPayout}
											class={`${RADIUS.button} bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-60`}
										>
											{requestingPayout ? 'Memproses...' : 'Ya, Request'}
										</button>
									</form>
									<button
										onclick={() => (showPayoutConfirm = false)}
										class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-semibold ${COLOR.textSecondary}`}
									>
										Batal
									</button>
								</div>
							</div>
						{:else}
							<button
								onclick={() => (showPayoutConfirm = true)}
								disabled={data.payout.pendingPayout < MINIMUM_PAYOUT}
								class={`mt-6 w-full ${RADIUS.button} ${SPACING.button} ${TEXT.button} font-bold text-white ${TRANSITION.all} ${
									data.payout.pendingPayout >= MINIMUM_PAYOUT
										? `${COLOR.accentBg} hover:-translate-y-0.5`
										: 'cursor-not-allowed bg-zinc-300 dark:bg-zinc-700'
								} disabled:opacity-60`}
							>
								Request Payout
							</button>
							{#if data.payout.pendingPayout < MINIMUM_PAYOUT}
								<p class={`mt-2 text-center text-xs ${COLOR.textMuted}`}>
									Minimum {formatCurrency(MINIMUM_PAYOUT)}. Kurang {formatCurrency(
										MINIMUM_PAYOUT - data.payout.pendingPayout
									)} lagi.
								</p>
							{/if}
						{/if}
					</div>

					<!-- Bank Info -->
					<div
						class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}
					>
						<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>🏦 Info Rekening</h3>
						{#if data.payout.bankName}
							<div class="space-y-3">
								<div>
									<p class={`text-xs ${COLOR.textMuted} mb-0.5`}>Bank</p>
									<p class={`font-semibold ${COLOR.textPrimary}`}>{data.payout.bankName}</p>
								</div>
								<div>
									<p class={`text-xs ${COLOR.textMuted} mb-0.5`}>Nomor Rekening</p>
									<p class={`font-semibold ${COLOR.textPrimary}`}>
										{data.payout.bankAccountNumber}
									</p>
								</div>
								<div>
									<p class={`text-xs ${COLOR.textMuted} mb-0.5`}>Atas Nama</p>
									<p class={`font-semibold ${COLOR.textPrimary}`}>{data.payout.bankAccountName}</p>
								</div>
							</div>
						{:else}
							<div class="flex flex-col items-center justify-center py-8 text-center">
								<p class="mb-2 text-3xl">🏦</p>
								<p class={`text-sm ${COLOR.textMuted}`}>Belum ada info rekening.</p>
								<a
									href="/app/settings"
									class={`mt-3 text-sm font-bold ${COLOR.accent} hover:underline`}
								>
									Lengkapi di Settings →
								</a>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class={`${RADIUS.card} border-2 border-dashed ${COLOR.cardBorder} p-12 text-center`}>
					<p class="mb-2 text-3xl">💼</p>
					<p class={`${TEXT.h3} ${COLOR.textPrimary} mb-1`}>Belum Ada Affiliate Account</p>
					<p class={`text-sm ${COLOR.textMuted}`}>
						Affiliate account dibuat otomatis untuk mentor dan facilitator.
					</p>
				</div>
			{/if}
		{/if}
	</PlanLimiter>
</PageWrapper>
