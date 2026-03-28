<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import RoleSwitcher from '$lib/components/app/RoleSwitcher.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING, RADIUS, ELEVATION, TRANSITION } from '$lib/config/design';
	import { formatCurrency } from '$lib/utils/format';
	import { fly, fade } from 'svelte/transition';

	interface DashboardLearnerProps {
		data: any;
	}

	let { data }: DashboardLearnerProps = $props();

	const courseColumns = [
		{ key: 'title', label: 'Course' },
		{ key: 'progress', label: 'Progress' },
		{ key: 'price', label: 'Price' }
	];
	const courseRows = (data.courses?.slice(0, 5) ?? []).map((c: any) => ({
		title: c.title,
		progress: `${c.progress ?? 0}%`,
		price: formatCurrency(c.price ?? 0)
	}));

	const stats = [
		{ label: 'My Courses', value: data.stats.myCourses || 0, icon: '📚', color: 'blue' },
		{ label: 'Avg Progress', value: `${data.stats.progress || 0}%`, icon: '📈', color: 'indigo' },
		{ label: 'Certificates', value: data.stats.certificates || 0, icon: '🎓', color: 'purple' },
		{ label: 'Payments', value: data.stats.pendingPayments || 0, icon: '💳', color: 'amber' }
	];
</script>

<div class={SPACING.section}>
	<!-- Header Section -->
	<header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6" in:fade={{ duration: 400 }}>
		<div>
			<div class="flex items-center gap-2 mb-2">
				<span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">Student Workspace</span>
				<div class="h-1 w-1 rounded-full bg-gray-300"></div>
				<span class="text-xs font-medium text-gray-400">Last login: Today</span>
			</div>
			<h1 class="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-gray-50">
				Welcome back, <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">{data.user.fullName || data.user.username}</span>!
			</h1>
		</div>
		<div class="flex items-center gap-3">
			<div class="hidden sm:block"><RoleSwitcher /></div>
			<div class="h-10 w-10 rounded-full bg-linear-to-br from-blue-600 to-indigo-700 p-0.5 shadow-lg">
				<div class="h-full w-full rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center font-bold text-blue-600">
					{data.user.username[0].toUpperCase()}
				</div>
			</div>
		</div>
	</header>

	<!-- Bento Grid Stats -->
	<div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-2 gap-4 h-auto lg:h-[400px]">
		<!-- Main Stat: Progress -->
		<div 
			class={`md:col-span-2 lg:col-span-3 row-span-2 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} relative overflow-hidden group p-8 flex flex-col justify-between`}
			in:fly={{ y: 20, duration: 500, delay: 100 }}
		>
			<div class="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
			<div class="relative z-10">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs font-black uppercase tracking-widest text-blue-600">Overall Progress</span>
					<span class="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-lg">📈</span>
				</div>
				<p class="text-6xl font-black text-gray-900 dark:text-gray-50">{data.stats.progress || 0}%</p>
			</div>
			<div class="relative z-10">
				<div class="h-3 w-full bg-gray-100 dark:bg-neutral-800 rounded-full mb-4 overflow-hidden">
					<div class="h-full bg-linear-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000" style="width: {data.stats.progress || 0}%"></div>
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">You've completed <span class="font-bold text-gray-900 dark:text-gray-100">{data.stats.completedLessons || 0}</span> lessons this month. Keep it up!</p>
			</div>
		</div>

		<!-- Secondary Stat: Courses -->
		<div 
			class={`md:col-span-2 lg:col-span-3 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} p-6 flex items-center justify-between group`}
			in:fly={{ y: 20, duration: 500, delay: 200 }}
		>
			<div class="flex flex-col">
				<span class="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Active Courses</span>
				<span class="text-4xl font-black text-gray-900 dark:text-gray-50">{data.stats.myCourses || 0}</span>
			</div>
			<div class="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">📚</div>
		</div>

		<!-- Tertiary Stat: Certificates -->
		<div 
			class={`md:col-span-1 lg:col-span-1.5 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} p-6 flex flex-col justify-between group`}
			in:fly={{ y: 20, duration: 500, delay: 300 }}
		>
			<div class="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-xl mb-4 group-hover:rotate-12 transition-transform">🎓</div>
			<div>
				<span class="text-3xl font-black text-gray-900 dark:text-gray-50">{data.stats.certificates || 0}</span>
				<p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Certificates</p>
			</div>
		</div>

		<!-- Quaternary Stat: Payments -->
		<div 
			class={`md:col-span-1 lg:col-span-1.5 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} p-6 flex flex-col justify-between group`}
			in:fly={{ y: 20, duration: 500, delay: 400 }}
		>
			<div class="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-xl mb-4 group-hover:-rotate-12 transition-transform">💳</div>
			<div>
				<span class="text-3xl font-black text-gray-900 dark:text-gray-50">{data.stats.pendingPayments || 0}</span>
				<p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payments Pending</p>
			</div>
		</div>
	</div>

	<!-- Activity Section -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
		<div class="lg:col-span-2" in:fade={{ duration: 600, delay: 500 }}>
			<div class="mb-6 flex items-center justify-between">
				<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Continue Learning</h2>
				<a href="/app/my-courses" class="text-sm font-bold text-blue-600 hover:text-blue-700">View all curriculum →</a>
			</div>
			
			<div class="space-y-4">
				{#if data.courses && data.courses.length > 0}
					{#each data.courses.slice(0, 3) as course}
						<div class={`${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} p-4 flex items-center gap-4 hover:shadow-md transition-shadow`}>
							<div class="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
								{#if course.thumbnailUrl}
									<img src={course.thumbnailUrl} alt="" class="h-full w-full object-cover" />
								{:else}
									<div class="h-full w-full flex items-center justify-center text-2xl">📚</div>
								{/if}
							</div>
							<div class="flex-1 min-w-0">
								<h3 class="font-bold text-gray-900 dark:text-gray-50 truncate">{course.title}</h3>
								<div class="flex items-center gap-3 mt-1">
									<div class="flex-1 h-1.5 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
										<div class="h-full bg-blue-600 rounded-full" style="width: {course.progress || 0}%"></div>
									</div>
									<span class="text-[10px] font-bold text-gray-400">{course.progress || 0}%</span>
								</div>
							</div>
							<a href={`/app/courses/${course.id}/learn`} class={`px-4 py-2 ${RADIUS.button} bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold hover:scale-105 transition-transform`}>Resume</a>
						</div>
					{/each}
				{:else}
					<div class="py-12 text-center border-2 border-dashed border-gray-200 dark:border-neutral-800 rounded-3xl">
						<p class="text-gray-400">No active courses yet. Start your journey today!</p>
						<a href="/app/courses" class="inline-block mt-4 text-sm font-black text-blue-600">Browse Catalog →</a>
					</div>
				{/if}
			</div>
		</div>

		<div in:fade={{ duration: 600, delay: 600 }}>
			<div class="mb-6">
				<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Activity Goal</h2>
			</div>
			<div class={`${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} p-6 flex flex-col items-center text-center`}>
				<div class="relative h-40 w-40 mb-6">
					<svg class="h-full w-full" viewBox="0 0 36 36">
						<path class="stroke-gray-100 dark:stroke-neutral-800" stroke-width="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
						<path class="stroke-blue-600" stroke-width="3" stroke-dasharray="{data.stats.progress || 0}, 100" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
					</svg>
					<div class="absolute inset-0 flex flex-col items-center justify-center">
						<span class="text-3xl font-black text-gray-900 dark:text-gray-50">{data.stats.progress || 0}%</span>
						<span class="text-[10px] font-bold text-gray-400 uppercase">of target</span>
					</div>
				</div>
				<h3 class="font-bold text-gray-900 dark:text-gray-50 mb-1">Weekly Streak: 🔥 3 Days</h3>
				<p class="text-xs text-gray-500">You're doing better than 85% of students. Don't stop now!</p>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom styles for the Bento Grid */
	.grid-rows-2 {
		grid-template-rows: repeat(2, minmax(0, 1fr));
	}
</style>
