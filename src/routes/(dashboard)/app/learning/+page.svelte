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


{#if data.tab === 'courses'}
		{#if showSuccess}
			<div
				class={`mb-8 p-5 ${RADIUS.card} ${COLOR.success} ${TEXT.body} animate-in fade-in slide-in-from-top-4 flex items-center gap-3 border border-green-200 shadow-sm dark:border-green-900`}
				role="alert"
			>
				<span class="text-xl">✅</span>
				<div>
					<p class="font-bold">Payment Successful!</p>
					<p class="text-sm opacity-90">
						Your course access is being activated. Please refresh in a moment if the status hasn't
						changed.
					</p>
				</div>
			</div>
		{/if}

		{#if !data.enrollments || data.enrollments.length === 0}
			<PageSection>
				<div class="flex flex-col items-center justify-center py-20 text-center">
					<div class="mb-6 text-6xl">📚</div>
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-3`}>No Courses Yet</h2>
					<p class={`mb-8 max-w-sm ${COLOR.textSecondary}`}>
						Explore our course catalog and start your learning journey today.
					</p>
					<a
						href="/app/explore"
						class={`inline-flex items-center gap-2 no-underline ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-bold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg`}
					>
						Browse Courses
					</a>
				</div>
			</PageSection>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.enrollments as enrollment}
					<div
						class={`group flex flex-col ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.base} ${ELEVATION.cardHover} ${ELEVATION.transition} overflow-hidden`}
					>
						<div class="relative h-44 w-full overflow-hidden bg-gray-100">
							{#if enrollment.course.thumbnailUrl}
								<img
									src={enrollment.course.thumbnailUrl}
									alt={enrollment.course.title}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100"
								>
									<span class="text-5xl">📚</span>
								</div>
							{/if}

							<div class="absolute top-3 right-3 flex flex-col items-end gap-1.5">
								{#if enrollment.status === 'active'}
									<span
										class="rounded-full bg-green-500/90 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-sm"
									>
										Active
									</span>
								{:else if enrollment.status === 'pending'}
									<span
										class="rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-sm"
									>
										Pending
									</span>
								{/if}
								{#if enrollment.track && trackInfo[enrollment.track]}
									<span
										class={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide uppercase backdrop-blur-sm ${trackInfo[enrollment.track].color}`}
									>
										{trackInfo[enrollment.track].icon}
										{trackInfo[enrollment.track].label}
									</span>
								{/if}
							</div>
						</div>

						<div class="flex flex-1 flex-col p-5">
							{#if 'cohortName' in enrollment && enrollment.cohortName}
								<p class="mb-2 text-[10px] font-black tracking-widest text-blue-600 uppercase">
									📅 {enrollment.cohortName}
								</p>
							{/if}

							<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-1 line-clamp-2 leading-snug`}>
								{enrollment.course.title}
							</h3>
							{#if 'description' in enrollment.course && enrollment.course.description}
								<p class={`${TEXT.small} ${COLOR.textSecondary} mb-4 line-clamp-2`}>
									{enrollment.course.description}
								</p>
							{/if}

							{#if enrollment.status === 'active' && !enrollment.track}
								<div class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
									<p class="text-xs font-bold text-amber-700">⚡ Belum pilih jalur specialisasi!</p>
									<p class="mt-0.5 text-[11px] text-amber-600">
										Pilih jalur Creator, Seller, atau Affiliator untuk pengalaman belajar lebih
										terarah.
									</p>
									<a
										href="/app/explore/{enrollment.course.id}"
										class="mt-2 inline-block text-[11px] font-bold text-amber-700 underline underline-offset-2"
									>
										Pilih Jalur Sekarang →
									</a>
								</div>
							{/if}

							{#if enrollment.status === 'active'}
								<div class="mt-auto mb-5">
									<div class="mb-2 flex items-center justify-between">
										<span class={`text-xs font-semibold ${COLOR.textMuted}`}>
											{enrollment.completedLessons} / {enrollment.totalLessons} lessons
										</span>
										<span
											class={`text-xs font-black ${enrollment.progressPercent >= 100 ? 'text-green-600' : 'text-blue-600'}`}
										>
											{enrollment.progressPercent}%
										</span>
									</div>
									<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
										<div
											class={`h-full rounded-full transition-all duration-700 ${
												enrollment.progressPercent >= 100
													? 'bg-green-500'
													: 'bg-linear-to-r from-blue-500 to-indigo-600'
											}`}
											style="width: {enrollment.progressPercent}%"
										></div>
									</div>
									{#if enrollment.progressPercent >= 100}
										<p class="mt-2 text-center text-xs font-bold text-green-600">
											🎉 Course Complete!
										</p>
									{/if}
								</div>

								<a
									href="/app/explore/{enrollment.course.id}/learn"
									class={`block w-full text-center no-underline ${RADIUS.button} font-bold ${TEXT.button} ${TRANSITION.all} py-3.5 ${
										enrollment.progressPercent >= 100
											? 'bg-green-600 text-white hover:bg-green-700'
											: `${COLOR.accentBg} text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-lg`
									}`}
								>
									{enrollment.progressPercent === 0
										? 'Start Learning →'
										: enrollment.progressPercent >= 100
											? 'Review Course'
											: 'Continue Learning →'}
								</a>
							{:else if enrollment.status === 'pending'}
								<div class={`mt-auto ${SPACING.cardPadding} ${RADIUS.button} ${COLOR.warning} mb-4`}>
									{#if 'paymentProofStatus' in enrollment && enrollment.paymentProofStatus === 'pending'}
										<div class="flex items-center gap-2">
											<span class="text-base">⏳</span>
											<p class={`${COLOR.textSecondary} ${TEXT.small} font-semibold`}>
												Payment proof under review
											</p>
										</div>
									{:else if 'paymentProofStatus' in enrollment && enrollment.paymentProofStatus === 'rejected'}
										<p class={`${TEXT.small} mb-3 font-bold text-red-600`}>
											⚠️ Payment proof rejected. Please reupload.
										</p>
										<a
											href="/app/payments?courseId={enrollment.course.id}"
											class={`inline-block no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base}`}
											>Upload Payment Proof</a
										>
									{:else}
										<p class={`${COLOR.textSecondary} mb-3 ${TEXT.small}`}>
											Upload payment proof to activate course access
										</p>
										<a
											href="/app/payments?courseId={enrollment.course.id}"
											class={`inline-block no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base}`}
											>Upload Payment Proof</a
										>
									{/if}
								</div>
							{/if}

							<div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
								<span class={`${TEXT.small} ${COLOR.textMuted}`}>
									Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('id-ID', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
									})}
								</span>
								{#if 'duration' in enrollment.course && enrollment.course.duration}
									<span class={`${TEXT.small} ${COLOR.textMuted}`}>
										{enrollment.course.duration} minggu
									</span>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{:else if data.tab === 'progress'}
		<PageHeader title="My Learning Progress" />

		<div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
			>
				<p class="text-4xl font-black text-blue-600">{'totalCourses' in (data.stats || {}) ? (data.stats as any).totalCourses : 0}</p>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Enrolled</p>
			</div>
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
			>
				<p class="text-4xl font-black text-green-600">{'completedCourses' in (data.stats || {}) ? (data.stats as any).completedCourses : 0}</p>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Completed</p>
			</div>
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
			>
				<p class="text-4xl font-black text-purple-600">{'totalLessonsCompleted' in (data.stats || {}) ? (data.stats as any).totalLessonsCompleted : 0}</p>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Lessons Done</p>
			</div>
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
			>
				<p class="text-4xl font-black text-amber-500">{'avgScore' in (data.stats || {}) ? ((data.stats as any).avgScore || '-') : '-'}</p>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Avg Score</p>
			</div>
		</div>

		<div class="mb-8">
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>📚 Course Progress</h2>
			{#if !data.enrollments || data.enrollments.length === 0}
				<div
					class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-8 text-center`}
				>
					<p class={`${COLOR.textSecondary}`}>You haven't enrolled in any courses yet.</p>
					<a href="/app/explore" class="mt-4 inline-block text-blue-600 hover:underline"
						>Browse Courses</a
					>
				</div>
			{:else}
				<div class="space-y-4">
					{#each data.enrollments as enrollment}
						<div
							class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}
						>
							<div class="flex items-start gap-4">
								<div class="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
									{#if enrollment.course.thumbnailUrl}
										<img
											src={enrollment.course.thumbnailUrl}
											alt=""
											class="h-full w-full object-cover"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center text-2xl">📚</div>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<div class="mb-1 flex items-center gap-2">
										<h3 class={`font-bold ${COLOR.textPrimary} truncate`}>
											{enrollment.course.title}
										</h3>
										{#if enrollment.track && trackLabels[enrollment.track]}
											<span
												class={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${trackLabels[enrollment.track].color}`}
											>
												{trackLabels[enrollment.track].icon}
												{trackLabels[enrollment.track].label}
											</span>
										{/if}
									</div>
									<div class="mb-2">
										<div class="mb-1 flex items-center justify-between">
											<span class={`text-xs ${COLOR.textMuted}`}>
												{enrollment.completedLessons} / {enrollment.totalLessons} lessons
											</span>
											<span
												class={`text-xs font-bold ${enrollment.progressPercent >= 100 ? 'text-green-600' : 'text-blue-600'}`}
											>
												{enrollment.progressPercent}%
											</span>
										</div>
										<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
											<div
												class="h-full rounded-full transition-all {enrollment.progressPercent >= 100
													? 'bg-green-500'
													: 'bg-blue-500'}"
												style="width: {enrollment.progressPercent}%"
											></div>
										</div>
									</div>
									<div class="flex items-center gap-3">
										<span
											class={`{ enrollment.status === 'completed' ? 'bg-green-100 text-green-700'
											: enrollment.status === 'active' ? 'bg-blue-100 text-blue-700'
											: 'bg-amber-100 text-amber-700' } rounded-full px-2.5 py-0.5
											text-[10px] font-bold
										uppercase`}
										>
											{enrollment.status}
										</span>
										{#if enrollment.progressPercent > 0 && enrollment.progressPercent < 100}
											<a
												href="/app/explore/{enrollment.course.id}/learn"
												class="text-xs text-blue-600 hover:underline"
											>
												Continue →
											</a>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{#if data.submissions && data.submissions.length > 0}
			<div class="mb-8">
				<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>📝 Recent Submissions</h2>
				<div
					class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}
				>
					<table class="w-full text-left">
						<thead>
							<tr class="border-b border-gray-100 bg-gray-50/70">
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Course</th
								>
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Type</th
								>
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Score</th
								>
								<th
									class={`px-5 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
									>Date</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-50">
							{#each data.submissions as sub}
								<tr>
									<td class="px-5 py-3">
										<p class={`text-sm font-medium ${COLOR.textPrimary}`}>{sub.courseTitle}</p>
										<p class={`text-xs ${COLOR.textMuted}`}>{sub.lessonTitle || '-'}</p>
									</td>
									<td class="px-5 py-3">
										<span
											class={`{ sub.type === 'action' ? 'bg-blue-100 text-blue-700'
											: 'bg-purple-100 text-purple-700' } rounded-full px-2 py-0.5 text-[10px] font-bold
										uppercase`}
										>
											{sub.type}
										</span>
									</td>
									<td class="px-5 py-3">
										{#if sub.score !== null}
											<span
												class={`font-bold ${sub.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}
											>
												{sub.score}/100
											</span>
										{:else}
											<span class={`text-xs ${COLOR.textMuted}`}>Pending</span>
										{/if}
									</td>
									<td class="px-5 py-3">
										<p class={`text-xs ${COLOR.textSecondary}`}>
											{new Date(sub.createdAt).toLocaleDateString('id-ID', {
												day: 'numeric',
												month: 'short'
											})}
										</p>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		{#if data.certificates && data.certificates.length > 0}
			<div>
				<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>🏆 My Certificates</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.certificates as cert}
						<div
							class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border-2 border-amber-200 bg-amber-50/50 p-5`}
						>
							<div class="mb-3 text-4xl">🏆</div>
							<h3 class={`font-bold ${COLOR.textPrimary} mb-1`}>{cert.courseTitle}</h3>
							<p class={`text-xs ${COLOR.textMuted} mb-3`}>
								Issued: {new Date(cert.issuedAt).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})}
							</p>
							<p class="mb-3 font-mono text-xs text-gray-500">{cert.serial}</p>
							<a
								href="/app/learning/certificates/{cert.id}"
								class={`text-sm font-bold text-blue-600 hover:underline`}
							>
								View Certificate →
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:else if data.tab === 'checkpoints'}
		<PageHeader
			title="Weekly Checkpoints"
			description="Complete your weekly action items to track your progress"
		/>

		<div class="mb-8 grid grid-cols-3 gap-4">
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
			>
				<p class="text-3xl font-black text-blue-600">{'total' in (data.stats || {}) ? (data.stats as any).total : 0}</p>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Total</p>
			</div>
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
			>
				<p class="text-3xl font-black text-green-600">{'completed' in (data.stats || {}) ? (data.stats as any).completed : 0}</p>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Completed</p>
			</div>
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
			>
				<p class="text-3xl font-black text-amber-500">{'pending' in (data.stats || {}) ? (data.stats as any).pending : 0}</p>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Pending</p>
			</div>
		</div>

		{#if !data.checkpoints || data.checkpoints.length === 0}
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-12 text-center`}
			>
				<div class="mb-4 text-5xl">📋</div>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Active Checkpoints</h3>
				<p class={`${COLOR.textSecondary} mb-6`}>
					You don't have any weekly checkpoints yet. This could be because you haven't joined a
					batch/cohort.
				</p>
				<a
					href="/app/learning?tab=courses"
					class={`inline-block ${RADIUS.button} ${COLOR.accentBg} px-6 py-3 ${TEXT.button} font-bold text-white`}
				>
					View My Courses
				</a>
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.checkpoints as checkpoint}
					{@const isCompleted = checkpoint.submission?.completed}
					{@const isExpanded = expandedCheckpoint === checkpoint.id}
					{@const overdue = !isCompleted && isOverdue(checkpoint.dueDate)}

					<div
						class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border-2 ${isCompleted ? 'border-green-200 bg-green-50/50' : overdue ? 'border-red-200 bg-red-50/30' : COLOR.cardBorder} overflow-hidden transition-all`}
					>
						<button
							class="flex w-full items-center justify-between p-5 text-left"
							onclick={() => (expandedCheckpoint = isExpanded ? null : checkpoint.id)}
						>
							<div class="flex items-center gap-4">
								<div
									class={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
										isCompleted
											? 'bg-green-100 text-green-600'
											: overdue
												? 'bg-red-100 text-red-600'
												: 'bg-blue-100 text-blue-600'
									}`}
								>
									{isCompleted ? '✓' : checkpoint.weekNumber}
								</div>
								<div>
									<div class="mb-1 flex items-center gap-2">
										<h3 class={`font-bold ${COLOR.textPrimary}`}>{checkpoint.title}</h3>
										{#if checkpoint.track && trackLabels[checkpoint.track]}
											<span
												class={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${trackLabels[checkpoint.track].color}`}
											>
												{trackLabels[checkpoint.track].icon}
												{trackLabels[checkpoint.track].label}
											</span>
										{/if}
									</div>
									<p class={`text-xs ${COLOR.textMuted}`}>
										{checkpoint.courseTitle} • Week {checkpoint.weekNumber}
										{#if checkpoint.dueDate}
											• Due: {new Date(checkpoint.dueDate).toLocaleDateString('id-ID', {
												day: 'numeric',
												month: 'short'
											})}
										{/if}
									</p>
								</div>
							</div>
							<div class="flex items-center gap-2">
								{#if isCompleted}
									<span class="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
										Completed
									</span>
								{:else if overdue}
									<span class="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
										Overdue
									</span>
								{:else}
									<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
										Pending
									</span>
								{/if}
								<span
									class={`text-${COLOR.textMuted} transition-transform ${isExpanded ? 'rotate-180' : ''}`}
									>▼</span
								>
							</div>
						</button>

						{#if isExpanded}
							<div class="border-t border-gray-100 px-5 pb-5">
								<p class={`${COLOR.textSecondary} mb-4`}>
									{checkpoint.description || 'Complete your weekly action items for this checkpoint.'}
								</p>

								{#if isCompleted && checkpoint.submission?.notes}
									<div class="mb-4 rounded-lg bg-gray-50 p-4">
										<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted} mb-2`}>
											Your Submission
										</p>
										<p class={`${COLOR.textPrimary}`}>{checkpoint.submission.notes}</p>
										<p class={`text-xs ${COLOR.textMuted} mt-2`}>
											Submitted: {new Date(checkpoint.submission.submittedAt!).toLocaleDateString(
												'id-ID',
												{
													day: 'numeric',
													month: 'long',
													year: 'numeric',
													hour: '2-digit',
													minute: '2-digit'
												}
											)}
										</p>
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
									>
										<input type="hidden" name="checkpointId" value={checkpoint.id} />
										<div class="mb-4">
											<label
												for="notes-{checkpoint.id}"
												class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
											>
												Notes / Progress Update
											</label>
											<textarea
												id="notes-{checkpoint.id}"
												name="notes"
												required
												rows="3"
												placeholder="What did you accomplish this week? Any challenges?"
												class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} p-3 ${TEXT.body} resize-none outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
											></textarea>
										</div>
										<button
											type="submit"
											disabled={submitting === checkpoint.id}
											class={`w-full ${RADIUS.button} ${COLOR.accentBg} py-3 ${TEXT.button} font-bold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50`}
										>
											{submitting === checkpoint.id ? 'Submitting...' : 'Mark as Complete'}
										</button>
									</form>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{:else if data.tab === 'certificates'}
		<PageHeader
			title="Sertifikat"
			description="Akses dan unduh seluruh sertifikat hasil kelulusan materi dan kursus Anda."
		/>


		<PageSection>
			{#if !data.certificates || data.certificates.length === 0}
				<div
					class={`flex flex-col items-center justify-center py-20 text-center ${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} border-dashed`}
				>
					<div class="mb-4 text-6xl">📜</div>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>
						{$page.url.searchParams.has('q') ? 'Sertifikat tidak ditemukan' : 'Belum ada sertifikat'}
					</h3>
					<p class={`${TEXT.body} ${COLOR.textSecondary} max-w-md`}>
						{$page.url.searchParams.has('q')
							? `Pencarian untuk "${$page.url.searchParams.get('q')}" tidak membuahkan hasil. Silakan coba kata kunci lain.`
							: 'Selesaikan kursus dan ujian Anda untuk mendapatkan sertifikat kelulusan resmi dari Naik Kelas.'}
					</p>
					{#if $page.url.searchParams.has('q')}
						<button
							onclick={() => {
								updateQueryParam($page.url, 'q', null, goto);
							}}
							class={`mt-6 ${TEXT.button} text-blue-600 hover:underline`}
						>
							Bersihkan pencarian
						</button>
					{/if}

				</div>
			{:else}
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.certificates as cert}
						<a
							href={`/app/learning/certificates/${cert.id}`}
							class={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} ${ELEVATION.cardHover}`}
						>
							<div
								class="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/5 transition-transform duration-500 group-hover:scale-150"
							></div>

							<div class="relative p-6">
								<div class="mb-4 flex items-start justify-between">
									<div
										class={`flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl dark:bg-blue-900/30`}
									>
										🎓
									</div>
									<span class={`${TEXT.small} ${COLOR.textMuted} font-mono`}>
										#{cert.serial.split('-').pop()}
									</span>
								</div>

								<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-1 line-clamp-2 font-bold`}>
									{cert.courseTitle}
								</h3>
								<p class={`${TEXT.small} ${COLOR.textSecondary} mb-4`}>
									Diterbitkan pada {formatDate(cert.issuedAt)}
								</p>

								<div class="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
									<span class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
										Lihat Detail
									</span>
									<svg
										class="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-1 dark:text-blue-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2.5"
											d="M14 5l7 7m0 0l-7 7m7-7H3"
										/>
									</svg>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</PageSection>
	{/if}
