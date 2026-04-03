<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import {
		COLOR,
		TEXT,
		SPACING,
		RADIUS,
		ELEVATION,
		GRADIENT,
		TRANSITION
	} from '$lib/config/design';
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
		date: new Date(t.createdAt).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}),
		amount: formatCurrency(t.amount ?? 0),
		user: t.username ?? t.userId
	}));
</script>

<div class="animate-in fade-in flex flex-col gap-10 duration-1000 md:gap-14">
	<!-- Financial Analytics Header -->
	<header class="relative overflow-hidden pt-8 pb-4">
		<div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
			<div class="space-y-4">
				<div class="flex items-center gap-3">
					<div
						class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-700 uppercase shadow-sm dark:border-emerald-900/30 dark:bg-emerald-900/20"
					>
						Business Ops
					</div>
					<div
						class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
					></div>
					<span class={`text-[10px] font-bold ${COLOR.textMuted} tracking-widest uppercase`}
						>Revenue Live</span
					>
				</div>
				<h1
					class="text-5xl leading-none font-black tracking-tighter text-zinc-900 md:text-6xl dark:text-white"
				>
					Revenue <span
						class="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
						>Nexus</span
					>
				</h1>
				<p
					class="max-w-2xl text-sm leading-relaxed font-medium text-zinc-500 md:text-base dark:text-zinc-400"
				>
					Track financial velocity, acquisition efficiency, and ecosystem growth. Data-driven
					transparency for Naik Kelas business operations.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<a href="/app/admin/reports">
					<Button
						variant="ghost"
						class={`h-12 rounded-full border border-zinc-200 px-8 font-black tracking-widest uppercase transition-all dark:border-zinc-800 ${COLOR.surfaceHover}`}
					>
						Analytical Export ⬇
					</Button>
				</a>
			</div>
		</div>
	</header>

	<!-- Financial Bento Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<div
			class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} border-l-4 border-l-emerald-600 hover:-translate-y-1`}
		>
			<div class="space-y-1">
				<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}
					>Gross Revenue</span
				>
				<p class="text-3xl leading-tight font-black tracking-tighter text-zinc-900 dark:text-white">
					{formatCurrency(data.stats.revenue || 0)}
				</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-10 transition-opacity group-hover:opacity-20"
			>
				💰
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-1`}
		>
			<div class="space-y-1">
				<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}
					>User ARPU</span
				>
				<p class="text-3xl leading-tight font-black tracking-tighter text-zinc-900 dark:text-white">
					{formatCurrency(data.stats.arpu || 0)}
				</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-10 transition-opacity group-hover:opacity-20"
			>
				🎯
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-1`}
		>
			<div class="space-y-1">
				<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}
					>Active Subs</span
				>
				<p class="text-5xl leading-tight font-black tracking-tighter text-zinc-900 dark:text-white">
					{data.stats.activeSubs || 0}
				</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-10 transition-opacity group-hover:opacity-20"
			>
				🔄
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} border border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-900/10 ${TRANSITION.all}`}
		>
			<div class="space-y-1">
				<span
					class="text-[10px] font-black tracking-widest text-emerald-600 uppercase dark:text-emerald-400"
					>Retention Rate</span
				>
				<p class="text-5xl leading-tight font-black tracking-tighter text-zinc-900 dark:text-white">
					{100 - (data.stats.churn || 0)}<span class="text-2xl opacity-40">%</span>
				</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-10 transition-opacity group-hover:opacity-20"
			>
				📈
			</div>
		</div>
	</div>

	<!-- Revenue Intelligence Graph -->
	<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
		<div class="lg:col-span-8">
			<OverviewGraph
				title="Capital Inflow"
				description="Transactional volume and revenue spikes mapped across 30 active cycles."
				dataPoints={data.activityGraph || []}
			/>
		</div>

		<div class="space-y-6 lg:col-span-4">
			<!-- Advanced Ops Actions -->
			<div
				class={`${RADIUS.card} ${COLOR.card} border-2 border-zinc-100 p-8 shadow-sm dark:border-zinc-800`}
			>
				<h3 class={`text-xs font-black tracking-widest ${COLOR.textMuted} mb-8 uppercase`}>
					Capital Operations
				</h3>
				<div class="space-y-3">
					<a
						href="/app/admin/payments"
						class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} ${COLOR.surfaceHover}`}
					>
						<div class="flex items-center gap-3">
							<span class="text-lg">🏦</span>
							<span class="text-xs font-black tracking-tight uppercase">Payout Hub</span>
						</div>
					</a>

					<a
						href="/app/admin/coupons"
						class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} ${COLOR.surfaceHover}`}
					>
						<div class="flex items-center gap-3">
							<span class="text-lg">🎟️</span>
							<span class="text-xs font-black tracking-tight uppercase">Promotions</span>
						</div>
					</a>

					<a
						href="/app/admin/refunds"
						class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} ${COLOR.surfaceHover} opacity-60`}
					>
						<div class="flex items-center gap-3">
							<span class="text-lg">↩️</span>
							<span class="text-xs font-black tracking-tight uppercase">Refund Queue</span>
						</div>
					</a>
				</div>
			</div>

			<!-- Financial Health Card -->
			<div
				class={`${RADIUS.card} group relative overflow-hidden bg-linear-to-br from-emerald-600 to-teal-700 p-8 text-white shadow-lg`}
			>
				<div class="relative z-10 space-y-2">
					<h4 class="text-xs leading-none font-black tracking-widest text-emerald-200 uppercase">
						Healthy Growth
					</h4>
					<p class="text-lg leading-tight font-black tracking-tighter italic">
						Naik Kelas +24% MoM
					</p>
					<p class="text-[10px] leading-relaxed font-medium opacity-70">
						Revenue sustainability index is looking exceptionally strong for this quarter. Keep
						scaling acquisition tracks.
					</p>
				</div>
				<div
					class="absolute -right-2 -bottom-2 text-6xl opacity-20 transition-transform duration-700 group-hover:scale-110"
				>
					💎
				</div>
			</div>
		</div>
	</div>

	<!-- Transaction Ledger -->
	<PageSection>
		<div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div class="space-y-2">
				<h2 class="text-3xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white">
					Settlement Ledger
				</h2>
				<p class="text-xs font-medium tracking-widest text-zinc-500 uppercase">
					Real-time financial reconciliation
				</p>
			</div>
			<a href="/app/admin/payments">
				<Button
					variant="ghost"
					class="rounded-full border border-zinc-200 px-6 py-2.5 text-[10px] font-black tracking-widest uppercase dark:border-zinc-800"
					>Explore Financial Audit</Button
				>
			</a>
		</div>

		<div
			class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} animate-in fade-in slide-in-from-bottom-5 shadow-sm delay-300 duration-1000`}
		>
			<Table {columns} {rows} />
			<div
				class="flex justify-center border-t border-zinc-100 bg-zinc-50/50 px-8 py-4 dark:border-zinc-800 dark:bg-zinc-900/50"
			>
				<a
					href="/app/admin/payments"
					class="text-[10px] font-black tracking-widest text-emerald-600 uppercase hover:underline"
					>Show total transaction history</a
				>
			</div>
		</div>
	</PageSection>
</div>
