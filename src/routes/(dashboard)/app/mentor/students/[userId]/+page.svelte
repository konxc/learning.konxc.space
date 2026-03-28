<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form?: ActionData | null } = $props();

	let gradingSubmission = $state<string | null>(null);
	let gradingScore = $state(80);
	let gradingFeedback = $state('');

	const { student, courseProgress, submissions } = data;

	const trackLabels: Record<string, { label: string; color: string; icon: string }> = {
		creator: { label: 'Creator', color: 'bg-purple-100 text-purple-700', icon: '🎥' },
		seller: { label: 'Seller', color: 'bg-orange-100 text-orange-700', icon: '🛒' },
		affiliate: { label: 'Affiliate', color: 'bg-blue-100 text-blue-700', icon: '🔗' }
	};

	const getTrackLabel = (track: string | null | undefined) => {
		if (!track) return null;
		return trackLabels[track] || null;
	};

	// Group lesson details by module within each course
	function groupByModule(lessonDetails: typeof courseProgress[0]['lessonDetails']) {
		const map = new Map<string, { moduleTitle: string; moduleOrder: number; lessons: typeof lessonDetails }>();
		for (const item of lessonDetails) {
			const key = item.module.id;
			if (!map.has(key)) {
				map.set(key, { moduleTitle: item.module.title, moduleOrder: item.module.order, lessons: [] });
			}
			map.get(key)!.lessons.push(item);
		}
		return [...map.values()].sort((a, b) => a.moduleOrder - b.moduleOrder);
	}

	// Overall stats across all courses
	const totalCompleted = courseProgress.reduce((s: number, c) => s + c.completedLessons, 0);
	const totalLessons = courseProgress.reduce((s: number, c) => s + c.totalLessons, 0);
	const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

	let expandedCourses = $state<Set<string>>(new Set([courseProgress[0]?.enrollment.course.id || '']));

	function toggleCourse(courseId: string) {
		const s = new Set(expandedCourses);
		s.has(courseId) ? s.delete(courseId) : s.add(courseId);
		expandedCourses = s;
	}
</script>

<svelte:head>
	<title>{student.fullName || student.username} — Student Progress</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Student Progress">
		<a
			href="/app/mentor/students"
			class={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 no-underline hover:text-blue-700 ${TRANSITION.colors}`}
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
				<line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
			</svg>
			All Students
		</a>
	</PageHeader>

	<!-- Student Profile Card -->
	<div class={`mb-8 flex flex-col gap-6 sm:flex-row sm:items-center ${RADIUS.card} ${COLOR.card} ${ELEVATION.base} p-6 md:p-8 border ${COLOR.cardBorder}`}>
		<!-- Avatar -->
		<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-2xl font-black text-white shadow-lg">
			{(student.fullName || student.username)?.[0]?.toUpperCase() ?? 'S'}
		</div>

		<!-- Info -->
		<div class="flex-1">
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} font-black`}>
				{student.fullName || student.username}
			</h2>
			{#if student.fullName}
				<p class={`text-sm ${COLOR.textMuted}`}>@{student.username}</p>
			{/if}
			{#if student.email}
				<p class={`text-sm ${COLOR.textSecondary} mt-0.5`}>{student.email}</p>
			{/if}
		</div>

		<!-- Overall Stats -->
		<div class="flex gap-6 sm:text-right">
			<div>
				<p class={`text-[10px] font-black uppercase tracking-widest ${COLOR.textMuted}`}>Courses</p>
				<p class={`text-3xl font-black ${COLOR.textPrimary}`}>{courseProgress.length}</p>
			</div>
			<div>
				<p class={`text-[10px] font-black uppercase tracking-widest ${COLOR.textMuted}`}>Lessons Done</p>
				<p class="text-3xl font-black text-blue-600">{totalCompleted}<span class="text-base font-normal text-gray-400">/{totalLessons}</span></p>
			</div>
			<div>
				<p class={`text-[10px] font-black uppercase tracking-widest ${COLOR.textMuted}`}>Overall</p>
				<p class={`text-3xl font-black ${overallPercent >= 100 ? 'text-green-600' : 'text-blue-600'}`}>{overallPercent}%</p>
			</div>
		</div>
	</div>

	<!-- Overall Progress Bar -->
	<div class="mb-8">
		<div class="mb-2 flex items-center justify-between">
			<span class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted}`}>Overall Learning Progress</span>
			<span class={`text-xs font-black ${overallPercent >= 100 ? 'text-green-600' : 'text-blue-600'}`}>{overallPercent}%</span>
		</div>
		<div class="h-3 w-full overflow-hidden rounded-full bg-gray-100">
			<div
				class={`h-full rounded-full transition-all duration-700 ${overallPercent >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
				style="width: {overallPercent}%"
			></div>
		</div>
	</div>

	<!-- Per-Course Progress Accordion -->
	<div class="space-y-4">
		{#each courseProgress as cp (cp.enrollment.course.id)}
			{@const modules = groupByModule(cp.lessonDetails)}
			{@const isOpen = expandedCourses.has(cp.enrollment.course.id)}

			<div class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${ELEVATION.base} ${TRANSITION.all}`}>
				<!-- Course Header -->
				<button
					class={`flex w-full items-center justify-between gap-4 px-6 py-5 ${COLOR.card} text-left hover:bg-gray-50 ${TRANSITION.colors}`}
					onclick={() => toggleCourse(cp.enrollment.course.id)}
				>
					<div class="flex items-center gap-4">
						{#if cp.enrollment.course.thumbnailUrl}
							<img
								src={cp.enrollment.course.thumbnailUrl}
								alt=""
								class="h-12 w-16 rounded-lg object-cover"
							/>
						{:else}
							<div class="flex h-12 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 text-2xl">
								📚
							</div>
						{/if}
						<div>
							<h3 class={`font-bold ${COLOR.textPrimary} leading-snug`}>{cp.enrollment.course.title}</h3>
							<div class="mt-1 flex items-center gap-3 flex-wrap">
								<span class={`text-xs ${COLOR.textMuted}`}>
									{cp.completedLessons}/{cp.totalLessons} lessons
								</span>
								{#if cp.enrollment.track && getTrackLabel(cp.enrollment.track)}
									{@const track = getTrackLabel(cp.enrollment.track)}
									<span class={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${track?.color}`}>
										{track?.icon} {track?.label}
									</span>
								{/if}
								<span class={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
									cp.enrollment.status === 'active' ? `${COLOR.successBg}` : `${COLOR.warningBg}`
								}`}>
									{cp.enrollment.status}
								</span>
							</div>
						</div>
					</div>

					<div class="flex shrink-0 items-center gap-4">
						<!-- Mini progress -->
						<div class="hidden w-32 sm:block">
							<div class="mb-1 flex justify-end">
								<span class={`text-xs font-black ${cp.progressPercent >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
									{cp.progressPercent}%
								</span>
							</div>
							<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
								<div
									class={`h-full rounded-full ${cp.progressPercent >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
									style="width: {cp.progressPercent}%"
								></div>
							</div>
						</div>
						<svg class={`h-5 w-5 ${COLOR.textMuted} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
					</div>
				</button>

				<!-- Lesson Progress Detail (Expandable) -->
				{#if isOpen}
					<div class="border-t border-gray-100 bg-gray-50/50 p-4 animate-in slide-in-from-top-2 duration-300">
						{#if modules.length === 0}
							<p class={`text-center py-4 ${COLOR.textMuted} text-sm`}>No lessons available in this course yet.</p>
						{:else}
							<div class="space-y-4">
								{#each modules as mod}
									<div>
										<p class={`mb-2 text-xs font-black uppercase tracking-widest ${COLOR.textMuted} px-2`}>
											{mod.moduleTitle}
										</p>
										<div class="space-y-1">
											{#each mod.lessons as item}
												{@const isDone = item.completedAt !== null}
												<div class={`flex items-center gap-3 rounded-xl px-4 py-3 ${isDone ? 'bg-green-50' : 'bg-white'} border ${isDone ? 'border-green-100' : 'border-gray-100'} shadow-sm`}>
													<div class={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isDone ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
														{isDone ? '✓' : '○'}
													</div>
													<span class={`flex-1 text-sm font-medium ${isDone ? COLOR.textPrimary : COLOR.textSecondary}`}>
														{item.lesson.title}
													</span>
													{#if isDone && item.completedAt}
														<span class={`text-xs ${COLOR.textMuted} hidden sm:block`}>
															{new Date(item.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
														</span>
													{:else if !isDone && item.lastPositionMs && item.lastPositionMs > 0}
														<span class="text-xs text-amber-500">In progress</span>
													{/if}
												</div>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Submissions / Action Reports -->
	{#if submissions && submissions.length > 0}
		<div class="mt-8">
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>📝 Action Submissions</h3>
			<div class="space-y-4">
				{#each submissions as sub}
					{@const payload = typeof sub.payload === 'string' ? JSON.parse(sub.payload) : sub.payload}
					{@const metadata = typeof sub.metadata === 'string' ? JSON.parse(sub.metadata) : sub.metadata}
					<div class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} p-5`}>
						{#if gradingSubmission === sub.id}
							<form
								method="POST"
								action="?/grade"
								use:enhance={() => {
									return async ({ update }) => {
										await update();
										gradingSubmission = null;
										gradingFeedback = '';
									};
								}}
								class="space-y-4"
							>
								<input type="hidden" name="submissionId" value={sub.id} />
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label for="score-{sub.id}" class="mb-1.5 block text-xs font-black uppercase tracking-widest text-gray-500">
											Score (0-100)
										</label>
										<input
											id="score-{sub.id}"
											type="number"
											name="score"
											bind:value={gradingScore}
											min="0"
											max="100"
											class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
										/>
									</div>
									<div class="flex items-end gap-2">
										<button
											type="submit"
											class={`${RADIUS.button} ${COLOR.accentBg} px-4 py-2 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg`}
										>
											Save Grade
										</button>
										<button
											type="button"
											onclick={() => (gradingSubmission = null)}
											class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.all} hover:bg-gray-50`}
										>
											Cancel
										</button>
									</div>
								</div>
								<div>
									<label for="feedback-{sub.id}" class="mb-1.5 block text-xs font-black uppercase tracking-widest text-gray-500">
										Feedback (Optional)
									</label>
									<textarea
										id="feedback-{sub.id}"
										name="feedback"
										bind:value={gradingFeedback}
										rows="2"
										placeholder="Give feedback to the student..."
										class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none`}
									></textarea>
								</div>
							</form>
						{:else}
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<span class={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
											sub.type === 'action' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
										}`}>
											{sub.type}
										</span>
										<span class="text-xs text-gray-400">{sub.lesson?.title}</span>
									</div>
									{#if payload?.url}
										<a 
											href={payload.url} 
											target="_blank" 
											rel="noopener noreferrer"
											class="text-sm font-medium text-blue-600 hover:underline break-all"
										>
											{payload.url}
										</a>
									{/if}
									{#if payload?.note}
										<p class="mt-2 text-sm text-gray-600 italic">"{payload.note}"</p>
									{/if}
									<p class="mt-2 text-xs text-gray-400">
										Submitted: {new Date(sub.createdAt).toLocaleDateString('id-ID')}
									</p>
								</div>
								<div class="shrink-0 text-right">
									{#if sub.grade}
										<div class="text-right">
											<span class={`text-lg font-bold ${sub.grade.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
												{sub.grade.score}/100
											</span>
											{#if sub.grade.feedback}
												<p class="mt-1 max-w-xs text-xs text-gray-500">{sub.grade.feedback}</p>
											{/if}
											<button
												onclick={() => {
													gradingSubmission = sub.id;
													gradingScore = sub.grade?.score || 80;
													gradingFeedback = sub.grade?.feedback || '';
												}}
												class="mt-2 text-xs text-blue-600 hover:underline"
											>
												Edit Grade
											</button>
										</div>
									{:else}
										<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
											Pending Review
										</span>
										<button
											onclick={() => (gradingSubmission = sub.id)}
											class="mt-2 block text-xs text-blue-600 hover:underline"
										>
											Review
										</button>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</PageWrapper>
