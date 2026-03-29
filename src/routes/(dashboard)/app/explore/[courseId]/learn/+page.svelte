<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import MaterialViewer from '$lib/components/MaterialViewer.svelte';
	import ActionSubmitter from '$lib/components/ActionSubmitter.svelte';
	import { onMount, tick } from 'svelte';
	import {
		COLOR,
		RADIUS,
		SPACING,
		TRANSITION,
		TEXT,
		ELEVATION,
		GRADIENT
	} from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { fly, fade, slide } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	let selectedLessonId: string | null = $state(
		data.firstLesson?.id || data.modules[0]?.lessons?.[0]?.id || null
	);
	let selectedMaterialIndex = $state(0);
	let expandedModules = $state<Set<string>>(new Set([data.modules[0]?.id || '']));
	let activeTab = $state<'content' | 'notes'>('content');
	let lessonNotes = $state<Record<string, string>>({});
	let mobileMenuOpen = $state(false);
	let savingNotes = $state<Record<string, boolean>>({});
	let notesLoaded = $state(false);

	async function loadNoteFromServer(lessonId: string) {
		try {
			const res = await fetch(`/api/notes?lessonId=${lessonId}&courseId=${data.course.id}`);
			const result = await res.json();
			if (result.note) {
				lessonNotes[lessonId] = result.note.content;
			}
		} catch (e) {
			console.error('Failed to load note:', e);
		}
	}

	async function saveNoteToServer(lessonId: string, content: string) {
		savingNotes[lessonId] = true;
		try {
			await fetch('/api/notes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lessonId, courseId: data.course.id, content })
			});
			localStorage.setItem('nk-lesson-notes', JSON.stringify(lessonNotes));
		} catch (e) {
			console.error('Failed to save note:', e);
		} finally {
			savingNotes[lessonId] = false;
		}
	}

	let debounceTimers: Record<string, any> = {};

	function handleNoteChange(lessonId: string, content: string) {
		lessonNotes[lessonId] = content;
		if (debounceTimers[lessonId]) clearTimeout(debounceTimers[lessonId]);
		debounceTimers[lessonId] = setTimeout(() => saveNoteToServer(lessonId, content), 1000);
	}

	onMount(async () => {
		const savedNotes = localStorage.getItem('nk-lesson-notes');
		if (savedNotes) {
			try {
				lessonNotes = JSON.parse(savedNotes);
			} catch (e) {}
		}

		const allLessonIds = data.modules.flatMap((m) => m.lessons.map((l) => l.id));
		for (const lessonId of allLessonIds) {
			await loadNoteFromServer(lessonId);
		}
		notesLoaded = true;
	});

	function toggleModule(moduleId: string) {
		const newSet = new Set(expandedModules);
		if (newSet.has(moduleId)) newSet.delete(moduleId);
		else newSet.add(moduleId);
		expandedModules = newSet;
	}

	function selectLesson(lessonId: string) {
		selectedLessonId = lessonId;
		selectedMaterialIndex = 0;
		if (window.innerWidth < 768) mobileMenuOpen = false;
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
		if (selectedLesson?.materials && selectedMaterialIndex < selectedLesson.materials.length - 1) {
			goToMaterial(1);
			return;
		}

		const allLessons = data.modules.flatMap((m) => m.lessons);
		const currentIndex = allLessons.findIndex((l) => l.id === selectedLessonId);

		if (currentIndex < allLessons.length - 1) {
			const nextLesson = allLessons[currentIndex + 1];
			selectLesson(nextLesson.id);
			if (!expandedModules.has(nextLesson.moduleId)) {
				expandedModules.add(nextLesson.moduleId);
			}
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

	const trackMap: Record<string, { label: string; icon: string; color: string }> = {
		creator: { label: 'Creator', icon: '🎥', color: 'text-blue-500' },
		seller: { label: 'Seller', icon: '🛒', color: 'text-emerald-500' },
		affiliate: { label: 'Affiliate', icon: '🔗', color: 'text-purple-500' }
	};
</script>

<svelte:head>
	<title>{selectedLesson?.title || 'Initialize'} - Protocol Cinema</title>
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
	<!-- Cinematic Command Header (Top) -->
	<header
		class="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80"
	>
		<div class="mx-auto flex h-20 items-center justify-between px-8">
			<div class="flex items-center gap-6">
				<a
					href="/app/learning"
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-all hover:border-blue-500/30 hover:text-blue-600 dark:border-zinc-800"
				>
					<Icon name="arrow-left" size={20} />
				</a>
				<div class="mr-4 h-10 w-px bg-zinc-200 dark:bg-zinc-800"></div>
				<div class="flex flex-col">
					<p
						class="mb-1 text-[9px] leading-none font-black tracking-widest text-zinc-400 uppercase italic"
					>
						Active Spec
					</p>
					<h2
						class="text-lg leading-none font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
					>
						{data.course.title}
					</h2>
				</div>
			</div>

			<div class="hidden items-center gap-8 md:flex">
				<div class="flex flex-col items-end">
					<div class="mb-1.5 flex items-center gap-3">
						<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase"
							>Completion Protocol</span
						>
						<span class="text-xs font-black text-blue-600 italic"
							>{data.progressPercent}% Verified</span
						>
					</div>
					<div
						class="h-1.5 w-48 overflow-hidden rounded-full bg-zinc-100 shadow-inner dark:bg-zinc-800"
					>
						<div
							class="h-full bg-linear-to-r from-blue-600 to-indigo-500 transition-all duration-1000"
							style="width: {data.progressPercent}%"
						></div>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<div class="h-10 w-px bg-zinc-200 dark:bg-zinc-800"></div>
					{#if data.enrollment?.track && trackMap[data.enrollment.track]}
						<div
							class="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
						>
							<span class="text-lg">{trackMap[data.enrollment.track].icon}</span>
							<span
								class="text-[10px] font-black tracking-widest text-zinc-600 uppercase italic dark:text-zinc-400"
							>
								{trackMap[data.enrollment.track].label}
							</span>
						</div>
					{/if}
				</div>
			</div>

			<button
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white md:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			>
				<Icon name={mobileMenuOpen ? 'x' : 'layers'} size={20} />
			</button>
		</div>
	</header>

	<div class="grid min-h-[calc(100vh-80px)] grid-cols-1 md:grid-cols-[380px_1fr]">
		<!-- Mission Log Sidebar -->
		<aside
			class={`max-h-[calc(100vh-80px)] overflow-y-auto border-r border-zinc-200 bg-white transition-all duration-500 dark:border-zinc-800 dark:bg-zinc-950 ${mobileMenuOpen ? 'fixed inset-0 z-40 pt-20' : 'hidden md:block'}`}
		>
			<div class="space-y-6 p-8">
				<div class="mb-8 flex items-center justify-between">
					<h3 class="text-sm font-black tracking-[0.2em] text-zinc-400 uppercase italic">
						Mission Log
					</h3>
					<button
						class="text-[10px] font-black tracking-widest text-blue-600 uppercase italic hover:underline"
						onclick={() =>
							(expandedModules =
								expandedModules.size === data.modules.length
									? new Set()
									: new Set(data.modules.map((m) => m.id)))}
					>
						{expandedModules.size === data.modules.length ? 'Collapse All' : 'Expand All'}
					</button>
				</div>

				<div class="space-y-4">
					{#each data.modules as module, i (module.id)}
						{@const modProgress = getModuleProgress(module)}
						<div
							class={`overflow-hidden rounded-2xl border-2 transition-all duration-500 ${expandedModules.has(module.id) ? 'border-blue-600/20 bg-blue-50/10 dark:bg-blue-600/5' : 'border-zinc-100 dark:border-zinc-900'}`}
						>
							<button
								class="group flex w-full items-center justify-between p-5 text-left"
								onclick={() => toggleModule(module.id)}
							>
								<div class="flex items-center gap-4">
									<div
										class={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black transition-all ${modProgress.percentage === 100 ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'} shadow-inner`}
									>
										{(i + 1).toString().padStart(2, '0')}
									</div>
									<div>
										<h4
											class="mb-1 text-sm leading-none font-black text-zinc-900 uppercase transition-colors group-hover:text-blue-600 dark:text-white"
										>
											{module.title}
										</h4>
										<div class="flex items-center gap-2">
											<div
												class="h-1 w-12 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
											>
												<div
													class="h-full bg-blue-600 transition-all duration-500"
													style="width: {modProgress.percentage}%"
												></div>
											</div>
											<span
												class="text-[9px] font-black tracking-widest text-zinc-400 uppercase italic"
												>{modProgress.completed}/{modProgress.total} Verified</span
											>
										</div>
									</div>
								</div>
								<Icon
									name="chevron-down"
									size={16}
									class={`text-zinc-300 transition-transform duration-500 ${expandedModules.has(module.id) ? 'rotate-180' : ''}`}
								/>
							</button>

							{#if expandedModules.has(module.id)}
								<div class="space-y-1 px-3 pb-4" transition:slide>
									<div class="mx-2 mb-3 h-px w-full bg-zinc-200/50 dark:bg-zinc-800/50"></div>
									{#each module.lessons as lesson (lesson.id)}
										<button
											class={`group flex w-full items-center justify-between rounded-xl p-4 transition-all ${lesson.id === selectedLessonId ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
											disabled={lesson.isLocked}
											onclick={() => selectLesson(lesson.id)}
										>
											<div class="flex items-center gap-4">
												<div
													class={`h-2 w-2 rounded-full ${lesson.id === selectedLessonId ? 'bg-white shadow-[0_0_8px_white]' : lesson.isLocked ? 'bg-zinc-300' : lesson.progress?.completedAt ? 'bg-emerald-500' : 'bg-zinc-400'}`}
												></div>
												<span
													class={`text-[11px] font-black tracking-tight uppercase italic ${lesson.isLocked ? 'text-zinc-300' : lesson.id === selectedLessonId ? 'text-white' : 'text-zinc-600 dark:text-zinc-400'}`}
												>
													{lesson.title}
												</span>
											</div>

											<div class="flex items-center gap-2">
												{#if lesson.isLocked}
													<Icon name="lock" size={14} class="text-zinc-300" />
												{:else if lesson.progress?.completedAt}
													<Icon
														name="check-circle"
														size={14}
														class={lesson.id === selectedLessonId
															? 'text-white/80'
															: 'text-emerald-500'}
													/>
												{/if}
											</div>
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</aside>

		<!-- Immersive Content Area -->
		<main class="relative bg-white p-8 md:p-12 dark:bg-zinc-950">
			{#if selectedLesson}
				<div class="mx-auto max-w-6xl">
					<!-- Top Meta / Tab Switcher -->
					<div
						class="flex flex-col justify-between gap-8 border-b border-zinc-100 pb-8 md:flex-row md:items-end dark:border-zinc-900"
					>
						<div>
							<div class="mb-3 flex items-center gap-3">
								<div
									class="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-blue-600 uppercase italic"
								>
									Active Node
								</div>
								<div class="text-[10px] font-black tracking-widest text-zinc-400 uppercase italic">
									{selectedLesson.materials.length} Strategic Assets
								</div>
							</div>
							<h1
								class="text-4xl leading-none font-black tracking-tighter text-zinc-900 uppercase italic md:text-5xl dark:text-white"
							>
								{selectedLesson.title}
							</h1>
						</div>

						<div class="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
							<button
								class={`rounded-lg px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'content' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
								onclick={() => (activeTab = 'content')}
							>
								Material Context
							</button>
							<button
								class={`rounded-lg px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'notes' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
								onclick={() => (activeTab = 'notes')}
							>
								Strategic Log
							</button>
						</div>
					</div>

					{#if activeTab === 'content'}
						<div class="space-y-6" in:fade={{ duration: 400 }}>
							{#if selectedMaterial}
								<div
									class={`relative overflow-hidden ${RADIUS.card} ${ELEVATION.card} border-4 border-zinc-950 shadow-2xl dark:border-zinc-900`}
								>
									<MaterialViewer
										material={{
											...selectedMaterial,
											type: selectedMaterial.type as 'text' | 'video' | 'link'
										}}
										lessonId={selectedLesson.id}
										courseId={data.course.id}
										onComplete={handleMaterialComplete}
									/>
								</div>

								{#if selectedMaterialIndex === selectedLesson.materials.length - 1}
									<div class="mt-8">
										<ActionSubmitter
											lessonId={selectedLesson.id}
											courseId={data.course.id}
											existingSubmission={selectedLesson.submission}
										/>
									</div>
								{/if}
							{:else}
								<div
									class="rounded-[3rem] border border-dashed border-zinc-200 bg-zinc-50 py-32 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
								>
									<Icon name="layers" size={48} class="mx-auto mb-4 text-zinc-300 opacity-20" />
									<p class="text-[10px] font-black tracking-widest text-zinc-300 uppercase italic">
										Awaiting Operational Briefing Node
									</p>
								</div>
							{/if}
						</div>
					{:else}
						<div class="space-y-6" in:fade={{ duration: 400 }}>
							<div class="mb-4 flex items-center justify-between">
								<h3 class="text-sm font-black tracking-widest text-zinc-400 uppercase italic">
									Field Notes Log
								</h3>
								<div class="flex items-center gap-2">
									{#if savingNotes[selectedLesson.id]}
										<span
											class="animate-pulse text-[10px] font-black tracking-widest text-amber-500 uppercase"
											>Syncing...</span
										>
									{:else if notesLoaded}
										<span class="text-[10px] font-black tracking-widest text-emerald-500 uppercase"
											>Encrypted & Stored</span
										>
									{/if}
								</div>
							</div>
							<textarea
								class={`min-h-[400px] w-full p-10 ${RADIUS.card} resize-none border-2 border-dashed border-zinc-200 bg-zinc-50 text-lg font-medium text-zinc-700 italic focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300`}
								placeholder="Begin tactical briefing log for this node..."
								value={lessonNotes[selectedLesson.id] || ''}
								oninput={(e) =>
									handleNoteChange(selectedLesson.id, (e.target as HTMLTextAreaElement).value)}
							></textarea>
						</div>
					{/if}

					<!-- Cinematic Navigation Controls -->
					<div
						class="grid grid-cols-1 gap-6 border-t border-zinc-100 pt-12 md:grid-cols-3 dark:border-zinc-900"
					>
						<button
							class="flex items-center justify-center gap-3 rounded-2xl border-2 border-zinc-100 py-6 text-[11px] font-black tracking-widest text-zinc-400 uppercase transition-all hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-20 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white"
							disabled={selectedMaterialIndex === 0}
							onclick={() => goToMaterial(-1)}
						>
							<Icon name="chevron-left" size={16} /> Previous Node
						</button>

						{#if selectedLesson.quiz}
							<a
								href="/app/explore/{data.course.id}/learn/quiz/{selectedLesson.quiz.id}"
								class="flex items-center justify-center gap-3 rounded-2xl bg-zinc-950 py-6 text-[11px] font-black tracking-widest text-white uppercase shadow-xl transition-all hover:-translate-y-1 dark:bg-white dark:text-zinc-950"
							>
								Operational Quiz <Icon name="zap" size={16} />
							</a>
						{:else}
							<div class="hidden md:block"></div>
						{/if}

						<button
							class="flex items-center justify-center gap-3 rounded-2xl border-2 border-zinc-100 py-6 text-[11px] font-black tracking-widest text-zinc-400 uppercase transition-all hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-20 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white"
							disabled={selectedMaterialIndex === selectedLesson.materials.length - 1}
							onclick={() => goToMaterial(1)}
						>
							Next Node <Icon name="chevron-right" size={16} />
						</button>
					</div>

					<!-- Certification Protocol Card -->
					<div
						class={`relative overflow-hidden rounded-[3rem] p-12 text-white shadow-2xl transition-all duration-1000 ${data.progressPercent === 100 ? 'bg-linear-to-br from-emerald-600 to-teal-700' : 'bg-linear-to-br from-zinc-900 to-black'}`}
					>
						<div class="absolute top-0 right-0 p-12 opacity-10">
							<Icon name="award" size={200} />
						</div>

						<div class="relative z-10 max-w-2xl">
							<div class="mb-6 h-1 w-20 rounded-full bg-white/40"></div>
							<h3
								class="mb-4 text-3xl leading-none font-black tracking-tighter uppercase italic md:text-5xl"
							>
								Operational Maturity
							</h3>
							<p class="mb-10 text-sm leading-relaxed font-medium text-white/70 italic">
								Complete all protocols within this node to unlock your verified diplomatic seal and
								professional clearance. Current progress: {data.progressPercent}%.
							</p>

							<button
								class={`inline-flex items-center gap-4 rounded-2xl px-12 py-5 text-lg font-black tracking-widest uppercase transition-all ${data.progressPercent === 100 ? 'bg-white text-emerald-600 hover:-translate-y-1 hover:shadow-2xl' : 'cursor-not-allowed border border-white/10 bg-white/10 text-white/40'}`}
								disabled={data.progressPercent < 100}
								onclick={async (e) => {
									const btn = e.currentTarget;
									btn.classList.add('opacity-80', 'cursor-not-allowed');
									try {
										const response = await fetch(`/app/explore/${data.course.id}/learn/complete`, {
											method: 'POST'
										});
										const result = await response.json();
										if (result.success) {
											window.location.href = `/app/learning/certificates/${result.certificateId}`;
										} else {
											alert(result.message || 'Node incomplete.');
										}
									} catch (err) {
										console.error(err);
									} finally {
										btn.classList.remove('opacity-80', 'cursor-not-allowed');
									}
								}}
							>
								Claim Verified Seal <Icon name="award" size={20} />
							</button>
						</div>
					</div>
				</div>
			{:else}
				<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
					<Icon name="layers" size={64} class="mb-8 text-zinc-200 dark:text-zinc-800" />
					<h2 class="text-3xl font-black tracking-tighter text-zinc-400 uppercase italic">
						Awaiting Node Selection
					</h2>
					<p class="mt-4 text-[10px] font-black tracking-[0.2em] text-zinc-300 uppercase italic">
						Initialize mission profile to proceed.
					</p>
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	@media print {
		button,
		aside,
		header {
			display: none !important;
		}
		main {
			width: 100% !important;
			padding: 0 !important;
		}
	}
</style>
