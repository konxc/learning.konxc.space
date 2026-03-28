<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import MaterialViewer from '$lib/components/MaterialViewer.svelte';
	import ActionSubmitter from '$lib/components/ActionSubmitter.svelte';
	import { onMount } from 'svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let selectedModuleId: string | null = $state(data.modules[0]?.id || null);
	let selectedLessonId: string | null = $state(data.modules[0]?.lessons?.[0]?.id || null);
	let selectedMaterialIndex = $state(0);
	let expandedModules = $state<Set<string>>(new Set([data.modules[0]?.id || '']));
	let activeTab = $state<'content' | 'notes'>('content');
	let lessonNotes = $state<Record<string, string>>({});
	let mobileMenuOpen = $state(false);
	let savingNotes = $state<Record<string, boolean>>({});
	let notesLoaded = $state(false);

	async function loadNoteFromServer(lessonId: string) {
		try {
			const courseId = data.course.id;
			const res = await fetch(`/api/notes?lessonId=${lessonId}&courseId=${courseId}`);
			const result = await res.json();
			if (result.note) {
				lessonNotes[lessonId] = result.note.content;
			}
		} catch (e) {
			console.error('Failed to load note from server:', e);
		}
	}

	async function saveNoteToServer(lessonId: string, content: string) {
		savingNotes[lessonId] = true;
		try {
			const courseId = data.course.id;
			await fetch('/api/notes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lessonId, courseId, content })
			});
			localStorage.setItem('nk-lesson-notes', JSON.stringify(lessonNotes));
		} catch (e) {
			console.error('Failed to save note to server:', e);
		} finally {
			savingNotes[lessonId] = false;
		}
	}

	let debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

	function handleNoteChange(lessonId: string, content: string) {
		lessonNotes[lessonId] = content;

		if (debounceTimers[lessonId]) {
			clearTimeout(debounceTimers[lessonId]);
		}
		debounceTimers[lessonId] = setTimeout(() => {
			saveNoteToServer(lessonId, content);
		}, 1000);
	}

	onMount(async () => {
		if (data.firstLesson) {
			selectedLessonId = data.firstLesson.id;
		}

		// Load notes from local storage first (for quick display)
		const savedNotes = localStorage.getItem('nk-lesson-notes');
		if (savedNotes) {
			try {
				lessonNotes = JSON.parse(savedNotes);
			} catch (e) {
				console.error('Failed to parse notes');
			}
		}

		// Then sync with server in background
		const allLessonIds = data.modules.flatMap((m) => m.lessons.map((l) => l.id));
		for (const lessonId of allLessonIds) {
			await loadNoteFromServer(lessonId);
		}
		notesLoaded = true;
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

	function handleMaterialComplete() {
		// If there is another material in the same lesson, go to it
		if (selectedLesson?.materials && selectedMaterialIndex < selectedLesson.materials.length - 1) {
			goToMaterial(1);
			return;
		}

		// Otherwise, find the next lesson
		const allLessons = data.modules.flatMap((m) => m.lessons);
		const currentIndex = allLessons.findIndex((l) => l.id === selectedLessonId);

		if (currentIndex < allLessons.length - 1) {
			const nextLesson = allLessons[currentIndex + 1];
			selectLesson(nextLesson.id);

			// Expand the module of the next lesson if it's collapsed
			if (!expandedModules.has(nextLesson.moduleId)) {
				expandedModules.add(nextLesson.moduleId);
			}
		}
	}

	function toggleAllModules() {
		if (expandedModules.size === data.modules.length) {
			expandedModules = new Set();
		} else {
			expandedModules = new Set(data.modules.map((m) => m.id));
		}
	}

	function getModuleProgress(module: any) {
		const completedLessons = module.lessons.filter((l: any) => l.progress?.completedAt).length;
		return {
			completed: completedLessons,
			total: module.lessons.length,
			percentage: (completedLessons / module.lessons.length) * 100 || 0
		};
	}

	const brandColor = $derived(data.course.organization?.brandColor || '#2563eb');
	const brandContrastColor = '#ffffff'; // Fallback for dark backgrounds
</script>

<svelte:head>
	<title>{data.course.title} - Learn | {data.course.organization?.name || 'Naik Kelas'}</title>
</svelte:head>

<div class={`${SPACING.page} ${SPACING.section}`}>
	<!-- Mobile Menu Toggle -->
	<div class="mb-4 md:hidden">
		<button
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700"
		>
			<span>📚 {selectedLesson?.title || 'Select Lesson'}</span>
			<span>{mobileMenuOpen ? '▲' : '▼'}</span>
		</button>
	</div>

	<div
		class={`grid min-h-[calc(100vh-100px)] grid-cols-1 gap-6 md:grid-cols-[300px_1fr] ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}
	>
		<aside
			class={`h-fit overflow-y-auto md:sticky md:top-6 md:max-h-[calc(100vh-3rem)] ${RADIUS.card} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base} border border-gray-100 dark:border-neutral-800 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}
		>
			<div class="mb-8">
				<a
					href="/app/my-courses"
					class="mb-6 flex items-center gap-2 text-xs font-bold tracking-widest text-blue-600 uppercase no-underline hover:text-blue-700"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"
						></polyline></svg
					>
					Course List
				</a>
				<div class="flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<h2 class={`${TEXT.h2} ${COLOR.textPrimary} line-clamp-2`}>{data.course.title}</h2>
						<button
							class={`rounded-lg p-2 ${COLOR.neutralHover} ${TRANSITION.colors} hover:opacity-80`}
							style="color: {brandColor}"
							onclick={toggleAllModules}
							title={expandedModules.size === data.modules.length ? 'Collapse All' : 'Expand All'}
						>
							{#if expandedModules.size === data.modules.length}
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line
										x1="14"
										y1="10"
										x2="21"
										y2="3"
									/><line x1="3" y1="21" x2="10" y2="14" /></svg
								>
							{:else}
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line
										x1="21"
										y1="3"
										x2="14"
										y2="10"
									/><line x1="3" y1="21" x2="10" y2="14" /></svg
								>
							{/if}
						</button>
						<!-- Track Indicator -->
						{#if data.enrollment?.track}
							{@const trackInfo = {
								creator: {
									label: '🎥 Content Creator',
									color: 'bg-purple-100 text-purple-700 border-purple-200'
								},
								seller: {
									label: '🛒 Seller / Dropshipper',
									color: 'bg-orange-100 text-orange-700 border-orange-200'
								},
								affiliate: {
									label: '🔗 Affiliator',
									color: 'bg-teal-100 text-teal-700 border-teal-200'
								}
							}[data.enrollment.track]}
							<div
								class="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold {trackInfo?.color ||
									'bg-gray-100 text-gray-700'}"
							>
								{trackInfo?.label || data.enrollment.track}
							</div>
						{/if}
						<!-- Drip Content Indicator -->
						{#if data.dripContent?.enabled}
							<div
								class="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
							>
								📅 Week {data.dripContent.currentWeek}
							</div>
						{/if}
						<!-- Progress Bar -->
						<div class="mt-3">
							<div class="mb-1.5 flex items-center justify-between">
								<span class="text-xs font-semibold text-gray-500 dark:text-gray-400">
									{data.completedLessons} / {data.totalLessons} lessons
								</span>
								<span
									class="text-xs font-black {data.progressPercent >= 100
										? 'text-green-600 dark:text-green-400'
										: 'text-blue-600 dark:text-blue-400'}"
								>
									{data.progressPercent}%
								</span>
							</div>
							<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
								<div
									class="h-full rounded-full transition-all duration-700"
									style="width: {data.progressPercent}%; background: {brandColor};"
								></div>
							</div>
						</div>
						<p class={`${TEXT.small} ${COLOR.textMuted} mt-2 leading-relaxed`}>
							{data.course.description}
						</p>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					{#each data.modules as module (module.id)}
						{@const modProgress = getModuleProgress(module)}
						<div
							class={`overflow-hidden border ${RADIUS.small} ${COLOR.cardBorder} transition-all duration-300 ${
								expandedModules.has(module.id) ? 'shadow-md shadow-blue-500/5' : ''
							}`}
						>
							<button
								class={`flex w-full cursor-pointer items-center justify-between border-none px-4 py-3.5 ${COLOR.card} focus:ring-2 focus:ring-blue-600/70 focus:outline-none focus:ring-inset ${TRANSITION.colors} ${COLOR.neutralHover}`}
								onclick={() => toggleModule(module.id)}
								aria-expanded={expandedModules.has(module.id)}
								type="button"
							>
								<div class="flex flex-col items-start gap-1 text-left">
									<span class={`${TEXT.button} ${COLOR.textPrimary} font-bold`}>{module.title}</span
									>
									<div class="flex items-center gap-2">
										<div
											class="h-1 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800"
										>
											<div
												class="h-full transition-all duration-500"
												style="width: {modProgress.percentage}%; background: {brandColor};"
											></div>
										</div>
										<span class="text-[10px] font-medium text-gray-400"
											>{modProgress.completed}/{modProgress.total} Selesai</span
										>
									</div>
								</div>
								<div class="flex items-center gap-2">
									{#if modProgress.percentage === 100}
										<span
											class="rounded-full bg-green-500/10 px-1.5 py-0.5 text-[10px] font-bold text-green-500 uppercase"
											>Selesai</span
										>
									{/if}
									<svg
										class={`h-4 w-4 ${COLOR.textMuted} ${TRANSITION.transform} ${
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
											stroke-width="2.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
							</button>

							{#if expandedModules.has(module.id)}
								<div class={`flex flex-col p-2 ${COLOR.neutral}`}>
									{#each module.lessons as lesson (lesson.id)}
										<button
											class={`w-full rounded-lg px-3 py-2.5 text-left ${TRANSITION.all} flex items-center justify-between gap-2`}
											style={lesson.id === selectedLessonId ? `background: ${brandColor}; color: white; font-weight: bold;` : ''}
											class:bg-gray-50={lesson.isLocked}
											class:opacity-50={lesson.isLocked}
											class:cursor-not-allowed={lesson.isLocked}
											class:hover:bg-gray-100={!lesson.isLocked && lesson.id !== selectedLessonId}
											onclick={() => !lesson.isLocked && selectLesson(lesson.id)}
											type="button"
											disabled={lesson.isLocked}
										>
											<span class={`${TEXT.small} flex items-center gap-2 truncate`}>
												{#if lesson.isLocked}
													🔒
												{:else if lesson.progress?.completedAt}
													✅
												{:else if lesson.weekNumber}
													<span class="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700"
														>W{lesson.weekNumber}</span
													>
												{/if}
												{lesson.title}
											</span>
											{#if lesson.progress?.completedAt && !lesson.isLocked}
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
			</div>
		</aside>

		<main class={`${RADIUS.card} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base}`}>
			{#if selectedLesson}
				<div class="mb-8 overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800">
					<div
						class="h-2 transition-all duration-500 ease-out"
						style="width: {(data.progress.filter((p) => p.completedAt).length /
							data.modules.flatMap((m) => m.lessons).length) *
							100 || 0}%; background: {brandColor};"
					></div>
					<div
						class="flex items-center justify-between px-4 py-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase"
					>
						<span>Progress Belajar</span>
						<span
							>{Math.round(
								(data.progress.filter((p) => p.completedAt).length /
									data.modules.flatMap((m) => m.lessons).length) *
									100 || 0
							)}% Complete</span
						>
					</div>
				</div>

				<div class="mb-6 border-b border-gray-100 pb-4 dark:border-neutral-800">
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>{selectedLesson.title}</h1>
					<div class="flex items-center justify-between gap-4">
						<div class="flex flex-1 items-center gap-2">
							{#each selectedLesson.materials as mat, i}
								<div
									class={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i === selectedMaterialIndex ? 'ring-2' : 'bg-gray-200 dark:bg-neutral-800'}`}
									style={i === selectedMaterialIndex ? `background: ${brandColor}; ring-color: ${brandColor}33;` : ''}
								></div>
							{/each}
						</div>
						<div class="flex items-center gap-6">
							<span class={`${TEXT.small} ${COLOR.textMuted} font-medium whitespace-nowrap`}>
								Materi {selectedMaterialIndex + 1} / {selectedLesson.materials.length}
							</span>
						</div>
					</div>
				</div>

				<div class="mb-6 flex gap-4 border-b border-gray-100 dark:border-neutral-800">
					<button
						class="px-4 py-2 text-sm font-semibold transition-all"
						style={activeTab === 'content' ? `border-bottom: 2px solid ${brandColor}; color: ${brandColor};` : 'color: #6b7280;'}
						onclick={() => (activeTab = 'content')}
					>
						Isi Materi
					</button>
					<button
						class="px-4 py-2 text-sm font-semibold transition-all"
						style={activeTab === 'notes' ? `border-bottom: 2px solid ${brandColor}; color: ${brandColor};` : 'color: #6b7280;'}
						onclick={() => (activeTab = 'notes')}
					>
						Catatan Pelajaran
					</button>
				</div>

				{#if activeTab === 'content'}
					{#if selectedLesson.materials.length > 0}
						{#if selectedMaterial}
							<MaterialViewer
								material={{
									...selectedMaterial,
									type: selectedMaterial.type as 'text' | 'video' | 'link'
								}}
								lessonId={selectedLesson.id}
								courseId={data.course.id}
								onComplete={handleMaterialComplete}
							/>

							{#if selectedMaterialIndex === selectedLesson.materials.length - 1}
								<div class="animate-in fade-in slide-in-from-bottom-4 mt-12 duration-700">
									<ActionSubmitter
										lessonId={selectedLesson.id}
										courseId={data.course.id}
										existingSubmission={selectedLesson.submission}
									/>
								</div>
							{/if}
						{:else}
							<div class="px-5 py-16 text-center">
								<p class={COLOR.textSecondary}>No material available for this lesson.</p>
							</div>
						{/if}
					{:else}
						<div class="px-5 py-16 text-center">
							<p class={`${COLOR.textSecondary} mb-2 text-lg font-medium`}>
								Materi belum tersedia.
							</p>
							<p class={`${TEXT.small} ${COLOR.textMuted}`}>
								Mohon tunggu pembaruan dari mentor Anda.
							</p>
						</div>
					{/if}
				{:else}
					<div class="animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div class="mb-3 flex items-center justify-between">
							<span class={`text-xs font-medium ${COLOR.textMuted}`}>
								{#if savingNotes[selectedLesson.id]}
									<span class="text-amber-600">Menyimpan...</span>
								{:else if notesLoaded}
									<span class="text-green-600">✓ Tersimpan</span>
								{:else}
									<span class="text-gray-400">Memuat...</span>
								{/if}
							</span>
						</div>
						<textarea
							class={`min-h-[300px] w-full p-6 ${RADIUS.card} ${COLOR.bg} border-2 border-dashed ${COLOR.cardBorder} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none ${TEXT.body} ${COLOR.textPrimary} resize-none`}
							placeholder="Tulis catatan Anda di sini... Catatan akan disimpan otomatis ke cloud."
							value={lessonNotes[selectedLesson.id] || ''}
							oninput={(e) =>
								handleNoteChange(selectedLesson.id, (e.target as HTMLTextAreaElement).value)}
						></textarea>
						<p class="mt-4 text-xs text-gray-400 italic">
							Catatan tersimpan secara otomatis dan dapat diakses dari perangkat lain.
						</p>
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
							href="/app/courses/{data.course.id}/learn/quiz/{selectedLesson.quiz.id}"
							class={`inline-flex items-center ${RADIUS.button} px-6 py-3 ${TEXT.button} font-semibold whitespace-nowrap text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
							style="background: {brandColor}"
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
					class={`mt-10 overflow-hidden ${RADIUS.card} ${SPACING.cardPadding} relative text-center text-white shadow-2xl transition-all duration-500 hover:scale-[1.01]`}
					style="background: {brandColor};"
				>
					<!-- Decorative background elements -->
					<div class="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
					<div
						class="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl"
					></div>

					<div class="relative z-10">
						<div
							class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
						>
							{#if data.course.organization?.logoUrl}
								<img src={data.course.organization.logoUrl} alt="" class="h-10 w-10 object-contain" />
							{:else}
								<span class="text-3xl">🎓</span>
							{/if}
						</div>
						<h3 class={`${TEXT.h2} mb-2 text-white`}>Selamat! Anda Hampir Selesai</h3>
						<p class="mb-8 text-white/90 duration-200 active:scale-95">
							Selesaikan semua materi untuk membuka sertifikat kelulusan resmi dari {data.course.organization?.name || 'Naik Kelas'}.
						</p>

						<div class="flex flex-col items-center gap-4">
							<button
								class={`group relative inline-flex items-center gap-3 overflow-hidden ${RADIUS.button} bg-white px-10 py-4 ${TEXT.button} text-lg font-bold ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-1 hover:shadow-2xl active:scale-95`}
								style="color: {brandColor}; text-shadow: none;"
								onclick={async (e) => {
									const btn = e.currentTarget;
									btn.classList.add('opacity-80', 'cursor-not-allowed');
									try {
										const response = await fetch(`/app/courses/${data.course.id}/learn/complete`, {
											method: 'POST'
										});
										const result = await response.json();
										if (result.success) {
											window.location.href = `/app/certificates/${result.certificateId}`;
										} else {
											alert(result.message || 'Anda belum menyelesaikan semua materi.');
										}
									} catch (err) {
										console.error(err);
									} finally {
										btn.classList.remove('opacity-80', 'cursor-not-allowed');
									}
								}}
								type="button"
							>
								<span>Klaim Sertifikat Sekarang</span>
								<svg
									class="h-5 w-5 transition-transform group-hover:translate-x-1"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"
									></polyline></svg
								>
							</button>
							<span class="text-[10px] font-medium tracking-widest text-white/60 uppercase"
								>Verifikasi Instan via {data.course.organization?.name || 'Naik Kelas'}</span
							>
						</div>
					</div>
				</div>
			{:else}
				<div class="px-5 py-16 text-center">
					<p class={COLOR.textSecondary}>Please select a lesson to begin learning.</p>
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	@media print {
		/* Hide download button and info section when printing */
		button,
		:global(.certificate-info),
		:global(.certificate-header > h1),
		:global(.certificate-header > button) {
			display: none !important;
		}

		/* Remove background gradient for print */
		div:has(.certificate-body) {
			background: white !important;
			padding: 0 !important;
		}
	}
</style>
