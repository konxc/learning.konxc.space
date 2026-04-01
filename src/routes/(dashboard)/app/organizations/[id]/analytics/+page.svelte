<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	function formatIDR(n: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(n);
	}
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
	<div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
		{#each [{ label: 'Total Revenue', value: formatIDR(data.summary.totalRevenue), color: 'text-emerald-600' }, { label: 'Total Enrollment', value: data.summary.totalEnrollments, color: 'text-blue-600' }, { label: 'Aktif Belajar', value: data.summary.totalActive, color: 'text-indigo-600' }, { label: 'Selesai', value: data.summary.totalCompleted, color: 'text-purple-600' }, { label: 'Total Course', value: data.summary.totalCourses, color: COLOR.textPrimary }, { label: 'Total Member', value: data.summary.totalMembers, color: COLOR.textPrimary }] as card}
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.base} p-5`}>
				<p class={`text-2xl font-bold ${card.color}`}>{card.value}</p>
				<p class={`text-xs ${COLOR.textMuted} mt-1`}>{card.label}</p>
			</div>
		{/each}
	</div>

	<!-- Per-Course Stats -->
	<div
		class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.base} overflow-hidden`}
	>
		<div class="border-b px-6 py-4 ${COLOR.cardBorder}">
			<h3 class={`font-bold ${COLOR.textPrimary}`}>Performa per Course</h3>
		</div>
		<table class="w-full text-left">
			<thead>
				<tr class="border-b ${COLOR.cardBorder} bg-zinc-50/50 dark:bg-zinc-900/50">
					{#each ['Course', 'Total', 'Aktif', 'Selesai', 'Est. Revenue'] as h}
						<th class={`px-5 py-3 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
							>{h}</th
						>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
				{#each data.courseStats as course}
					<tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
						<td class={`px-5 py-3 font-medium ${COLOR.textPrimary}`}>{course.title}</td>
						<td class={`px-5 py-3 ${COLOR.textSecondary}`}>{course.total}</td>
						<td class="px-5 py-3 font-bold text-blue-600">{course.active}</td>
						<td class="px-5 py-3 font-bold text-emerald-600">{course.completed}</td>
						<td class="px-5 py-3 font-bold text-emerald-600">{formatIDR(course.revenue)}</td>
					</tr>
				{/each}
				{#if data.courseStats.length === 0}
					<tr>
						<td colspan="5" class={`px-5 py-10 text-center text-sm ${COLOR.textMuted}`}>
							Belum ada course di organisasi ini.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</PageWrapper>
