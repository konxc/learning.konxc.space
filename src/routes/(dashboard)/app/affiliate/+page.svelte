<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	let activeTab = $state<'links' | 'sales'>('links');

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

	<!-- Stats Cards -->
	<div class="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}>
			<p class="text-3xl font-black text-green-600">{formatCurrency(Number(data.stats.totalSales))}</p>
			<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted}`}>Total Penjualan</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}>
			<p class="text-3xl font-black text-blue-600">{formatCurrency(Number(data.stats.totalCommission))}</p>
			<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted}`}>Total Komisi</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}>
			<p class="text-3xl font-black text-purple-600">{data.stats.linkCount}</p>
			<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted}`}>Affiliate Links</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}>
			<p class="text-3xl font-black text-amber-500">{data.stats.saleCount}</p>
			<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted}`}>Total Transaksi</p>
		</div>
	</div>

	<!-- Tabs -->
	<div class="mb-6 flex gap-4 border-b border-gray-200">
		<button
			class={`px-4 py-2 font-bold transition-all ${activeTab === 'links' ? 'border-b-2 border-blue-600 text-blue-600' : COLOR.textSecondary}`}
			onclick={() => activeTab = 'links'}
		>
			🔗 Affiliate Links
		</button>
		<button
			class={`px-4 py-2 font-bold transition-all ${activeTab === 'sales' ? 'border-b-2 border-blue-600 text-blue-600' : COLOR.textSecondary}`}
			onclick={() => activeTab = 'sales'}
		>
			💰 Sales & Commission
		</button>
	</div>

	{#if activeTab === 'links'}
		<!-- Add Link Form -->
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6 mb-6`}>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>➕ Tambah Affiliate Link</h3>
			<form
				method="POST"
				action="?/addLink"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							window.location.reload();
						}
					};
				}}
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
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
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}>
			<table class="w-full text-left">
				<thead>
					<tr class="border-b border-gray-100 bg-gray-50/70">
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Produk</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Platform</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Harga</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Clicks</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Konversi</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50">
					{#each data.links as link}
						<tr>
							<td class="px-5 py-3">
								<p class={`font-medium ${COLOR.textPrimary}`}>{link.name}</p>
								<a href={link.url} target="_blank" class={`text-xs ${COLOR.textMuted} hover:text-blue-600`}>
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
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												window.location.reload();
											}
										};
									}}
								>
									<input type="hidden" name="linkId" value={link.id} />
									<button type="submit" class="text-red-600 hover:underline text-sm">
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
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6 mb-6`}>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>➕ Catat Penjualan</h3>
			<form
				method="POST"
				action="?/addSale"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							window.location.reload();
						}
					};
				}}
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}>
			<table class="w-full text-left">
				<thead>
					<tr class="border-b border-gray-100 bg-gray-50/70">
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Produk</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Platform</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Penjualan</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Komisi</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Status</th>
						<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Tanggal</th>
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
								<span class={`rounded-full px-2 py-0.5 text-xs font-bold ${
									sale.status === 'confirmed' ? 'bg-green-100 text-green-700' :
									sale.status === 'paid' ? 'bg-blue-100 text-blue-700' :
									sale.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
									'bg-gray-100 text-gray-700'
								}`}>
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
</PageWrapper>
