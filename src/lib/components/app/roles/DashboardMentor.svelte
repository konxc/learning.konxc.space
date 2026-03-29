<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING, RADIUS, ELEVATION, GRADIENT, TRANSITION } from '$lib/config/design';
	import { formatCurrency } from '$lib/utils/format';
	import { fade, fly } from 'svelte/transition';

	interface DashboardMentorProps {
		data: any;
	}

	let { data }: DashboardMentorProps = $props();

	const columns = [
		{ key: 'title', label: 'Course Track' },
		{ key: 'students', label: 'Learners' },
		{ key: 'status', label: 'Status' }
	];
	const rows = (data.mentorCourses?.slice(0, 5) ?? []).map((c: any) => ({
		title: c.title,
		students: c.students ?? 0,
		status: c.published ? 'Live' : 'Drafting'
	}));

	const trackStats = [
		{ label: 'Creators', count: data.stats.trackCounts?.creator || 0, icon: '🎥', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
		{ label: 'Sellers', count: data.stats.trackCounts?.seller || 0, icon: '🛒', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10' },
		{ label: 'Affiliates', count: data.stats.trackCounts?.affiliate || 0, icon: '🔗', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
		{ label: 'Learners', count: data.stats.trackCounts?.unassigned || 0, icon: '💡', color: 'text-zinc-600', bg: 'bg-zinc-100 dark:bg-zinc-800' }
	];
</script>

<div class="flex flex-col gap-10 md:gap-14 animate-in fade-in duration-1000">
	<!-- High-Fidelity Header -->
	<header class="relative overflow-hidden pt-8 pb-4">
		<div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
			<div class="space-y-4">
				<div class="flex items-center gap-3">
					<div class="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 text-[10px] font-black tracking-widest uppercase shadow-sm">
						Mentor Academy
					</div>
					<div class="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
					<span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Platform Live</span>
				</div>
				<h1 class="text-5xl md:text-6xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">
					Curriculum <span class="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Nexus</span>
				</h1>
				<p class="text-sm md:text-base font-medium text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
					Engineering exponential growth for the next generation of digital builder. 
					Monitor, mentor, and scale your instructional impact.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<a href="/app/mentor/courses/new">
					<Button variant="primary" class="h-12 px-8 font-black tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/10">
						Draft New Track
					</Button>
				</a>
			</div>
		</div>
	</header>

	<!-- Principal Metrics Bento -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-1`}>
			<div class="space-y-1">
				<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Deployed Courses</span>
				<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight">
					{data.stats.myCourses || 0}
				</p>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">📚</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-1 border-l-4 border-l-blue-600`}>
			<div class="space-y-1">
				<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Active Learners</span>
				<p class="text-5xl font-black tracking-tighter text-blue-600 dark:text-blue-400 leading-tight">
					{data.stats.totalStudents || 0}
				</p>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">⚡</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} border-2 border-dashed border-zinc-200 dark:border-zinc-800 ${TRANSITION.all} hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/30 dark:bg-zinc-950/30`}>
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Review Requests</span>
					{#if data.stats.pendingSubmissions > 0}
						<div class="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
					{/if}
				</div>
				<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight">
					{data.stats.pendingSubmissions || 0}
				</p>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">📪</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 ${TRANSITION.all} hover:bg-blue-50/50 dark:hover:bg-blue-900/20`}>
			<div class="space-y-1">
				<span class="text-[10px] font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">Impact Subs</span>
				<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight">
					{data.stats.totalActionSubmissions || 0}
				</p>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">📈</div>
		</div>
	</div>

	<!-- Professional Ecosystem Mosaic -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-1">
		{#each trackStats as track}
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5 flex items-center gap-4 ${ELEVATION.base} hover:shadow-md transition-all active:scale-95 cursor-default`}>
				<div class={`h-10 w-10 shrink-0 ${RADIUS.button} ${track.bg} flex items-center justify-center text-xl`}>
					{track.icon}
				</div>
				<div class="min-w-0">
					<div class={`text-lg font-black ${track.color} leading-none truncate`}>{track.count}</div>
					<div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5 truncate">{track.label}</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Primary Insight Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
		<div class="lg:col-span-8">
			<OverviewGraph
				title="Learning Velocity"
				description="Submission volume and engagement spikes across your curriculum."
				dataPoints={[30, 45, 60, 55, 70, 90, 85, 100, 110, 95, 120, 130]}
			/>
		</div>

		<div class="lg:col-span-4 space-y-6">
			<!-- Quick Pipeline Actions -->
			<div class={`${RADIUS.card} ${COLOR.card} border-2 border-zinc-100 dark:border-zinc-800 p-8 shadow-sm`}>
				<h3 class="text-xs font-black tracking-widest text-zinc-400 uppercase mb-8">Management Center</h3>
				<div class="space-y-3">
					<a href="/app/mentor/submissions" class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700`}>
						<div class="flex items-center gap-3">
							<span class="text-lg">📋</span>
							<span class="text-xs font-black uppercase tracking-tight">Grade Submission</span>
						</div>
						{#if data.stats.pendingSubmissions > 0}
							<div class="px-2 py-0.5 rounded-full bg-red-600 text-[9px] font-black text-white">{data.stats.pendingSubmissions}</div>
						{/if}
					</a>

					<a href="/app/mentor/materials" class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800`}>
						<div class="flex items-center gap-3">
							<span class="text-lg">📁</span>
							<span class="text-xs font-black uppercase tracking-tight">Material Depot</span>
						</div>
					</a>

					<a href="/app/mentor/broadcast" class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800`}>
						<div class="flex items-center gap-3">
							<span class="text-lg">📣</span>
							<span class="text-xs font-black uppercase tracking-tight">Broadcaster</span>
						</div>
					</a>
				</div>
			</div>

			<!-- Mentor Tip / Motivation -->
			<div class={`${RADIUS.card} bg-zinc-950 dark:bg-zinc-800 p-8 text-white relative overflow-hidden`}>
				<div class="relative z-10 space-y-2">
					<h4 class="text-xs font-black text-blue-400 uppercase tracking-widest leading-none">Mentor Tip</h4>
					<p class="text-xs font-medium leading-relaxed opacity-80">
						Quality feedback is the fuel of learning. Take 15 minutes today to leave detailed comments on pending submissions.
					</p>
				</div>
				<div class="absolute -right-4 -bottom-4 text-4xl opacity-20 rotate-12">💡</div>
			</div>
		</div>
	</div>

	<!-- Portfolio Table Section -->
	<PageSection>
		<div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
			<div class="space-y-2">
				<h2 class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">Active Curriculum</h2>
				<p class="text-xs font-medium text-zinc-500 uppercase tracking-widest">Master tracks and sub-modules</p>
			</div>
			<a href="/app/mentor/courses">
				<Button variant="ghost" class="text-[10px] font-black tracking-widest uppercase border border-zinc-200 dark:border-zinc-800 px-6 py-2.5 rounded-full">Explore All Library</Button>
			</a>
		</div>

		<div class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300 shadow-sm`}>
			<Table {columns} {rows} />
			<div class="px-8 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
				<a href="/app/mentor/courses" class="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Show all curriculum tracks</a>
			</div>
		</div>
	</PageSection>
</div>
