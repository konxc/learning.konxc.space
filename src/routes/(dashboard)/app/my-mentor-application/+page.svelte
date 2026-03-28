<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>My Mentor Application - Naik Kelas</title>
</svelte:head>

{#if data.isMentor}
	<PageWrapper>
		<div class="px-5 py-20 text-center">
			<PageSection>
				<span class="mb-6 block text-7xl">🎉</span>
				<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-4`}>You are a Mentor!</h1>
				<p class={`${TEXT.body} ${COLOR.textSecondary} mb-8 text-lg`}>
					Congratulations! You are now a mentor on Naik Kelas.
				</p>
				<a
					href="/app/mentor/courses"
					class={`inline-flex items-center ${RADIUS.card} ${COLOR.accentBg} px-10 py-4 ${TEXT.button} text-lg font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
				>
					View My Courses
				</a>
			</PageSection>
		</div>
	</PageWrapper>
{:else if data.application}
	<PageWrapper>
		<PageHeader title="My Mentor Application" />

		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Application Status</h2>
			<div
				class={`inline-block px-6 py-3 ${RADIUS.button} ${TEXT.body} mb-4 text-xl font-semibold ${
					data.application.status === 'pending'
						? COLOR.warningBg
						: data.application.status === 'approved'
							? COLOR.successBg
							: COLOR.errorBg
				}`}
			>
				{data.application.status === 'pending' && '⏳ Under Review'}
				{data.application.status === 'approved' && '✓ Approved'}
				{data.application.status === 'rejected' && '✗ Rejected'}
			</div>
			<p class={`${TEXT.body} ${COLOR.textMuted} mb-2`}>
				Submitted: {new Date(data.application.createdAt).toLocaleDateString('id-ID')}
			</p>

			{#if data.application.reviewedAt}
				<p class={`${TEXT.body} ${COLOR.textMuted} mb-4`}>
					Reviewed: {new Date(data.application.reviewedAt).toLocaleDateString('id-ID')}
				</p>
			{/if}

			{#if data.application.adminNotes}
				<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding} mt-4`}>
					<strong class={`block ${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}
						>Admin Feedback:</strong
					>
					<p class={`${TEXT.body} ${COLOR.textSecondary} leading-relaxed`}>
						{data.application.adminNotes}
					</p>
				</div>
			{/if}
		</PageSection>

		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-5`}>Application Details</h2>
			<div class="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
					<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
						>Full Name</span
					>
					<span class={`block ${TEXT.body} ${COLOR.textPrimary} text-lg font-semibold`}
						>{data.application.fullName}</span
					>
				</div>
				<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
					<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
						>Email</span
					>
					<span class={`block ${TEXT.body} ${COLOR.textPrimary} text-lg font-semibold`}
						>{data.application.email}</span
					>
				</div>
				<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
					<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
						>Phone</span
					>
					<span class={`block ${TEXT.body} ${COLOR.textPrimary} text-lg font-semibold`}
						>{data.application.phone}</span
					>
				</div>
				<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
					<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
						>Expertise</span
					>
					<span class={`block ${TEXT.body} ${COLOR.textPrimary} text-lg font-semibold`}
						>{data.application.expertise}</span
					>
				</div>
				<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
					<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
						>Years of Experience</span
					>
					<span class={`block ${TEXT.body} ${COLOR.textPrimary} text-lg font-semibold`}
						>{data.application.yearsExperience} years</span
					>
				</div>
			</div>

			<div class="mb-6">
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Bio</h3>
				<p class={`${TEXT.body} ${COLOR.textSecondary} leading-relaxed`}>{data.application.bio}</p>
			</div>

			<div class="mb-6">
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Motivation</h3>
				<p class={`${TEXT.body} ${COLOR.textSecondary} leading-relaxed`}>
					{data.application.motivation}
				</p>
			</div>

			{#if data.application.githubUrl || data.application.linkedinUrl || data.application.portfolioUrl}
				<div class="mb-6">
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Links</h3>
					<div class="flex flex-wrap items-center gap-3">
						{#if data.application.portfolioUrl}
							<a
								href={data.application.portfolioUrl}
								target="_blank"
								rel="noopener noreferrer"
								class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} ${SPACING.button} ${TEXT.button} ${COLOR.accent} font-semibold ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
							>
								Portfolio →
							</a>
						{/if}
						{#if data.application.githubUrl}
							<a
								href={data.application.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} ${SPACING.button} ${TEXT.button} ${COLOR.accent} font-semibold ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
							>
								GitHub →
							</a>
						{/if}
						{#if data.application.linkedinUrl}
							<a
								href={data.application.linkedinUrl}
								target="_blank"
								rel="noopener noreferrer"
								class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} ${SPACING.button} ${TEXT.button} ${COLOR.accent} font-semibold ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
							>
								LinkedIn →
							</a>
						{/if}
					</div>
				</div>
			{/if}
		</PageSection>
	</PageWrapper>
{:else}
	<PageWrapper>
		<div class="px-5 py-20 text-center">
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-4`}>Become a Mentor</h1>
			<p class={`${TEXT.body} ${COLOR.textSecondary} mb-8 text-lg`}>
				Share your expertise and help others grow their programming skills
			</p>
			<a
				href="/app/apply-mentor"
				class={`inline-flex items-center ${RADIUS.card} ${COLOR.accentBg} px-10 py-4 ${TEXT.button} text-lg font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
			>
				Apply as Mentor
			</a>
		</div>
	</PageWrapper>
{/if}
