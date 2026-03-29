<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
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


<div class="flex flex-col gap-10 md:gap-14 animate-in fade-in duration-1000">
	<!-- Cinematic Learner Protocol Header -->
	<header 
		class={`relative overflow-hidden p-10 ${RADIUS.card} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 shadow-2xl transition-all hover:shadow-blue-500/5`}
	>
		<!-- Background Nodal Elements -->
		<div class="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
		<div class="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
		
		<div class="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
			<div class="space-y-6">
				<div class="flex items-center gap-3">
					<div class="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 text-[10px] font-black tracking-widest uppercase shadow-sm">
						Learner Protocol
					</div>
					<div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[9px] font-black uppercase tracking-tighter">
						<span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span>
						Live Tracking
					</div>
				</div>
				
				<div class="space-y-2">
					<h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] text-zinc-900 dark:text-white">
						Knowledge <span class="bg-linear-to-r from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent italic">Acquisition</span>
					</h1>
					<p class="max-w-xl text-base font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
						Deploy your learning protocols, monitor real-time node progress, and execute tactical assignments 
						to accelerate your professional development within the Naik Kelas ecosystem.
					</p>
				</div>
			</div>

			<!-- Dynamic Tab Navigation (Standardized Glassmorphism) -->
			<nav class={`flex p-1.5 ${RADIUS.button} bg-zinc-100 dark:bg-zinc-800/50 border ${COLOR.cardBorder} backdrop-blur-md shadow-inner`}>
				{#each [
					{ id: 'courses', label: 'My Courses', icon: 'book' },
					{ id: 'progress', label: 'Performance', icon: 'activity' },
					{ id: 'checkpoints', label: 'Mission Board', icon: 'shield-check' },
					{ id: 'certificates', label: 'Credentials', icon: 'award' }
				] as tab}
					<button 
						onclick={() => updateQueryParam($page.url, 'tab', tab.id, goto)}
						class={`px-6 py-2.5 ${RADIUS.button} text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
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
			class={`p-6 ${RADIUS.card} ${COLOR.success} flex items-center gap-4 border border-green-200 shadow-xl dark:border-green-900 animate-in slide-in-from-top-2 duration-500`}
			role="alert"
		>
			<div class="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
				<span class="text-xl">✅</span>
			</div>
			<div>
				<p class="font-black uppercase tracking-tight text-[11px]">Transaction Success</p>
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
					<div class="flex flex-col items-center justify-center py-20 text-center bg-zinc-50 dark:bg-zinc-800/20 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800">
						<div class="mb-6 text-6xl opacity-20">📚</div>
						<h2 class="text-2xl font-black tracking-tight text-zinc-900 dark:text-white mb-2 uppercase italic">No Active Protocols</h2>
						<p class="mb-8 max-w-sm text-sm font-medium text-zinc-500 dark:text-zinc-400">
							Your knowledge library is currently empty. Initialize your journey by exploring the curriculum catalog.
						</p>
						<a
							href="/app/explore"
							class={`inline-flex items-center gap-3 px-8 py-3 ${RADIUS.button} bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-black uppercase tracking-widest ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-1 hover:shadow-2xl`}
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
									<div class="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-500/10 to-indigo-500/10">
										<span class="text-6xl grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">💎</span>
									</div>
								{/if}

								<div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

								<div class="absolute top-4 right-4 flex flex-col items-end gap-2">
									{#if enrollment.status === 'active'}
										<div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
											<span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
											Active Protocol
										</div>
									{:else}
										<div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
											Pending Verification
										</div>
									{/if}

									{#if enrollment.track && trackInfo[enrollment.track]}
										<div class={`px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/20`}>
											{trackInfo[enrollment.track].icon} {trackInfo[enrollment.track].label}
										</div>
									{/if}
								</div>
							</div>

							<div class="flex flex-1 flex-col p-8">
								{#if enrollment.cohortName}
									<div class="flex items-center gap-2 mb-4">
										<div class="h-1 w-4 rounded-full bg-blue-600"></div>
										<p class="text-[9px] font-black tracking-widest text-blue-600 uppercase italic">
											{enrollment.cohortName}
										</p>
									</div>
								{/if}

								<h3 class="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white mb-2 leading-none group-hover:text-blue-600 transition-colors italic">
									{enrollment.course.title}
								</h3>
								
								<p class="text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400 mb-8 line-clamp-2 italic">
									{enrollment.course.description || 'Initialize your professional deployment through this high-performance curriculum node.'}
								</p>

								{#if enrollment.status === 'active' && !enrollment.track}
									<div class="mb-8 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
										<p class="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1 italic">Strategist Required</p>
										<p class="text-[11px] font-medium text-zinc-600 dark:text-zinc-300 leading-tight">
											Nodal track selection required for specialized learning protocols.
										</p>
										<a href="/app/explore/{enrollment.course.id}" class="mt-3 inline-block text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline italic">Select Track →</a>
									</div>
								{/if}

								{#if enrollment.status === 'active'}
									<div class="mt-auto mb-8 space-y-3">
										<div class="flex items-center justify-between">
											<span class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Node Completion</span>
											<span class={`text-[10px] font-black tracking-tighter ${enrollment.progressPercent >= 100 ? 'text-emerald-500' : 'text-blue-600'}`}>
												{enrollment.progressPercent}% Verified
											</span>
										</div>
										<div class="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
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
										class={`w-full flex items-center justify-center gap-3 py-4 ${RADIUS.button} text-[11px] font-black uppercase tracking-widest transition-all ${
											enrollment.progressPercent >= 100
												? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-500/20'
												: 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xl hover:-translate-y-1'
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
										<div class="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
											<p class="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1 italic">Awaiting Clearance</p>
											<p class="text-[11px] font-medium text-zinc-500 leading-tight">
												Your credentials are being verified by the centralized nodal authority.
											</p>
										</div>
										<a
											href="/app/payments?courseId={enrollment.course.id}"
											class={`w-full flex items-center justify-center gap-2 py-4 ${RADIUS.button} bg-linear-to-br from-amber-500 to-orange-600 text-white text-[11px] font-black uppercase tracking-widest shadow-xl hover:shadow-orange-500/30 transition-all`}
										>
											Verification Depot <Icon name="shield" size={14} />
										</a>
									</div>
								{/if}

								<div class="mt-6 flex items-center justify-between opacity-40 pt-4 border-t border-zinc-100 dark:border-zinc-800">
									<div class="flex items-center gap-2">
										<Icon name="calendar" size={12} />
										<span class="text-[9px] font-black uppercase tracking-widest">
											{new Date(enrollment.enrolledAt).toLocaleDateString('id-ID', {
												day: '2-digit',
												month: 'short',
												year: 'numeric'
											})}
										</span>
									</div>
									<div class="flex items-center gap-2">
										<Icon name="clock" size={12} />
										<span class="text-[9px] font-black uppercase tracking-widest">
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
					<h2 class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none uppercase italic">Performance Pulse</h2>
					<p class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">Cross-Nodal Analytics</p>
				</div>
				<div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm border border-blue-500/20">
					<Icon name="bar-chart-2" size={20} />
				</div>
			</div>

			<div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
				{#if data.tab === 'progress' && data.stats && 'totalCourses' in data.stats}
					{#each [
						{ label: 'Protocols Enrolled', value: data.stats.totalCourses || 0, icon: 'book', color: 'text-blue-600', bg: 'bg-blue-500/5' },
						{ label: 'Verified Complete', value: data.stats.completedCourses || 0, icon: 'check-circle', color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
						{ label: 'Nodes Processed', value: data.stats.totalLessonsCompleted || 0, icon: 'layers', color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
						{ label: 'Avg Efficiency', value: data.stats.avgScore ? `${data.stats.avgScore}%` : '-', icon: 'target', color: 'text-amber-500', bg: 'bg-amber-500/5' }
					] as stat}
						<div class={`p-6 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} flex flex-col items-center text-center group hover:-translate-y-1 ${TRANSITION.all}`}>
							<div class={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
								<Icon name={stat.icon} size={24} />
							</div>
							<p class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none mb-2">{stat.value}</p>
							<p class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
						</div>
					{/each}
				{/if}
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
				<!-- Ledger Flow (Submissions) -->
				<div class="lg:col-span-8">
					<div class="mb-6 flex items-center gap-4">
						<div class="h-8 w-1 rounded-full bg-blue-600"></div>
						<h3 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Protocol Ledger</h3>
					</div>

					<div class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.card}`}>
						<div class="p-1 px-8 bg-linear-to-r from-blue-600/10 via-indigo-500/10 to-transparent h-1"></div>
						<div class="overflow-x-auto">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
										<th class="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol Node</th>
										<th class="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Action Type</th>
										<th class="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Efficiency</th>
										<th class="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Clearance</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
									{#if !data.submissions || data.submissions.length === 0}
										<tr>
											<td colspan="4" class="px-8 py-20 text-center text-xs font-medium text-zinc-400 italic">No historical data found in the nodal ledger.</td>
										</tr>
									{:else}
										{#each data.submissions as sub}
											<tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
												<td class="px-8 py-5">
													<p class="text-xs font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-1">{sub.courseTitle}</p>
													<p class="text-[10px] font-medium text-zinc-400 italic">{sub.lessonTitle || 'System Node'}</p>
												</td>
												<td class="px-8 py-5">
													<div class={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${sub.type === 'action' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
														<Icon name={sub.type === 'action' ? 'zap' : 'book'} size={10} />
														{sub.type}
													</div>
												</td>
												<td class="px-8 py-5">
													{#if sub.score !== null}
														<div class="flex items-center gap-2">
															<span class={`text-sm font-black tracking-tighter ${sub.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
																{sub.score}/100
															</span>
															<div class="h-1 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
																<div class={`h-full ${sub.score >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} style="width: {sub.score}%"></div>
															</div>
														</div>
													{:else}
														<span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">Awaiting Audit</span>
													{/if}
												</td>
												<td class="px-8 py-5">
													<p class="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">
														{new Date(sub.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
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
				<div class="lg:col-span-4 space-y-8">
					<div class="mb-6 flex items-center gap-4">
						<div class="h-8 w-1 rounded-full bg-indigo-600"></div>
						<h3 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Specializations</h3>
					</div>

					<div class={`p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} relative overflow-hidden`}>
						<div class="absolute -right-4 -bottom-4 text-8xl opacity-5 grayscale rotate-12 pointer-events-none uppercase font-black tracking-tighter leading-none">Node</div>
						{#if data.certificates && data.certificates.length > 0}
							<div class="space-y-6 relative z-10">
								{#each data.certificates.slice(0, 3) as cert}
									<div class="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 shadow-sm group hover:border-indigo-500/30 transition-colors">
										<div class="flex items-center gap-4">
											<div class="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-sm">
												<Icon name="award" size={20} />
											</div>
											<div>
												<p class="text-[11px] font-black text-zinc-900 dark:text-white uppercase leading-none mb-1">{cert.courseTitle}</p>
												<p class="text-[9px] font-bold text-zinc-400 italic font-mono lowercase tracking-tighter">#{cert.serial.split('-').pop()}</p>
											</div>
										</div>
									</div>
								{/each}
								<a href="/app/learning?tab=certificates" class="block text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline italic">Access All Credentials →</a>
							</div>
						{:else}
							<div class="text-center py-10 opacity-40">
								<Icon name="award" size={48} class="mx-auto mb-4" />
								<p class="text-xs font-black uppercase tracking-widest">No Seals Verified</p>
							</div>
						{/if}
					</div>

					<!-- Strategic Tip -->
					<div class={`${RADIUS.card} bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden group shadow-xl`}>
						<div class="relative z-10 space-y-3">
							<h4 class="text-[10px] font-black text-blue-100 uppercase tracking-widest leading-none opacity-80">Knowledge Strategist</h4>
							<p class="text-xl font-black italic tracking-tighter leading-tight uppercase">Operational Velocity</p>
							<p class="text-[10px] font-medium leading-relaxed opacity-70">
								Protocol completion rate is optimal. Focus on specialized action items in Week 3 to maximize track-specific nodal growth.
							</p>
						</div>
						<div class="absolute -right-2 -bottom-2 text-7xl opacity-20 grayscale transition-transform group-hover:rotate-12 duration-700">🚀</div>
					</div>
				</div>
			</div>
	{:else if data.tab === 'checkpoints'}
		<PageHeader
			title="Weekly Checkpoints"
			description="Complete your weekly action items to track your progress"
		/>

		{:else if data.tab === 'checkpoints'}
			<div class="mb-10 flex items-center justify-between">
				<div>
					<h2 class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none uppercase italic">Mission Board</h2>
					<p class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">Tactical Action Ledger</p>
				</div>
				<div class="flex items-center gap-4">
					<div class="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest text-zinc-500">
						Weekly Cycle
					</div>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-6 mb-12">
				{#if data.tab === 'checkpoints' && data.stats && 'pending' in data.stats}
					{#each [
						{ label: 'Total Missions', value: data.stats.total || 0, color: 'text-blue-600', bg: 'bg-blue-500/5' },
						{ label: 'Cleared', value: data.stats.completed || 0, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
						{ label: 'Awaiting Execution', value: data.stats.pending || 0, color: 'text-amber-500', bg: 'bg-amber-500/5' }
					] as stat}
						<div class={`p-6 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} flex flex-col items-center text-center shadow-sm`}>
							<p class={`text-4xl font-black tracking-tighter ${stat.color} leading-none mb-2`}>{stat.value}</p>
							<p class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
						</div>
					{/each}
				{/if}
			</div>

			{#if !data.checkpoints || data.checkpoints.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-center bg-zinc-50 dark:bg-zinc-800/20 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800">
					<div class="mb-6 text-6xl opacity-20">📋</div>
					<h3 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white mb-2 uppercase italic">No Active Missions</h3>
					<p class="mb-8 max-w-sm text-sm font-medium text-zinc-500 dark:text-zinc-400">
						You are not currently assigned to any tactical learning cohorts. Initialize your course selection to activate mission protocols.
					</p>
					<a
						href="/app/learning?tab=courses"
						class={`px-8 py-3 ${RADIUS.button} bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-black uppercase tracking-widest ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-1`}
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
								class="flex w-full items-center justify-between p-8 text-left group"
								onclick={() => (expandedCheckpoint = isExpanded ? null : checkpoint.id)}
							>
								<div class="flex items-center gap-6">
									<div
										class={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black shadow-inner border transition-transform group-hover:scale-105 ${
											isCompleted
												? 'bg-emerald-500 text-white border-emerald-400'
												: overdue
													? 'bg-red-500 text-white border-red-400'
													: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700'
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
											<h3 class="text-xl font-black tracking-tighter text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase italic">{checkpoint.title}</h3>
											{#if checkpoint.track && trackLabels[checkpoint.track]}
												<span
													class={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${trackLabels[checkpoint.track].color} border border-current opacity-70`}
												>
													{trackLabels[checkpoint.track].icon} {trackLabels[checkpoint.track].label}
												</span>
											{/if}
										</div>
										<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
											{checkpoint.courseTitle} 
											<span class="h-1 w-1 rounded-full bg-zinc-300"></span> 
											Cycle {checkpoint.weekNumber}
											{#if checkpoint.dueDate}
												<span class="h-1 w-1 rounded-full bg-zinc-300"></span>
												<span class={overdue ? 'text-red-500' : ''}>
													Deadline: {new Date(checkpoint.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
												</span>
											{/if}
										</p>
									</div>
								</div>
								
								<div class="flex items-center gap-6">
									<div class={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
										isCompleted
											? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/20'
											: overdue
												? 'bg-red-500/20 text-red-600 border border-red-500/20'
												: 'bg-amber-500/20 text-amber-600 border border-amber-500/20'
									}`}>
										{isCompleted ? 'Mission Cleared' : overdue ? 'Protocol Overdue' : 'Awaiting Action'}
									</div>
									<div class={`text-zinc-400 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
										<Icon name="chevron-down" size={20} />
									</div>
								</div>
							</button>

							{#if isExpanded}
								<div class="px-8 pb-8 pt-0 animate-in slide-in-from-top-4 duration-500">
									<div class="h-px w-full bg-zinc-100 dark:bg-zinc-800 mb-8"></div>
									
									<div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
										<div class="lg:col-span-12">
											<p class="text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400 mb-8 italic">
												{checkpoint.description || 'Initialize your weekly performance log. Document all nodal successes and tactical challenges encountered during this learning cycle.'}
											</p>

											{#if isCompleted && checkpoint.submission?.notes}
												<div class="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
													<div class="absolute right-0 top-0 p-8 text-6xl opacity-5 grayscale font-black tracking-tighter leading-none pointer-events-none uppercase italic">Cleared</div>
													<h4 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4 italic">Action Log Summary</h4>
													<p class="text-sm font-medium text-zinc-900 dark:text-zinc-200 leading-relaxed italic">
														"{checkpoint.submission.notes}"
													</p>
													<div class="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4 opacity-60">
														<Icon name="clock" size={12} />
														<span class="text-[9px] font-black uppercase tracking-widest">
															Synthesized: {new Date(checkpoint.submission.submittedAt!).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
															}
														};
													}}
													class="space-y-6"
												>
													<input type="hidden" name="checkpointId" value={checkpoint.id} />
													<div class="space-y-3">
														<label
															for="notes-{checkpoint.id}"
															class="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic ml-1"
														>
															Tactical Progress Update
														</label>
														<textarea
															id="notes-{checkpoint.id}"
															name="notes"
															required
															rows="4"
															placeholder="Execute your weekly status report... What assets were deployed? What protocols were initialized?"
															class={`w-full p-6 ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 dark:bg-zinc-900 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all placeholder:italic`}
														></textarea>
													</div>
													<button
														type="submit"
														disabled={submitting === checkpoint.id}
														class={`w-full py-4 ${RADIUS.button} bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-black uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
													>
														{submitting === checkpoint.id ? 'Synthesizing Action...' : 'Confirm Mission Clearance'}
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
					<h2 class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none uppercase italic">Verified Credentials</h2>
					<p class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">Diplomatic Learning Seals</p>
				</div>
				<div class="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm border border-amber-500/20">
					<Icon name="award" size={20} />
				</div>
			</div>

			{#if !data.certificates || data.certificates.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-center bg-zinc-50 dark:bg-zinc-800/20 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800">
					<div class="mb-6 text-6xl opacity-20">📜</div>
					<h3 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white mb-2 uppercase italic">No Seals Verified</h3>
					<p class="mb-8 max-w-sm text-sm font-medium text-zinc-500 dark:text-zinc-400">
						Your professional credential portfolio is currently empty. Complete your assigned course protocols to earn official Naik Kelas verification seals.
					</p>
					<a
						href="/app/learning?tab=courses"
						class={`px-8 py-3 ${RADIUS.button} bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-black uppercase tracking-widest ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-1`}
					>
						Deploy My Protocols
					</a>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each data.certificates as cert}
						<a
							href="/app/learning/certificates/{cert.id}"
							class={`group relative overflow-hidden flex flex-col ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} ${ELEVATION.cardHover} ${TRANSITION.all} p-8`}
						>
							<!-- Decorative Watermark -->
							<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/5 transition-transform duration-1000 group-hover:scale-150"></div>
							
							<div class="relative z-10 flex flex-col h-full">
								<div class="flex items-start justify-between mb-8">
									<div class="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
										<Icon name="award" size={28} />
									</div>
									<div class="text-right">
										<p class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1 italic">Serial Number</p>
										<p class="text-[10px] font-black font-mono text-zinc-900 dark:text-white lowercase tracking-tighter">
											#{cert.serial.split('-').pop()}
										</p>
									</div>
								</div>

								<div class="flex-1">
									<h3 class="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white mb-2 leading-tight uppercase italic group-hover:text-blue-600 transition-colors">
										{cert.courseTitle}
									</h3>
									<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">
										Issued: {new Date(cert.issuedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
									</p>
								</div>

								<div class="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
									<span class="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 transition-all group-hover:tracking-[0.3em]">
										Protocol Verified
									</span>
									<div class="h-8 w-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all">
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
