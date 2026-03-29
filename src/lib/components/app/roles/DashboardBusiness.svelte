<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import RoleSwitcher from '$lib/components/app/RoleSwitcher.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING, RADIUS, ELEVATION, GRADIENT } from '$lib/config/design';
	import { formatCurrency } from '$lib/utils/format';
	import { fade, fly } from 'svelte/transition';

	interface DashboardBusinessProps {
		data: any;
	}

	let { data }: DashboardBusinessProps = $props();

	const columns = [
		{ key: 'date', label: 'Date' },
		{ key: 'amount', label: 'Amount' },
		{ key: 'user', label: 'User' }
	];
	const rows = (data.recentTransactions?.slice(0, 5) ?? []).map((t: any) => ({
		date: new Date(t.createdAt).toLocaleDateString('id-ID'),
		amount: formatCurrency(t.amount ?? 0),
		user: t.username ?? t.userId
	}));
</script>

<div class="flex flex-col gap-12 lg:gap-14">
	<!-- Standardized Header -->
	<header
		class="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end"
		in:fade={{ duration: 800 }}
	>
		<div class="space-y-4">
			<div class="flex items-center gap-2.5">
				<div class="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
				<span class={`${TEXT.small} ${COLOR.textMuted} tracking-[0.25em]`}
					>BUSINESS OVERVIEW • FINANCIALS LIVE</span
				>
			</div>
			<h1 class="text-4xl md:text-5xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">
				Revenue <span class="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Analytics</span>
			</h1>
			<p class={`${TEXT.secondary} max-w-xl font-medium leading-relaxed`}>
				Track financial performance, Average Revenue Per User (ARPU), and subscription churn in one unified view.
			</p>
		</div>

		<div
			class="flex items-center gap-5 rounded-[1.5rem] bg-white/5 shadow-sm transition-all"
			in:fade={{ duration: 1000, delay: 200 }}
		>
			<RoleSwitcher userRole={data.user.role} />
		</div>
	</header>

	<!-- Bento Grid for Business Stats -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
		<div
			class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all border-l-4 border-l-emerald-500`}
		>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Total Revenue</span>
			<p class="mt-4 text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
				{formatCurrency(data.stats.revenue || 0)}
			</p>
		</div>
		<div
			class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all`}
		>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">ARPU</span>
			<p class="mt-4 text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
				{formatCurrency(data.stats.arpu || 0)}
			</p>
		</div>
		<div
			class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all`}
		>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Active Subscriptions</span>
			<p class="mt-4 text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
				{data.stats.activeSubs || 0}
			</p>
		</div>
		<div
			class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all`}
		>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Churn Rate</span>
			<p class="mt-4 text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
				{data.stats.churn || 0}<span class="text-2xl text-zinc-400">%</span>
			</p>
		</div>
	</div>

	<div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
		<!-- Financial Activity Graph -->
		<div class="lg:col-span-8">
			<OverviewGraph
				title="Finance Activity"
				description="Settled revenue vs. projections over 30 days"
				dataPoints={[120, 150, 180, 140, 200, 250, 220, 280, 310, 290, 350, 400]}
			/>
		</div>

		<!-- Action Sidebar: Financial Ops -->
		<div class="lg:col-span-4 space-y-8">
			<div class={`${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} p-10 ${ELEVATION.card}`}>
				<h3 class="text-xs font-black tracking-widest text-zinc-400 uppercase mb-8">Financial Operations</h3>
				<div class="space-y-4">
					<a href="/app/admin/payments" class="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
						<span class="text-sm font-bold">Payout Registry</span>
						<span class="text-zinc-300">→</span>
					</a>
					<a href="/app/admin/reports" class="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
						<span class="text-sm font-bold">Download Reports</span>
						<span class="text-zinc-300">⬇</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	<PageSection>
		<div class="mb-8 flex items-center justify-between">
			<h2 class={`${TEXT.h2} font-black tracking-tight`}>Recent Transactions</h2>
			<a href="/app/admin/payments">
				<Button variant="ghost" class="text-[10px] font-black tracking-widest uppercase">View All Logs</Button>
			</a>
		</div>
		<div class="overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
			<Table {columns} {rows} />
		</div>
	</PageSection>
</div>
