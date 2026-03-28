<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	const trackLabels: Record<string, { label: string; icon: string; color: string }> = {
		creator: { label: 'Creator', icon: '🎥', color: 'bg-purple-100 text-purple-700' },
		seller: { label: 'Seller', icon: '🛒', color: 'bg-orange-100 text-orange-700' },
		affiliate: { label: 'Affiliate', icon: '🔗', color: 'bg-teal-100 text-teal-700' }
	};
</script>

<svelte:head>
	<title>My Progress — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="My Learning Progress" />

	<!-- Overall Stats -->
	<div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
		<div
			class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
		>
			<p class="text-4xl font-black text-blue-600">{data.stats.totalCourses}</p>
			<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Enrolled</p>
		</div>
		<div
			class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
		>
			<p class="text-4xl font-black text-green-600">{data.stats.completedCourses}</p>
			<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Completed</p>
		</div>
		<div
			class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
		>
			<p class="text-4xl font-black text-purple-600">{data.stats.totalLessonsCompleted}</p>
			<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Lessons Done</p>
		</div>
		<div
			class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}
		>
			<p class="text-4xl font-black text-amber-500">{data.stats.avgScore || '-'}</p>
			<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Avg Score</p>
		</div>
	</div>

	<!-- Course Progress -->
	<div class="mb-8">
		<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>📚 Course Progress</h2>
		{#if data.enrollments.length === 0}
			<div
				class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-8 text-center`}
			>
				<p class={`${COLOR.textSecondary}`}>You haven't enrolled in any courses yet.</p>
				<a href="/app/courses" class="mt-4 inline-block text-blue-600 hover:underline"
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
											href="/app/courses/{enrollment.course.id}/learn"
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

	<!-- Recent Submissions -->
	{#if data.submissions.length > 0}
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

	<!-- Certificates -->
	{#if data.certificates.length > 0}
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
							href="/app/certificates/{cert.id}"
							class={`text-sm font-bold text-blue-600 hover:underline`}
						>
							View Certificate →
						</a>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</PageWrapper>
