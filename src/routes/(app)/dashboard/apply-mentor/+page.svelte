<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let portfolioUrl = $state('');
	let githubUrl = $state('');
	let linkedinUrl = $state('');
</script>

<svelte:head>
	<title>Apply as Mentor - Naik Kelas</title>
</svelte:head>

{#if data.existingApplication}
	<PageWrapper>
		<PageHeader title="Mentor Application Status" />
		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Your Application Status</h2>
			<div
				class={`inline-block px-6 py-3 ${RADIUS.button} ${TEXT.body} text-xl font-semibold mb-4 ${
					data.existingApplication.status === 'pending'
						? COLOR.warningBg
						: data.existingApplication.status === 'approved'
							? COLOR.successBg
							: COLOR.errorBg
				}`}
			>
				{data.existingApplication.status === 'pending' && '⏳ Under Review'}
				{data.existingApplication.status === 'approved' && '✓ Approved'}
				{data.existingApplication.status === 'rejected' && '✗ Rejected'}
			</div>
			<p class={`${TEXT.body} ${COLOR.textMuted} mb-4`}>
				Submitted: {new Date(data.existingApplication.createdAt).toLocaleDateString('id-ID')}
			</p>
			{#if data.existingApplication.adminNotes}
				<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding} mt-4`}>
					<strong class={`block ${TEXT.button} ${COLOR.textPrimary} font-semibold mb-2`}>Admin Notes:</strong>
					<p class={`${TEXT.body} ${COLOR.textSecondary} leading-relaxed`}>{data.existingApplication.adminNotes}</p>
				</div>
			{/if}
		</PageSection>
		<div class="mt-6">
			<a
				href="/dashboard"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} px-6 py-3 ${TEXT.button} ${COLOR.textPrimary} font-semibold ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-1`}
			>
				← Back to Dashboard
			</a>
		</div>
	</PageWrapper>
{:else}
	<PageWrapper>
		<PageHeader
			title="Apply as Mentor"
			description="Share your expertise and help others grow their programming skills"
		/>

		{#if form?.error}
			<PageSection>
				<div class={`${RADIUS.button} ${SPACING.cardPadding} ${COLOR.error} ${ELEVATION.base}`} role="alert">
					{form.error}
				</div>
			</PageSection>
		{/if}

		<PageSection>
			<form method="POST" class="flex flex-col gap-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="flex flex-col gap-2">
						<label for="fullName" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							Full Name *
						</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							required
							value={data.user.fullName || ''}
							placeholder="Enter your full name"
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label for="email" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							Email *
						</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							value={data.user.email || ''}
							placeholder="your@email.com"
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<label for="phone" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Phone Number *
					</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						required
						value={data.user.phone || ''}
						placeholder="e.g. 08123456789"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="bio" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Bio *
					</label>
					<textarea
						id="bio"
						name="bio"
						required
						rows="4"
						placeholder="Tell us about yourself, your background and experience..."
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 resize-y`}
					></textarea>
				</div>

				<div class="flex flex-col gap-2">
					<label for="expertise" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Area of Expertise *
					</label>
					<input
						type="text"
						id="expertise"
						name="expertise"
						required
						placeholder="e.g. Web Development, Data Science, AI/ML"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					/>
					<small class={`${TEXT.small} ${COLOR.textMuted}`}>What topics are you comfortable teaching?</small>
				</div>

				<div class="flex flex-col gap-2">
					<label for="yearsExperience" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Years of Experience *
					</label>
					<input
						type="number"
						id="yearsExperience"
						name="yearsExperience"
						required
						min="0"
						placeholder="e.g. 5"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="portfolioUrl" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Portfolio URL
					</label>
					<input
						type="url"
						id="portfolioUrl"
						name="portfolioUrl"
						bind:value={portfolioUrl}
						placeholder="https://yourportfolio.com"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="flex flex-col gap-2">
						<label for="githubUrl" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							GitHub URL
						</label>
						<input
							type="url"
							id="githubUrl"
							name="githubUrl"
							bind:value={githubUrl}
							placeholder="https://github.com/yourusername"
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label for="linkedinUrl" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							LinkedIn URL
						</label>
						<input
							type="url"
							id="linkedinUrl"
							name="linkedinUrl"
							bind:value={linkedinUrl}
							placeholder="https://linkedin.com/in/yourprofile"
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<label for="motivation" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Why do you want to be a mentor? *
					</label>
					<textarea
						id="motivation"
						name="motivation"
						required
						rows="5"
						placeholder="Share your motivation for becoming a mentor..."
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 resize-y`}
					></textarea>
				</div>

				<div class="flex items-center gap-3 pt-2">
					<button
						type="submit"
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-8 py-3.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						Submit Application
					</button>
					<a
						href="/dashboard"
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-8 py-3.5 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						Cancel
					</a>
				</div>
			</form>
		</PageSection>
	</PageWrapper>
{/if}

