<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | null) {
		if (!date) return '-';
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
	}

	const progressColor = (percent: number) => {
		if (percent >= 100) return 'bg-green-500';
		if (percent >= 75) return 'bg-blue-500';
		if (percent >= 50) return 'bg-yellow-500';
		return 'bg-orange-500';
	};
</script>

<svelte:head>
	<title>Learning Progress - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Learning Progress"
		description="Track your learning journey and achievements"
	/>

	<!-- Stats Overview -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Total Courses</p>
			<p class={`${TEXT.h2} ${COLOR.textPrimary}`}>{data.stats.totalCourses}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Active Courses</p>
			<p class={`${TEXT.h2} ${COLOR.accent}`}>{data.stats.activeCourses}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Completed</p>
			<p class={`${TEXT.h2} text-green-500`}>{data.stats.completedCourses}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Lessons Done</p>
			<p class={`${TEXT.h2} ${COLOR.textPrimary}`}>{data.stats.totalLessonsCompleted}</p>
		</div>
	</div>

	<!-- XP & Level -->
	<div class="mb-8">
		<PageSection>
			<div class="mb-4 flex items-center justify-between">
				<div>
					<p class={`${TEXT.small} ${COLOR.textMuted}`}>Level {data.stats.level}</p>
					<p class={`${TEXT.h3} ${COLOR.accent}`}>{data.stats.xp} XP</p>
				</div>
				<span class="text-4xl">⭐</span>
			</div>
			<div class="h-3 rounded-full bg-gray-200 dark:bg-neutral-700">
				<div
					class="h-3 rounded-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-500"
					style="width: {Math.min((data.stats.xp % 500) / 5, 100)}%"
				></div>
			</div>
			<p class={`${TEXT.small} ${COLOR.textMuted} mt-2`}>
				{500 - (data.stats.xp % 500)} XP to next level
			</p>
		</PageSection>
	</div>

	<!-- Course Progress List -->
	<PageSection>
		<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Course Progress</h2>

		{#if data.courseProgress.length === 0}
			<div class="py-10 text-center">
				<p class={`${TEXT.body} ${COLOR.textMuted}`}>No courses enrolled yet.</p>
				<a href="/app/explore" class={`mt-4 inline-block ${COLOR.accent} hover:underline`}>
					Explore Courses →
				</a>
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.courseProgress as course}
					<div
						class={`flex items-center gap-4 p-4 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder}`}
					>
						<div
							class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-neutral-800"
						>
							{#if course.course.thumbnailUrl}
								<img
									src={course.course.thumbnailUrl}
									alt={course.course.title}
									class="h-full w-full rounded-lg object-cover"
								/>
							{:else}
								<span class="text-2xl">📚</span>
							{/if}
						</div>

						<div class="min-w-0 flex-1">
							<h3 class={`${TEXT.body} font-semibold ${COLOR.textPrimary} truncate`}>
								{course.course.title}
							</h3>
							<p class={`${TEXT.small} ${COLOR.textMuted}`}>
								{course.completedLessons} / {course.totalLessons} lessons
							</p>
							<div class="mt-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700">
								<div
									class={`h-2 rounded-full ${progressColor(course.progressPercent)} transition-all duration-500`}
									style="width: {course.progressPercent}%"
								></div>
							</div>
						</div>

						<div class="flex-shrink-0 text-right">
							<p
								class={`${TEXT.h3} ${course.progressPercent >= 100 ? 'text-green-500' : COLOR.accent}`}
							>
								{course.progressPercent}%
							</p>
							{#if course.completedAt}
								<span class="text-xs text-green-500">✓ Completed</span>
							{/if}
						</div>

						<a
							href="/app/explore/{course.course.id}/learn"
							class={`flex-shrink-0 ${RADIUS.button} ${COLOR.accentBg} px-4 py-2 ${TEXT.button} text-white`}
						>
							{course.progressPercent >= 100 ? 'Review' : 'Continue'}
						</a>
					</div>
				{/each}
			</div>
		{/if}
	</PageSection>
</PageWrapper>
