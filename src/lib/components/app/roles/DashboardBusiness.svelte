<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import RoleSwitcher from '$lib/components/app/RoleSwitcher.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING, RADIUS, ELEVATION, GRADIENT, TRANSITION } from '$lib/config/design';
	import { formatCurrency } from '$lib/utils/format';
	import { fade, fly } from 'svelte/transition';

	interface DashboardBusinessProps {
		data: any;
	}

	let { data }: DashboardBusinessProps = $props();

	const columns = [
		{ key: 'date', label: 'Settlement Date' },
		{ key: 'user', label: 'Associate/User' },
		{ key: 'amount', label: 'Amount Settled' }
	];
	const rows = (data.recentTransactions?.slice(0, 5) ?? []).map((t: any) => ({
		date: new Date(t.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
		amount: formatCurrency(t.amount ?? 0),
		user: t.username ?? t.userId
	}));
</script>

<div class="flex flex-col gap-10 md:gap-14 animate-in fade-in duration-1000">
	<!-- Financial Analytics Header -->
	<header class="relative overflow-hidden pt-8 pb-4">
		<div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
			<div class="space-y-4">
				<div class="flex items-center gap-3">
					<div class="px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 text-[10px] font-bold tracking-widest uppercase shadow-sm">
						Business Ops
					</div>
					<div class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
					<span class={`text-[10px] font-bold ${COLOR.textMuted} uppercase tracking-widest`}>Revenue Live</span>
				</div>
				<h1 class="text-5xl md:text-6xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">
					Revenue <span class="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Nexus</span>
				</h1>
				<p class="text-sm md:text-base font-medium text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
					Track financial velocity, acquisition efficiency, and ecosystem growth. 
					Data-driven transparency for Naik Kelas business operations.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<a href="/app/admin/reports">
					<Button variant="ghost" class={`h-12 px-8 font-black tracking-widest uppercase border border-zinc-200 dark:border-zinc-800 rounded-full transition-all ${COLOR.surfaceHover}`}>
						Analytical Export ⬇
					</Button>
				</a>
			</div>
		</div>
	</header>

	<!-- Financial Bento Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-1 border-l-4 border-l-emerald-600`}>
			<div class="space-y-1">
				<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}>Gross Revenue</span>
				<p class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight">
					{formatCurrency(data.stats.revenue || 0)}
				</p>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">💰</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-1`}>
			<div class="space-y-1">
				<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}>User ARPU</span>
				<p class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight">
					{formatCurrency(data.stats.arpu || 0)}
				</p>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">🎯</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-1`}>
			<div class="space-y-1">
				<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}>Active Subs</span>
				<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight">
					{data.stats.activeSubs || 0}
				</p>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">🔄</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10 ${TRANSITION.all}`}>
			<div class="space-y-1">
				<span class="text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">Retention Rate</span>
				<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight">
					{100 - (data.stats.churn || 0)}<span class="text-2xl opacity-40">%</span>
				</p>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">📈</div>
		</div>
	</div>

	<!-- Revenue Intelligence Graph -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
		<div class="lg:col-span-8">
			<OverviewGraph
				title="Capital Inflow"
				description="Transactional volume and revenue spikes mapped across 30 active cycles."
				dataPoints={[120, 150, 180, 140, 200, 250, 220, 280, 310, 290, 350, 400]}
			/>
		</div>

		<div class="lg:col-span-4 space-y-6">
			<!-- Advanced Ops Actions -->
			<div class={`${RADIUS.card} ${COLOR.card} border-2 border-zinc-100 dark:border-zinc-800 p-8 shadow-sm`}>
				<h3 class={`text-xs font-black tracking-widest ${COLOR.textMuted} uppercase mb-8`}>Capital Operations</h3>
				<div class="space-y-3">
					<a href="/app/admin/payments" class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} ${COLOR.surfaceHover}`}>
						<div class="flex items-center gap-3">
							<span class="text-lg">🏦</span>
							<span class="text-xs font-black uppercase tracking-tight">Payout Hub</span>
						</div>
					</a>

					<a href="/app/admin/coupons" class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} ${COLOR.surfaceHover}`}>
						<div class="flex items-center gap-3">
							<span class="text-lg">🎟️</span>
							<span class="text-xs font-black uppercase tracking-tight">Promotions</span>
						</div>
					</a>

					<a href="/app/admin/refunds" class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} ${COLOR.surfaceHover} opacity-60`}>
						<div class="flex items-center gap-3">
							<span class="text-lg">↩️</span>
							<span class="text-xs font-black uppercase tracking-tight">Refund Queue</span>
						</div>
					</a>
				</div>
			</div>

			<!-- Financial Health Card -->
			<div class={`${RADIUS.card} bg-linear-to-br from-emerald-600 to-teal-700 p-8 text-white relative overflow-hidden group shadow-lg`}>
				<div class="relative z-10 space-y-2">
					<h4 class="text-xs font-black text-emerald-200 uppercase tracking-widest leading-none">Healthy Growth</h4>
					<p class="text-lg font-black leading-tight italic tracking-tighter">Naik Kelas +24% MoM</p>
					<p class="text-[10px] opacity-70 font-medium leading-relaxed">
						Revenue sustainability index is looking exceptionally strong for this quarter. Keep scaling acquisition tracks.
					</p>
				</div>
				<div class="absolute -right-2 -bottom-2 text-6xl opacity-20 transition-transform group-hover:scale-110 duration-700">💎</div>
			</div>
		</div>
	</div>

	<!-- Transaction Ledger -->
	<PageSection>
		<div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
			<div class="space-y-2">
				<h2 class="text-3xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">Settlement Ledger</h2>
				<p class="text-xs font-medium text-zinc-500 uppercase tracking-widest">Real-time financial reconciliation</p>
			</div>
			<a href="/app/admin/payments">
				<Button variant="ghost" class="text-[10px] font-black tracking-widest uppercase border border-zinc-200 dark:border-zinc-800 px-6 py-2.5 rounded-full">Explore Financial Audit</Button>
			</a>
		</div>

		<div class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300 shadow-sm`}>
			<Table {columns} {rows} />
			<div class="px-8 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
				<a href="/app/admin/payments" class="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest">Show total transaction history</a>
			</div>
		</div>
	</PageSection>
</div>
