<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

    let showModuleForm = $state(false);
    let showLessonForm = $state(false);
    let showMaterialForm = $state(false);
    let selectedModuleId = $state<string | null>(null);
</script>

<svelte:head>
    <title>Manage Materials - {data.course.title}</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-5xl">
		<div class="mb-6">
			<a
				href="/dashboard/mentor/courses"
				class={`inline-flex items-center mb-3 ${TEXT.small} ${COLOR.accent} font-semibold ${TRANSITION.colors} hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
			>
				← Back to Courses
			</a>
			<div class="flex items-center justify-between gap-4">
				<PageHeader title="Manage Materials: {data.course.title}" />
				<a
					href="/dashboard/mentor/courses/{data.course.id}/materials/quiz"
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} border-2 border-blue-600 px-6 py-3 ${TEXT.button} font-semibold ${COLOR.accent} ${TRANSITION.all} hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
				>
					Manage Quiz →
				</a>
			</div>
		</div>

		<PageSection>
			<div class="mb-10">
				<div class="mb-6 flex items-center justify-between gap-4">
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Modules</h2>
					<button
						onclick={() => (showModuleForm = true)}
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
					>
						+ Add Module
					</button>
				</div>

				{#if showModuleForm}
					<div class={`mb-6 ${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
						<form method="post" action="?/createModule" use:enhance class="space-y-4">
							<input
								type="text"
								name="title"
								placeholder="Module title"
								required
								class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
							<div class="flex items-center gap-3 pt-2">
								<button
									type="submit"
									class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
								>
									Create
								</button>
								<button
									type="button"
									onclick={() => (showModuleForm = false)}
									class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-5 py-2.5 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-1`}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				{/if}

				{#if data.modules.length === 0}
					<div class="px-10 py-16 text-center">
						<p class={`${TEXT.body} ${COLOR.textMuted}`}>
							No modules yet. Create one to start building your course.
						</p>
					</div>
				{:else}
					<div class="flex flex-col gap-4">
						{#each data.modules as module}
							<div
								class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding} border-l-4 border-blue-600`}
							>
								<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-1`}>{module.title}</h3>
								<p class={`${TEXT.small} ${COLOR.textMuted}`}>Order: {module.order}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</PageSection>
	</div>
</PageWrapper>


