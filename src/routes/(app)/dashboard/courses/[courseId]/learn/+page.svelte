<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import MaterialViewer from '$lib/components/MaterialViewer.svelte';
	import { onMount } from 'svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let selectedModuleId: string | null = $state(data.modules[0]?.id || null);
	let selectedLessonId: string | null = $state(data.modules[0]?.lessons?.[0]?.id || null);
	let selectedMaterialIndex = $state(0);
	let expandedModules = $state<Set<string>>(new Set([data.modules[0]?.id || '']));

	onMount(() => {
		if (data.firstLesson) {
			selectedLessonId = data.firstLesson.id;
		}
	});

	function toggleModule(moduleId: string) {
		if (expandedModules.has(moduleId)) {
			expandedModules.delete(moduleId);
		} else {
			expandedModules.add(moduleId);
		}
	}

	function selectLesson(lessonId: string) {
		selectedLessonId = lessonId;
		selectedMaterialIndex = 0;
	}

	const selectedLesson = $derived(
		data.modules.flatMap((m) => m.lessons).find((l) => l.id === selectedLessonId)
	);

	const selectedMaterial = $derived(selectedLesson?.materials?.[selectedMaterialIndex]);

	function goToMaterial(offset: number) {
		if (!selectedLesson?.materials) return;

		const newIndex = selectedMaterialIndex + offset;
		if (newIndex >= 0 && newIndex < selectedLesson.materials.length) {
			selectedMaterialIndex = newIndex;
		}
	}
</script>

<svelte:head>
	<title>{data.course.title} - Learn - Naik Kelas</title>
</svelte:head>

<div class="mx-auto max-w-screen-2xl px-4 py-4 md:px-6 md:py-6 lg:px-12">
	<div class="grid min-h-[calc(100vh-100px)] grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
		<aside
			class={`h-fit overflow-y-auto md:sticky md:top-6 md:max-h-[calc(100vh-3rem)] ${RADIUS.card} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base}`}
		>
			<div class="mb-5">
				<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2`}>{data.course.title}</h2>
				<p class={`${TEXT.body} ${COLOR.textMuted} text-sm leading-relaxed`}>
					{data.course.description}
				</p>
			</div>

			<div class="flex flex-col gap-2">
				{#each data.modules as module (module.id)}
					<div class={`${COLOR.cardBorder} ${RADIUS.small} overflow-hidden border`}>
						<button
							class={`w-full px-4 py-3 ${COLOR.card} flex cursor-pointer items-center justify-between border-none ${TRANSITION.colors} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
							onclick={() => toggleModule(module.id)}
							aria-expanded={expandedModules.has(module.id)}
							type="button"
						>
							<span class={`${TEXT.button} ${COLOR.textPrimary} font-semibold`}>{module.title}</span
							>
							<svg
								class={`h-5 w-5 ${COLOR.textMuted} ${TRANSITION.transform} ${
									expandedModules.has(module.id) ? 'rotate-180' : ''
								}`}
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								aria-hidden="true"
							>
								<path
									d="M5 7.5L10 12.5L15 7.5"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>

						{#if expandedModules.has(module.id)}
							<div class={`flex flex-col p-2 ${COLOR.neutral}`}>
								{#each module.lessons as lesson (lesson.id)}
									<button
										class={`w-full rounded-lg px-3 py-2.5 text-left ${TRANSITION.all} flex items-center justify-between gap-2 ${
											lesson.id === selectedLessonId
												? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
												: `${COLOR.card} ${COLOR.textPrimary} hover:${COLOR.neutralHover}`
										} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
										onclick={() => selectLesson(lesson.id)}
										type="button"
									>
										<span class={`${TEXT.small} truncate`}>{lesson.title}</span>
										{#if lesson.progress?.completedAt}
											<svg
												class="h-5 w-5 shrink-0"
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												aria-hidden="true"
											>
												<path
													d="M16.6667 5L7.50004 14.1667L3.33337 10"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										{/if}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</aside>

		<main class={`${RADIUS.card} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base}`}>
			{#if selectedLesson}
				<div class="mb-6 border-b border-gray-200 pb-4 dark:border-neutral-800">
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>{selectedLesson.title}</h1>
					<div class={`${TEXT.small} ${COLOR.textMuted}`}>
						<span>Material {selectedMaterialIndex + 1} of {selectedLesson.materials.length}</span>
					</div>
				</div>

				{#if selectedLesson.materials.length > 0}
					{#if selectedMaterial}
						<MaterialViewer
							material={{
								...selectedMaterial,
								type: selectedMaterial.type as 'text' | 'video' | 'link'
							}}
							lessonId={selectedLesson.id}
							courseId={data.course.id}
						/>
					{:else}
						<div class="px-5 py-16 text-center">
							<p class={COLOR.textSecondary}>No material available for this lesson.</p>
						</div>
					{/if}

					<div
						class="mt-8 flex items-center justify-between gap-4 border-t border-gray-200 pt-6 dark:border-neutral-800"
					>
						<button
							class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-6 py-3 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} hover:border-blue-600 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 ${
								selectedMaterialIndex === 0 ? 'cursor-not-allowed opacity-50' : ''
							}`}
							disabled={selectedMaterialIndex === 0}
							onclick={() => goToMaterial(-1)}
							type="button"
						>
							← Previous
						</button>
						{#if selectedLesson.quiz}
							<a
								href="/dashboard/courses/{data.course.id}/learn/quiz/{selectedLesson.quiz.id}"
								class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-6 py-3 ${TEXT.button} font-semibold whitespace-nowrap text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
							>
								📝 Take Quiz
							</a>
						{/if}
						<button
							class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-6 py-3 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} hover:border-blue-600 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 ${
								selectedMaterialIndex === selectedLesson.materials.length - 1
									? 'cursor-not-allowed opacity-50'
									: ''
							}`}
							disabled={selectedMaterialIndex === selectedLesson.materials.length - 1}
							onclick={() => goToMaterial(1)}
							type="button"
						>
							Next →
						</button>
					</div>

					<div
						class={`mt-8 ${RADIUS.card} ${SPACING.cardPadding} bg-linear-to-br from-gray-50 to-blue-50/50 text-center dark:from-neutral-900 dark:to-blue-950/20`}
					>
						<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Complete Course</h3>
						<p class={`${TEXT.body} ${COLOR.textMuted} mb-5`}>
							Finish all lessons and quizzes to receive your certificate
						</p>
						<button
							class={`inline-flex items-center ${RADIUS.button} bg-linear-to-r from-amber-500 to-orange-500 px-8 py-3.5 ${TEXT.button} text-lg font-bold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
							onclick={async () => {
								const response = await fetch(
									`/dashboard/courses/${data.course.id}/learn/complete`,
									{
										method: 'POST'
									}
								);
								const result = await response.json();
								if (result.success) {
									window.location.href = `/dashboard/certificates/${result.certificateId}`;
								} else {
									alert(result.message || 'Cannot complete course yet');
								}
							}}
							type="button"
						>
							🎓 Get Certificate
						</button>
					</div>
				{:else}
					<div class="px-5 py-16 text-center">
						<p class={`${COLOR.textSecondary} mb-2`}>No materials available for this lesson yet.</p>
						<p class={`${TEXT.small} ${COLOR.textMuted}`}>
							Please check back later or contact your mentor.
						</p>
					</div>
				{/if}
			{:else}
				<div class="px-5 py-16 text-center">
					<p class={COLOR.textSecondary}>Please select a lesson to begin learning.</p>
				</div>
			{/if}
		</main>
	</div>
</div>
