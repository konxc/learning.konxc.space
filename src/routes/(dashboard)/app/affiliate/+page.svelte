<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PlanLimiter from '$lib/components/app/PlanLimiter.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import SalesTrendChart from '$lib/components/app/affiliate/SalesTrendChart.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION, SPACING } from '$lib/config/design';
	import { enhance } from '$app/forms';
	import { formToast } from '$lib/utils/formEnhance';
	import { toast } from '$lib/stores/toastStore';

	let { data }: { data: PageData } = $props();
	const currentPlan = data.workspaces?.activeOrg?.planType || 'free';

	const tabs = [
		{ label: '🔗 Affiliate Links', value: 'links' },
		{ label: '💰 Sales & Commission', value: 'sales' },
		{ label: '🏦 Payout', value: 'payout' }
	];

	const platformIcons: Record<string, string> = {
		shopee: '🛒',
		tokopedia: '🛍️',
		tiktok_shop: '🎵',
		lazada: '📦',
		other: '🔗'
	};

	const MINIMUM_PAYOUT = 100_000;

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}

	let requestingPayout = $state(false);
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

		{#if data.tab === 'links'}
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

			<!-- Links List -->
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}
			>
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-gray-100 bg-gray-50/70">
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
								>Harga</th
							>
							<th
								class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Clicks</th
							>
							<th
								class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Konversi</th
							>
							<th
								class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Aksi</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each data.links as link}
							<tr>
								<td class="px-5 py-3">
									<p class={`font-medium ${COLOR.textPrimary}`}>{link.name}</p>
									<a
										href={link.url}
										target="_blank"
										class={`text-xs ${COLOR.textMuted} hover:text-blue-600`}
									>
										{link.url.substring(0, 40)}...
									</a>
								</td>
								<td class="px-5 py-3">
									<span class="text-lg">{platformIcons[link.platform] || '🔗'}</span>
								</td>
								<td class="px-5 py-3">
									{link.productPrice ? formatCurrency(link.productPrice) : '-'}
								</td>
								<td class="px-5 py-3 font-bold text-blue-600">{link.clicks}</td>
								<td class="px-5 py-3 font-bold text-green-600">{link.conversions}</td>
								<td class="px-5 py-3">
									<form
										method="POST"
										action="?/deleteLink"
										use:enhance={formToast({
											success: 'Affiliate link berhasil dihapus',
											error: 'Gagal menghapus affiliate link',
											withUpdate: false,
											onSuccess: () => window.location.reload()
										})}
									>
										<input type="hidden" name="linkId" value={link.id} />
										<button type="submit" class="text-sm text-red-600 hover:underline">
											Hapus
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				{#if data.links.length === 0}
					<div class="p-8 text-center">
						<p class={`${COLOR.textSecondary}`}>Belum ada affiliate link. Tambahkan di atas!</p>
					</div>
				{/if}
			</div>
		{:else if data.tab === 'payout'}
			<!-- Payout Section -->
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
								<span class={`text-sm font-semibold ${COLOR.textPrimary}`}>
									{formatCurrency(data.payout.paidOut)}
								</span>
							</div>
							<div class="flex items-center justify-between">
								<span class={`text-sm ${COLOR.textSecondary}`}>Total Earnings</span>
								<span class={`text-sm font-semibold ${COLOR.textPrimary}`}>
									{formatCurrency(data.payout.totalEarnings)}
								</span>
							</div>
							<div class={`my-2 h-px bg-zinc-200 dark:bg-zinc-700`}></div>
							<div class="flex items-center justify-between">
								<span class={`text-sm ${COLOR.textSecondary}`}>Tier</span>
								<span
									class={`${RADIUS.badge} px-2 py-0.5 text-xs font-bold capitalize ${
										data.payout.tier === 'platinum'
											? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
											: data.payout.tier === 'gold'
												? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
												: data.payout.tier === 'silver'
													? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
													: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
									}`}
								>
									{data.payout.tier}
								</span>
							</div>
						</div>

						<form
							method="POST"
							action="?/requestPayout"
							class="mt-6"
							use:enhance={() => {
								requestingPayout = true;
								return async ({ result }) => {
									requestingPayout = false;
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
								disabled={requestingPayout || data.payout.pendingPayout < MINIMUM_PAYOUT}
								class={`w-full ${RADIUS.button} ${SPACING.button} ${TEXT.button} font-bold text-white ${TRANSITION.all} ${
									data.payout.pendingPayout >= MINIMUM_PAYOUT
										? `${COLOR.accentBg} ${COLOR.accentHover}`
										: 'cursor-not-allowed bg-zinc-300 dark:bg-zinc-700'
								} disabled:opacity-60`}
							>
								{requestingPayout ? 'Memproses...' : 'Request Payout'}
							</button>
						</form>

						{#if data.payout.pendingPayout < MINIMUM_PAYOUT}
							<p class={`mt-2 text-center text-xs ${COLOR.textMuted}`}>
								Minimum payout {formatCurrency(MINIMUM_PAYOUT)}. Kurang {formatCurrency(
									MINIMUM_PAYOUT - data.payout.pendingPayout
								)} lagi.
							</p>
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
