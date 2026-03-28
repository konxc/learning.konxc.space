<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import RoleSwitcher from '$lib/components/app/RoleSwitcher.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING, RADIUS } from '$lib/config/design';
	import { formatCurrency } from '$lib/utils/format';

	interface DashboardMentorProps {
		data: any;
	}

	let { data }: DashboardMentorProps = $props();

	const columns = [
		{ key: 'title', label: 'Course' },
		{ key: 'students', label: 'Students' },
		{ key: 'status', label: 'Status' }
	];
	const rows = (data.mentorCourses?.slice(0, 5) ?? []).map((c: any) => ({
		title: c.title,
		students: c.students ?? 0,
		status: c.published ? 'Published' : 'Draft'
	}));
</script>

<div class={SPACING.section}>
	<div class="mb-8 flex items-center justify-between gap-4">
		<div>
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>Mentor Center</h1>
			<p class={`${TEXT.body} ${COLOR.textSecondary}`}>Manage your courses and students</p>
		</div>
		<div class="w-40"><RoleSwitcher /></div>
	</div>

	<div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<KpiCard label="My Courses" value={data.stats.myCourses || 0} />
		<KpiCard label="Total Students" value={data.stats.totalStudents || 0} accent />
		<KpiCard label="Pending Reviews" value={data.stats.pendingSubmissions || 0} />
		<KpiCard label="Action Submissions" value={data.stats.totalActionSubmissions || 0} />
	</div>

	<!-- Track Breakdown -->
	{#if data.stats.trackCounts}
		<div class="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<div class="text-2xl mb-1">🎥</div>
				<div class="text-2xl font-black text-purple-600">{data.stats.trackCounts.creator || 0}</div>
				<div class="text-xs text-gray-500 font-medium">Creators</div>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<div class="text-2xl mb-1">🛒</div>
				<div class="text-2xl font-black text-orange-600">{data.stats.trackCounts.seller || 0}</div>
				<div class="text-xs text-gray-500 font-medium">Sellers</div>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<div class="text-2xl mb-1">🔗</div>
				<div class="text-2xl font-black text-blue-600">{data.stats.trackCounts.affiliate || 0}</div>
				<div class="text-xs text-gray-500 font-medium">Affiliates</div>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<div class="text-2xl mb-1">⏳</div>
				<div class="text-2xl font-black text-gray-600">{data.stats.trackCounts.unassigned || 0}</div>
				<div class="text-xs text-gray-500 font-medium">Unassigned</div>
			</div>
		</div>
	{/if}

	<PageSection>
		<OverviewGraph
			title="Teaching Overview"
			description="Teaching activity over the last 30 days"
			noCard={true}
		/>
	</PageSection>

	<PageSection>
		<div class="mb-4 flex items-center justify-between">
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>My Courses</h2>
			<a href="/app/mentor/courses"><Button variant="ghost">Manage</Button></a>
		</div>
		<Table {columns} {rows} />
	</PageSection>
</div>
