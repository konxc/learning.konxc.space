<script lang="ts">
	import { COLOR, RADIUS, ELEVATION, TRANSITION, TEXT } from '$lib/config/design';

	interface LessonItem {
		id: string;
		title: string;
		order: number;
		completedAt: Date | null;
	}

	interface ModuleItem {
		id: string;
		title: string;
		order: number;
		lessons: LessonItem[];
	}

	interface Props {
		modules: ModuleItem[];
		activeLessonId?: string;
		courseId: string;
	}

	let { modules, activeLessonId, courseId }: Props = $props();

	let searchQuery = $state('');
	let expandedModules = $state<Set<string>>(new Set(modules.map((m) => m.id)));

	// Flatten all lessons for prev/next navigation
	const allLessons = $derived(modules.flatMap((m) => m.lessons).sort((a, b) => a.order - b.order));

	const activeIndex = $derived(allLessons.findIndex((l) => l.id === activeLessonId));

	const prevLesson = $derived(activeIndex > 0 ? allLessons[activeIndex - 1] : null);
	const nextLesson = $derived(
		activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null
	);

	// Filter modules/lessons by search
	const filteredModules = $derived(
		searchQuery.trim()
			? modules
					.map((m) => ({
						...m,
						lessons: m.lessons.filter((l) =>
							l.title.toLowerCase().includes(searchQuery.toLowerCase())
						)
					}))
					.filter((m) => m.lessons.length > 0)
			: modules
	);

	function toggleModule(moduleId: string) {
		const next = new Set(expandedModules);
		if (next.has(moduleId)) {
			next.delete(moduleId);
		} else {
			next.add(moduleId);
		}
		expandedModules = next;
	}

	function moduleProgress(m: ModuleItem): number {
		if (m.lessons.length === 0) return 0;
		const done = m.lessons.filter((l) => l.completedAt !== null).length;
		return Math.round((done / m.lessons.length) * 100);
	}
</script>

<aside
	class={`flex h-full flex-col ${COLOR.card} ${COLOR.cardBorder} border-r ${ELEVATION.base}`}
	aria-label="Course navigation sidebar"
>
	<!-- Search -->
	<div class="border-b p-4 {COLOR.cardBorder}">
		<input
			type="search"
			bind:value={searchQuery}
			placeholder="Cari pelajaran..."
			class={`w-full px-3 py-2 text-sm ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 ${COLOR.textPrimary} outline-none placeholder:text-zinc-400 ${TRANSITION.colors} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:bg-zinc-800/50`}
			aria-label="Cari pelajaran"
		/>
	</div>

	<!-- Module tree -->
	<nav class="flex-1 overflow-y-auto py-2" aria-label="Daftar modul dan pelajaran">
		{#if filteredModules.length === 0}
			<p class="px-4 py-8 text-center text-sm {COLOR.textMuted}">Tidak ada pelajaran ditemukan.</p>
		{:else}
			{#each filteredModules as mod (mod.id)}
				{@const progress = moduleProgress(mod)}
				{@const isExpanded = expandedModules.has(mod.id)}

				<!-- Module header -->
				<div class="px-2">
					<button
						onclick={() => toggleModule(mod.id)}
						class={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left ${TRANSITION.colors} hover:bg-zinc-100 dark:hover:bg-zinc-800/60`}
						aria-expanded={isExpanded}
						aria-controls="module-{mod.id}"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class={`shrink-0 ${COLOR.textMuted} ${TRANSITION.all} ${isExpanded ? 'rotate-90' : ''}`}
							aria-hidden="true"
						>
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>

						<div class="min-w-0 flex-1">
							<p class={`text-xs font-semibold ${COLOR.textPrimary} truncate`}>{mod.title}</p>
							<!-- Progress bar -->
							<div class="mt-1.5 flex items-center gap-2">
								<div class="h-1 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
									<div
										class="h-full rounded-full bg-blue-500 {TRANSITION.all}"
										style="width: {progress}%"
									></div>
								</div>
								<span class="text-[10px] font-medium {COLOR.textMuted}">{progress}%</span>
							</div>
						</div>
					</button>
				</div>

				<!-- Lessons list -->
				{#if isExpanded}
					<ul id="module-{mod.id}" class="mb-1 px-2">
						{#each mod.lessons as lesson (lesson.id)}
							{@const isActive = lesson.id === activeLessonId}
							{@const isDone = lesson.completedAt !== null}
							<li>
								<a
									href="/app/learning/courses/{courseId}/lessons/{lesson.id}"
									class={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${TRANSITION.colors} ${
										isActive
											? 'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
											: `${COLOR.textSecondary} hover:bg-zinc-100 dark:hover:bg-zinc-800/60`
									}`}
									aria-current={isActive ? 'page' : undefined}
								>
									<!-- Checkmark or bullet -->
									<span
										class={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
											isDone
												? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
												: isActive
													? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
													: 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'
										}`}
										aria-label={isDone
											? 'Selesai'
											: isActive
												? 'Sedang dipelajari'
												: 'Belum selesai'}
									>
										{#if isDone}
											✓
										{:else}
											{lesson.order}
										{/if}
									</span>
									<span class="min-w-0 flex-1 truncate">{lesson.title}</span>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			{/each}
		{/if}
	</nav>

	<!-- Prev / Next navigation -->
	<div class="flex gap-2 border-t p-3 {COLOR.cardBorder}">
		{#if prevLesson}
			<a
				href="/app/learning/courses/{courseId}/lessons/{prevLesson.id}"
				class={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold ${RADIUS.button} ${COLOR.neutral} ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-200 dark:hover:bg-zinc-700`}
				aria-label="Pelajaran sebelumnya: {prevLesson.title}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="19" y1="12" x2="5" y2="12"></line>
					<polyline points="12 19 5 12 12 5"></polyline>
				</svg>
				Sebelumnya
			</a>
		{:else}
			<div class="flex-1"></div>
		{/if}

		{#if nextLesson}
			<a
				href="/app/learning/courses/{courseId}/lessons/{nextLesson.id}"
				class={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold ${RADIUS.button} ${COLOR.accentBg} text-white ${TRANSITION.colors} hover:bg-blue-700`}
				aria-label="Pelajaran berikutnya: {nextLesson.title}"
			>
				Berikutnya
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
			</a>
		{:else}
			<div class="flex-1"></div>
		{/if}
	</div>
</aside>
