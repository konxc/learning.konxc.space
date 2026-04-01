<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import {
		COLOR,
		TEXT,
		SPACING,
		RADIUS,
		ELEVATION,
		TRANSITION,
		GRADIENT
	} from '$lib/config/design';
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

<div class="flex flex-col gap-12 lg:gap-14">
	<!-- Unified Header Strategy -->
	<header
		class="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end"
		in:fade={{ duration: 800 }}
	>
		<div class="space-y-4">
			<div class="flex items-center gap-2.5">
				<div
					class="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
				></div>
				<span class={`${TEXT.small} ${COLOR.textMuted} tracking-[0.25em]`}
					>LEARNER DASHBOARD • {new Date().toLocaleDateString('en-US', {
						month: 'long',
						year: 'numeric'
					})}</span
				>
			</div>
			<h1
				class={`${TEXT.h1} leading-tight text-zinc-900 md:text-5xl dark:text-white pl-1`}
			>
				Ready to excel, <span
					class="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent"
					>{data.user.fullName || data.user.username}?</span
				>
			</h1>
			<p class={`${TEXT.secondary} max-w-2xl leading-relaxed font-medium`}>
				Track your professional growth, manage certifications, and continue your specialized
				learning tracks in one unified space.
			</p>
		</div>
	</header>

	<!-- Proportional Bento Grid (Grid 2.1 with Independent Heights) -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-12">
		<!-- Hero Progress Card (The Anchor) -->
		<div
			class={`md:col-span-4 lg:col-span-8 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} group relative flex flex-col justify-between overflow-hidden p-8 lg:p-10 ${ELEVATION.card} ${ELEVATION.cardHover} transition-all duration-700 hover:-translate-y-1`}
			in:fly={{ y: 40, duration: 800, delay: 100 }}
		>
			<div
				class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-500/5 blur-[80px] transition-all duration-1000 group-hover:bg-blue-500/10"
			></div>

			<div class="relative z-10 mb-8 flex items-start justify-between">
				<div class="space-y-4">
					<h3 class="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase">
						Overall Mastery
					</h3>
					<div class="flex items-end gap-3 leading-none">
						<span
							class="text-7xl font-black tracking-tighter text-zinc-900 md:text-8xl dark:text-white"
							>{data.stats.progress || 0}<span class="text-3xl text-blue-500">%</span></span
						>
						<div
							class="mb-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black tracking-widest text-emerald-600 uppercase"
						>
							Excel
						</div>
					</div>
				</div>
				<div
					class="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200/50 bg-white text-3xl shadow-xl dark:border-zinc-700/50 dark:bg-zinc-800/50"
				>
					⚡
				</div>
			</div>

			<div class="relative z-10 mt-10 space-y-6">
				<div class="flex items-end justify-between">
					<span class="text-xs font-black tracking-widest text-zinc-400 uppercase"
						>Curriculum Completion</span
					>
					<span class="text-sm font-black text-zinc-900 dark:text-white"
						>{data.stats.completedLessons || 0} / {data.stats.totalLessons || 0} Lessons</span
					>
				</div>
				<div
					class="h-6 w-full overflow-hidden rounded-full bg-zinc-100/50 p-1.5 shadow-inner ring-1 ring-zinc-200/50 dark:bg-zinc-800/50 dark:ring-zinc-700/50"
				>
					<div
						class="h-full rounded-full bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(37,99,235,0.4)] transition-all duration-2000 ease-out"
						style="width: {data.stats.progress || 0}%"
					></div>
				</div>
				<div class="flex items-center gap-5 pt-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600"
					>
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							><path
								d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 110-8 4 4 0 010 8zm8-7a4 4 0 010 8m-2 5a4 4 0 014 4v2"
							/></svg
						>
					</div>
					<p class="text-xs font-bold text-zinc-400">
						Collaborate with <span class="text-zinc-900 dark:text-white">peers</span> enrolled in this
						track.
					</p>
				</div>
			</div>
		</div>

		<!-- Vertical Actions Column (Split) -->
		<div class="lg:col-span-4 lg:row-span-2 flex flex-col gap-8">
			<!-- Top: Verified Wallet -->
			<div
				class={`flex-1 ${RADIUS.card} ${GRADIENT.primary} group relative flex flex-col justify-center items-center overflow-hidden p-8 text-center text-white lg:p-10 ${ELEVATION.card} transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30`}
				in:fly={{ y: 40, duration: 800, delay: 300 }}
			>
				<div
					class="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-white/10 blur-3xl transition-transform duration-1000 group-hover:scale-150"
				></div>
				<div
					class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/20 text-3xl shadow-xl backdrop-blur-md"
				>
					🎓
				</div>
				<div class="relative z-10 w-full">
					<p class="mb-2 text-7xl leading-none font-black tracking-tighter lg:text-8xl">
						{data.stats.certificates || 0}
					</p>
					<p class="mb-8 text-[10px] font-black tracking-[0.25em] text-white/60 uppercase">
						Verified Credentials
					</p>
					<button
						class="w-full rounded-2xl border border-white/30 bg-white/10 py-5 text-[10px] font-black tracking-widest uppercase backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white hover:text-blue-700 active:scale-95"
						>View Wallet</button
					>
				</div>
			</div>

			<!-- Bottom: Daily Mission (New Engagement Feature) -->
			<div
				class={`flex-1 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} group relative flex flex-col justify-center gap-8 overflow-hidden p-8 ${ELEVATION.card} ${ELEVATION.cardHover} transition-all duration-500 hover:-translate-y-1`}
				in:fly={{ y: 40, duration: 800, delay: 450 }}
			>
				<div class="flex items-start justify-between relative z-10">
					<div class="space-y-4">
						<h3 class="text-xs font-black tracking-[0.2em] text-blue-600 uppercase">
							Daily Mission
						</h3>
						<p class="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
							{data.stats.dailyRemaining === 0 ? 'Goal Achieved!' : 'Level Up Today'}
						</p>
					</div>
					<div class="h-12 w-12 flex items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-50 text-2xl shadow-sm dark:bg-orange-900/10">
						{data.stats.dailyRemaining === 0 ? '🏆' : '🔥'}
					</div>
				</div>

				<div class="mt-4 space-y-5 relative z-10">
					<div class="flex items-center justify-between text-[11px] font-black tracking-widest text-zinc-400 uppercase">
						<span>Progress Today</span>
						<span class="text-zinc-900 dark:text-white">{data.stats.dailyProgress || 0}%</span>
					</div>
					<div class="h-2 w-full bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800 shadow-inner">
						<div 
							class="h-full bg-linear-to-r from-orange-400 via-orange-500 to-amber-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all duration-1000" 
							style="width: {data.stats.dailyProgress || 0}%"
						></div>
					</div>
					<p class="text-[11px] font-medium text-zinc-500 leading-relaxed">
						{#if data.stats.dailyRemaining > 0}
							Complete <span class="text-zinc-900 dark:text-white font-black">{data.stats.dailyRemaining} more lesson{data.stats.dailyRemaining > 1 ? 's' : ''}</span> to hit your daily expert goal.
						{:else}
							Well done! You have reached your learning goal for today. <span class="text-blue-600 font-black">Keep going?</span>
						{/if}
					</p>
				</div>
			</div>
		</div>

		<!-- Mini Stack of Cards (Grouped in 4 cols) -->
		<div class="grid grid-cols-1 gap-8 md:col-span-4 md:grid-cols-2 lg:col-span-8">
			<!-- Square Card: Active Training -->
			<div
				class={` ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} group flex cursor-pointer flex-col justify-between p-8 ${ELEVATION.card} ${ELEVATION.cardHover} transition-all hover:-translate-y-1`}
				in:fly={{ y: 40, duration: 800, delay: 200 }}
			>
				<div class="mb-6 flex items-center justify-between">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl shadow-sm dark:bg-blue-900/20"
					>
						📚
					</div>
					<div
						class="rounded-full bg-zinc-50 p-2 transition-transform group-hover:translate-x-1 dark:bg-zinc-800"
					>
						<svg
							class="h-5 w-5 text-zinc-300"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg
						>
					</div>
				</div>
				<div>
					<p
						class="mb-2 text-5xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white"
					>
						{data.stats.myCourses || 0}
					</p>
					<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase"
						>Courses in focus</span
					>
				</div>
			</div>

			<!-- Mini Card: Pending Actions -->
			<div
				class={`${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} flex flex-col justify-between p-8 ${ELEVATION.card} ${ELEVATION.cardHover} transition-all hover:-translate-y-1`}
				in:fly={{ y: 40, duration: 800, delay: 400 }}
			>
				<div class="mb-6 flex items-center gap-4">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl shadow-sm dark:bg-amber-900/20"
					>
						💳
					</div>
					<span class="text-[10px] font-black tracking-[0.2em] text-amber-600 uppercase"
						>PAYMENTS</span
					>
				</div>
				<div>
					<p
						class="mb-2 text-5xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white"
					>
						{data.stats.pendingPayments || 0}
					</p>
					<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase"
						>Active Invoice</span
					>
				</div>
			</div>
		</div>
	</div>

	<!-- Bottom Sections: Harmonized Grid -->
	<div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
		<!-- Journey Feed (Wider Column) -->
		<div class="space-y-8 lg:col-span-7" in:fade={{ duration: 1000, delay: 500 }}>
			<div
				class="flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800"
			>
				<h2 class={`${TEXT.h2} font-black tracking-tight`}>Journey Resume</h2>
				<a
					href="/app/learning/courses"
					class="flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-600 uppercase transition-all hover:gap-3 hover:text-blue-700"
					>Curriculum Library <span>→</span></a
				>
			</div>

			<div class="grid gap-5">
				{#if data.courses && data.courses.length > 0}
					{#each data.courses.slice(0, 3) as course}
						<div
							class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} group flex cursor-pointer items-center gap-6 p-6 ${ELEVATION.base} ${ELEVATION.cardHover} transition-all duration-500 hover:-translate-y-1 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30`}
						>
							<!-- Thumbnail -->
							<div
								class="h-20 w-20 shrink-0 overflow-hidden rounded-[1.25rem] bg-zinc-100 shadow-lg transition-transform group-hover:scale-105 group-hover:rotate-1 dark:bg-zinc-800"
							>
								{#if course.thumbnailUrl}
									<img src={course.thumbnailUrl} alt="" class="h-full w-full object-cover" />
								{:else}
									<div class="flex h-full w-full items-center justify-center text-4xl">📘</div>
								{/if}
							</div>

							<!-- Main content -->
							<div class="flex min-w-0 flex-1 flex-col gap-2.5">
								<div class="flex items-center gap-2">
									<span
										class="rounded-md bg-zinc-100 px-2 py-0.5 text-[9px] font-black tracking-widest text-zinc-500 uppercase dark:bg-zinc-800"
										>MOD {String(course.currentUnit || 1).padStart(2, '0')}</span
									>
									<span class="text-[10px] font-black tracking-widest text-blue-600 uppercase"
										>{course.progress || 0}%</span
									>
								</div>
								<h3 class="truncate text-base font-bold tracking-tight text-zinc-900 dark:text-white">
									{course.title}
								</h3>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
									<div
										class="h-full rounded-full bg-blue-600 transition-all duration-1000"
										style="width: {course.progress || 0}%"
									></div>
								</div>
							</div>

							<!-- Play button -->
							<a
								href={`/app/explore/${course.id}/learn`}
								class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl transition-all hover:scale-110 hover:bg-blue-600 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
								aria-label="Continue learning"
							>
								<svg
									class="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"><path d="M5 3l14 9-14 9V3z" fill="currentColor" /></svg
								>
							</a>
						</div>
					{/each}
				{:else}
					<div
						class="rounded-[3rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-24 text-center dark:border-zinc-800 dark:bg-zinc-900/30"
					>
						<div
							class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-4xl dark:bg-zinc-800"
						>
							🧭
						</div>
						<h3 class="text-xl font-black text-zinc-900 dark:text-white">New Horizon Awaits</h3>
						<p class="mt-2 text-xs font-medium text-zinc-400">
							Zero active curriculum. Start your expert journey today.
						</p>
						<a
							href="/app/explore"
							class="mt-8 inline-block rounded-2xl bg-zinc-900 px-10 py-4 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:scale-105 hover:shadow-2xl dark:bg-zinc-100 dark:text-zinc-900"
							>Explore Tracks</a
						>
					</div>
				{/if}
			</div>
		</div>

		<!-- Behavioral Analytics (Narrower Column) -->
		<div class="space-y-8 lg:col-span-5" in:fade={{ duration: 1000, delay: 700 }}>
			<div
				class="flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800"
			>
				<h2 class={`${TEXT.h2} font-black tracking-tight`}>Performance</h2>
			</div>

			<div
				class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} group relative flex flex-col items-center overflow-hidden p-10 text-center lg:p-12 ${ELEVATION.card} ${ELEVATION.cardHover}`}
			>
				<div class="absolute top-0 right-0 p-6">
					<div
						class="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-[9px] font-black tracking-widest text-amber-600 uppercase"
					>
						WEEKLY GOAL
					</div>
				</div>

				<div class="relative mb-10 h-56 w-56 scale-110">
					<svg class="h-full w-full -rotate-90" viewBox="0 0 36 36">
						<circle
							class="stroke-zinc-100 dark:stroke-zinc-800"
							stroke-width="3"
							fill="none"
							cx="18"
							cy="18"
							r="16"
						/>
						<circle
							class="stroke-blue-600 transition-all duration-1000"
							stroke-width="3"
							stroke-dasharray="{data.stats.weeklyProgress || 0}, 100"
							stroke-linecap="round"
							fill="none"
							cx="18"
							cy="18"
							r="16"
						/>
					</svg>
					<div class="absolute inset-0 flex flex-col items-center justify-center">
						<span class="mb-1 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase"
							>Weekly</span
						>
						<span class="text-6xl font-black tracking-tighter text-zinc-900 dark:text-white"
							>{data.stats.weeklyProgress || 0}%</span
						>
					</div>
				</div>

				<div class="w-full space-y-6">
					<div
						class="rounded-3xl border border-zinc-200/50 bg-zinc-50/50 p-7 dark:border-zinc-800/50 dark:bg-zinc-900/50"
					>
						<div
							class="mb-5 flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800"
						>
							<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase"
								>Expert Streak</span
							>
							<span class="text-2xl leading-none font-black text-zinc-900 dark:text-white"
								>🔥 {data.stats.streak || 0} DAYS</span
							>
						</div>
						<div class="flex justify-between gap-1.5">
							{#each ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as day, i}
								{@const active = data.stats.streak > i}
								<div
									class={`flex h-10 flex-1 items-center justify-center rounded-xl text-[10px] font-black ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-black/5 text-zinc-300 dark:bg-white/5 dark:text-zinc-600'}`}
								>
									{day}
								</div>
							{/each}
						</div>
					</div>
					<p class="px-4 text-xs leading-relaxed font-bold text-zinc-400">
						Monitored learning patterns based on your consistent lesson completion.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.role-switcher) {
		background-color: transparent !important;
		border: none !important;
		box-shadow: none !important;
	}
</style>
