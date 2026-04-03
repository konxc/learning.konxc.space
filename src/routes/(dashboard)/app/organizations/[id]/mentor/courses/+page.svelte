<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { fly } from 'svelte/transition';
	let { data }: { data: PageData } = $props();

	let filter = $state('all');
</script>

<svelte:head>
	<title>My Courses - Mentor</title>
</svelte:head>

<PageWrapper>
	<div class={`${SPACING.page} pb-12`}>
		<PageHeader 
			title="My Assigned Courses" 
			description="Manage your curriculum, grade student submissions, and track class performance."
		/>

		<!-- Modern Tab Filter -->
		<div class="mb-10 flex items-center justify-between border-b border-zinc-100 dark:border-white/5">
			<div class="flex gap-8">
				{#each ['all', 'published', 'draft'] as type}
					<button
						type="button"
						class={`relative pb-4 text-sm font-black tracking-widest uppercase transition-all ${
							filter === type 
								? `${COLOR.accent} opacity-100` 
								: 'text-gray-400 opacity-60 hover:opacity-100'
						}`}
						onclick={() => (filter = type)}
					>
						{type}
						<span class="ml-1.5 text-[10px] opacity-40">
							({type === 'all' ? data.courses.length : data.courses.filter(c => c.status === type).length})
						</span>
						{#if filter === type}
							<div 
								class={`absolute bottom-0 left-0 h-1 w-full rounded-full ${COLOR.accentBg}`}
								in:fly={{ y: 2, duration: 300 }}
							></div>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each data.courses.filter((c) => filter === 'all' || c.status === filter) as course}
				<div
					class={`group relative flex flex-col overflow-hidden border ${COLOR.cardBorder} ${COLOR.card} ${RADIUS.card} ${ELEVATION.base} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/5`}
				>
					<!-- Thumbnail Area with Badge Overlay -->
					<div class="relative h-52 w-full overflow-hidden">
						{#if course.thumbnailUrl}
							<img
								src={course.thumbnailUrl}
								alt={course.title}
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								loading="lazy"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-white/2 text-7xl group-hover:scale-110 transition-transform duration-700">
								📚
							</div>
						{/if}
						
						<!-- Status Badge Overlay -->
						<div class="absolute top-4 right-4">
							<span class={`rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md shadow-xl`}>
								{course.status}
							</span>
						</div>
					</div>

					<!-- Course Content -->
					<div class="flex flex-1 flex-col p-6">
						<div class="mb-5 flex-1">
							<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2 leading-tight group-hover:text-blue-600 transition-colors`}>
								{course.title}
							</h3>
							<p class="line-clamp-2 text-sm font-medium leading-relaxed text-gray-500 dark:text-neutral-400">
								{course.description}
							</p>
						</div>

						<!-- Stats Row -->
						<div class="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-zinc-50/50 p-4 dark:bg-white/2">
							<div class="flex flex-col">
								<span class="text-[10px] font-black tracking-widest text-gray-400 uppercase">Students</span>
								<div class="flex items-center gap-1.5 mt-0.5">
									<span class="text-xl font-black text-gray-900 dark:text-white">{course.studentCount || 0}</span>
									<span class="text-xs text-gray-400">👤</span>
								</div>
							</div>
							<div class="flex flex-col border-l border-zinc-100 pl-4 dark:border-white/10">
								<span class="text-[10px] font-black tracking-widest text-gray-400 uppercase">Pending</span>
								<div class="flex items-center gap-1.5 mt-0.5">
									<span class={`text-xl font-black ${course.pendingSubmissionsCount > 0 ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
										{course.pendingSubmissionsCount || 0}
									</span>
									<span class="text-xs text-gray-400">✍️</span>
								</div>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="space-y-3">
							<a
								href="/app/organizations/{data.membership?.orgId}/mentor/courses/{course.id}/materials"
								class={`flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 text-xs font-black text-white transition-all hover:bg-black active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200`}
							>
								<span>⚙️</span>
								Manage Materials
							</a>
							
							<a
								href="/app/organizations/{data.membership?.orgId}/mentor/courses/{course.id}/submissions"
								class={`relative flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3.5 text-xs font-black text-gray-900 transition-all hover:border-amber-400 hover:bg-amber-50/30 active:scale-[0.98] dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5`}
							>
								<span>📝</span>
								Review Submissions
								{#if course.pendingSubmissionsCount > 0}
									<span class="absolute -top-1.5 -right-1.5 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-lg ring-2 ring-white dark:ring-zinc-900">
										{course.pendingSubmissionsCount}
									</span>
								{/if}
							</a>

							<a
								href="/app/organizations/{data.membership?.orgId}/mentor/students?course={course.id}"
								class="block w-full text-center text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors uppercase pt-2"
							>
								View Class Roster →
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if data.courses.length === 0}
			<div class="flex flex-col items-center justify-center py-32 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
				<div class="mb-6 rounded-3xl bg-zinc-50 p-8 dark:bg-white/2 text-8xl">🏜️</div>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Courses Assigned</h3>
				<p class={`${TEXT.body} ${COLOR.textSecondary} max-w-sm mx-auto opacity-70`}>
					You haven't been assigned as a mentor to any courses yet. Please contact the administrator to get started.
				</p>
			</div>
		{/if}
	</div>
</PageWrapper>
