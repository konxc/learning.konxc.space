<script lang="ts">
	import type { PageData } from './$types';
	import { COLOR, RADIUS, ELEVATION } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';

	let { data }: { data: PageData } = $props();

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: Date | string | null): string {
		if (!date) return '-';
		return new Date(date).toLocaleString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Analitik Kupon: {data.coupon.code} - Admin</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<a
				href="/app/admin/coupons"
				class={`mb-2 inline-flex items-center gap-1 text-sm ${COLOR.accent} hover:underline`}
			>
				<Icon name="arrow-left" size={16} /> Kembali
			</a>
			<h1 class={`text-2xl font-bold ${COLOR.textPrimary}`}>
				Analitik Kupon: <span class={COLOR.accent}>{data.coupon.code}</span>
			</h1>
			<p class={`mt-1 text-sm ${COLOR.textMuted}`}>
				{data.coupon.description ?? 'Tanpa deskripsi'}
			</p>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatCard label="Total Penggunaan" value={data.stats.totalUsages.toString()} icon="users" />
		<StatCard
			label="Total Diskon"
			value={formatCurrency(data.stats.totalDiscount)}
			icon="percent"
		/>
		<StatCard
			label="Total Pendapatan"
			value={formatCurrency(data.stats.totalRevenue)}
			icon="dollar"
		/>
		{#if data.stats.remainingUses !== null}
			<StatCard
				label="Sisa Kuota"
				value={data.stats.remainingUses.toString()}
				icon="alert-circle"
			/>
		{/if}
	</div>

	<!-- Usage Table -->
	<div class={`rounded-2xl border ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card}`}>
		<div class={`border-b px-6 py-4 ${COLOR.cardBorder}`}>
			<h2 class={`text-lg font-semibold ${COLOR.textPrimary}`}>Riwayat Penggunaan</h2>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class={`border-b ${COLOR.cardBorder}`}>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Pengguna</th>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Kursus</th>
						<th class={`px-4 py-3 text-right font-medium ${COLOR.textMuted}`}>Pesanan</th>
						<th class={`px-4 py-3 text-right font-medium ${COLOR.textMuted}`}>Diskon</th>
						<th class={`px-4 py-3 text-right font-medium ${COLOR.textMuted}`}>Bayar</th>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Waktu</th>
					</tr>
				</thead>
				<tbody>
					{#each data.usages as usage}
						<tr class={`border-b ${COLOR.cardBorder} ${COLOR.surfaceHover}`}>
							<td class={`px-4 py-3`}>
								<p class={`font-medium ${COLOR.textPrimary}`}>{usage.userName ?? '-'}</p>
								<p class={`text-xs ${COLOR.textMuted}`}>{usage.userEmail ?? ''}</p>
							</td>
							<td class={`px-4 py-3 ${COLOR.textSecondary}`}>{usage.courseTitle ?? '-'}</td>
							<td class={`px-4 py-3 text-right ${COLOR.textPrimary}`}
								>{formatCurrency(usage.orderAmount)}</td
							>
							<td class="px-4 py-3 text-right text-red-500"
								>-{formatCurrency(usage.discountAmount)}</td
							>
							<td class={`px-4 py-3 text-right font-medium ${COLOR.textPrimary}`}
								>{formatCurrency(usage.finalAmount)}</td
							>
							<td class={`px-4 py-3 ${COLOR.textMuted}`}>{formatDate(usage.usedAt)}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class={`px-4 py-8 text-center ${COLOR.textMuted}`}>
								Belum ada penggunaan
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
