<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: Date | null) {
		if (!date) return '-';
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
	}

	const completionRate = $derived(
		data.stats.totalEnrollments > 0
			? Math.round((data.stats.completedEnrollments / data.stats.totalEnrollments) * 100)
			: 0
	);
</script>

<svelte:head>
	<title>Analytics - {data.organization.name} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Organization Analytics"
		description="Performance metrics for {data.organization.name}"
	/>

	<!-- Stats Cards -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Total Courses</p>
			<p class={`${TEXT.h2} ${COLOR.textPrimary}`}>{data.stats.totalCourses}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Total Members</p>
			<p class={`${TEXT.h2} ${COLOR.accent}`}>{data.stats.memberCount}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Total Enrollments</p>
			<p class={`${TEXT.h2} ${COLOR.textPrimary}`}>{data.stats.totalEnrollments}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5`}>
			<p class={`${TEXT.small} ${COLOR.textMuted}`}>Revenue</p>
			<p class={`${TEXT.h2} text-green-500`}>{formatCurrency(data.stats.revenue)}</p>
		</div>
	</div>

	<!-- Completion Rate -->
	<div class="mb-8">
		<PageSection>
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Completion Rate</h2>
			<div class="flex items-center gap-4">
				<div class="h-4 flex-1 rounded-full bg-gray-200 dark:bg-neutral-700">
					<div
						class="h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
						style="width: {completionRate}%"
					></div>
				</div>
				<span class={`${TEXT.h3} ${COLOR.accent}`}>{completionRate}%</span>
			</div>
			<p class={`${TEXT.small} ${COLOR.textMuted} mt-2`}>
				{data.stats.completedEnrollments} of {data.stats.totalEnrollments} students completed
			</p>
		</PageSection>
	</div>

	<!-- Courses List -->
	<div class="mb-8 grid gap-4 lg:grid-cols-2">
		<PageSection>
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Courses ({data.courses.length})</h2>
			{#if data.courses.length === 0}
				<p class={`${TEXT.body} ${COLOR.textMuted} py-4`}>No courses yet</p>
			{:else}
				<div class="space-y-2">
					{#each data.courses.slice(0, 5) as course}
						<a
							href="/app/explore/{course.id}"
							class={`flex items-center justify-between rounded-lg border p-3 ${COLOR.cardBorder} ${TRANSITION.all} hover:border-blue-400`}
						>
							<span class={`${TEXT.body} ${COLOR.textPrimary}`}>{course.title}</span>
							<span class={`${TEXT.small} ${COLOR.accent}`}>View →</span>
						</a>
					{/each}
				</div>
			{/if}
		</PageSection>

		<PageSection>
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Recent Enrollments</h2>
			{#if data.recentEnrollments.length === 0}
				<p class={`${TEXT.body} ${COLOR.textMuted} py-4`}>No enrollments yet</p>
			{:else}
				<div class="space-y-2">
					{#each data.recentEnrollments as enrollment}
						<div
							class={`flex items-center justify-between rounded-lg border p-3 ${COLOR.cardBorder}`}
						>
							<div>
								<p class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>
									{enrollment.user.fullName || enrollment.user.username}
								</p>
								<p class={`${TEXT.small} ${COLOR.textMuted}`}>{enrollment.course.title}</p>
							</div>
							<span class={`${TEXT.small} ${COLOR.textMuted}`}>
								{formatDate(enrollment.enrolledAt)}
							</span>
						</div>
					{/each}
				</div>
			{/if}
		</PageSection>
	</div>
</PageWrapper>
