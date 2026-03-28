<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { page } from '$app/stores';
	let { data }: { data: PageData } = $props();

	const showSuccess = $page.url.searchParams.has('payment');
</script>

<svelte:head>
	<title>My Courses - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="My Enrolled Courses" />

	{#if showSuccess}
		<div
			class={`mb-8 p-5 ${RADIUS.card} ${COLOR.success} ${TEXT.body} animate-in fade-in slide-in-from-top-4 flex items-center gap-3 border border-green-200 shadow-sm transition-all dark:border-green-900`}
			role="alert"
		>
			<span class="text-xl">✅</span>
			<div>
				<p class="font-bold">Pembayaran Berhasil!</p>
				<p class="text-sm opacity-90">
					Terima kasih! Akses kursus Anda sedang diaktifkan. Silakan refresh halaman dalam beberapa
					saat jika status belum berubah.
				</p>
			</div>
		</div>
	{/if}

	<div class={`courses-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`}>
		{#each data.enrollments as enrollment}
			<div
				class={`course-card ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.base} ${ELEVATION.hover} ${ELEVATION.transition} overflow-hidden ${
					enrollment.status === 'pending' ? 'opacity-90' : ''
				}`}
			>
				{#if enrollment.status === 'active'}
					<a
						href="/app/courses/{enrollment.course.id}"
						class="block text-inherit no-underline"
					>
						{#if enrollment.course.thumbnailUrl}
							<img
								src={enrollment.course.thumbnailUrl}
								alt={enrollment.course.title}
								class="thumbnail h-48 w-full object-cover"
								loading="lazy"
								decoding="async"
								fetchpriority="low"
							/>
						{:else}
							<div
								class="thumbnail-placeholder flex h-48 w-full items-center justify-center bg-gray-100"
							>
								<span class="emoji text-6xl">📚</span>
							</div>
						{/if}
					</a>
				{:else if enrollment.course.thumbnailUrl}
					<img
						src={enrollment.course.thumbnailUrl}
						alt={enrollment.course.title}
						class="thumbnail h-48 w-full object-cover"
						loading="lazy"
						decoding="async"
						fetchpriority="low"
					/>
				{:else}
					<div
						class="thumbnail-placeholder flex h-48 w-full items-center justify-center bg-gray-100"
					>
						<span class="emoji text-6xl">📚</span>
					</div>
				{/if}

				<div class="course-info p-5">
					<h3 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2`}>{enrollment.course.title}</h3>
					<p class={`description ${TEXT.secondary} mb-4 line-clamp-3`}>
						{enrollment.course.description}
					</p>

					<div
						class="enrollment-meta mt-4 flex items-center justify-between border-t border-gray-200 pt-4"
					>
						<span class={`enrolled-date ${TEXT.secondary} text-sm`}>
							Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString('id-ID')}
						</span>
						<span
							class={`status-badge px-3 py-1 ${RADIUS.badge} ${TEXT.small} uppercase ${
								enrollment.status === 'active' ? COLOR.successBg : COLOR.warningBg
							}`}
						>
							{enrollment.status}
						</span>
					</div>

					{#if enrollment.status === 'pending'}
						<div
							class={`pending-actions mt-4 ${SPACING.cardPadding} ${RADIUS.button} ${COLOR.warning}`}
						>
							{#if enrollment.paymentProofStatus === 'pending'}
								<p class={`proof-status ${COLOR.textSecondary} ${TEXT.body} mb-3`}>
									Bukti pembayaran sedang ditinjau
								</p>
							{:else if enrollment.paymentProofStatus === 'rejected'}
								<p
									class={`proof-status rejected ${TEXT.body} mb-3 ${SPACING.input} ${RADIUS.input} ${COLOR.error}`}
								>
									Bukti pembayaran ditolak. Silakan upload ulang.
								</p>
								<a
									href="/app/payments?courseId={enrollment.course.id}"
									class={`inline-block no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base} ${ELEVATION.hover}`}
								>
									Upload Bukti Pembayaran
								</a>
							{:else}
								<p class={`proof-hint ${COLOR.textSecondary} mb-3 text-sm`}>
									Upload bukti pembayaran untuk mengaktifkan akses kursus
								</p>
								<a
									href="/app/payments?courseId={enrollment.course.id}"
									class={`inline-block no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base} ${ELEVATION.hover}`}
								>
									Upload Bukti Pembayaran
								</a>
							{/if}
						</div>
					{:else if enrollment.status === 'active'}
						<div class="course-actions mt-4 border-t border-gray-200 pt-4">
							<a
								href="/app/courses/{enrollment.course.id}/learn"
								class={`block w-full text-center no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base} ${ELEVATION.hover}`}
							>
								Continue Learning →
							</a>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	{#if data.enrollments.length === 0}
		<PageSection>
			<div class="text-center">
				<p class={`mb-4 ${COLOR.textSecondary}`}>You haven't enrolled in any courses yet</p>
				<a
					href="/app/courses"
					class={`inline-flex items-center no-underline ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} ${ELEVATION.hover}`}
					>Browse Courses</a
				>
			</div>
		</PageSection>
	{/if}
</PageWrapper>
