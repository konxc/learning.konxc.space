<script lang="ts">
	import type { PageData } from './$types';
	import { COLOR } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data }: { data: PageData } = $props();

	const materialsByCourse = $derived(
		data.materials.reduce(
			(acc, m) => {
				if (!acc[m.courseId]) {
					acc[m.courseId] = { title: m.courseTitle, materials: [] };
				}
				acc[m.courseId].materials.push(m);
				return acc;
			},
			{} as Record<string, { title: string; materials: typeof data.materials }>
		)
	);
</script>

<svelte:head>
	<title>Materials - Naik Kelas</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class={`text-2xl font-bold ${COLOR.textPrimary}`}>Materials</h1>
		<p class={`mt-1 text-sm ${COLOR.textMuted}`}>Semua materi dari kursus Anda</p>
	</div>

	<div class="space-y-8">
		{#each Object.entries(materialsByCourse) as [courseId, course]}
			<div>
				<h2 class={`mb-4 text-lg font-semibold ${COLOR.textPrimary}`}>{course.title}</h2>
				<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each course.materials as material}
						<a
							href="/app/mentor/courses/{courseId}"
							class={`rounded-xl border p-4 ${COLOR.card} ${COLOR.cardBorder} transition-all hover:border-blue-500/50`}
						>
							<div class="flex items-start gap-3">
								<div
									class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${COLOR.neutral}`}
								>
									<Icon
										name={material.type === 'video'
											? 'play'
											: material.type === 'text'
												? 'file-text'
												: 'link'}
										size={20}
										class={COLOR.accent}
									/>
								</div>
								<div class="min-w-0 flex-1">
									<p class={`truncate font-medium ${COLOR.textPrimary}`}>
										{material.lessonTitle}
									</p>
									<p class={`mt-0.5 text-xs capitalize ${COLOR.textMuted}`}>
										{material.type}
									</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{:else}
			<div class={`rounded-xl border p-8 text-center ${COLOR.card} ${COLOR.cardBorder}`}>
				<Icon name="file" size={48} class={`mx-auto mb-4 ${COLOR.textMuted}`} />
				<p class={COLOR.textMuted}>Belum ada materi</p>
			</div>
		{/each}
	</div>
</div>
