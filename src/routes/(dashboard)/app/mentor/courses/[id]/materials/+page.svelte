<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { formToast } from '$lib/utils/formEnhance';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let showModuleForm = $state(false);
	let showLessonForm = $state(false);
	let selectedModuleId = $state<string | null>(null);

	// Drag state for modules
	let draggedModuleId = $state<string | null>(null);
	let dragOverModuleId = $state<string | null>(null);

	// Drag state for lessons (keyed by moduleId)
	let draggedLessonId = $state<string | null>(null);
	let dragOverLessonId = $state<string | null>(null);

	// Local ordered copies for optimistic UI
	let orderedModules = $state([...data.modules]);

	// Lessons grouped by moduleId
	let lessonsByModule = $state<Record<string, typeof data.lessons>>(
		Object.fromEntries(
			data.modules.map((m) => [m.id, data.lessons.filter((l) => l.moduleId === m.id)])
		)
	);

	// --- Module drag handlers ---
	function onModuleDragStart(e: DragEvent, moduleId: string) {
		draggedModuleId = moduleId;
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}

	function onModuleDragOver(e: DragEvent, moduleId: string) {
		e.preventDefault();
		dragOverModuleId = moduleId;
	}

	function onModuleDrop(e: DragEvent, targetId: string) {
		e.preventDefault();
		if (!draggedModuleId || draggedModuleId === targetId) {
			draggedModuleId = null;
			dragOverModuleId = null;
			return;
		}

		const from = orderedModules.findIndex((m) => m.id === draggedModuleId);
		const to = orderedModules.findIndex((m) => m.id === targetId);
		if (from === -1 || to === -1) return;

		// Optimistic reorder
		const next = [...orderedModules];
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);
		orderedModules = next;

		// Persist to server
		const form = new FormData();
		form.set('orderedIds', next.map((m) => m.id).join(','));
		fetch('?/reorderModules', { method: 'POST', body: form });

		draggedModuleId = null;
		dragOverModuleId = null;
	}

	// --- Lesson drag handlers ---
	function onLessonDragStart(e: DragEvent, lessonId: string) {
		draggedLessonId = lessonId;
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}

	function onLessonDragOver(e: DragEvent, lessonId: string) {
		e.preventDefault();
		dragOverLessonId = lessonId;
	}

	function onLessonDrop(e: DragEvent, targetId: string, moduleId: string) {
		e.preventDefault();
		if (!draggedLessonId || draggedLessonId === targetId) {
			draggedLessonId = null;
			dragOverLessonId = null;
			return;
		}

		const lessons = lessonsByModule[moduleId] ?? [];
		const from = lessons.findIndex((l) => l.id === draggedLessonId);
		const to = lessons.findIndex((l) => l.id === targetId);
		if (from === -1 || to === -1) return;

		const next = [...lessons];
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);
		lessonsByModule = { ...lessonsByModule, [moduleId]: next };

		// Persist
		const form = new FormData();
		form.set('moduleId', moduleId);
		form.set('orderedIds', next.map((l) => l.id).join(','));
		fetch('?/reorderLessons', { method: 'POST', body: form });

		draggedLessonId = null;
		dragOverLessonId = null;
	}
</script>

<svelte:head>
	<title>Manage Materials - {data.course.title}</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-5xl">
		<div class="mb-6">
			<a
				href="/app/mentor/courses"
				class={`mb-3 inline-flex items-center ${TEXT.small} ${COLOR.accent} font-semibold ${TRANSITION.colors} hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
			>
				← Back to Courses
			</a>
			<div class="flex items-center justify-between gap-4">
				<PageHeader title="Manage Materials: {data.course.title}" />
				<a
					href="/app/mentor/courses/{data.course.id}/materials/quiz"
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} border-2 border-blue-600 px-6 py-3 ${TEXT.button} font-semibold ${COLOR.accent} ${TRANSITION.all} hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
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
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
					>
						+ Add Module
					</button>
				</div>

				{#if showModuleForm}
					<div class={`mb-6 ${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
						<form
							method="post"
							action="?/createModule"
							use:enhance={formToast({
								success: 'Modul berhasil dibuat',
								error: 'Gagal membuat modul',
								onSuccess: () => (showModuleForm = false)
							})}
							class="space-y-4"
						>
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
									class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
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

				{#if orderedModules.length === 0}
					<div class="px-10 py-16 text-center">
						<p class={`${TEXT.body} ${COLOR.textMuted}`}>
							No modules yet. Create one to start building your course.
						</p>
					</div>
				{:else}
					<div class="flex flex-col gap-4">
						{#each orderedModules as mod (mod.id)}
							<!-- Module row with drag handle -->
							<div
								draggable="true"
								ondragstart={(e) => onModuleDragStart(e, mod.id)}
								ondragover={(e) => onModuleDragOver(e, mod.id)}
								ondrop={(e) => onModuleDrop(e, mod.id)}
								ondragleave={() => (dragOverModuleId = null)}
								class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding} border-l-4 border-blue-600 ${TRANSITION.all} cursor-grab active:cursor-grabbing ${
									draggedModuleId === mod.id ? 'opacity-50' : 'opacity-100'
								} ${dragOverModuleId === mod.id && draggedModuleId !== mod.id ? 'ring-2 ring-blue-400' : ''}`}
								role="listitem"
							>
								<div class="flex items-start justify-between gap-4">
									<div class="flex items-center gap-3">
										<!-- Drag handle icon -->
										<span class="text-zinc-300 dark:text-zinc-600" aria-hidden="true">⠿</span>
										<div>
											<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-1`}>{mod.title}</h3>
											<p class={`${TEXT.small} ${COLOR.textMuted}`}>Order: {mod.order}</p>
										</div>
									</div>

									<!-- Add lesson button -->
									<button
										onclick={() => {
											selectedModuleId = mod.id;
											showLessonForm = true;
										}}
										class={`shrink-0 text-xs font-semibold ${COLOR.accent} ${TRANSITION.colors} hover:underline`}
									>
										+ Add Lesson
									</button>
								</div>

								<!-- Lessons list -->
								{#if lessonsByModule[mod.id]?.length}
									<ul class="mt-4 flex flex-col gap-2 pl-6">
										{#each lessonsByModule[mod.id] as lesson (lesson.id)}
											<li
												draggable="true"
												ondragstart={(e) => onLessonDragStart(e, lesson.id)}
												ondragover={(e) => onLessonDragOver(e, lesson.id)}
												ondrop={(e) => onLessonDrop(e, lesson.id, mod.id)}
												ondragleave={() => (dragOverLessonId = null)}
												class={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${COLOR.card} ${COLOR.cardBorder} ${TRANSITION.all} cursor-grab active:cursor-grabbing ${
													draggedLessonId === lesson.id ? 'opacity-50' : 'opacity-100'
												} ${dragOverLessonId === lesson.id && draggedLessonId !== lesson.id ? 'ring-2 ring-blue-300' : ''}`}
											>
												<span class="text-zinc-300 dark:text-zinc-600" aria-hidden="true">⠿</span>
												<span class={`flex-1 ${COLOR.textPrimary}`}>{lesson.title}</span>
												<span class={`${TEXT.small} ${COLOR.textMuted}`}>#{lesson.order + 1}</span>
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				<!-- Add lesson form (shown below selected module) -->
				{#if showLessonForm && selectedModuleId}
					<div class={`mt-4 ${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
						<p class={`${TEXT.small} ${COLOR.textMuted} mb-3`}>
							Adding lesson to module: <strong
								>{orderedModules.find((m) => m.id === selectedModuleId)?.title}</strong
							>
						</p>
						<form
							method="post"
							action="?/createLesson"
							use:enhance={formToast({
								success: 'Lesson berhasil dibuat',
								error: 'Gagal membuat lesson',
								onSuccess: () => {
									showLessonForm = false;
									selectedModuleId = null;
								}
							})}
							class="space-y-4"
						>
							<input type="hidden" name="moduleId" value={selectedModuleId} />
							<input
								type="text"
								name="title"
								placeholder="Lesson title"
								required
								class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
							<div class="flex items-center gap-3 pt-2">
								<button
									type="submit"
									class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
								>
									Create Lesson
								</button>
								<button
									type="button"
									onclick={() => {
										showLessonForm = false;
										selectedModuleId = null;
									}}
									class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-5 py-2.5 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none`}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				{/if}
			</div>
		</PageSection>
	</div>
</PageWrapper>
