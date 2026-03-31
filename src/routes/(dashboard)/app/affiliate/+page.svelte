<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PlanLimiter from '$lib/components/app/PlanLimiter.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';
	import { formToast } from '$lib/utils/formEnhance';

	let { data }: { data: PageData } = $props();
	const currentPlan = data.workspaces?.activeOrg?.planType || 'free';

	const tabs = [
		{ label: '🔗 Affiliate Links', value: 'links' },
		{ label: '💰 Sales & Commission', value: 'sales' }
	];

	const platformIcons: Record<string, string> = {
		shopee: '🛒',
		tokopedia: '🛍️',
		tiktok_shop: '🎵',
		lazada: '📦',
		other: '🔗'
	};

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
	}
</script>

<svelte:head>
	<title>Affiliate Dashboard — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Affiliate Dashboard" description="Track your affiliate links and sales" />

	<PlanLimiter requiredPlan="pro" {currentPlan} featureName="Affiliate Dashboard">
		<!-- Stats Cards -->
		<div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
		{:else}
			<!-- Add Sale Form -->
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} mb-6 p-6`}
			>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>➕ Catat Penjualan</h3>
				<form
					method="POST"
					action="?/addSale"
					use:enhance={formToast({
						success: 'Penjualan berhasil dicatat',
						error: 'Gagal mencatat penjualan',
						withUpdate: false,
						onSuccess: () => window.location.reload()
					})}
					class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
				>
					<input
						type="text"
						name="productName"
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
						type="number"
						name="saleAmount"
						required
						placeholder="Jumlah Penjualan (Rp)"
						class={`${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body} outline-none focus:border-blue-600`}
					/>
					<input
						type="number"
						name="commissionAmount"
						placeholder="Komisi (Rp)"
						class={`${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body} outline-none focus:border-blue-600`}
					/>
					<input
						type="text"
						name="transactionId"
						placeholder="ID Transaksi"
						class={`${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body} outline-none focus:border-blue-600`}
					/>
					<textarea
						name="notes"
						placeholder="Catatan"
						rows="1"
						class={`${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body} outline-none focus:border-blue-600`}
					></textarea>
					<button
						type="submit"
						class={`${RADIUS.button} ${COLOR.accentBg} py-2 ${TEXT.button} font-bold text-white`}
					>
						Simpan
					</button>
				</form>
			</div>

			<!-- Sales List -->
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
					<tbody class="divide-y divide-gray-50">
						{#each data.sales as sale}
							<tr>
								<td class="px-5 py-3">
									<p class={`font-medium ${COLOR.textPrimary}`}>{sale.productName}</p>
									{#if sale.transactionId}
										<p class={`text-xs ${COLOR.textMuted}`}>ID: {sale.transactionId}</p>
									{/if}
								</td>
								<td class="px-5 py-3">
									<span class="text-lg">{platformIcons[sale.platform] || '🔗'}</span>
								</td>
								<td class="px-5 py-3 font-bold text-green-600">
									{formatCurrency(sale.saleAmount)}
								</td>
								<td class="px-5 py-3 font-bold text-blue-600">
									{formatCurrency(sale.commissionAmount || 0)}
								</td>
								<td class="px-5 py-3">
									<span
										class={`rounded-full px-2 py-0.5 text-xs font-bold ${
											sale.status === 'confirmed'
												? 'bg-green-100 text-green-700'
												: sale.status === 'paid'
													? 'bg-blue-100 text-blue-700'
													: sale.status === 'pending'
														? 'bg-yellow-100 text-yellow-700'
														: 'bg-gray-100 text-gray-700'
										}`}
									>
										{sale.status}
									</span>
								</td>
								<td class="px-5 py-3 text-sm">
									{new Date(sale.createdAt).toLocaleDateString('id-ID')}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				{#if data.sales.length === 0}
					<div class="p-8 text-center">
						<p class={`${COLOR.textSecondary}`}>Belum ada penjualan dicatat. Catat di atas!</p>
					</div>
				{/if}
			</div>
		{/if}
	</PlanLimiter>
</PageWrapper>
