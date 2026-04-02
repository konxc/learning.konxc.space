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
		{
			label: 'Creators',
			count: data.stats.trackCounts?.creator || 0,
			icon: '🎥',
			color: 'text-purple-600',
			bg: 'bg-purple-50 dark:bg-purple-900/10'
		},
		{
			label: 'Sellers',
			count: data.stats.trackCounts?.seller || 0,
			icon: '🛒',
			color: 'text-orange-600',
			bg: 'bg-orange-50 dark:bg-orange-900/10'
		},
		{
			label: 'Affiliates',
			count: data.stats.trackCounts?.affiliate || 0,
			icon: '🔗',
			color: 'text-blue-600',
			bg: 'bg-blue-50 dark:bg-blue-900/10'
		},
		{
			label: 'Learners',
			count: data.stats.trackCounts?.unassigned || 0,
			icon: '💡',
			color: 'text-zinc-600',
			bg: 'bg-zinc-100 dark:bg-zinc-800'
		}
	];
</script>

<div class="animate-in fade-in flex flex-col gap-10 duration-1000 md:gap-14">
	<!-- High-Fidelity Header -->
	<header class="relative overflow-hidden pt-8 pb-4">
		<div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
			<div class="space-y-4">
				<div class="flex items-center gap-3">
					<div
						class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black tracking-widest text-blue-700 uppercase shadow-sm dark:border-blue-900/30 dark:bg-blue-900/20"
					>
						Mentor Academy
					</div>
					<div
						class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
					></div>
					<span class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase"
						>Platform Live</span
					>
				</div>
				<h1
					class="text-5xl leading-none font-black tracking-tighter text-zinc-900 md:text-6xl dark:text-white"
				>
					Curriculum <span
						class="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent"
						>Nexus</span
					>
				</h1>
				<p
					class="max-w-2xl text-sm leading-relaxed font-medium text-zinc-500 md:text-base dark:text-zinc-400"
				>
					Engineering exponential growth for the next generation of digital builder. Monitor,
					mentor, and scale your instructional impact.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<a href="/app/mentor/courses/new">
					<Button
						variant="primary"
						class="h-12 px-8 font-black tracking-widest uppercase shadow-xl shadow-blue-500/10 transition-transform hover:scale-105 active:scale-95"
					>
						Draft New Track
					</Button>
				</a>
			</div>
		</div>
	</header>

	<!-- Principal Metrics Bento -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<div
			class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-1`}
		>
			<div class="space-y-1">
				<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase"
					>Instructional Quality</span
				>
				<p class="text-5xl leading-tight font-black tracking-tighter text-zinc-900 dark:text-white">
					{data.stats.approvalRate || 0}%
				</p>
				<p class="text-[10px] font-bold text-emerald-500 uppercase">Approval Rate</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-10 transition-opacity group-hover:opacity-20"
			>
				🎯
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${TRANSITION.all} border-l-4 border-l-blue-600 hover:-translate-y-1`}
		>
			<div class="space-y-1">
				<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase"
					>Active Learners</span
				>
				<p
					class="text-5xl leading-tight font-black tracking-tighter text-blue-600 dark:text-blue-400"
				>
					{data.stats.totalStudents || 0}
				</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-10 transition-opacity group-hover:opacity-20"
			>
				⚡
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} border-2 border-dashed border-zinc-200 dark:border-zinc-800 ${TRANSITION.all} bg-zinc-50/30 hover:border-zinc-300 dark:bg-zinc-950/30 dark:hover:border-zinc-700`}
		>
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase"
						>Review Requests</span
					>
					{#if data.stats.pendingSubmissions > 0}
						<div class="h-2 w-2 animate-ping rounded-full bg-red-500"></div>
					{/if}
				</div>
				<p class="text-5xl leading-tight font-black tracking-tighter text-zinc-900 dark:text-white">
					{data.stats.pendingSubmissions || 0}
				</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-10 transition-opacity group-hover:opacity-20"
			>
				📪
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} border border-blue-100 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-900/10 ${TRANSITION.all} hover:bg-blue-50/50 dark:hover:bg-blue-900/20`}
		>
			<div class="space-y-1">
				<span
					class="text-[10px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400"
					>Performance Avg</span
				>
				<p class="text-5xl leading-tight font-black tracking-tighter text-zinc-900 dark:text-white">
					{data.stats.avgScore || 0}
				</p>
				<p class="text-[10px] font-bold text-blue-500 uppercase">Avg Student Score</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-10 transition-opacity group-hover:opacity-20"
			>
				📈
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} border-2 border-indigo-100 bg-indigo-50/20 dark:border-indigo-900/30 dark:bg-indigo-900/10 ${TRANSITION.all} hover:bg-indigo-50/40`}
		>
			<div class="space-y-1">
				<span
					class="text-[10px] leading-tight font-black tracking-widest text-indigo-600 uppercase dark:text-indigo-400"
					>Mid-Term Review</span
				>
				<p class="text-5xl leading-tight font-black tracking-tighter text-zinc-900 dark:text-white">
					{data.stats.midTermReviews || 0}
				</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-10 transition-opacity group-hover:opacity-20"
			>
				⚖️
			</div>
		</div>
	</div>

	<!-- Professional Ecosystem Mosaic -->
	<div class="grid grid-cols-2 gap-4 px-1 md:grid-cols-4">
		{#each trackStats as track}
			<div
				class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} flex items-center gap-4 p-5 ${ELEVATION.base} cursor-default transition-all hover:shadow-md active:scale-95`}
			>
				<div
					class={`h-10 w-10 shrink-0 ${RADIUS.button} ${track.bg} flex items-center justify-center text-xl`}
				>
					{track.icon}
				</div>
				<div class="min-w-0">
					<div class={`text-lg font-black ${track.color} truncate leading-none`}>{track.count}</div>
					<div
						class="mt-0.5 truncate text-[9px] font-black tracking-widest text-zinc-400 uppercase"
					>
						{track.label}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Primary Insight Grid -->
	<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
		<div class="lg:col-span-8">
			<OverviewGraph
				title="Learning Velocity"
				description="Submission volume and engagement spikes across your curriculum."
				dataPoints={data.activityGraph ?? []}
			/>
		</div>

		<div class="space-y-6 lg:col-span-4">
			<!-- Quick Pipeline Actions -->
			<div
				class={`${RADIUS.card} ${COLOR.card} border-2 border-zinc-100 p-8 shadow-sm dark:border-zinc-800`}
			>
				<h3 class="mb-8 text-xs font-black tracking-widest text-zinc-400 uppercase">
					Management Center
				</h3>
				<div class="space-y-3">
					<a
						href="/app/mentor/submissions"
						class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800`}
					>
						<div class="flex items-center gap-3">
							<span class="text-lg">📋</span>
							<span class="text-xs font-black tracking-tight uppercase">Grade Submission</span>
						</div>
						{#if data.stats.pendingSubmissions > 0}
							<div class="rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black text-white">
								{data.stats.pendingSubmissions}
							</div>
						{/if}
					</a>

					<a
						href="/app/mentor/materials"
						class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
					>
						<div class="flex items-center gap-3">
							<span class="text-lg">📁</span>
							<span class="text-xs font-black tracking-tight uppercase">Material Depot</span>
						</div>
					</a>

					<a
						href="/app/mentor/students?filter=midterm"
						class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
					>
						<div class="flex items-center gap-3">
							<span class="text-lg">⚖️</span>
							<span class="text-xs font-black tracking-tight uppercase">Mid-Term Review</span>
						</div>
						{#if data.stats.midTermReviews > 0}
							<div class="rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-black text-white">
								{data.stats.midTermReviews}
							</div>
						{/if}
					</a>

					<a
						href="/app/mentor/broadcast"
						class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
					>
						<div class="flex items-center gap-3">
							<span class="text-lg">📣</span>
							<span class="text-xs font-black tracking-tight uppercase">Broadcaster</span>
						</div>
					</a>
				</div>
			</div>

			<!-- Mentor Tip / Motivation -->
			<div
				class={`${RADIUS.card} relative overflow-hidden bg-zinc-950 p-8 text-white dark:bg-zinc-800`}
			>
				<div class="relative z-10 space-y-2">
					<h4 class="text-xs leading-none font-black tracking-widest text-blue-400 uppercase">
						Mentor Tip
					</h4>
					<p class="text-xs leading-relaxed font-medium opacity-80">
						Quality feedback is the fuel of learning. Take 15 minutes today to leave detailed
						comments on pending submissions.
					</p>
				</div>
				<div class="absolute -right-4 -bottom-4 rotate-12 text-4xl opacity-20">💡</div>
			</div>
		</div>
	</div>

	<!-- Portfolio Table Section -->
	<PageSection>
		<div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div class="space-y-2">
				<h2 class="text-3xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white">
					Active Curriculum
				</h2>
				<p class="text-xs font-medium tracking-widest text-zinc-500 uppercase">
					Master tracks and sub-modules
				</p>
			</div>
			<a href="/app/mentor/courses">
				<Button
					variant="ghost"
					class="rounded-full border border-zinc-200 px-6 py-2.5 text-[10px] font-black tracking-widest uppercase dark:border-zinc-800"
					>Explore All Library</Button
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
					href="/app/mentor/courses"
					class="text-[10px] font-black tracking-widest text-blue-600 uppercase hover:underline"
					>Show all curriculum tracks</a
				>
			</div>
		</div>
	</PageSection>
</div>
