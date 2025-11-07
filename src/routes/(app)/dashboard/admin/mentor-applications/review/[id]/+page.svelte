<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

let { data, form }: { data: PageData; form?: ActionData | null } = $props();

	let adminNotes = $state('');
</script>

<svelte:head>
	<title>Review Mentor Application - Admin</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Review Mentor Application">
		<a
			href="/dashboard/admin/mentor-applications"
			class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} ${SPACING.button} ${TEXT.button} ${COLOR.textPrimary} font-medium ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-1`}
		>
			← Back to Applications
		</a>
	</PageHeader>

{#if form?.message}
		<PageSection>
			<div
				class={`${RADIUS.button} ${SPACING.cardPadding} ${COLOR.error} ${ELEVATION.base}`}
				role="alert"
			>
			{form.message}
			</div>
		</PageSection>
	{/if}

	<PageSection>
		<div
			class="mb-8 flex flex-col gap-4 border-b-2 border-gray-200 pb-6 md:flex-row md:items-start md:justify-between dark:border-neutral-800"
		>
			<div>
				<h2 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>{data.application.fullName}</h2>
				<p class={`${TEXT.body} ${COLOR.textMuted}`}>@{data.user.username} • {data.user.email}</p>
			</div>
			<span
				class={`inline-block px-5 py-2 ${RADIUS.badge} ${TEXT.button} font-semibold capitalize ${
					data.application.status === 'pending'
						? COLOR.warningBg
						: data.application.status === 'approved'
							? COLOR.successBg
							: COLOR.errorBg
				}`}
			>
				{data.application.status}
			</span>
		</div>

		<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<div class={`${RADIUS.card} ${COLOR.neutral} ${SPACING.cardPadding}`}>
				<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
					>Email</span
				>
				<span class={`block ${TEXT.body} text-lg ${COLOR.textPrimary} font-semibold`}
					>{data.application.email}</span
				>
			</div>
			<div class={`${RADIUS.card} ${COLOR.neutral} ${SPACING.cardPadding}`}>
				<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
					>Phone</span
				>
				<span class={`block ${TEXT.body} text-lg ${COLOR.textPrimary} font-semibold`}
					>{data.application.phone}</span
				>
			</div>
			<div class={`${RADIUS.card} ${COLOR.neutral} ${SPACING.cardPadding}`}>
				<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
					>Expertise</span
				>
				<span class={`block ${TEXT.body} text-lg ${COLOR.textPrimary} font-semibold`}
					>{data.application.expertise}</span
				>
			</div>
			<div class={`${RADIUS.card} ${COLOR.neutral} ${SPACING.cardPadding}`}>
				<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
					>Experience</span
				>
				<span class={`block ${TEXT.body} text-lg ${COLOR.textPrimary} font-semibold`}
					>{data.application.yearsExperience} years</span
				>
			</div>
			<div class={`${RADIUS.card} ${COLOR.neutral} ${SPACING.cardPadding}`}>
				<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
					>Applied On</span
				>
				<span class={`block ${TEXT.body} text-lg ${COLOR.textPrimary} font-semibold`}>
					{new Date(data.application.createdAt).toLocaleDateString('id-ID')}
				</span>
			</div>
			<div class={`${RADIUS.card} ${COLOR.neutral} ${SPACING.cardPadding}`}>
				<span class={`block ${TEXT.small} ${COLOR.textMuted} mb-2 tracking-wide uppercase`}
					>Current Role</span
				>
				<span
					class={`block ${TEXT.body} text-lg font-semibold ${data.user.role === 'mentor' ? 'text-green-600 dark:text-green-400' : COLOR.textPrimary}`}
				>
					{data.user.role}
				</span>
			</div>
		</div>

		<div class="mb-8">
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3 font-semibold`}>Bio</h3>
			<p class={`${TEXT.body} ${COLOR.textSecondary} text-base leading-relaxed`}>
				{data.application.bio}
			</p>
		</div>

		<div class="mb-8">
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3 font-semibold`}>Motivation</h3>
			<p class={`${TEXT.body} ${COLOR.textSecondary} text-base leading-relaxed`}>
				{data.application.motivation}
			</p>
		</div>

		{#if data.application.portfolioUrl || data.application.githubUrl || data.application.linkedinUrl}
			<div class="mb-8">
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3 font-semibold`}>Links</h3>
				<div class="flex flex-wrap items-center gap-3">
					{#if data.application.portfolioUrl}
						<a
							href={data.application.portfolioUrl}
							target="_blank"
							rel="noopener noreferrer"
							class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} px-6 py-3 ${TEXT.button} ${COLOR.accent} font-semibold ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
						>
							Portfolio →
						</a>
					{/if}
					{#if data.application.githubUrl}
						<a
							href={data.application.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} px-6 py-3 ${TEXT.button} ${COLOR.accent} font-semibold ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
						>
							GitHub →
						</a>
					{/if}
					{#if data.application.linkedinUrl}
						<a
							href={data.application.linkedinUrl}
							target="_blank"
							rel="noopener noreferrer"
							class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} px-6 py-3 ${TEXT.button} ${COLOR.accent} font-semibold ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
						>
							LinkedIn →
						</a>
					{/if}
				</div>
			</div>
		{/if}

		{#if data.application.adminNotes}
			<div class="mb-8">
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3 font-semibold`}>Previous Admin Notes</h3>
				<div class={`${RADIUS.small} ${SPACING.cardPadding} ${COLOR.warning}`}>
					<p class={COLOR.textPrimary}>{data.application.adminNotes}</p>
				</div>
			</div>
		{/if}
	</PageSection>

	{#if data.application.status === 'pending'}
		<PageSection>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6 font-semibold`}>Review Application</h3>
			<form method="POST" action="?/approve" class="mb-8">
				<div class="mb-6">
					<label
						for="adminNotes"
						class={`block ${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}
					>
						Admin Notes (optional for approval)
					</label>
					<textarea
						id="adminNotes"
						name="adminNotes"
						rows="3"
						bind:value={adminNotes}
						placeholder="Add notes about this approval..."
						class={`w-full ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-y focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					></textarea>
				</div>

				<div>
					<button
						type="submit"
						class={`w-full ${RADIUS.card} bg-linear-to-r from-green-600 to-emerald-700 px-8 py-4 ${TEXT.button} text-lg font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						✓ Approve Application
					</button>
				</div>
			</form>

			<form method="POST" action="?/reject">
				<div class="mb-6">
					<label
						for="rejectNotes"
						class={`block ${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}
					>
						Rejection Reason *
					</label>
					<textarea
						id="rejectNotes"
						name="adminNotes"
						rows="3"
						required
						placeholder="Please provide reason for rejection..."
						class={`w-full ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-y focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					></textarea>
					<small class={`mt-2 block ${TEXT.small} ${COLOR.textMuted}`}>
						This feedback will be shown to the applicant
					</small>
				</div>

				<div>
					<button
						type="submit"
						class={`w-full ${RADIUS.card} bg-linear-to-r from-red-600 to-rose-700 px-8 py-4 ${TEXT.button} text-lg font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						✗ Reject Application
					</button>
				</div>
			</form>
		</PageSection>
	{/if}
</PageWrapper>
