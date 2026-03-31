<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toastStore';
	import { updateQueryParam } from '$lib/utils/url-params';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data }: { data: PageData } = $props();

	const showSuccess = $page.url.searchParams.has('payment');

	const trackInfo: Record<string, { icon: string; label: string; color: string }> = {
		creator: { icon: '🎥', label: 'Kreator', color: 'bg-purple-100 text-purple-700' },
		seller: { icon: '🛒', label: 'Seller', color: 'bg-orange-100 text-orange-700' },
		affiliate: { icon: '🔗', label: 'Affiliator', color: 'bg-blue-100 text-blue-700' }
	};

	const trackLabels: Record<string, { label: string; icon: string; color: string }> = {
		creator: { label: 'Creator', icon: '🎥', color: 'bg-purple-100 text-purple-700' },
		seller: { label: 'Seller', icon: '🛒', color: 'bg-orange-100 text-orange-700' },
		affiliate: { label: 'Affiliate', icon: '🔗', color: 'bg-teal-100 text-teal-700' }
	};

	let submitting = $state<string | null>(null);
	let expandedCheckpoint = $state<string | null>(null);

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(date));
	}

	function isOverdue(dueDate: Date | null): boolean {
		if (!dueDate) return false;
		return new Date(dueDate) < new Date();
	}
</script>

<svelte:head>
	<title>My Learning — Naik Kelas</title>
</svelte:head>

<div class="animate-in fade-in flex flex-col gap-10 duration-1000 md:gap-14">
	<!-- Cinematic Learner Protocol Header -->
	<header
		class={`relative overflow-hidden p-10 ${RADIUS.card} border ${COLOR.cardBorder} bg-white shadow-2xl transition-all hover:shadow-blue-500/5 dark:bg-zinc-900`}
	>
		<!-- Background Nodal Elements -->
		<div
			class="absolute -top-20 -left-20 h-80 w-80 animate-pulse rounded-full bg-blue-500/5 blur-[100px] dark:bg-blue-500/10"
		></div>
		<div
			class="absolute -right-20 -bottom-20 h-80 w-80 animate-pulse rounded-full bg-indigo-500/5 blur-[100px] delay-700 dark:bg-indigo-500/10"
		></div>

		<div class="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
			<div class="space-y-6">
				<div class="flex items-center gap-3">
					<div
						class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black tracking-widest text-blue-700 uppercase shadow-sm dark:border-blue-900/30 dark:bg-blue-900/20"
					>
						Learner Protocol
					</div>
					<div
						class="flex items-center gap-1.5 rounded-md bg-zinc-950 px-2 py-1 text-[9px] font-black tracking-tighter text-white uppercase dark:bg-white dark:text-zinc-950"
					>
						<span class="h-1.5 w-1.5 animate-ping rounded-full bg-blue-500"></span>
						Live Tracking
					</div>
				</div>

				<div class="space-y-2">
					<h1
						class="text-5xl leading-[0.85] font-black tracking-tighter text-zinc-900 md:text-7xl dark:text-white"
					>
						Knowledge <span
							class="bg-linear-to-r from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent italic"
							>Acquisition</span
						>
					</h1>
					<p
						class="max-w-xl text-base leading-relaxed font-medium text-zinc-500 dark:text-zinc-400"
					>
						Deploy your learning protocols, monitor real-time node progress, and execute tactical
						assignments to accelerate your professional development within the Naik Kelas ecosystem.
					</p>
				</div>
			</div>

			<!-- Dynamic Tab Navigation (Standardized Glassmorphism) -->
			<nav
				class={`flex p-1.5 ${RADIUS.button} border bg-zinc-100 dark:bg-zinc-800/50 ${COLOR.cardBorder} shadow-inner backdrop-blur-md`}
			>
				{#each [{ id: 'courses', label: 'My Courses', icon: 'book' }, { id: 'progress', label: 'Performance', icon: 'activity' }, { id: 'checkpoints', label: 'Mission Board', icon: 'shield-check' }, { id: 'certificates', label: 'Credentials', icon: 'award' }] as tab}
					<button
						onclick={() => updateQueryParam($page.url, 'tab', tab.id, goto)}
						class={`px-6 py-2.5 ${RADIUS.button} flex items-center gap-2 text-[11px] font-black tracking-widest uppercase transition-all ${
							data.tab === tab.id
								? 'bg-white text-blue-600 shadow-xl dark:bg-zinc-900'
								: 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
						}`}
					>
						{tab.label}
					</button>
				{/each}
			</nav>
		</div>
	</header>

	{#if showSuccess}
		<div
			class={`p-6 ${RADIUS.card} ${COLOR.success} animate-in slide-in-from-top-2 flex items-center gap-4 border border-green-200 shadow-xl duration-500 dark:border-green-900`}
			role="alert"
		>
			<div
				class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-600"
			>
				<span class="text-xl">✅</span>
			</div>
			<div>
				<p class="text-[11px] font-black tracking-tight uppercase">Transaction Success</p>
				<p class="text-xs font-medium text-green-700 dark:text-green-300">
					Activation protocols initiated. Your course access is being synthesized.
				</p>
			</div>
		</div>
	{/if}

	<!-- Tab Content Layer -->
	<main class="min-h-[60vh]">
		{#if data.tab === 'courses'}
			{#if !data.enrollments || data.enrollments.length === 0}
				<PageSection noCard={true}>
					<div
						class="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-zinc-50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-800/20"
					>
						<div class="mb-6 text-6xl opacity-20">📚</div>
						<h2
							class="mb-2 text-2xl font-black tracking-tight text-zinc-900 uppercase italic dark:text-white"
						>
							No Active Protocols
						</h2>
						<p class="mb-8 max-w-sm text-sm font-medium text-zinc-500 dark:text-zinc-400">
							Your knowledge library is currently empty. Initialize your journey by exploring the
							curriculum catalog.
						</p>
						<a
							href="/app/explore"
							class={`inline-flex items-center gap-3 px-8 py-3 ${RADIUS.button} bg-zinc-950 text-[11px] font-black tracking-widest text-white uppercase dark:bg-white dark:text-zinc-950 ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-1 hover:shadow-2xl`}
						>
							Initialize Discovery <Icon name="arrow-right" size={14} />
						</a>
					</div>
				</PageSection>
			{:else}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each data.enrollments as enrollment}
						<div
							class={`group flex flex-col ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.card} ${ELEVATION.cardHover} ${TRANSITION.all} overflow-hidden`}
						>
							<!-- Cinematic Node Thumbnail -->
							<div class="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
								{#if enrollment.course.thumbnailUrl}
									<img
										src={enrollment.course.thumbnailUrl}
										alt={enrollment.course.title}
										class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
										loading="lazy"
									/>
								{:else}
									<div
										class="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-500/10 to-indigo-500/10"
									>
										<span
											class="text-6xl opacity-20 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0"
											>💎</span
										>
									</div>
								{/if}

								<div
									class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
								></div>

								<div class="absolute top-4 right-4 flex flex-col items-end gap-2">
									{#if enrollment.status === 'active'}
										<div
											class="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[9px] font-black tracking-widest text-white uppercase shadow-xl backdrop-blur-md"
										>
											<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>
											Active Protocol
										</div>
									{:else}
										<div
											class="flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-[9px] font-black tracking-widest text-white uppercase shadow-xl backdrop-blur-md"
										>
											Pending Verification
										</div>
									{/if}

									{#if enrollment.track && trackInfo[enrollment.track]}
										<div
											class={`rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[9px] font-black tracking-widest text-zinc-900 uppercase shadow-xl dark:bg-zinc-900/90 dark:text-white`}
										>
											{trackInfo[enrollment.track].icon}
											{trackInfo[enrollment.track].label}
										</div>
									{/if}
								</div>
							</div>

							<div class="flex flex-1 flex-col p-8">
								{#if enrollment.cohortName}
									<div class="mb-4 flex items-center gap-2">
										<div class="h-1 w-4 rounded-full bg-blue-600"></div>
										<p class="text-[9px] font-black tracking-widest text-blue-600 uppercase italic">
											{enrollment.cohortName}
										</p>
									</div>
								{/if}

								<h3
									class="mb-2 text-2xl leading-none font-black tracking-tighter text-zinc-900 italic transition-colors group-hover:text-blue-600 dark:text-white"
								>
									{enrollment.course.title}
								</h3>

								<p
									class="mb-8 line-clamp-2 text-xs leading-relaxed font-medium text-zinc-500 italic dark:text-zinc-400"
								>
									{enrollment.course.description ||
										'Initialize your professional deployment through this high-performance curriculum node.'}
								</p>

								{#if enrollment.status === 'active' && !enrollment.track}
									<div
										class="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 backdrop-blur-md"
									>
										<p
											class="mb-1 text-[9px] font-black tracking-widest text-amber-600 uppercase italic"
										>
											Strategist Required
										</p>
										<p
											class="text-[11px] leading-tight font-medium text-zinc-600 dark:text-zinc-300"
										>
											Nodal track selection required for specialized learning protocols.
										</p>
										<a
											href="/app/explore/{enrollment.course.id}"
											class="mt-3 inline-block text-[10px] font-black tracking-widest text-amber-600 uppercase italic hover:underline"
											>Select Track →</a
										>
									</div>
								{/if}

								{#if enrollment.status === 'active'}
									<div class="mt-auto mb-8 space-y-3">
										<div class="flex items-center justify-between">
											<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase"
												>Node Completion</span
											>
											<span
												class={`text-[10px] font-black tracking-tighter ${enrollment.progressPercent >= 100 ? 'text-emerald-500' : 'text-blue-600'}`}
											>
												{enrollment.progressPercent}% Verified
											</span>
										</div>
										<div
											class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 shadow-inner dark:bg-zinc-800"
										>
											<div
												class={`h-full rounded-full transition-all duration-1000 ${
													enrollment.progressPercent >= 100
														? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
														: 'bg-linear-to-r from-blue-600 via-indigo-500 to-violet-500'
												}`}
												style="width: {enrollment.progressPercent}%"
											></div>
										</div>
									</div>

									<a
										href="/app/explore/{enrollment.course.id}/learn"
										class={`flex w-full items-center justify-center gap-3 py-4 ${RADIUS.button} text-[11px] font-black tracking-widest uppercase transition-all ${
											enrollment.progressPercent >= 100
												? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-700'
												: 'bg-zinc-950 text-white shadow-xl hover:-translate-y-1 dark:bg-white dark:text-zinc-950'
										}`}
									>
										{#if enrollment.progressPercent === 0}
											Incept Protocol <Icon name="play" size={14} />
										{:else if enrollment.progressPercent >= 100}
											Review Protocol <Icon name="refresh-ccw" size={14} />
										{:else}
											Resume Operation <Icon name="zap" size={14} />
										{/if}
									</a>
								{:else if enrollment.status === 'pending'}
									<div class="mt-auto space-y-4">
										<div class="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
											<p
												class="mb-1 text-[9px] font-black tracking-widest text-amber-600 uppercase italic"
											>
												Awaiting Clearance
											</p>
											<p class="text-[11px] leading-tight font-medium text-zinc-500">
												Your credentials are being verified by the centralized nodal authority.
											</p>
										</div>
										<a
											href="/app/payments?courseId={enrollment.course.id}"
											class={`flex w-full items-center justify-center gap-2 py-4 ${RADIUS.button} bg-linear-to-br from-amber-500 to-orange-600 text-[11px] font-black tracking-widest text-white uppercase shadow-xl transition-all hover:shadow-orange-500/30`}
										>
											Verification Depot <Icon name="shield" size={14} />
										</a>
									</div>
								{/if}

								<div
									class="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 opacity-40 dark:border-zinc-800"
								>
									<div class="flex items-center gap-2">
										<Icon name="calendar" size={12} />
										<span class="text-[9px] font-black tracking-widest uppercase">
											{#if enrollment.enrolledAt}
												{new Date(enrollment.enrolledAt).toLocaleDateString('id-ID', {
													day: '2-digit',
													month: 'short',
													year: 'numeric'
												})}
											{:else}
												--
											{/if}
										</span>
									</div>
									<div class="flex items-center gap-2">
										<Icon name="clock" size={12} />
										<span class="text-[9px] font-black tracking-widest uppercase">
											{enrollment.course.duration || 4} Weeks
										</span>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{:else if data.tab === 'progress'}
			<div class="mb-10 flex items-center justify-between">
				<div>
					<h2
						class="text-3xl leading-none font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
					>
						Performance Pulse
					</h2>
					<p class="mt-1 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
						Cross-Nodal Analytics
					</p>
				</div>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 shadow-sm"
				>
					<Icon name="bar-chart-2" size={20} />
				</div>
			</div>

			<div class="mb-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
				{#if data.tab === 'progress' && data.stats && 'totalCourses' in data.stats}
					{#each [{ label: 'Protocols Enrolled', value: data.stats.totalCourses || 0, icon: 'book', color: 'text-blue-600', bg: 'bg-blue-500/5' }, { label: 'Verified Complete', value: data.stats.completedCourses || 0, icon: 'check-circle', color: 'text-emerald-500', bg: 'bg-emerald-500/5' }, { label: 'Nodes Processed', value: data.stats.totalLessonsCompleted || 0, icon: 'layers', color: 'text-indigo-500', bg: 'bg-indigo-500/5' }, { label: 'Avg Efficiency', value: data.stats.avgScore ? `${data.stats.avgScore}%` : '-', icon: 'target', color: 'text-amber-500', bg: 'bg-amber-500/5' }] as stat}
						<div
							class={`p-6 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} group flex flex-col items-center text-center hover:-translate-y-1 ${TRANSITION.all}`}
						>
							<div
								class={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} mb-4 flex items-center justify-center transition-transform group-hover:scale-110`}
							>
								<Icon name={stat.icon} size={24} />
							</div>
							<p
								class="mb-2 text-3xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white"
							>
								{stat.value}
							</p>
							<p class="text-[9px] font-black tracking-widest text-zinc-400 uppercase">
								{stat.label}
							</p>
						</div>
					{/each}
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
				<!-- Ledger Flow (Submissions) -->
				<div class="lg:col-span-8">
					<div class="mb-6 flex items-center gap-4">
						<div class="h-8 w-1 rounded-full bg-blue-600"></div>
						<h3 class="text-xl font-black tracking-tight text-zinc-900 uppercase dark:text-white">
							Protocol Ledger
						</h3>
					</div>

					<div
						class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.card}`}
					>
						<div
							class="h-1 bg-linear-to-r from-blue-600/10 via-indigo-500/10 to-transparent p-1 px-8"
						></div>
						<div class="overflow-x-auto">
							<table class="w-full border-collapse text-left">
								<thead>
									<tr
										class="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50"
									>
										<th
											class="px-8 py-4 text-[10px] font-black tracking-widest text-zinc-400 uppercase"
											>Protocol Node</th
										>
										<th
											class="px-8 py-4 text-[10px] font-black tracking-widest text-zinc-400 uppercase"
											>Action Type</th
										>
										<th
											class="px-8 py-4 text-[10px] font-black tracking-widest text-zinc-400 uppercase"
											>Efficiency</th
										>
										<th
											class="px-8 py-4 text-[10px] font-black tracking-widest text-zinc-400 uppercase"
											>Clearance</th
										>
									</tr>
								</thead>
								<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
									{#if !data.submissions || data.submissions.length === 0}
										<tr>
											<td
												colspan="4"
												class="px-8 py-20 text-center text-xs font-medium text-zinc-400 italic"
												>No historical data found in the nodal ledger.</td
											>
										</tr>
									{:else}
										{#each data.submissions as sub}
											<tr class="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
												<td class="px-8 py-5">
													<p
														class="mb-1 text-xs leading-none font-black tracking-tight text-zinc-900 dark:text-white"
													>
														{sub.courseTitle}
													</p>
													<p class="text-[10px] font-medium text-zinc-400 italic">
														{sub.lessonTitle || 'System Node'}
													</p>
												</td>
												<td class="px-8 py-5">
													<div
														class={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-black tracking-tighter uppercase ${sub.type === 'action' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}
													>
														<Icon name={sub.type === 'action' ? 'zap' : 'book'} size={10} />
														{sub.type}
													</div>
												</td>
												<td class="px-8 py-5">
													{#if sub.score !== null}
														<div class="flex items-center gap-2">
															<span
																class={`text-sm font-black tracking-tighter ${sub.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}
															>
																{sub.score}/100
															</span>
															<div
																class="h-1 w-8 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
															>
																<div
																	class={`h-full ${sub.score >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
																	style="width: {sub.score}%"
																></div>
															</div>
														</div>
													{:else}
														<span
															class="text-[10px] font-black tracking-widest text-zinc-300 uppercase italic"
															>Awaiting Audit</span
														>
													{/if}
												</td>
												<td class="px-8 py-5">
													<p
														class="text-[10px] font-black tracking-tighter text-zinc-500 uppercase"
													>
														{new Date(sub.createdAt).toLocaleDateString('id-ID', {
															day: '2-digit',
															month: 'short'
														})}
													</p>
												</td>
											</tr>
										{/each}
									{/if}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<!-- Track Specialization Node -->
				<div class="space-y-8 lg:col-span-4">
					<div class="mb-6 flex items-center gap-4">
						<div class="h-8 w-1 rounded-full bg-indigo-600"></div>
						<h3 class="text-xl font-black tracking-tight text-zinc-900 uppercase dark:text-white">
							Specializations
						</h3>
					</div>

					<div
						class={`p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} relative overflow-hidden`}
					>
						<div
							class="pointer-events-none absolute -right-4 -bottom-4 rotate-12 text-8xl leading-none font-black tracking-tighter uppercase opacity-5 grayscale"
						>
							Node
						</div>
						{#if data.certificates && data.certificates.length > 0}
							<div class="relative z-10 space-y-6">
								{#each data.certificates.slice(0, 3) as cert}
									<div
										class="group flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 shadow-sm transition-colors hover:border-indigo-500/30 dark:border-zinc-800 dark:bg-zinc-800/50"
									>
										<div class="flex items-center gap-4">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shadow-sm transition-transform group-hover:scale-110"
											>
												<Icon name="award" size={20} />
											</div>
											<div>
												<p
													class="mb-1 text-[11px] leading-none font-black text-zinc-900 uppercase dark:text-white"
												>
													{cert.courseTitle}
												</p>
												<p
													class="font-mono text-[9px] font-bold tracking-tighter text-zinc-400 lowercase italic"
												>
													#{cert.serial.split('-').pop()}
												</p>
											</div>
										</div>
									</div>
								{/each}
								<a
									href="/app/learning?tab=certificates"
									class="block text-center text-[10px] font-black tracking-widest text-indigo-600 uppercase italic hover:underline"
									>Access All Credentials →</a
								>
							</div>
						{:else}
							<div class="py-10 text-center opacity-40">
								<Icon name="award" size={48} class="mx-auto mb-4" />
								<p class="text-xs font-black tracking-widest uppercase">No Seals Verified</p>
							</div>
						{/if}
					</div>

					<!-- Strategic Tip -->
					<div
						class={`${RADIUS.card} group relative overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl`}
					>
						<div class="relative z-10 space-y-3">
							<h4
								class="text-[10px] leading-none font-black tracking-widest text-blue-100 uppercase opacity-80"
							>
								Knowledge Strategist
							</h4>
							<p class="text-xl leading-tight font-black tracking-tighter uppercase italic">
								Operational Velocity
							</p>
							<p class="text-[10px] leading-relaxed font-medium opacity-70">
								Protocol completion rate is optimal. Focus on specialized action items in Week 3 to
								maximize track-specific nodal growth.
							</p>
						</div>
						<div
							class="absolute -right-2 -bottom-2 text-7xl opacity-20 grayscale transition-transform duration-700 group-hover:rotate-12"
						>
							🚀
						</div>
					</div>
				</div>
			</div>
		{:else if data.tab === 'checkpoints'}
			<PageHeader
				title="Weekly Checkpoints"
				description="Complete your weekly action items to track your progress"
			/>

			<div class="mb-10 flex items-center justify-between">
				<div>
					<h2
						class="text-3xl leading-none font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
					>
						Mission Board
					</h2>
					<p class="mt-1 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
						Tactical Action Ledger
					</p>
				</div>
				<div class="flex items-center gap-4">
					<div
						class="rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-[10px] font-black tracking-widest text-zinc-500 uppercase dark:border-zinc-700 dark:bg-zinc-800"
					>
						Weekly Cycle
					</div>
				</div>
			</div>

			<div class="mb-12 grid grid-cols-3 gap-6">
				{#if data.stats && 'pending' in data.stats}
					{#each [{ label: 'Total Missions', value: data.stats.total || 0, color: 'text-blue-600', bg: 'bg-blue-500/5' }, { label: 'Cleared', value: data.stats.completed || 0, color: 'text-emerald-500', bg: 'bg-emerald-500/5' }, { label: 'Awaiting Execution', value: data.stats.pending || 0, color: 'text-amber-500', bg: 'bg-amber-500/5' }] as stat}
						<div
							class={`p-6 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} flex flex-col items-center text-center shadow-sm`}
						>
							<p class={`text-4xl font-black tracking-tighter ${stat.color} mb-2 leading-none`}>
								{stat.value}
							</p>
							<p class="text-[9px] font-black tracking-widest text-zinc-400 uppercase">
								{stat.label}
							</p>
						</div>
					{/each}
				{/if}
			</div>

			{#if !data.checkpoints || data.checkpoints.length === 0}
				<div
					class="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-zinc-50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-800/20"
				>
					<div class="mb-6 text-6xl opacity-20">📋</div>
					<h3
						class="mb-2 text-xl font-black tracking-tight text-zinc-900 uppercase italic dark:text-white"
					>
						No Active Missions
					</h3>
					<p class="mb-8 max-w-sm text-sm font-medium text-zinc-500 dark:text-zinc-400">
						You are not currently assigned to any tactical learning cohorts. Initialize your course
						selection to activate mission protocols.
					</p>
					<a
						href="/app/learning?tab=courses"
						class={`px-8 py-3 ${RADIUS.button} bg-zinc-950 text-[11px] font-black tracking-widest text-white uppercase dark:bg-white dark:text-zinc-950 ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-1`}
					>
						Deploy My Courses
					</a>
				</div>
			{:else}
				<div class="space-y-6">
					{#each data.checkpoints as checkpoint}
						{@const isCompleted = checkpoint.submission?.completed}
						{@const isExpanded = expandedCheckpoint === checkpoint.id}
						{@const overdue = !isCompleted && isOverdue(checkpoint.dueDate)}

						<div
							class={`${RADIUS.card} ${COLOR.card} border-2 ${isCompleted ? 'border-emerald-500/20 bg-emerald-500/5' : overdue ? 'border-red-500/20 bg-red-500/5' : COLOR.cardBorder} overflow-hidden transition-all duration-500 ${isExpanded ? 'shadow-2xl' : 'shadow-sm hover:shadow-md'}`}
						>
							<button
								class="group flex w-full items-center justify-between p-8 text-left"
								onclick={() => (expandedCheckpoint = isExpanded ? null : checkpoint.id)}
							>
								<div class="flex items-center gap-6">
									<div
										class={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-xl font-black shadow-inner transition-transform group-hover:scale-105 ${
											isCompleted
												? 'border-emerald-400 bg-emerald-500 text-white'
												: overdue
													? 'border-red-400 bg-red-500 text-white'
													: 'border-zinc-200 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white'
										}`}
									>
										{#if isCompleted}
											<Icon name="check" size={24} strokeWidth={3} />
										{:else}
											<span class="font-mono">W{checkpoint.weekNumber}</span>
										{/if}
									</div>
									<div>
										<div class="mb-2 flex items-center gap-3">
											<h3
												class="text-xl font-black tracking-tighter text-zinc-900 uppercase italic transition-colors group-hover:text-blue-600 dark:text-white"
											>
												{checkpoint.title}
											</h3>
											{#if checkpoint.track && trackLabels[checkpoint.track]}
												<span
													class={`rounded-md px-2 py-0.5 text-[8px] font-black tracking-widest uppercase ${trackLabels[checkpoint.track].color} border border-current opacity-70`}
												>
													{trackLabels[checkpoint.track].icon}
													{trackLabels[checkpoint.track].label}
												</span>
											{/if}
										</div>
										<p
											class="flex items-center gap-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase"
										>
											{checkpoint.courseTitle}
											<span class="h-1 w-1 rounded-full bg-zinc-300"></span>
											Cycle {checkpoint.weekNumber}
											{#if checkpoint.dueDate}
												<span class="h-1 w-1 rounded-full bg-zinc-300"></span>
												<span class={overdue ? 'text-red-500' : ''}>
													Deadline: {new Date(checkpoint.dueDate).toLocaleDateString('id-ID', {
														day: '2-digit',
														month: 'short'
													})}
												</span>
											{/if}
										</p>
									</div>
								</div>

								<div class="flex items-center gap-6">
									<div
										class={`rounded-full px-4 py-1.5 text-[9px] font-black tracking-widest uppercase shadow-sm ${
											isCompleted
												? 'border border-emerald-500/20 bg-emerald-500/20 text-emerald-600'
												: overdue
													? 'border border-red-500/20 bg-red-500/20 text-red-600'
													: 'border border-amber-500/20 bg-amber-500/20 text-amber-600'
										}`}
									>
										{isCompleted
											? 'Mission Cleared'
											: overdue
												? 'Protocol Overdue'
												: 'Awaiting Action'}
									</div>
									<div
										class={`text-zinc-400 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}
									>
										<Icon name="chevron-down" size={20} />
									</div>
								</div>
							</button>

							{#if isExpanded}
								<div class="animate-in slide-in-from-top-4 px-8 pt-0 pb-8 duration-500">
									<div class="mb-8 h-px w-full bg-zinc-100 dark:bg-zinc-800"></div>

									<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
										<div class="lg:col-span-12">
											<p
												class="mb-8 text-sm leading-relaxed font-medium text-zinc-500 italic dark:text-zinc-400"
											>
												{checkpoint.description ||
													'Initialize your weekly performance log. Document all nodal successes and tactical challenges encountered during this learning cycle.'}
											</p>

											{#if isCompleted && checkpoint.submission?.notes}
												<div
													class="relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900"
												>
													<div
														class="pointer-events-none absolute top-0 right-0 p-8 text-6xl leading-none font-black tracking-tighter uppercase italic opacity-5 grayscale"
													>
														Cleared
													</div>
													<h4
														class="mb-4 text-[9px] font-black tracking-widest text-zinc-400 uppercase italic"
													>
														Action Log Summary
													</h4>
													<p
														class="text-sm leading-relaxed font-medium text-zinc-900 italic dark:text-zinc-200"
													>
														"{checkpoint.submission.notes}"
													</p>
													<div
														class="mt-8 flex items-center gap-4 border-t border-zinc-100 pt-4 opacity-60 dark:border-zinc-800"
													>
														<Icon name="clock" size={12} />
														<span class="text-[9px] font-black tracking-widest uppercase">
															Synthesized: {new Date(
																checkpoint.submission.submittedAt!
															).toLocaleDateString('id-ID', {
																day: '2-digit',
																month: 'long',
																year: 'numeric',
																hour: '2-digit',
																minute: '2-digit'
															})}
														</span>
													</div>
												</div>
											{:else}
												<form
													method="POST"
													action="?/submit"
													use:enhance={() => {
														submitting = checkpoint.id;
														return async ({ result }) => {
															submitting = null;
															if (result.type === 'success') {
																window.location.reload();
															} else if (result.type === 'failure') {
																const data = (result.data ?? {}) as Record<string, unknown>;
																toast.error((data.error as string) || 'Gagal mengirim checkpoint');
															}
														};
													}}
													class="space-y-6"
												>
													<input type="hidden" name="checkpointId" value={checkpoint.id} />
													<div class="space-y-3">
														<label
															for="notes-{checkpoint.id}"
															class="ml-1 text-[9px] font-black tracking-widest text-zinc-400 uppercase italic"
														>
															Tactical Progress Update
														</label>
														<textarea
															id="notes-{checkpoint.id}"
															name="notes"
															required
															rows="4"
															placeholder="Execute your weekly status report... What assets were deployed? What protocols were initialized?"
															class={`w-full p-6 ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 text-sm font-medium transition-all outline-none placeholder:italic focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:bg-zinc-900`}
														></textarea>
													</div>
													<button
														type="submit"
														disabled={submitting === checkpoint.id}
														class={`w-full py-4 ${RADIUS.button} bg-zinc-950 text-[11px] font-black tracking-widest text-white uppercase shadow-2xl transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950`}
													>
														{submitting === checkpoint.id
															? 'Synthesizing Action...'
															: 'Confirm Mission Clearance'}
													</button>
												</form>
											{/if}
										</div>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		{:else if data.tab === 'certificates'}
			<div class="mb-10 flex items-center justify-between">
				<div>
					<h2
						class="text-3xl leading-none font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
					>
						Verified Credentials
					</h2>
					<p class="mt-1 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
						Diplomatic Learning Seals
					</p>
				</div>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500 shadow-sm"
				>
					<Icon name="award" size={20} />
				</div>
			</div>

			{#if !data.certificates || data.certificates.length === 0}
				<div
					class="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-zinc-50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-800/20"
				>
					<div class="mb-6 text-6xl opacity-20">📜</div>
					<h3
						class="mb-2 text-xl font-black tracking-tight text-zinc-900 uppercase italic dark:text-white"
					>
						No Seals Verified
					</h3>
					<p class="mb-8 max-w-sm text-sm font-medium text-zinc-500 dark:text-zinc-400">
						Your professional credential portfolio is currently empty. Complete your assigned course
						protocols to earn official Naik Kelas verification seals.
					</p>
					<a
						href="/app/learning?tab=courses"
						class={`px-8 py-3 ${RADIUS.button} bg-zinc-950 text-[11px] font-black tracking-widest text-white uppercase dark:bg-white dark:text-zinc-950 ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-1`}
					>
						Deploy My Protocols
					</a>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each data.certificates as cert}
						<a
							href="/app/learning/certificates/{cert.id}"
							class={`group relative flex flex-col overflow-hidden ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${ELEVATION.cardHover} ${TRANSITION.all} p-8`}
						>
							<!-- Decorative Watermark -->
							<div
								class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/5 transition-transform duration-1000 group-hover:scale-150"
							></div>

							<div class="relative z-10 flex h-full flex-col">
								<div class="mb-8 flex items-start justify-between">
									<div
										class="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-3xl shadow-inner transition-colors duration-500 group-hover:bg-blue-600 group-hover:text-white dark:bg-zinc-800"
									>
										<Icon name="award" size={28} />
									</div>
									<div class="text-right">
										<p
											class="mb-1 text-[9px] font-bold tracking-widest text-zinc-400 uppercase italic"
										>
											Serial Number
										</p>
										<p
											class="font-mono text-[10px] font-black tracking-tighter text-zinc-900 lowercase dark:text-white"
										>
											#{cert.serial.split('-').pop()}
										</p>
									</div>
								</div>

								<div class="flex-1">
									<h3
										class="mb-2 text-2xl leading-tight font-black tracking-tighter text-zinc-900 uppercase italic transition-colors group-hover:text-blue-600 dark:text-white"
									>
										{cert.courseTitle}
									</h3>
									<p class="mb-6 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
										Issued: {new Date(cert.issuedAt).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</p>
								</div>

								<div
									class="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800"
								>
									<span
										class="text-[9px] font-black tracking-[0.2em] text-blue-600 uppercase transition-all group-hover:tracking-[0.3em]"
									>
										Protocol Verified
									</span>
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600 dark:bg-zinc-800"
									>
										<Icon name="arrow-right" size={14} />
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		{/if}
	</main>
</div>
