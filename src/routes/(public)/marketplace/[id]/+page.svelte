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
	<meta
		name="description"
		content={data.course?.description || 'Learn expert-led tracks at Naik Kelas.'}
	/>
</svelte:head>

{#if !data.course}
	<div class="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
		<div class="mb-6 text-6xl opacity-20">🔍</div>
		<h1 class={`${TEXT.h1} mb-4`}>Course Not Found</h1>
		<p class={`${TEXT.secondary} mb-8`}>
			The course you're looking for doesn't exist or is not available.
		</p>
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
					<img
						src={data.course.thumbnailUrl}
						alt=""
						class="h-full w-full object-cover opacity-30 blur-2xl"
					/>
				{:else}
					<div class={`h-full w-full ${GRADIENT.primary} opacity-20`}></div>
				{/if}
				<div
					class="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/80 to-zinc-950"
				></div>
			</div>

			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
					<!-- Hero Text -->
					<div class="lg:col-span-8" in:fade={{ duration: 800 }}>
						<nav
							class="mb-8 flex items-center gap-2 overflow-hidden text-[10px] font-black tracking-widest text-zinc-400 uppercase"
						>
							<a href="/marketplace" class="transition-colors hover:text-blue-400">Marketplace</a>
							<span>/</span>
							<span class="truncate text-zinc-600">{data.course.title}</span>
						</nav>

						<div class="mb-6 flex items-center gap-4">
							<span
								class="rounded-full border border-blue-500/30 bg-blue-500/20 px-4 py-1.5 text-[10px] font-black tracking-widest text-blue-400 uppercase"
							>
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

						<p class="mb-10 max-w-2xl text-lg leading-relaxed font-medium text-zinc-300 md:text-xl">
							{data.course.description}
						</p>

						{#if data.mentor}
							<div class="flex items-center gap-4 border-t border-white/10 pt-8">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-xl"
								>
									{data.mentor.fullName?.[0] || 'M'}
								</div>
								<div>
									<p class="mb-1 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
										Lead Instructor
									</p>
									<p class="text-lg leading-none font-bold text-white">
										{data.mentor.fullName || data.mentor.username}
									</p>
								</div>
							</div>
						{/if}
					</div>

					<!-- Thumbnail Hero Card -->
					<div class="lg:col-span-4" in:fly={{ x: 40, duration: 800, delay: 200 }}>
						<div
							class={`overflow-hidden ${RADIUS.card} shadow-3xl group border-4 border-white/10 bg-zinc-900`}
						>
							{#if data.course.thumbnailUrl}
								<img
									src={data.course.thumbnailUrl}
									alt={data.course.title}
									class="aspect-video h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
								/>
							{:else}
								<div
									class={`flex aspect-video h-full w-full items-center justify-center ${GRADIENT.surface}`}
								>
									<span class="text-6xl">📚</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Course Details Navigation (Sticky Sub-header) -->
		<div
			class="sticky top-0 z-40 border-y border-zinc-200 bg-white/80 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80"
		>
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between">
					<div class="hidden items-center gap-8 md:flex">
						{#each ['Overview', 'Curriculum', 'Instructor', 'Reviews'] as tab}
							<button
								class="text-[11px] font-black tracking-widest text-zinc-400 uppercase transition-colors hover:text-blue-600"
								>{tab}</button
							>
						{/each}
					</div>
					<div class="flex items-center gap-6">
						<div class="flex flex-col items-end">
							<span
								class="mb-1 text-[9px] leading-none font-black tracking-widest text-zinc-400 uppercase"
								>Investment</span
							>
							<span class="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">
								Rp {data.course.price.toLocaleString('id-ID')}
							</span>
						</div>
						<a href={getEnrollUrl()}>
							<Button
								class="rounded-xl bg-blue-600 px-8 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
								>Quick Enroll</Button
							>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Layout Grid -->
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
				<!-- Informational Content -->
				<main class="space-y-20 lg:col-span-8">
					<!-- About Section -->
					<section class="space-y-8">
						<div class="flex items-center gap-3">
							<div class="h-8 w-1 rounded-full bg-blue-600"></div>
							<h2 class="text-[15px] font-black tracking-[0.2em] text-blue-600 uppercase">
								Course Architecture
							</h2>
						</div>
						<div
							class={`${TEXT.body} prose max-w-3xl text-lg leading-relaxed font-medium text-zinc-600 prose-zinc dark:text-zinc-400 dark:prose-invert`}
						>
							{data.course.description}
						</div>
					</section>

					<!-- Core Stats Section -->
					<section class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} flex flex-col gap-6 p-8`}>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-xl dark:bg-zinc-800"
							>
								⏱️
							</div>
							<div>
								<p class="mb-1 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
									Duration
								</p>
								<p class="text-xl leading-none font-black text-zinc-900 dark:text-white">
									{data.course.duration || 'Self-paced'} Weeks
								</p>
							</div>
						</div>
						<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} flex flex-col gap-6 p-8`}>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-xl dark:bg-zinc-800"
							>
								📅
							</div>
							<div>
								<p class="mb-1 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
									Last Update
								</p>
								<p class="text-xl leading-none font-black text-zinc-900 dark:text-white">
									{new Date(data.course.createdAt).toLocaleDateString('en-US', {
										month: 'short',
										year: 'numeric'
									})}
								</p>
							</div>
						</div>
						<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} flex flex-col gap-6 p-8`}>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-xl dark:bg-zinc-800"
							>
								🛡️
							</div>
							<div>
								<p class="mb-1 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
									Access Level
								</p>
								<p class="text-xl leading-none font-black text-zinc-900 dark:text-white">
									Lifetime
								</p>
							</div>
						</div>
					</section>

					<!-- Curriculum Section -->
					<section class="space-y-8">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
								What You'll Learn
							</h3>
							<span class="text-xs font-bold text-zinc-400"
								>{data.modules.length} Modules • {data.modules.reduce(
									(sum, m) => sum + (m.lessons?.length || 0),
									0
								)} Lessons</span
							>
						</div>
						<div class="overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
							{#each data.modules as mod, i}
								<div
									class="group flex items-center justify-between border-b border-zinc-100 bg-white p-7 transition-all last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60"
								>
									<div class="flex items-center gap-6">
										<div
											class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 text-sm font-black text-zinc-400 dark:bg-zinc-800"
										>
											0{i + 1}
										</div>
										<div>
											<h4 class="leading-tight font-black text-zinc-900 dark:text-white">
												{mod.title}
											</h4>
											<p class="mt-1 text-xs font-medium text-zinc-400">
												{mod.lessons?.length || 0} lessons
											</p>
										</div>
									</div>
									<Icon
										name="chevron-right"
										size={16}
										class="text-zinc-300 transition-colors group-hover:text-blue-500"
									/>
								</div>
							{/each}
							{#if data.modules.length === 0}
								<div class="p-8 text-center text-zinc-500">
									<p>Curriculum details coming soon</p>
								</div>
							{/if}
						</div>
					</section>
				</main>

				<!-- Enrollment Sidebar -->
				<aside class="lg:col-span-4">
					<div class="sticky top-28">
						<div
							class={`overflow-hidden ${RADIUS.card} border-2 border-blue-600/10 bg-white p-10 ${ELEVATION.card} shadow-3xl shadow-[0_32px_64px_-12px_rgba(37,99,235,0.1)] dark:bg-zinc-900`}
						>
							<div class="mb-10 text-center">
								<p class="mb-3 text-[10px] font-black tracking-[0.25em] text-blue-600 uppercase">
									One-Time Enrollment
								</p>
								<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
									Rp {data.course.price.toLocaleString('id-ID')}
								</p>
							</div>

							<div class="mb-10 space-y-5">
								{#each ['Career Mentorship', 'Lifetime Access', 'Verified Certification', 'Premium Community'] as feature}
									<div class="flex items-center gap-4">
										<div
											class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
										>
											<Icon name="check" size={12} strokeWidth={3} />
										</div>
										<span class="text-sm font-bold text-zinc-600 dark:text-zinc-300">{feature}</span
										>
									</div>
								{/each}
							</div>

							<a href={getEnrollUrl()} class="block">
								<Button
									class="w-full rounded-[1.25rem] bg-blue-600 py-7 text-sm font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
								>
									Start Learning Now
								</Button>
							</a>

							<div class="mt-10 border-t border-zinc-100 pt-10 text-center dark:border-zinc-800">
								<p class="text-[11px] leading-relaxed font-bold text-zinc-400">
									Already have an account? <br />
									<a href="/auth/signin" class="text-blue-600 hover:underline"
										>Log in to your profile</a
									>
								</p>
							</div>
						</div>

						<!-- Social Proof Card -->
						<div class={`mt-8 ${RADIUS.card} ${COLOR.neutral} p-8 text-center dark:bg-zinc-800/30`}>
							<div class="mb-4 flex justify-center -space-x-4">
								{#each Array(Math.min(4, data.enrollmentCount || 0)) as _, i}
									<div
										class="h-10 w-10 overflow-hidden rounded-full border-4 border-white bg-zinc-200 dark:border-zinc-900"
									>
										<img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
									</div>
								{/each}
								{#if (data.enrollmentCount || 0) > 4}
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-[10px] font-black text-white dark:border-zinc-900"
									>
										+{data.enrollmentCount - 4}
									</div>
								{/if}
							</div>
							<p class="text-xs font-bold text-zinc-500">
								Join over <span class="text-zinc-900 dark:text-white"
									>{data.enrollmentCount || 0}+ students</span
								> enrolled
							</p>
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
