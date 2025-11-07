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

	const columns = [
		{ key: 'date', label: 'Date' },
		{ key: 'amount', label: 'Amount' },
		{ key: 'user', label: 'User' }
	];
	const rows = (data.recentTransactions?.slice(0, 5) ?? []).map((t: any) => ({
		date: new Date(t.createdAt).toLocaleDateString('id-ID'),
		amount: formatCurrency(t.amount ?? 0),
		user: t.username ?? t.userId
	}));
</script>

<div class={SPACING.section}>
	<div class="mb-8 flex items-center justify-between gap-4">
		<div>
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>Business Overview</h1>
			<p class={`${TEXT.body} ${COLOR.textSecondary}`}>Ringkasan keuangan dan metrik bisnis</p>
		</div>
		<div class="w-40"><RoleSwitcher /></div>
	</div>

	<div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<KpiCard label="Revenue" value={formatCurrency(data.stats.revenue || 0)} accent />
		<KpiCard label="ARPU" value={formatCurrency(data.stats.arpu || 0)} />
		<KpiCard label="Active Subs" value={data.stats.activeSubs || 0} />
		<KpiCard label="Churn" value={`${data.stats.churn || 0}%`} />
	</div>

	<PageSection>
		<OverviewGraph title="Finance Overview" description="Ringkasan pendapatan" />
	</PageSection>

	<PageSection>
		<div class="mb-4 flex items-center justify-between">
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Recent Transactions</h2>
			<a href="/dashboard/admin/payments"><Button variant="ghost">Lihat semua</Button></a>
		</div>
		<Table {columns} {rows} />
	</PageSection>
</div>
