<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.course?.title || 'Course Details'} - Naik Kelas</title>
</svelte:head>

{#if !data.course}
	<PageWrapper>
		<PageSection>
			<div class="text-center">
				<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-4`}>Course Not Found</h1>
				<p class={`${COLOR.textSecondary} mb-6`}>
					The course you're looking for doesn't exist or has been removed.
				</p>
				<a
					href="/dashboard/courses"
					class={`inline-flex items-center no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base} ${ELEVATION.hover}`}
					>← Back to Courses</a
				>
			</div>
		</PageSection>
	</PageWrapper>
{:else}
	<PageWrapper>
		<div
			class="course-hero relative h-96 w-full ${RADIUS.card} mb-8 overflow-hidden ${ELEVATION.base}"
		>
			{#if data.course.thumbnailUrl}
				<img
					src={data.course.thumbnailUrl}
					alt={data.course.title}
					class="hero-image h-full w-full object-cover"
					loading="lazy"
					decoding="async"
					fetchpriority="low"
				/>
			{:else}
				<div
					class="hero-placeholder flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
				>
					<span class="emoji text-8xl">📚</span>
				</div>
			{/if}
			<div
				class="hero-overlay absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-10"
			>
				<div class="hero-content">
					<h1 class={`mb-3 text-3xl font-bold text-white md:text-4xl`}>{data.course.title}</h1>
					<p class={`hero-description text-lg text-white/90`}>{data.course.description}</p>
				</div>
			</div>
		</div>

		<div class="course-container flex flex-col gap-8 lg:flex-row">
			<main class="course-main flex-1">
				<PageSection>
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>About This Course</h2>
					<p class={`course-description ${TEXT.secondary} leading-relaxed`}>
						{data.course.description}
					</p>
				</PageSection>

				<PageSection>
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Course Information</h2>
					<div class="info-grid grid grid-cols-1 gap-5 md:grid-cols-2">
						<div class={`info-item ${RADIUS.button} bg-gray-50 p-4`}>
							<span
								class={`info-label block text-xs tracking-wider uppercase ${COLOR.textSecondary} mb-2`}
								>Duration</span
							>
							<span class={`info-value block ${COLOR.textPrimary} font-semibold`}
								>{data.course.duration || 'N/A'} weeks</span
							>
						</div>
						<div class={`info-item ${RADIUS.button} bg-gray-50 p-4`}>
							<span
								class={`info-label block text-xs tracking-wider uppercase ${COLOR.textSecondary} mb-2`}
								>Status</span
							>
							<span
								class={`info-value block font-semibold ${
									data.course.status === 'published' ? 'text-green-700' : COLOR.textPrimary
								}`}
							>
								{data.course.status}
							</span>
						</div>
						<div class={`info-item ${RADIUS.button} bg-gray-50 p-4`}>
							<span
								class={`info-label block text-xs tracking-wider uppercase ${COLOR.textSecondary} mb-2`}
								>Created</span
							>
							<span class={`info-value block ${COLOR.textPrimary} font-semibold`}>
								{new Date(data.course.createdAt).toLocaleDateString('id-ID')}
							</span>
						</div>
						{#if data.mentor}
							<div class={`info-item ${RADIUS.button} bg-gray-50 p-4`}>
								<span
									class={`info-label block text-xs tracking-wider uppercase ${COLOR.textSecondary} mb-2`}
									>Mentor</span
								>
								<span class={`info-value block ${COLOR.textPrimary} font-semibold`}
									>{data.mentor.username}</span
								>
							</div>
						{/if}
					</div>
				</PageSection>
			</main>

			<aside class="course-sidebar w-full lg:w-80">
				<div
					class={`enrollment-card ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} p-6 ${ELEVATION.base} sticky top-6`}
				>
					<div class="price-section mb-6 border-b border-gray-200 pb-6">
						<span class={`price-label block ${TEXT.secondary} mb-2`}>Price</span>
						<span class={`price-amount block text-3xl font-bold ${COLOR.accent}`}>
							Rp {data.course.price.toLocaleString('id-ID')}
						</span>
					</div>

					{#if data.isEnrolled}
						<div
							class={`enrolled-badge mb-4 ${SPACING.cardPadding} ${RADIUS.button} ${COLOR.success} text-center font-semibold`}
						>
							<span>✓ You are enrolled in this course</span>
						</div>
						<a
							href="/dashboard/my-courses"
							class={`block w-full text-center no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base} ${ELEVATION.hover}`}
							>View My Courses</a
						>
					{:else}
						<a
							href="/dashboard/courses/{data.course.id}/enroll"
							class={`block w-full text-center no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base} ${ELEVATION.hover}`}
							>Enroll Now</a
						>
					{/if}
				</div>
			</aside>
		</div>
	</PageWrapper>
{/if}
