<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING, RADIUS, ELEVATION, GRADIENT } from '$lib/config/design';
	import { formatCurrency } from '$lib/utils/format';
	import { fade, fly } from 'svelte/transition';

	interface DashboardMentorProps {
		data: any;
	}

	let { data }: DashboardMentorProps = $props();

	const columns = [
		{ key: 'title', label: 'Course' },
		{ key: 'students', label: 'Students' },
		{ key: 'status', label: 'Status' }
	];
	const rows = (data.mentorCourses?.slice(0, 5) ?? []).map((c: any) => ({
		title: c.title,
		students: c.students ?? 0,
		status: c.published ? 'Published' : 'Draft'
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
				<div class="h-2 w-2 animate-pulse rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
				<span class={`${TEXT.small} ${COLOR.textMuted} tracking-[0.25em]`}
					>MENTOR CENTER • ACADEMIC HUB</span
				>
			</div>
			<h1 class="text-4xl md:text-5xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">
				Curriculum <span class="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Management</span>
			</h1>
			<p class={`${TEXT.secondary} max-w-xl font-medium leading-relaxed`}>
				Empower your students, manage course materials, and review performance metrics across all learning tracks.
			</p>
		</div>
	</header>

	<!-- Bento Grid for Mentor Stats -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
		<div class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50`}>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">My Courses</span>
			<p class="mt-4 text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">{data.stats.myCourses || 0}</p>
		</div>
		<div
			class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all border-l-4 border-l-blue-500 shadow-blue-500/5`}
		>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Total Students</span>
			<p class="mt-4 text-5xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
				{data.stats.totalStudents || 0}
			</p>
		</div>
		<div
			class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all border border-transparent hover:border-orange-500/20`}
		>
			<div class="flex items-center gap-2">
				<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Reviews Pending</span>
				{#if data.stats.pendingSubmissions > 0}
					<div class="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
				{/if}
			</div>
			<p class="mt-4 text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
				{data.stats.pendingSubmissions || 0}
			</p>
		</div>
		<div
			class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all`}
		>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Action Subs</span>
			<p class="mt-4 text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
				{data.stats.totalActionSubmissions || 0}
			</p>
		</div>
	</div>

	<!-- Track Breakdown: Visualized as Info Cards -->
	{#if data.stats.trackCounts}
		<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-6 flex items-center gap-5 ${ELEVATION.base} hover:shadow-lg transition-all`}>
				<div class="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl dark:bg-purple-900/10">🎥</div>
				<div>
					<div class="text-xl font-black text-purple-600 dark:text-purple-400 leading-none">{data.stats.trackCounts.creator || 0}</div>
					<div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Creators</div>
				</div>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-6 flex items-center gap-5 ${ELEVATION.base} hover:shadow-lg transition-all`}>
				<div class="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl dark:bg-orange-900/10">🛒</div>
				<div>
					<div class="text-xl font-black text-orange-600 dark:text-orange-400 leading-none">{data.stats.trackCounts.seller || 0}</div>
					<div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Sellers</div>
				</div>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-6 flex items-center gap-5 ${ELEVATION.base} hover:shadow-lg transition-all`}>
				<div class="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl dark:bg-blue-900/10">🔗</div>
				<div>
					<div class="text-xl font-black text-blue-600 dark:text-blue-400 leading-none">{data.stats.trackCounts.affiliate || 0}</div>
					<div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Affiliates</div>
				</div>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-6 flex items-center gap-5 ${ELEVATION.base} hover:shadow-lg transition-all`}>
				<div class="h-12 w-12 rounded-xl bg-zinc-50 flex items-center justify-center text-2xl dark:bg-zinc-800">💡</div>
				<div>
					<div class="text-xl font-black text-zinc-900 dark:text-white leading-none">{data.stats.trackCounts.unassigned || 0}</div>
					<div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Learners</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
		<!-- Teaching Activity Graph -->
		<div class="lg:col-span-8">
			<OverviewGraph
				title="Instructional Activity"
				description="Student engagement and submission volume over 30 days"
				dataPoints={[30, 45, 60, 55, 70, 90, 85, 100, 110, 95, 120, 130]}
			/>
		</div>

		<!-- Action Sidebar: Course Management -->
		<div class="lg:col-span-4 space-y-8">
			<div class={`${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} p-10 ${ELEVATION.card}`}>
				<h3 class="text-xs font-black tracking-widest text-zinc-400 uppercase mb-8">Quick Actions</h3>
				<div class="space-y-4">
					<a href="/app/mentor/courses/new" class="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
						<span class="text-sm font-bold">New Course Track</span>
						<span class="text-blue-500 font-bold">+</span>
					</a>
					<a href="/app/mentor/submissions" class="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
						<span class="text-sm font-bold">Review Pipeline</span>
						<span class="text-zinc-300">→</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	<PageSection>
		<div class="mb-8 flex items-center justify-between">
			<h2 class={`${TEXT.h2} font-black tracking-tight`}>My Published Tracks</h2>
			<a href="/app/mentor/courses">
				<Button variant="ghost" class="text-[10px] font-black tracking-widest uppercase">Manage Curriculum</Button>
			</a>
		</div>
		<div class="overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
			<Table {columns} {rows} />
		</div>
	</PageSection>
</div>
