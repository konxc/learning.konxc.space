<script lang="ts">
	import type { PageData } from './$types';
	import { 
		COLOR, 
		TEXT, 
		RADIUS, 
		ELEVATION, 
		TRANSITION, 
		GRADIENT, 
		SPACING 
	} from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { fly, fade } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	function getEnrollUrl() {
		return `/marketplace/${data.course?.id}/checkout`;
	}
</script>

<svelte:head>
	<title>{data.course?.title || 'Course Details'} - Naik Kelas</title>
	<meta name="description" content={data.course?.description || 'Learn expert-led tracks at Naik Kelas.'} />
</svelte:head>

{#if !data.course}
	<div class="flex min-h-[60vh] flex-col items-center justify-center text-center p-8">
		<div class="mb-6 text-6xl opacity-20">🔍</div>
		<h1 class={`${TEXT.h1} mb-4`}>Course Not Found</h1>
		<p class={`${TEXT.secondary} mb-8`}>The course you're looking for doesn't exist or is not available.</p>
		<a href="/marketplace">
			<Button variant="outline">← Back to Marketplace</Button>
		</a>
	</div>
{:else}
	<div class={`min-h-screen ${COLOR.bg} selection:bg-blue-500/20`}>
		<!-- Course Overview Hero -->
		<div class="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
			<!-- Background Glows -->
			<div class="absolute inset-0 -z-10 bg-zinc-950">
				{#if data.course.thumbnailUrl}
					<img src={data.course.thumbnailUrl} alt="" class="h-full w-full object-cover opacity-30 blur-2xl" />
				{:else}
					<div class={`h-full w-full ${GRADIENT.primary} opacity-20`}></div>
				{/if}
				<div class="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/80 to-zinc-950"></div>
			</div>

			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
					<!-- Hero Text -->
					<div class="lg:col-span-8" in:fade={{ duration: 800 }}>
						<nav class="mb-8 flex items-center gap-2 overflow-hidden text-[10px] font-black tracking-widest text-zinc-400 uppercase">
							<a href="/marketplace" class="hover:text-blue-400 transition-colors">Marketplace</a>
							<span>/</span>
							<span class="text-zinc-600 truncate">{data.course.title}</span>
						</nav>
						
						<div class="mb-6 flex items-center gap-4">
							<span class="rounded-full bg-blue-500/20 border border-blue-500/30 px-4 py-1.5 text-[10px] font-black tracking-widest text-blue-400 uppercase">
								{data.course.duration || 'Flexible'} WEEKS
							</span>
							<div class="flex items-center gap-2 text-zinc-400">
								<Icon name="star" size={12} class="text-amber-400" />
								<span class="text-[10px] font-black">4.9 RATING</span>
							</div>
						</div>

						<h1 class="mb-8 text-4xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
							{data.course.title}
						</h1>

						<p class="mb-10 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
							{data.course.description}
						</p>

						{#if data.mentor}
							<div class="flex items-center gap-4 border-t border-white/10 pt-8">
								<div class="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-black text-white shadow-xl">
									{data.mentor.fullName?.[0] || 'M'}
								</div>
								<div>
									<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Lead Instructor</p>
									<p class="text-lg font-bold text-white leading-none">
										{data.mentor.fullName || data.mentor.username}
									</p>
								</div>
							</div>
						{/if}
					</div>

					<!-- Thumbnail Hero Card -->
					<div class="lg:col-span-4" in:fly={{ x: 40, duration: 800, delay: 200 }}>
						<div class={`overflow-hidden ${RADIUS.card} border-4 border-white/10 shadow-3xl bg-zinc-900 group`}>
							{#if data.course.thumbnailUrl}
								<img src={data.course.thumbnailUrl} alt={data.course.title} class="aspect-video h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
							{:else}
								<div class={`aspect-video flex h-full w-full items-center justify-center ${GRADIENT.surface}`}>
									<span class="text-6xl">📚</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Course Details Navigation (Sticky Sub-header) -->
		<div class="sticky top-0 z-40 border-y border-zinc-200 bg-white/80 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between">
					<div class="hidden items-center gap-8 md:flex">
						{#each ['Overview', 'Curriculum', 'Instructor', 'Reviews'] as tab}
							<button class="text-[11px] font-black tracking-widest text-zinc-400 uppercase hover:text-blue-600 transition-colors">{tab}</button>
						{/each}
					</div>
					<div class="flex items-center gap-6">
						<div class="flex flex-col items-end">
							<span class="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Investment</span>
							<span class="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">
								Rp {data.course.price.toLocaleString('id-ID')}
							</span>
						</div>
						<a href={getEnrollUrl()}>
							<Button class="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-xl px-8">Quick Enroll</Button>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Layout Grid -->
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
				<!-- Informational Content -->
				<main class="lg:col-span-8 space-y-20">
					<!-- About Section -->
					<section class="space-y-8">
						<div class="flex items-center gap-3">
							<div class="h-8 w-1 bg-blue-600 rounded-full"></div>
							<h2 class="font-black uppercase text-[15px] tracking-[0.2em] text-blue-600">Course Architecture</h2>
						</div>
						<div class={`${TEXT.body} max-w-3xl prose prose-zinc dark:prose-invert font-medium text-lg leading-relaxed text-zinc-600 dark:text-zinc-400`}>
							{data.course.description}
						</div>
					</section>

					<!-- Core Stats Section -->
					<section class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} p-8 flex flex-col gap-6`}>
							<div class="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-xl dark:bg-zinc-800">⏱️</div>
							<div>
								<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Duration</p>
								<p class="text-xl font-black text-zinc-900 dark:text-white leading-none">
									{data.course.duration || 'Self-paced'} Weeks
								</p>
							</div>
						</div>
						<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} p-8 flex flex-col gap-6`}>
							<div class="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-xl dark:bg-zinc-800">📅</div>
							<div>
								<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Last Update</p>
								<p class="text-xl font-black text-zinc-900 dark:text-white leading-none">
									{new Date(data.course.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
								</p>
							</div>
						</div>
						<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} p-8 flex flex-col gap-6`}>
							<div class="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-xl dark:bg-zinc-800">🛡️</div>
							<div>
								<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Access Level</p>
								<p class="text-xl font-black text-zinc-900 dark:text-white leading-none">Lifetime</p>
							</div>
						</div>
					</section>

					<!-- Mock Curriculum Section -->
					<section class="space-y-8">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white">What You'll Learn</h3>
							<span class="text-xs font-bold text-zinc-400">08 Modules • 45 Lessons</span>
						</div>
						<div class="overflow-hidden border border-zinc-200 rounded-[2rem] dark:border-zinc-800">
							{#each [1, 2, 3] as module}
								<div class="group flex items-center justify-between border-b border-zinc-100 bg-white p-7 last:border-0 hover:bg-zinc-50 transition-all dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60">
									<div class="flex items-center gap-6">
										<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 text-sm font-black text-zinc-400 dark:bg-zinc-800">
											0{module}
										</div>
										<div>
											<h4 class="font-black text-zinc-900 dark:text-white leading-tight">Professional Track Concept {module}</h4>
											<p class="text-xs font-medium text-zinc-400 mt-1">Foundations of modern industry strategy</p>
										</div>
									</div>
									<Icon name="chevron-right" size={16} class="text-zinc-300 group-hover:text-blue-500 transition-colors" />
								</div>
							{/each}
						</div>
					</section>
				</main>

				<!-- Enrollment Sidebar -->
				<aside class="lg:col-span-4">
					<div class="sticky top-28">
						<div class={`overflow-hidden ${RADIUS.card} border-2 border-blue-600/10 bg-white p-10 ${ELEVATION.card} shadow-3xl dark:bg-zinc-900 shadow-[0_32px_64px_-12px_rgba(37,99,235,0.1)]`}>
							<div class="mb-10 text-center">
								<p class="mb-3 text-[10px] font-black tracking-[0.25em] text-blue-600 uppercase">One-Time Enrollment</p>
								<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
									Rp {data.course.price.toLocaleString('id-ID')}
								</p>
							</div>

							<div class="mb-10 space-y-5">
								{#each ['Career Mentorship', 'Lifetime Access', 'Verified Certification', 'Premium Community'] as feature}
									<div class="flex items-center gap-4">
										<div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
											<Icon name="check" size={12} strokeWidth={3} />
										</div>
										<span class="text-sm font-bold text-zinc-600 dark:text-zinc-300">{feature}</span>
									</div>
								{/each}
							</div>

							<a href={getEnrollUrl()} class="block">
								<Button class="w-full py-7 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] text-sm font-black tracking-widest uppercase shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
									Start Learning Now
								</Button>
							</a>

							<div class="mt-10 border-t border-zinc-100 pt-10 text-center dark:border-zinc-800">
								<p class="text-[11px] font-bold text-zinc-400 leading-relaxed">
									Already have an account? <br />
									<a href="/auth/signin" class="text-blue-600 hover:underline">Log in to your profile</a>
								</p>
							</div>
						</div>

						<!-- Social Proof Card -->
						<div class={`mt-8 ${RADIUS.card} ${COLOR.neutral} p-8 dark:bg-zinc-800/30 text-center`}>
							<div class="flex justify-center -space-x-4 mb-4">
								{#each [1, 2, 3, 4] as i}
									<div class="h-10 w-10 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-200 overflow-hidden">
										<img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
									</div>
								{/each}
								<div class="h-10 w-10 rounded-full border-4 border-white dark:border-zinc-900 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">+50</div>
							</div>
							<p class="text-xs font-bold text-zinc-500">Join over <span class="text-zinc-900 dark:text-white">2,000+ graduates</span> from this track.</p>
						</div>
					</div>
				</aside>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom animations or layout tweaks that are complex for Tailwind 4 */
	section {
		scroll-margin-top: 100px;
	}
</style>
