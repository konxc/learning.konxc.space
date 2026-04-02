<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import OrgAnalyticsCard from '$lib/components/app/organizations/OrgAnalyticsCard.svelte';
	import { COLOR, RADIUS, ELEVATION, TEXT, TABLE } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	function formatIDR(n: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(n);
	}

	// Build a lookup map: courseId → completed count from completionData
	const completedByCourse = $derived(
		Object.fromEntries(data.completionData.map((c) => [c.courseId, Number(c.totalEnrollments)]))
	);

	// Build a lookup map: courseId → enrollment count from enrollmentsByCourse
	const enrollmentCountByCourse = $derived(
		Object.fromEntries(data.enrollmentsByCourse.map((c) => [c.courseId, Number(c.count)]))
	);
</script>

<svelte:head>
	<title>Analytics Organisasi - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Analytics Organisasi"
		description="Ringkasan performa course dan member organisasi kamu."
	/>

	<!-- Summary Cards -->
	<div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
		<OrgAnalyticsCard
			title="Total Kursus"
			value={data.summary.totalCourses}
			icon="book-open"
			color="blue"
		/>
		<OrgAnalyticsCard
			title="Total Enrollment"
			value={data.summary.totalEnrollments}
			icon="users"
			color="emerald"
		/>
		<OrgAnalyticsCard
			title="Total Selesai"
			value={data.summary.totalCompleted}
			icon="check-circle"
			color="purple"
		/>
		<OrgAnalyticsCard
			title="Total Anggota"
			value={data.summary.totalMembers}
			icon="building"
			color="amber"
		/>
	</div>

	<!-- Per-Course Table -->
	<div class={`${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden`}>
		<div class={`border-b ${COLOR.cardBorder} px-6 py-4`}>
			<h3 class={`font-bold ${COLOR.textPrimary}`}>Performa per Course</h3>
		</div>
		<table class="w-full text-left">
			<thead>
				<tr class={`border-b ${COLOR.cardBorder} ${TABLE.thead}`}>
					{#each ['Course', 'Enrollment', 'Selesai', 'Est. Revenue'] as h}
						<th class={`px-5 py-3 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>
							{h}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class={`divide-y ${TABLE.divider}`}>
				{#each data.courseStats as course (course.id)}
					<tr class={TABLE.rowHover}>
						<td class={`px-5 py-3 font-medium ${COLOR.textPrimary}`}>{course.title}</td>
						<td class={`px-5 py-3 ${COLOR.textSecondary}`}>
							{enrollmentCountByCourse[course.id] ?? course.total}
						</td>
						<td class="px-5 py-3 font-bold text-emerald-600 dark:text-emerald-400">
							{completedByCourse[course.id] ?? course.completed}
						</td>
						<td class="px-5 py-3 font-bold text-emerald-600 dark:text-emerald-400">
							{formatIDR(course.revenue)}
						</td>
					</tr>
				{/each}
				{#if data.courseStats.length === 0}
					<tr>
						<td colspan="4" class={`px-5 py-10 text-center text-sm ${COLOR.textMuted}`}>
							Belum ada course di organisasi ini.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</PageWrapper>
