<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/dashboard/OverviewGraph.svelte';
	import RoleSwitcher from '$lib/components/dashboard/RoleSwitcher.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING } from '$lib/config/design';
	import { formatCurrency } from '$lib/utils/format';
	const { data } = $props<{ data: any }>();

	const courseColumns = [
		{ key: 'title', label: 'Course' },
		{ key: 'progress', label: 'Progress' },
		{ key: 'price', label: 'Price' }
	];
	const courseRows = (data.courses?.slice(0, 5) ?? []).map((c: any) => ({
		title: c.title,
		progress: `${c.progress ?? 0}%`,
		price: formatCurrency(c.price ?? 0)
	}));
</script>

<div class={SPACING.section}>
	<div class="mb-8 flex items-center justify-between gap-4">
		<div>
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>Welcome, {data.user.username}!</h1>
			<p class={`${TEXT.body} ${COLOR.textSecondary}`}>Lacak progress pembelajaranmu</p>
		</div>
		<div class="w-40"><RoleSwitcher /></div>
	</div>

	<div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<KpiCard label="My Courses" value={data.stats.myCourses || 0} />
		<KpiCard label="Progress" value={`${data.stats.progress || 0}%`} accent />
		<KpiCard label="Certificates" value={data.stats.certificates || 0} />
		<KpiCard label="Pending Payments" value={data.stats.pendingPayments || 0} />
	</div>

	<PageSection>
		<OverviewGraph
			title="Learning Overview"
			description="Aktivitas belajarmu dalam 30 hari terakhir"
		/>
	</PageSection>

	<PageSection>
		<div class="mb-4 flex items-center justify-between">
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>My Courses</h2>
			<a href="/dashboard/my-courses"><Button variant="ghost">Lihat semua</Button></a>
		</div>
		<Table {courseColumns} rows={courseRows} />
	</PageSection>
</div>
