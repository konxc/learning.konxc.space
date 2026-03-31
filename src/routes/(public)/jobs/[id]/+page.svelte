<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showApplyForm = $state(false);
	let isSubmitting = $state(false);

	// Parse JSON fields
	const requirements = $derived(() => {
		try {
			return data.job.requirements ? JSON.parse(data.job.requirements) : [];
		} catch {
			return [];
		}
	});

	const responsibilities = $derived(() => {
		try {
			return data.job.responsibilities ? JSON.parse(data.job.responsibilities) : [];
		} catch {
			return [];
		}
	});

	function formatSalary(min: number | null, max: number | null) {
		if (!min && !max) return null;
		const fmt = (n: number) =>
			new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
				minimumFractionDigits: 0
			}).format(n);
		if (min && max) return `${fmt(min)} - ${fmt(max)}`;
		if (min) return `From ${fmt(min)}`;
		if (max) return `Up to ${fmt(max)}`;
		return null;
	}

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(date));
	}

	const jobTypeLabels: Record<string, string> = {
		'full-time': 'Full-time',
		'part-time': 'Part-time',
		contract: 'Contract',
		internship: 'Internship'
	};
</script>

<svelte:head>
	<title>{data.job.title} at {data.job.organization.name} - Naik Kelas Jobs</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-4xl">
		<!-- Back Link -->
		<div class="mb-6">
			<a href="/jobs" class={`${TEXT.body} ${COLOR.accent} hover:underline`}>
				← Back to Job Listings
			</a>
		</div>

		{#if form?.success}
			<div class="mb-6 rounded-lg bg-green-50 p-6 text-center dark:bg-green-900">
				<div class="mb-2 text-4xl">✅</div>
				<p class={`${TEXT.h3} ${COLOR.textPrimary}`}>Application Submitted!</p>
				<p class={`${TEXT.body} ${COLOR.textMuted} mt-2`}>{form.message}</p>
				<a
					href="/jobs"
					class={`mt-4 inline-block ${RADIUS.button} ${COLOR.accentBg} px-6 py-2 text-white`}
				>
					Browse More Jobs
				</a>
			</div>
		{:else}
			<!-- Job Header -->
			<PageSection>
				<div class="flex items-start gap-6">
					<div class="flex-1">
						<div class="mb-2 flex items-center gap-3">
							<span
								class={`rounded-full px-3 py-1 ${TEXT.small} bg-blue-100 font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200`}
							>
								{jobTypeLabels[data.job.jobType] || data.job.jobType}
							</span>
							{#if data.job.isRemote}
								<span
									class={`rounded-full px-3 py-1 ${TEXT.small} bg-green-100 font-semibold text-green-800 dark:bg-green-900 dark:text-green-200`}
								>
									Remote
								</span>
							{/if}
						</div>
						<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>{data.job.title}</h1>
						<div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
							<span class="flex items-center gap-1">
								🏢 {data.job.organization.name}
							</span>
							{#if data.job.location}
								<span class="flex items-center gap-1">
									📍 {data.job.location}
								</span>
							{/if}
							<span class="flex items-center gap-1">
								📅 {formatDate(data.job.createdAt)}
							</span>
						</div>
					</div>
				</div>

				{#if formatSalary(data.job.salaryMin, data.job.salaryMax)}
					<div class="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
						<span class={`${TEXT.body} ${COLOR.textMuted}`}>Salary Range: </span>
						<span class={`${TEXT.h3} ${COLOR.accent}`}
							>{formatSalary(data.job.salaryMin, data.job.salaryMax)}</span
						>
					</div>
				{/if}
			</PageSection>

			<!-- Job Description -->
			<PageSection>
				<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Job Description</h2>
				<div class={`${TEXT.body} ${COLOR.textPrimary} whitespace-pre-wrap`}>
					{data.job.description}
				</div>
			</PageSection>

			<!-- Requirements -->
			{#if requirements().length > 0}
				<PageSection>
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Requirements</h2>
					<ul class="space-y-2">
						{#each requirements() as req}
							<li class={`${TEXT.body} ${COLOR.textPrimary} flex items-start gap-2`}>
								<span class="mt-1 text-blue-500">•</span>
								{req}
							</li>
						{/each}
					</ul>
				</PageSection>
			{/if}

			<!-- Responsibilities -->
			{#if responsibilities().length > 0}
				<PageSection>
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Responsibilities</h2>
					<ul class="space-y-2">
						{#each responsibilities() as resp}
							<li class={`${TEXT.body} ${COLOR.textPrimary} flex items-start gap-2`}>
								<span class="mt-1 text-green-500">✓</span>
								{resp}
							</li>
						{/each}
					</ul>
				</PageSection>
			{/if}

			<!-- Application Section -->
			<PageSection>
				{#if !showApplyForm}
					<div class="py-6 text-center">
						<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Interested in this position?</h2>
						<p class={`${TEXT.body} ${COLOR.textMuted} mb-6`}>
							Apply now and join {data.job.organization.name}
						</p>
						<button
							onclick={() => (showApplyForm = true)}
							class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-8 py-3 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover}`}
						>
							Apply for this Position
						</button>
					</div>
				{:else}
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Apply for {data.job.title}</h2>

					{#if form?.error}
						<div
							class="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-200"
						>
							{form.error}
						</div>
					{/if}

					<form
						method="post"
						action="?/apply"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								isSubmitting = false;
								await update();
							};
						}}
						class="space-y-4"
					>
						<div>
							<label
								for="proposedRole"
								class={`block ${TEXT.body} font-semibold ${COLOR.textPrimary} mb-1`}
							>
								Proposed Role
							</label>
							<select
								id="proposedRole"
								name="proposedRole"
								class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body}`}
							>
								<option value="member">Member</option>
								<option value="facilitator">Facilitator</option>
								<option value="creator">Creator</option>
							</select>
						</div>

						<div>
							<label
								for="coverLetter"
								class={`block ${TEXT.body} font-semibold ${COLOR.textPrimary} mb-1`}
							>
								Cover Letter
							</label>
							<textarea
								id="coverLetter"
								name="coverLetter"
								rows="5"
								placeholder="Tell us why you're interested in this position..."
								class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body}`}
							></textarea>
						</div>

						<div>
							<label
								for="portfolioUrl"
								class={`block ${TEXT.body} font-semibold ${COLOR.textPrimary} mb-1`}
							>
								Portfolio URL (optional)
							</label>
							<input
								type="url"
								id="portfolioUrl"
								name="portfolioUrl"
								placeholder="https://your-portfolio.com"
								class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.body}`}
							/>
						</div>

						<div class="flex gap-4 pt-4">
							<button
								type="button"
								onclick={() => (showApplyForm = false)}
								class={`flex-1 ${RADIUS.button} border ${COLOR.cardBorder} px-6 py-3 ${TEXT.button} font-semibold`}
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								class={`flex-1 ${RADIUS.button} ${COLOR.accentBg} px-6 py-3 ${TEXT.button} font-semibold text-white disabled:opacity-50`}
							>
								{isSubmitting ? 'Submitting...' : 'Submit Application'}
							</button>
						</div>
					</form>
				{/if}
			</PageSection>
		{/if}
	</div>
</PageWrapper>
