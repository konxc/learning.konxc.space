<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import {
		COLOR,
		RADIUS,
		ELEVATION,
		TRANSITION
	} from '$lib/config/design';
	import { fade, fly } from 'svelte/transition';

	interface DashboardFacilitatorProps {
		data: any;
	}

	let { data }: DashboardFacilitatorProps = $props();

	const columns = [
		{ key: 'name', label: 'Batch Name' },
		{ key: 'course', label: 'Course' },
		{ key: 'students', label: 'Active Students' }
	];
    
	const rows = (data.activeCohortsList ?? []).map((c: any) => ({
		name: c.name,
		course: c.courseTitle || 'Main Track',
		students: c.studentCount ?? 0
	}));
</script>

<div class="animate-in fade-in flex flex-col gap-10 duration-1000 md:gap-14">
	<header class="relative overflow-hidden pt-8 pb-4">
		<div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
			<div class="space-y-4">
				<div class="flex items-center gap-3">
					<div class="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-700 uppercase shadow-sm dark:border-indigo-900/30 dark:bg-indigo-900/20">
						Facilitator Hub
					</div>
					<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
					<span class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Batch Operations</span>
				</div>
				<h1 class="text-5xl leading-none font-black tracking-tighter text-zinc-900 md:text-6xl dark:text-white">
					Cohort <span class="bg-linear-to-r from-indigo-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">Control</span>
				</h1>
				<p class="max-w-2xl text-sm leading-relaxed font-medium text-zinc-500 md:text-base dark:text-zinc-400">
					Managing student experience and cohort success. View active batches, monitor engagement, and ensure consistent learning velocity across your groups.
				</p>
			</div>
			
			<div class="flex items-center gap-3">
				<a href="/app/facilitator/cohorts">
					<Button variant="primary" class="h-12 px-8 font-black tracking-widest uppercase shadow-xl shadow-indigo-500/10 transition-transform hover:scale-105 active:scale-95">
						Manage All Batches
					</Button>
				</a>
			</div>
		</div>
	</header>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-1`}>
			<div class="space-y-1">
				<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Active Cohorts</span>
				<p class="text-5xl leading-tight font-black tracking-tighter text-zinc-900 dark:text-white">{data.stats.activeCohorts || 0}</p>
			</div>
			<div class="absolute right-4 bottom-4 text-3xl opacity-10">🏢</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} border-l-4 border-l-indigo-600 hover:-translate-y-1`}>
			<div class="space-y-1">
				<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Total Students</span>
				<p class="text-5xl leading-tight font-black tracking-tighter text-indigo-600 dark:text-indigo-400">{data.stats.totalStudents || 0}</p>
			</div>
			<div class="absolute right-4 bottom-4 text-3xl opacity-10">👥</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
		<div class="lg:col-span-8">
			<OverviewGraph
				title="Cohort Activity"
				description="Engagement levels across your managed batches."
				dataPoints={[40, 35, 55, 60, 45, 70, 80, 75, 90, 85, 100, 110]}
			/>
		</div>

		<div class="space-y-6 lg:col-span-4">
			<div class={`${RADIUS.card} ${COLOR.card} border-2 border-zinc-100 p-8 shadow-sm dark:border-zinc-800`}>
				<h3 class="mb-8 text-xs font-black tracking-widest text-zinc-400 uppercase">Operations</h3>
				<div class="space-y-3">
					<a href="/app/facilitator/cohorts" class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all`}>
						<div class="flex items-center gap-3">
							<span class="text-lg">📅</span>
							<span class="text-xs font-black tracking-tight uppercase">Batch Schedule</span>
						</div>
					</a>
					<a href="/app/mentor/broadcast" class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all`}>
						<div class="flex items-center gap-3">
							<span class="text-lg">📣</span>
							<span class="text-xs font-black tracking-tight uppercase">Announce to Groups</span>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>

	<PageSection>
		<div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div class="space-y-2">
				<h2 class="text-3xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white">Live Batches</h2>
				<p class="text-xs font-medium tracking-widest text-zinc-500 uppercase">Real-time cohort monitoring</p>
			</div>
		</div>

		<div class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} shadow-sm`}>
			{#if rows.length > 0}
				<Table {columns} {rows} />
			{:else}
				<div class="p-12 text-center text-zinc-400">
					<p class="text-sm font-medium uppercase tracking-widest">No active batches assigned</p>
				</div>
			{/if}
		</div>
	</PageSection>
</div>
