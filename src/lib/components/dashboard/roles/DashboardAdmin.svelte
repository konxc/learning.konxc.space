<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/dashboard/OverviewGraph.svelte';
	import RoleSwitcher from '$lib/components/dashboard/RoleSwitcher.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING } from '$lib/config/design';
	const { data } = $props<{ data: any }>();

	const columns = [
		{ key: 'applicant', label: 'Applicant' },
		{ key: 'submittedAt', label: 'Submitted' },
		{ key: 'status', label: 'Status' }
	];
	const rows = (data.pendingApplicationsList?.slice(0, 5) ?? []).map((a: any) => ({
		applicant: a.username ?? a.userId,
		submittedAt: new Date(a.createdAt).toLocaleDateString('id-ID'),
		status: a.status ?? 'pending'
	}));
</script>

<div class={SPACING.section}>
	<div class="mb-8 flex items-center justify-between gap-4">
		<div>
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>Admin Console</h1>
			<p class={`${TEXT.body} ${COLOR.textSecondary}`}>Kontrol panel untuk mengelola platform</p>
		</div>
		<div class="w-40"><RoleSwitcher /></div>
	</div>

	<div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<KpiCard label="Pending Payments" value={data.stats.pendingPayments || 0} accent />
		<KpiCard label="Mentor Applications" value={data.stats.pendingApplications || 0} />
		<KpiCard label="Active Users" value={data.stats.activeUsers || '-'} />
		<KpiCard label="Total Courses" value={data.stats.totalCourses || '-'} />
	</div>

	<PageSection>
		<OverviewGraph title="System Overview" description="Kesehatan sistem dan aktivitas" />
	</PageSection>

	<PageSection>
		<div class="mb-4 flex items-center justify-between">
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Mentor Applications</h2>
			<a href="/dashboard/admin/mentor-applications"><Button variant="ghost">Kelola</Button></a>
		</div>
		<Table {columns} {rows} />
	</PageSection>
</div>
