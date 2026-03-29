<script lang="ts">
	import KpiCard from '$lib/components/KpiCard.svelte';
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import RoleSwitcher from '$lib/components/app/RoleSwitcher.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING, RADIUS, ELEVATION, GRADIENT } from '$lib/config/design';
	import { fade, fly } from 'svelte/transition';

	interface DashboardAdminProps {
		data: any;
	}

	let { data }: DashboardAdminProps = $props();

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

<div class="flex flex-col gap-12 lg:gap-14">
	<!-- Standardized Header -->
	<header
		class="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end"
		in:fade={{ duration: 800 }}
	>
		<div class="space-y-4">
			<div class="flex items-center gap-2.5">
				<div class="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"></div>
				<span class={`${TEXT.small} ${COLOR.textMuted} tracking-[0.25em]`}
					>ADMIN CONSOLE • SYSTEM LIVE</span
				>
			</div>
			<h1 class="text-4xl md:text-5xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">
				Platform <span class="bg-linear-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Overview</span>
			</h1>
			<p class={`${TEXT.secondary} max-w-xl font-medium leading-relaxed`}>
				C-level summary of platform health, mentor applications, and financial settlement status.
			</p>
		</div>

		<div
			class="flex items-center gap-5 rounded-[1.5rem] bg-white/5 shadow-sm transition-all"
			in:fade={{ duration: 1000, delay: 200 }}
		>
			<RoleSwitcher userRole={data.user.role} />
		</div>
	</header>

	<!-- Bento Grid for Admin Stats -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
		<div class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all`}>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Pending Payments</span>
			<p class="mt-4 text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">{data.stats.pendingPayments || 0}</p>
		</div>
		<div class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all border-l-4 border-l-orange-500`}>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Mentor Apps</span>
			<p class="mt-4 text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">{data.stats.pendingApplications || 0}</p>
		</div>
		<div class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all`}>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Active Users</span>
			<p class="mt-4 text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">{data.stats.activeUsers || 0}</p>
		</div>
		<div class={`p-8 lg:p-10 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} hover:-translate-y-1 transition-all`}>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Total Tracks</span>
			<p class="mt-4 text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">{data.stats.totalCourses || 0}</p>
		</div>
	</div>

	<div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
		<!-- System Activity Graph -->
		<div class="lg:col-span-8">
			<OverviewGraph
				title="System Activity"
				description="Last 30 days of platform usage and enrollments"
				dataPoints={[40, 60, 45, 90, 100, 80, 50, 70, 85, 95, 110, 120]}
			/>
		</div>

		<!-- Action Sidebar: Management -->
		<div class="lg:col-span-4 space-y-8">
			<div class={`${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} p-10 ${ELEVATION.card}`}>
				<h3 class="text-xs font-black tracking-widest text-zinc-400 uppercase mb-8">Management</h3>
				<div class="space-y-4">
					<a href="/app/admin/users" class="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
						<span class="text-sm font-bold">User Directory</span>
						<span class="text-zinc-300">→</span>
					</a>
					<a href="/app/admin/payments" class="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
						<span class="text-sm font-bold">Financial Registry</span>
						<span class="text-zinc-300">→</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	<PageSection>
		<div class="mb-8 flex items-center justify-between">
			<h2 class={`${TEXT.h2} font-black tracking-tight`}>Mentor Applications</h2>
			<a href="/app/admin/mentor-applications">
				<Button variant="ghost" class="text-[10px] font-black tracking-widest uppercase">Manage All</Button>
			</a>
		</div>
		<div class="overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
			<Table {columns} {rows} />
		</div>
	</PageSection>
</div>
