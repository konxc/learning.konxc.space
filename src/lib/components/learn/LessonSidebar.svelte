<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { slide } from 'svelte/transition';

	interface LessonProgress {
		completedAt?: string | null;
	}

	interface Lesson {
		id: string;
		title: string;
		moduleId: string;
		isLocked?: boolean;
		progress?: LessonProgress;
	}

	interface Module {
		id: string;
		title: string;
		lessons: Lesson[];
	}

	interface LessonSidebarProps {
		modules: Module[];
		selectedLessonId: string | null;
		expandedModules: Set<string>;
		mobileMenuOpen: boolean;
		onSelectLesson: (lessonId: string) => void;
		onToggleModule: (moduleId: string) => void;
		onToggleExpandAll: () => void;
	}

	let {
		modules,
		selectedLessonId,
		expandedModules,
		mobileMenuOpen,
		onSelectLesson,
		onToggleModule,
		onToggleExpandAll
	}: LessonSidebarProps = $props();

	function getModuleProgress(module: Module) {
		const completedLessons = module.lessons.filter((l) => l.progress?.completedAt).length;
		return {
			completed: completedLessons,
			total: module.lessons.length,
			percentage: (completedLessons / module.lessons.length) * 100 || 0
		};
	}
</script>

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
				onclick={onToggleExpandAll}
			>
				{expandedModules.size === modules.length ? 'Collapse All' : 'Expand All'}
			</button>
		</div>

		<div class="space-y-4">
			{#each modules as module, i (module.id)}
				{@const modProgress = getModuleProgress(module)}
				<div
					class={`overflow-hidden rounded-2xl border-2 transition-all duration-500 ${expandedModules.has(module.id) ? 'border-blue-600/20 bg-blue-50/10 dark:bg-blue-600/5' : 'border-zinc-100 dark:border-zinc-900'}`}
				>
					<button
						class="group flex w-full items-center justify-between p-5 text-left"
						onclick={() => onToggleModule(module.id)}
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
									<div class="h-1 w-12 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
										<div
											class="h-full bg-blue-600 transition-all duration-500"
											style="width: {modProgress.percentage}%"
										></div>
									</div>
									<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase italic"
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
									onclick={() => onSelectLesson(lesson.id)}
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
