<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	const jobTypeLabels: Record<string, string> = {
		'full-time': 'Full-time',
		'part-time': 'Part-time',
		contract: 'Contract',
		internship: 'Internship'
	};

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
		const now = new Date();
		const jobDate = new Date(date);
		const diffDays = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(jobDate);
	}
</script>

<svelte:head>
	<title>Job Opportunities - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Job Opportunities"
		description="Browse open positions from organizations on Naik Kelas"
	/>

	{#if data.jobs.length === 0}
		<PageSection>
			<div class="py-16 text-center">
				<div class="mb-4 text-6xl">💼</div>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Open Positions</h3>
				<p class={`${TEXT.body} ${COLOR.textMuted}`}>Check back later for new job opportunities.</p>
			</div>
		</PageSection>
	{:else}
		<div class="grid gap-4 lg:grid-cols-2">
			{#each data.jobs as job}
				<a
					href="/jobs/{job.id}"
					class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5 ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
				>
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-neutral-800"
						>
							{#if job.organization.logoUrl}
								<img
									src={job.organization.logoUrl}
									alt={job.organization.name}
									class="h-full w-full rounded-lg object-cover"
								/>
							{:else}
								<span class="text-lg font-bold text-gray-500">
									{job.organization.name.charAt(0)}
								</span>
							{/if}
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex items-start justify-between gap-2">
								<h3 class={`${TEXT.h3} ${COLOR.textPrimary}`}>{job.title}</h3>
								{#if job.hasApplied}
									<span
										class="flex-shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800"
									>
										Applied ✓
									</span>
								{/if}
							</div>

							<p class={`${TEXT.body} ${COLOR.accent} mb-2`}>{job.organization.name}</p>

							<div class="mb-3 flex flex-wrap gap-2">
								<span
									class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
								>
									{jobTypeLabels[job.jobType] || job.jobType}
								</span>
								{#if job.isRemote}
									<span
										class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"
									>
										Remote
									</span>
								{/if}
								{#if job.location}
									<span
										class={`rounded-full px-2 py-1 text-xs ${COLOR.textMuted} bg-gray-100 dark:bg-neutral-800`}
									>
										📍 {job.location}
									</span>
								{/if}
							</div>

							{#if formatSalary(job.salaryMin, job.salaryMax)}
								<p class={`${TEXT.body} ${COLOR.textPrimary} font-semibold`}>
									{formatSalary(job.salaryMin, job.salaryMax)}
								</p>
							{/if}

							<p class={`${TEXT.small} ${COLOR.textMuted} mt-2 line-clamp-2`}>
								{job.description}
							</p>

							<p class={`${TEXT.small} ${COLOR.textMuted} mt-3`}>
								Posted {formatDate(job.createdAt)}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</PageWrapper>
