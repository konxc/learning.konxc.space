<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import RoleSwitcher from '$lib/components/app/RoleSwitcher.svelte';
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

<div class={SPACING.relaxed}>
	<!-- Premium Header: Sophisticated High-Density Layout -->
	<header
		class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
		in:fade={{ duration: 800 }}
	>
		<div class="space-y-3">
			<div class="flex items-center gap-2">
				<div class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
				<span class={`${TEXT.small} ${COLOR.textMuted} tracking-[0.2em]`}
					>LEARNER DASHBOARD • {new Date().toLocaleDateString('en-US', {
						month: 'long',
						year: 'numeric'
					})}</span
				>
			</div>
			<h1 class={`${TEXT.h1} leading-tight`}>
				Ready to excel, <span
					class="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text font-black text-transparent"
					>{data.user.fullName || data.user.username}?</span
				>
			</h1>
			<p class={`${TEXT.secondary} max-w-xl`}>
				Track your professional growth, manage certifications, and continue your specialized
				learning tracks in one unified space.
			</p>
		</div>

		<div
			class="flex items-center gap-4 rounded-2xl border border-zinc-200/50 bg-zinc-100 p-1 dark:border-zinc-800/50 dark:bg-zinc-900"
		>
			<RoleSwitcher />
			<div
				class="h-10 w-10 overflow-hidden rounded-xl shadow-2xl ring-2 ring-white dark:ring-zinc-800"
			>
				<div
					class={`${GRADIENT.primary} flex h-full w-full items-center justify-center text-sm font-black text-white`}
				>
					{data.user.username[0].toUpperCase()}
				</div>
			</div>
		</div>
	</header>

	<!-- Bento Grid 2.0: Higher Variety & Immersive Visuals -->
	<div class="grid auto-rows-[180px] grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-12">
		<!-- Hero Card: Progress Visualization -->
		<div
			class={`row-span-2 md:col-span-4 lg:col-span-8 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} group relative flex flex-col justify-between overflow-hidden p-10 ${ELEVATION.card} ${ELEVATION.cardHover} transition-all duration-700 hover:-translate-y-1 hover:shadow-blue-500/10`}
			in:fly={{ y: 40, duration: 800, delay: 100 }}
		>
			<div
				class="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px] transition-all duration-1000 group-hover:bg-blue-500/10"
			></div>
			<div
				class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-[80px]"
			></div>

			<div class="relative z-10 flex items-start justify-between">
				<div class="space-y-1">
					<h3
						class={`${TEXT.h3} font-black tracking-tighter text-zinc-900 uppercase dark:text-white`}
					>
						Overall Mastery
					</h3>
					<div class="flex items-center gap-2">
						<span
							class="text-6xl font-black tracking-tighter text-zinc-900 md:text-8xl dark:text-white"
							>{data.stats.progress || 0}<span class="text-4xl text-blue-500">%</span></span
						>
						<div
							class="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-600 uppercase"
						>
							Excellent
						</div>
					</div>
				</div>
				<div
					class="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200/50 bg-zinc-50 text-2xl shadow-inner dark:border-zinc-700/50 dark:bg-zinc-800/50"
				>
					⚡
				</div>
			</div>

			<div class="relative z-10 space-y-4">
				<div class="mb-1 flex items-end justify-between">
					<span class={`${TEXT.small} ${COLOR.textMuted}`}>Curriculum Completion</span>
					<span class="text-sm font-black text-zinc-900 dark:text-white"
						>{data.stats.completedLessons || 0} / {data.totalLessons || 100} Lessons</span
					>
				</div>
				<div
					class="h-4 w-full overflow-hidden rounded-full bg-zinc-100 p-1 shadow-inner ring-1 ring-zinc-200/50 dark:bg-zinc-800/50 dark:ring-zinc-700/50"
				>
					<div
						class="cubic-bezier(0.34, 1.56, 0.64, 1) h-full rounded-full bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 transition-all duration-2000"
						style="width: {data.stats.progress || 0}%"
					></div>
				</div>
				<div class="flex items-center gap-4">
					<div class="flex -space-x-2">
						{#each Array(3) as _}
							<div
								class="h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-zinc-200 dark:border-zinc-900"
							>
								<img src={`https://i.pravatar.cc/100?u=${Math.random()}`} alt="" />
							</div>
						{/each}
					</div>
					<p class={`${TEXT.muted} text-[10px]!`}>
						Join <span class="font-bold text-zinc-900 dark:text-white">1.2k alumni</span> who finished
						this path.
					</p>
				</div>
			</div>
		</div>

		<!-- Square Card: Active Courses -->
		<div
			class={`row-span-1 md:col-span-2 lg:col-span-4 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} group flex cursor-pointer flex-col justify-between p-8 ${ELEVATION.card} ${ELEVATION.cardHover} hover:-translate-y-1`}
			in:fly={{ y: 40, duration: 800, delay: 200 }}
		>
			<div class="flex items-center justify-between">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition-transform group-hover:scale-110 dark:bg-blue-900/20"
				>
					📚
				</div>
				<svg
					class="h-5 w-5 text-zinc-300 transition-transform group-hover:translate-x-1"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg
				>
			</div>
			<div>
				<p
					class="mb-1 text-5xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white"
				>
					{data.stats.myCourses || 0}
				</p>
				<span class={`${TEXT.small} ${COLOR.textMuted}`}>Courses in focus</span>
			</div>
		</div>

		<!-- Vertical Accent: Certificates -->
		<div
			class={`row-span-2 md:col-span-2 lg:col-span-2 ${RADIUS.card} ${GRADIENT.primary} group relative flex flex-col justify-between overflow-hidden p-8 text-white ${ELEVATION.card} hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1`}
			in:fly={{ y: 40, duration: 800, delay: 300 }}
		>
			<div
				class="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-transform duration-1000 group-hover:scale-150"
			></div>
			<div
				class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-md"
			>
				🎓
			</div>
			<div>
				<p class="mb-2 text-6xl leading-none font-black tracking-tighter">
					{data.stats.certificates || 0}
				</p>
				<p class="text-[10px] font-black tracking-widest text-white/70 uppercase">
					Verified Credentials
				</p>
			</div>
			<button
				class="mt-6 w-full rounded-xl border border-white/20 bg-white/10 py-3 text-[10px] font-black tracking-widest uppercase backdrop-blur-md transition-all hover:bg-white hover:text-blue-700"
				>View Wallet</button
			>
		</div>

		<!-- Horizontal Long: Activity Summary / Mini Graph -->
		<div
			class={`row-span-1 md:col-span-2 lg:col-span-2 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} flex flex-col justify-between p-6 ${ELEVATION.card} ${ELEVATION.cardHover} hover:-translate-y-1`}
			in:fly={{ y: 40, duration: 800, delay: 400 }}
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-lg dark:bg-amber-900/20"
				>
					💳
				</div>
				<span class={`${TEXT.small} font-bold text-zinc-400`}>PENDING</span>
			</div>
			<p class="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
				{data.stats.pendingPayments || 0}
			</p>
		</div>
	</div>

	<!-- Continuous Journey Section -->
	<div class="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
		<div class="space-y-8 lg:col-span-7" in:fade={{ duration: 1000, delay: 500 }}>
			<div class="flex items-center justify-between">
				<h2 class={`${TEXT.h2} font-black tracking-tight`}>Continue Journey</h2>
				<a
					href="/app/my-courses"
					class="text-xs font-black tracking-widest text-blue-600 uppercase transition-colors hover:text-blue-700"
					>Curriculum Library →</a
				>
			</div>

			<div class="grid gap-4">
				{#if data.courses && data.courses.length > 0}
					{#each data.courses.slice(0, 3) as course}
						<div
							class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} group flex cursor-pointer items-center gap-6 p-6 ${ELEVATION.base} ${ELEVATION.cardHover} transition-all duration-500 hover:-translate-y-1`}
						>
							<div
								class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 shadow-inner transition-transform group-hover:scale-105 dark:bg-zinc-800"
							>
								{#if course.thumbnailUrl}
									<img src={course.thumbnailUrl} alt="" class="h-full w-full object-cover" />
								{:else}
									<div class="flex h-full w-full items-center justify-center text-3xl">📘</div>
								{/if}
							</div>
							<div class="min-w-0 flex-1 space-y-2">
								<div class="flex items-center gap-2">
									<span
										class="rounded-md bg-zinc-100 px-2 py-0.5 text-[9px] font-black tracking-widest text-zinc-500 uppercase dark:bg-zinc-800"
										>Module 0{Math.floor(Math.random() * 5) + 1}</span
									>
									<div class="h-1 w-1 rounded-full bg-zinc-300"></div>
									<span class="text-[10px] font-bold text-blue-600"
										>{course.progress || 0}% Done</span
									>
								</div>
								<h3 class="truncate text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
									{course.title}
								</h3>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
									<div
										class="h-full rounded-full bg-blue-600"
										style="width: {course.progress || 0}%"
									></div>
								</div>
							</div>
							<a
								href={`/app/courses/${course.id}/learn`}
								class={`flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg transition-all hover:scale-110 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900`}
								aria-label="Continue learning this course"
								title="Continue learning"
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
						class="rounded-[2rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/30"
					>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-3xl dark:bg-zinc-800"
						>
							🧭
						</div>
						<h3 class="font-bold text-zinc-900 dark:text-white">Begin your mastery</h3>
						<p class={`${TEXT.muted} mt-1`}>
							No active courses. Explore our curated high-performance catalog.
						</p>
						<a
							href="/app/courses"
							class="mt-6 inline-block rounded-xl bg-zinc-900 px-8 py-3 text-xs font-black tracking-widest text-white uppercase transition-all hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-900"
							>Explore Catalog</a
						>
					</div>
				{/if}
			</div>
		</div>

		<div class="space-y-8 lg:col-span-5" in:fade={{ duration: 1000, delay: 700 }}>
			<div class="flex items-center justify-between">
				<h2 class={`${TEXT.h2} font-black tracking-tight`}>Consistency</h2>
			</div>
			<div
				class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} relative flex flex-col items-center overflow-hidden p-10 text-center ${ELEVATION.card} ${ELEVATION.cardHover}`}
			>
				<div class="absolute top-0 right-0 p-4">
					<div
						class="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-amber-600 uppercase"
					>
						Ongoing Streak
					</div>
				</div>

				<div class="relative mb-8 h-48 w-48 scale-110">
					<svg class="h-full w-full -rotate-90" viewBox="0 0 36 36">
						<circle
							class="stroke-zinc-100 dark:stroke-zinc-800"
							stroke-width="2.5"
							fill="none"
							cx="18"
							cy="18"
							r="16"
						/>
						<circle
							class="stroke-blue-600 transition-all duration-1000"
							stroke-width="2.5"
							stroke-dasharray="{data.stats.progress || 0}, 100"
							stroke-linecap="round"
							fill="none"
							cx="18"
							cy="18"
							r="16"
						/>
					</svg>
					<div class="absolute inset-0 flex flex-col items-center justify-center">
						<span class="mb-1 text-xs font-black tracking-widest text-zinc-400 uppercase"
							>Weekly</span
						>
						<span class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white"
							>{data.stats.progress || 0}%</span
						>
						<span class="mt-1 text-[10px] font-bold text-emerald-500 uppercase">↑ 12% Growth</span>
					</div>
				</div>

				<div class="w-full space-y-4">
					<div
						class="rounded-2xl border border-zinc-200/50 bg-zinc-50 p-6 dark:border-zinc-800/50 dark:bg-zinc-900"
					>
						<div class="mb-2 flex items-center justify-between">
							<span class="text-[10px] font-black text-zinc-400 uppercase">Current Streak</span>
							<span class="text-xl font-black text-zinc-900 dark:text-white">🔥 3 Days</span>
						</div>
						<div class="flex justify-between gap-1">
							{#each ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as day, i}
								<div
									class={`flex h-8 flex-1 items-center justify-center rounded-lg text-[10px] font-bold ${i < 3 ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800'}`}
								>
									{day}
								</div>
							{/each}
						</div>
					</div>
					<p class="text-[11px] font-medium text-zinc-500">
						You're outperforming <span class="font-black text-zinc-900 dark:text-white">92%</span> of
						active learners in your organization.
					</p>
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
