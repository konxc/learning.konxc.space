<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	let { data }: { data: PageData } = $props();

	let filter = $state('all');
</script>

<svelte:head>
	<title>My Courses - Mentor</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="My Assigned Courses" />

	<div class="filters mb-6 flex flex-wrap gap-3">
			<button
				type="button"
				class={`cursor-pointer ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${TRANSITION.colors} hover:bg-gray-50 ${
					filter === 'all' ? `${COLOR.accentBg} border-transparent text-white` : ''
				}`}
				onclick={() => (filter = 'all')}
			>
				All ({data.courses.length})
			</button>
			<button
				type="button"
				class={`cursor-pointer ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${TRANSITION.colors} hover:bg-gray-50 ${
					filter === 'published' ? `${COLOR.accentBg} border-transparent text-white` : ''
				}`}
				onclick={() => (filter = 'published')}
			>
				Published ({data.courses.filter((c) => c.status === 'published').length})
			</button>
			<button
				type="button"
				class={`cursor-pointer ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${TRANSITION.colors} hover:bg-gray-50 ${
					filter === 'draft' ? `${COLOR.accentBg} border-transparent text-white` : ''
				}`}
				onclick={() => (filter = 'draft')}
			>
			Draft ({data.courses.filter((c) => c.status === 'draft').length})
		</button>
	</div>

	<div class="courses-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.courses.filter((c) => filter === 'all' || c.status === filter) as course}
			<div
				class={`course-card ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.base} ${ELEVATION.hover} ${ELEVATION.transition} overflow-hidden`}
			>
				{#if course.thumbnailUrl}
					<img
						src={course.thumbnailUrl}
						alt={course.title}
						class="thumbnail h-48 w-full object-cover"
						loading="lazy"
						decoding="async"
						fetchpriority="low"
					/>
				{:else}
					<div
						class="thumbnail-placeholder flex h-48 w-full items-center justify-center bg-gray-100"
					>
						<span class="emoji text-6xl">📚</span>
					</div>
				{/if}

				<div class="course-info p-5">
					<h3 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2`}>{course.title}</h3>
					<p class={`description ${TEXT.secondary} mb-4 line-clamp-3`}>{course.description}</p>

					<div class="course-meta mb-4 flex items-center justify-between">
						<span class={`price ${COLOR.accent} text-lg font-bold`}
							>Rp {course.price.toLocaleString('id-ID')}</span
						>
						{#if course.duration}
							<span class={`duration ${COLOR.textSecondary}`}>{course.duration} weeks</span>
						{/if}
					</div>

					<div class="course-footer flex flex-col gap-3 border-t border-gray-200 pt-4">
						<span
							class={`status-badge inline-block px-3 py-1 ${RADIUS.badge} ${TEXT.small} uppercase ${
								course.status === 'published'
									? COLOR.successBg
									: `${COLOR.neutral} ${COLOR.textSecondary}`
							}`}
						>
							{course.status}
						</span>
						<div class="course-actions flex flex-col gap-2">
							<a
								href="/dashboard/mentor/courses/{course.id}/materials"
								class={`no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} text-center font-semibold ${TRANSITION.colors} hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
							>
								Manage Materials
							</a>
							<a
								href="/dashboard/mentor/courses/{course.id}/submissions"
								class={`no-underline ${RADIUS.button} ${COLOR.warningBg} ${SPACING.button} ${TEXT.button} text-center font-semibold ${TRANSITION.colors} hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
							>
								Review Submissions
							</a>
							<a
								href="/dashboard/mentor/students?course={course.id}"
								class={`no-underline ${COLOR.accent} text-center text-sm font-semibold ${TRANSITION.all} hover:translate-x-1`}
							>
								View Students →
							</a>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if data.courses.length === 0}
		<PageSection>
			<div class="text-center">
				<p class={COLOR.textSecondary}>You haven't been assigned to any courses yet</p>
			</div>
		</PageSection>
	{/if}
</PageWrapper>

