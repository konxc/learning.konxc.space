<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import RoleSwitcher from '$lib/components/app/RoleSwitcher.svelte';
	import { COLOR, TEXT, SPACING, RADIUS, ELEVATION, TRANSITION, GRADIENT } from '$lib/config/design';
	import { formatCurrency } from '$lib/utils/format';
	import { fly, fade } from 'svelte/transition';

	interface DashboardLearnerProps {
		data: any;
	}

	let { data }: DashboardLearnerProps = $props();

	const stats = [
		{ label: 'My Courses', value: data.stats.myCourses || 0, icon: '📚', color: 'blue' },
		{ label: 'Avg Progress', value: `${data.stats.progress || 0}%`, icon: '📈', color: 'indigo' },
		{ label: 'Certificates', value: data.stats.certificates || 0, icon: '🎓', color: 'purple' },
		{ label: 'Payments', value: data.stats.pendingPayments || 0, icon: '💳', color: 'amber' }
	];
</script>

<div class={SPACING.relaxed}>
	<!-- Premium Header: Sophisticated High-Density Layout -->
	<header class="flex flex-col md:flex-row md:items-end justify-between items-start gap-8" in:fade={{ duration: 800 }}>
		<div class="space-y-3">
			<div class="flex items-center gap-2">
				<div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
				<span class={`${TEXT.small} ${COLOR.textMuted} tracking-[0.2em]`}>LEARNER DASHBOARD • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
			</div>
			<h1 class={`${TEXT.h1} leading-tight`}>
				Ready to excel, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 font-black">{data.user.fullName || data.user.username}?</span>
			</h1>
			<p class={`${TEXT.secondary} max-w-xl`}>
				Track your professional growth, manage certifications, and continue your specialized learning tracks in one unified space.
			</p>
		</div>
		
		<div class="flex items-center gap-4 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
			<RoleSwitcher />
			<div class="h-10 w-10 rounded-xl overflow-hidden shadow-2xl ring-2 ring-white dark:ring-zinc-800">
				<div class={`${GRADIENT.primary} h-full w-full flex items-center justify-center font-black text-white text-sm`}>
					{data.user.username[0].toUpperCase()}
				</div>
			</div>
		</div>
	</header>

	<!-- Bento Grid 2.0: Higher Variety & Immersive Visuals -->
	<div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 auto-rows-[180px]">
		
		<!-- Hero Card: Progress Visualization -->
		<div 
			class={`lg:col-span-8 md:col-span-4 row-span-2 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} shadow-2xl relative overflow-hidden group p-10 flex flex-col justify-between transition-all duration-700 hover:-translate-y-1 hover:shadow-blue-500/10`}
			in:fly={{ y: 40, duration: 800, delay: 100 }}
		>
			<div class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px] group-hover:bg-blue-500/10 transition-all duration-1000"></div>
			<div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-[80px]"></div>
			
			<div class="relative z-10 flex justify-between items-start">
				<div class="space-y-1">
					<h3 class={`${TEXT.h3} font-black text-zinc-900 dark:text-white uppercase tracking-tighter`}>Overall Mastery</h3>
					<div class="flex items-center gap-2">
			<span class="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white">{data.stats.progress || 0}<span class="text-4xl text-blue-500">%</span></span>
						<div class="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase">Excellent</div>
					</div>
				</div>
				<div class="h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center text-2xl shadow-inner">⚡</div>
			</div>

			<div class="relative z-10 space-y-4">
				<div class="flex justify-between items-end mb-1">
					<span class={`${TEXT.small} ${COLOR.textMuted}`}>Curriculum Completion</span>
					<span class="text-sm font-black text-zinc-900 dark:text-white">{data.stats.completedLessons || 0} / {data.totalLessons || 100} Lessons</span>
				</div>
				<div class="h-4 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden p-1 shadow-inner ring-1 ring-zinc-200/50 dark:ring-zinc-700/50">
					<div class="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full transition-all duration-[2000ms] cubic-bezier(0.34, 1.56, 0.64, 1)" style="width: {data.stats.progress || 0}%"></div>
				</div>
				<div class="flex gap-4 items-center">
					<div class="flex -space-x-2">
						{#each Array(3) as _}
							<div class="h-6 w-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 overflow-hidden">
								<img src={`https://i.pravatar.cc/100?u=${Math.random()}`} alt="" />
							</div>
						{/each}
					</div>
					<p class={`${TEXT.muted} !text-[10px]`}>Join <span class="text-zinc-900 dark:text-white font-bold">1.2k alumni</span> who finished this path.</p>
				</div>
			</div>
		</div>

		<!-- Square Card: Active Courses -->
		<div 
			class={`lg:col-span-4 md:col-span-2 row-span-1 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} p-8 flex flex-col justify-between group cursor-pointer hover:border-blue-500/50 transition-all duration-500 shadow-xl`}
			in:fly={{ y: 40, duration: 800, delay: 200 }}
		>
			<div class="flex justify-between items-center">
				<div class="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📚</div>
				<svg class="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
			</div>
			<div>
				<p class="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none mb-1">{data.stats.myCourses || 0}</p>
				<span class={`${TEXT.small} ${COLOR.textMuted}`}>Courses in focus</span>
			</div>
		</div>

		<!-- Vertical Accent: Certificates -->
		<div 
			class={`lg:col-span-2 md:col-span-2 row-span-2 ${RADIUS.card} ${GRADIENT.primary} p-8 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden group`}
			in:fly={{ y: 40, duration: 800, delay: 300 }}
		>
			<div class="absolute -bottom-10 -right-10 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
			<div class="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl mb-4">🎓</div>
			<div>
				<p class="text-6xl font-black tracking-tighter leading-none mb-2">{data.stats.certificates || 0}</p>
				<p class="text-[10px] font-black uppercase tracking-widest text-white/70">Verified Credentials</p>
			</div>
			<button class="mt-6 w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-blue-700 transition-all">View Wallet</button>
		</div>

		<!-- Horizontal Long: Activity Summary / Mini Graph -->
		<div 
			class={`lg:col-span-2 md:col-span-2 row-span-1 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} p-6 flex flex-col justify-between shadow-xl`}
			in:fly={{ y: 40, duration: 800, delay: 400 }}
		>
			<div class="flex items-center gap-3">
				<div class="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-lg">💳</div>
				<span class={`${TEXT.small} font-bold text-zinc-400`}>PENDING</span>
			</div>
			<p class="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{data.stats.pendingPayments || 0}</p>
		</div>
	</div>

	<!-- Continuous Journey Section -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-16 items-start">
		<div class="lg:col-span-7 space-y-8" in:fade={{ duration: 1000, delay: 500 }}>
			<div class="flex items-center justify-between">
				<h2 class={`${TEXT.h2} font-black tracking-tight`}>Continue Journey</h2>
				<a href="/app/my-courses" class="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">Curriculum Library →</a>
			</div>
			
			<div class="grid gap-4">
				{#if data.courses && data.courses.length > 0}
					{#each data.courses.slice(0, 3) as course}
						<div class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} p-6 flex items-center gap-6 hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 group shadow-lg`}>
							<div class="h-20 w-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform">
								{#if course.thumbnailUrl}
									<img src={course.thumbnailUrl} alt="" class="h-full w-full object-cover" />
								{:else}
									<div class="h-full w-full flex items-center justify-center text-3xl">📘</div>
								{/if}
							</div>
							<div class="flex-1 min-w-0 space-y-2">
								<div class="flex items-center gap-2">
									<span class="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500">Module 0{Math.floor(Math.random() * 5)+1}</span>
									<div class="h-1 w-1 rounded-full bg-zinc-300"></div>
									<span class="text-[10px] font-bold text-blue-600">{course.progress || 0}% Done</span>
								</div>
								<h3 class="text-lg font-bold text-zinc-900 dark:text-white truncate tracking-tight">{course.title}</h3>
								<div class="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
									<div class="h-full bg-blue-600 rounded-full" style="width: {course.progress || 0}%"></div>
								</div>
							</div>
							<a 
								href={`/app/courses/${course.id}/learn`} 
								class={`h-11 w-11 flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 transition-all hover:scale-110 active:scale-95 shadow-lg`}
							>
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg>
							</a>
						</div>
					{/each}
				{:else}
					<div class="py-20 text-center bg-zinc-50/50 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem]">
						<div class="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🧭</div>
						<h3 class="font-bold text-zinc-900 dark:text-white">Begin your mastery</h3>
						<p class={`${TEXT.muted} mt-1`}>No active courses. Explore our curated high-performance catalog.</p>
						<a href="/app/courses" class="inline-block mt-6 px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all">Explore Catalog</a>
					</div>
				{/if}
			</div>
		</div>

		<div class="lg:col-span-5 space-y-8" in:fade={{ duration: 1000, delay: 700 }}>
			<div class="flex items-center justify-between">
				<h2 class={`${TEXT.h2} font-black tracking-tight`}>Consistency</h2>
			</div>
			<div class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} p-10 flex flex-col items-center text-center relative overflow-hidden shadow-2xl`}>
				<div class="absolute top-0 right-0 p-4">
					<div class="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">Ongoing Streak</div>
				</div>
				
				<div class="relative h-48 w-48 mb-8 scale-110">
					<svg class="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
						<circle class="stroke-zinc-100 dark:stroke-zinc-800" stroke-width="2.5" fill="none" cx="18" cy="18" r="16" />
						<circle 
							class="stroke-blue-600 transition-all duration-1000" 
							stroke-width="2.5" 
							stroke-dasharray="{(data.stats.progress || 0)}, 100" 
							stroke-linecap="round" 
							fill="none" 
							cx="18" 
							cy="18" 
							r="16" 
						/>
					</svg>
					<div class="absolute inset-0 flex flex-col items-center justify-center">
						<span class="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Weekly</span>
						<span class="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">{data.stats.progress || 0}%</span>
						<span class="text-[10px] font-bold text-emerald-500 uppercase mt-1">↑ 12% Growth</span>
					</div>
				</div>

				<div class="space-y-4 w-full">
					<div class="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
						<div class="flex items-center justify-between mb-2">
							<span class="text-[10px] font-black uppercase text-zinc-400">Current Streak</span>
							<span class="text-xl font-black text-zinc-900 dark:text-white">🔥 3 Days</span>
						</div>
						<div class="flex justify-between gap-1">
							{#each ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as day, i}
								<div class={`h-8 flex-1 flex items-center justify-center rounded-lg text-[10px] font-bold ${i < 3 ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}`}>
									{day}
								</div>
							{/each}
						</div>
					</div>
					<p class="text-[11px] text-zinc-500 font-medium">You're outperforming <span class="text-zinc-900 dark:text-white font-black">92%</span> of active learners in your organization.</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Animation enhancement */
	.cubic-bezier {
		transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	
	:global(.role-switcher) {
		background-color: transparent !important;
		border: none !important;
		box-shadow: none !important;
	}
</style>
