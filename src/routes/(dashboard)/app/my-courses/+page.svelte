<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	const showSuccess = $page.url.searchParams.has('payment');

	const trackInfo: Record<string, { icon: string; label: string; color: string }> = {
		creator: { icon: '🎥', label: 'Kreator', color: 'bg-purple-100 text-purple-700' },
		seller: { icon: '🛒', label: 'Seller', color: 'bg-orange-100 text-orange-700' },
		affiliate: { icon: '🔗', label: 'Affiliator', color: 'bg-blue-100 text-blue-700' }
	};
</script>

<svelte:head>
	<title>My Courses - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="My Courses" />

	{#if showSuccess}
		<div
			class={`mb-8 p-5 ${RADIUS.card} ${COLOR.success} ${TEXT.body} animate-in fade-in slide-in-from-top-4 flex items-center gap-3 border border-green-200 shadow-sm dark:border-green-900`}
			role="alert"
		>
			<span class="text-xl">✅</span>
			<div>
				<p class="font-bold">Payment Successful!</p>
				<p class="text-sm opacity-90">
					Your course access is being activated. Please refresh in a moment if the status hasn't
					changed.
				</p>
			</div>
		</div>
	{/if}

	{#if data.enrollments.length === 0}
		<PageSection>
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<div class="mb-6 text-6xl">📚</div>
				<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-3`}>No Courses Yet</h2>
				<p class={`mb-8 max-w-sm ${COLOR.textSecondary}`}>
					Explore our course catalog and start your learning journey today.
				</p>
				<a
					href="/app/courses"
					class={`inline-flex items-center gap-2 no-underline ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-bold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg`}
				>
					Browse Courses
				</a>
			</div>
		</PageSection>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.enrollments as enrollment}
				<div
					class={`group flex flex-col ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.base} ${ELEVATION.hover} ${ELEVATION.transition} overflow-hidden`}
				>
					<!-- Thumbnail -->
					<div class="relative h-44 w-full overflow-hidden bg-gray-100">
						{#if enrollment.course.thumbnailUrl}
							<img
								src={enrollment.course.thumbnailUrl}
								alt={enrollment.course.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100"
							>
								<span class="text-5xl">📚</span>
							</div>
						{/if}

						<!-- Badges overlay -->
						<div class="absolute top-3 right-3 flex flex-col items-end gap-1.5">
							{#if enrollment.status === 'active'}
								<span
									class="rounded-full bg-green-500/90 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-sm"
								>
									Active
								</span>
							{:else if enrollment.status === 'pending'}
								<span
									class="rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-sm"
								>
									Pending
								</span>
							{/if}
							{#if enrollment.track && trackInfo[enrollment.track]}
								<span
									class={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide uppercase backdrop-blur-sm ${trackInfo[enrollment.track].color}`}
								>
									{trackInfo[enrollment.track].icon}
									{trackInfo[enrollment.track].label}
								</span>
							{/if}
						</div>
					</div>

					<!-- Body -->
					<div class="flex flex-1 flex-col p-5">
						<!-- Cohort / Batch -->
						{#if enrollment.cohortName}
							<p class="mb-2 text-[10px] font-black tracking-widest text-blue-600 uppercase">
								📅 {enrollment.cohortName}
							</p>
						{/if}

						<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-1 line-clamp-2 leading-snug`}>
							{enrollment.course.title}
						</h3>
						<p class={`${TEXT.small} ${COLOR.textSecondary} mb-4 line-clamp-2`}>
							{enrollment.course.description}
						</p>

						<!-- No track prompt -->
						{#if enrollment.status === 'active' && !enrollment.track}
							<div class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
								<p class="text-xs font-bold text-amber-700">⚡ Belum pilih jalur specialisasi!</p>
								<p class="mt-0.5 text-[11px] text-amber-600">
									Pilih jalur Creator, Seller, atau Affiliator untuk pengalaman belajar lebih
									terarah.
								</p>
								<a
									href="/app/courses/{enrollment.course.id}"
									class="mt-2 inline-block text-[11px] font-bold text-amber-700 underline underline-offset-2"
								>
									Pilih Jalur Sekarang →
								</a>
							</div>
						{/if}

						<!-- Progress (active only) -->
						{#if enrollment.status === 'active'}
							<div class="mt-auto mb-5">
								<div class="mb-2 flex items-center justify-between">
									<span class={`text-xs font-semibold ${COLOR.textMuted}`}>
										{enrollment.completedLessons} / {enrollment.totalLessons} lessons
									</span>
									<span
										class={`text-xs font-black ${enrollment.progressPercent >= 100 ? 'text-green-600' : 'text-blue-600'}`}
									>
										{enrollment.progressPercent}%
									</span>
								</div>
								<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
									<div
										class={`h-full rounded-full transition-all duration-700 ${
											enrollment.progressPercent >= 100
												? 'bg-green-500'
												: 'bg-linear-to-r from-blue-500 to-indigo-600'
										}`}
										style="width: {enrollment.progressPercent}%"
									></div>
								</div>
								{#if enrollment.progressPercent >= 100}
									<p class="mt-2 text-center text-xs font-bold text-green-600">
										🎉 Course Complete!
									</p>
								{/if}
							</div>

							<a
								href="/app/courses/{enrollment.course.id}/learn"
								class={`block w-full text-center no-underline ${RADIUS.button} font-bold ${TEXT.button} ${TRANSITION.all} py-3.5 ${
									enrollment.progressPercent >= 100
										? 'bg-green-600 text-white hover:bg-green-700'
										: `${COLOR.accentBg} text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-lg`
								}`}
							>
								{enrollment.progressPercent === 0
									? 'Start Learning →'
									: enrollment.progressPercent >= 100
										? 'Review Course'
										: 'Continue Learning →'}
							</a>
						{:else if enrollment.status === 'pending'}
							<div class={`mt-auto ${SPACING.cardPadding} ${RADIUS.button} ${COLOR.warning} mb-4`}>
								{#if enrollment.paymentProofStatus === 'pending'}
									<div class="flex items-center gap-2">
										<span class="text-base">⏳</span>
										<p class={`${COLOR.textSecondary} ${TEXT.small} font-semibold`}>
											Payment proof under review
										</p>
									</div>
								{:else if enrollment.paymentProofStatus === 'rejected'}
									<p class={`${TEXT.small} mb-3 font-bold text-red-600`}>
										⚠️ Payment proof rejected. Please reupload.
									</p>
									<a
										href="/app/payments?courseId={enrollment.course.id}"
										class={`inline-block no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base}`}
										>Upload Payment Proof</a
									>
								{:else}
									<p class={`${COLOR.textSecondary} mb-3 ${TEXT.small}`}>
										Upload payment proof to activate course access
									</p>
									<a
										href="/app/payments?courseId={enrollment.course.id}"
										class={`inline-block no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base}`}
										>Upload Payment Proof</a
									>
								{/if}
							</div>
						{/if}

						<!-- Footer meta -->
						<div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
							<span class={`${TEXT.small} ${COLOR.textMuted}`}>
								Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'short',
									year: 'numeric'
								})}
							</span>
							{#if enrollment.course.duration}
								<span class={`${TEXT.small} ${COLOR.textMuted}`}
									>{enrollment.course.duration} minggu</span
								>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</PageWrapper>
