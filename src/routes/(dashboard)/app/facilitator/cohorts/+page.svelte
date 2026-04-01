<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | null) {
		if (!date) return '-';
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
	}

	const statusColors: Record<string, string> = {
		active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
	};
</script>

<svelte:head>
	<title>My Cohorts - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="My Cohorts"
		description="Manage your facilitated cohorts and student batches"
	/>

	{#if data.cohorts.length === 0}
		<PageSection>
			<div class="py-16 text-center">
				<div class="mb-4 text-6xl">📚</div>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Cohorts Assigned</h3>
				<p class={`${TEXT.body} ${COLOR.textMuted} mb-6`}>
					You haven't been assigned as a facilitator for any cohorts yet.
				</p>
				{#if data.memberships.length > 0}
					<p class={`${TEXT.body} ${COLOR.textMuted}`}>
						You're a facilitator in: {data.memberships.map((m) => m.organization.name).join(', ')}
					</p>
				{/if}
			</div>
		</PageSection>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.cohorts as cohort}
				<a
					href="/app/admin/cohorts/{cohort.id}"
					class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5 ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
				>
					<div class="mb-3 flex items-start justify-between">
						<div>
							<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-1`}>{cohort.name}</h3>
							<p class={`${TEXT.small} ${COLOR.accent}`}>{cohort.course.title}</p>
						</div>
						<span
							class={`rounded-full px-2 py-1 ${TEXT.small} font-semibold capitalize ${statusColors[cohort.status]}`}
						>
							{cohort.status}
						</span>
					</div>

					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class={COLOR.textMuted}>Organization</span>
							<span class={COLOR.textPrimary}>{cohort.organization.name}</span>
						</div>
						<div class="flex justify-between">
							<span class={COLOR.textMuted}>Students</span>
							<span class={COLOR.textPrimary}>{cohort.studentCount}</span>
						</div>
						<div class="flex justify-between">
							<span class={COLOR.textMuted}>Start</span>
							<span class={COLOR.textPrimary}>{formatDate(cohort.startDate)}</span>
						</div>
						{#if cohort.endDate}
							<div class="flex justify-between">
								<span class={COLOR.textMuted}>End</span>
								<span class={COLOR.textPrimary}>{formatDate(cohort.endDate)}</span>
							</div>
						{/if}
					</div>

					<div class="mt-4 border-t pt-3 {COLOR.cardBorder}">
						<span class={`${TEXT.button} ${COLOR.accent}`}>View Details →</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</PageWrapper>
