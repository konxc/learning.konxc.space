<script lang="ts">
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import {
		COLOR,
		TEXT,
		SPACING,
		RADIUS,
		ELEVATION,
		GRADIENT,
		TRANSITION
	} from '$lib/config/design';
	import { fade, fly } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface DashboardAdminProps {
		data: any;
	}

	let { data }: DashboardAdminProps = $props();

	// Mock system pulse state — replaced with real session count from DB
	// systemHealth and activeUsers are now passed via data.systemStats
	const systemHealth = $derived(data.systemStats?.health ?? 99.9);
	const activeUsers = $derived(data.systemStats?.activeUsers ?? data.stats?.totalUsers ?? 0);

	const columns = [
		{ key: 'applicant', label: 'Candidate' },
		{ key: 'submittedAt', label: 'Timestamp' },
		{ key: 'status', label: 'Verdict' }
	];
	const rows = (data.pendingApplicationsList ?? []).map((a: any) => ({
		applicant: a.username ?? a.userId,
		submittedAt: a.createdAt
			? new Date(a.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
			: '-',
		status: a.status ?? 'Pending'
	}));
</script>

<div class="animate-in fade-in flex flex-col gap-10 duration-1000 md:gap-14">
	<!-- High-Fidelity Authority Header -->
	<header
		class={`relative overflow-hidden p-10 ${RADIUS.card} border ${COLOR.cardBorder} bg-white shadow-2xl transition-all hover:shadow-red-500/5 dark:bg-zinc-900`}
	>
		<!-- Background Dynamic Elements -->
		<div
			class="absolute -top-20 -right-20 h-80 w-80 animate-pulse rounded-full bg-red-500/5 blur-[100px] dark:bg-red-500/10"
		></div>

		<div class="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
			<div class="space-y-6">
				<div class="flex items-center gap-3">
					<div
						class="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-black tracking-widest text-red-700 uppercase shadow-sm dark:border-red-900/30 dark:bg-red-900/20"
					>
						Admin Command
					</div>
					<div
						class="flex items-center gap-1.5 rounded-md bg-zinc-950 px-2 py-1 text-[9px] font-black tracking-tighter text-white uppercase dark:bg-white dark:text-zinc-950"
					>
						<span class="h-1.5 w-1.5 animate-ping rounded-full bg-red-500"></span>
						System Live
					</div>
				</div>

				<div class="space-y-2">
					<h1
						class="text-5xl leading-[0.85] font-black tracking-tighter text-zinc-900 md:text-7xl dark:text-white"
					>
						Platform <span
							class="bg-linear-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent italic"
							>Oversight</span
						>
					</h1>
					<p
						class="max-w-xl text-base leading-relaxed font-medium text-zinc-500 dark:text-zinc-400"
					>
						Central nervous system of Naik Kelas. Monitor health metrics, manage mentor ingress, and
						audit total system value across all ecosystem nodes.
					</p>
				</div>
			</div>

			<!-- Real-time Pulse Widgets -->
			<div class="grid grid-cols-2 items-center gap-4 lg:flex lg:flex-row lg:gap-6">
				<div
					class={`p-6 ${RADIUS.card} border bg-zinc-50 dark:bg-zinc-800/50 ${COLOR.cardBorder} group flex items-center gap-4 transition-colors hover:border-emerald-500/30`}
				>
					<div class="text-right">
						<p
							class={`text-[9px] font-black ${COLOR.textMuted} mb-2 leading-none tracking-widest uppercase`}
						>
							Pulse Health
						</p>
						<p
							class="text-2xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white"
						>
							{systemHealth}%
						</p>
					</div>
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110"
					>
						<Icon name="activity" size={20} />
					</div>
				</div>

				<div
					class={`p-6 ${RADIUS.card} border bg-zinc-50 dark:bg-zinc-800/50 ${COLOR.cardBorder} group flex items-center gap-4 transition-colors hover:border-blue-500/30`}
				>
					<div class="text-right">
						<p
							class={`text-[9px] font-black ${COLOR.textMuted} mb-2 leading-none tracking-widest uppercase`}
						>
							Active Nodes
						</p>
						<p
							class="text-2xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white"
						>
							{activeUsers}
						</p>
					</div>
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110"
					>
						<Icon name="users" size={20} />
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- High-Frequency Analytics Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<div
			class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden ${TRANSITION.all} hover:-translate-y-1`}
		>
			<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}
				>Universal Ingress</span
			>
			<div class="mt-4 flex items-end gap-3">
				<p class="text-5xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white">
					{data.stats.totalUsers || 0}
				</p>
				<span class="mb-1 text-[10px] font-black text-emerald-500 uppercase">+12%</span>
			</div>
			<div
				class="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800"
			>
				<span class={`text-[9px] font-bold ${COLOR.textMuted}`}
					>S:{data.stats.totalStudents || 0} • M:{data.stats.totalMentors || 0}</span
				>
				<div class="h-1 w-12 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
					<div class="h-full w-3/4 bg-blue-600"></div>
				</div>
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden border-l-4 border-l-emerald-500 ${TRANSITION.all} hover:-translate-y-1`}
		>
			<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}
				>Operational Tracks</span
			>
			<div class="mt-4 flex items-end gap-3">
				<p class="text-5xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white">
					{data.stats.activeEnrollments || 0}
				</p>
				<span class="mb-1 text-[10px] font-black text-emerald-500 uppercase">Live</span>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-5 transition-opacity group-hover:opacity-10"
			>
				🎓
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden border-l-4 border-l-orange-500 ${TRANSITION.all} hover:-translate-y-1`}
		>
			<div class="flex items-center gap-2">
				<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}
					>Ecosystem Requests</span
				>
				{#if data.stats.pendingApplications > 0}
					<div class="h-2 w-2 animate-pulse rounded-full bg-red-600"></div>
				{/if}
			</div>
			<div class="mt-4 flex items-end gap-2">
				<p class="text-5xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white">
					{data.stats.pendingApplications || 0}
				</p>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-5 transition-opacity group-hover:opacity-10"
			>
				📄
			</div>
		</div>

		<div
			class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden border-l-4 border-l-blue-500 ${TRANSITION.all} hover:-translate-y-1`}
		>
			<span class={`text-[10px] font-black tracking-widest ${COLOR.textMuted} uppercase`}
				>Global Catalog</span
			>
			<div class="mt-4 flex items-end gap-3">
				<p class="text-5xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white">
					{data.stats.publishedCourses || 0}
				</p>
				<span class="mb-1 text-[10px] font-black text-blue-500 uppercase"
					>of {data.stats.totalCourses || 0}</span
				>
			</div>
			<div
				class="absolute right-4 bottom-4 text-3xl opacity-5 transition-opacity group-hover:opacity-10"
			>
				📦
			</div>
		</div>
	</div>

	<!-- System Performance Architecture -->
	<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
		<div class="space-y-8 lg:col-span-8">
			<!-- Strategic Sub-Protocol Stats -->
			<div class="grid grid-cols-2 gap-5 md:grid-cols-4">
				{#each [{ label: 'Creators', value: data.stats.trackCounts?.creator || 0, icon: '🎥', color: 'from-purple-500 to-indigo-500' }, { label: 'Sellers', value: data.stats.trackCounts?.seller || 0, icon: '🛒', color: 'from-orange-500 to-amber-500' }, { label: 'Affiliates', value: data.stats.trackCounts?.affiliate || 0, icon: '🔗', color: 'from-blue-500 to-cyan-500' }, { label: 'Learners', value: data.stats.trackCounts?.student || data.stats.totalStudents || 0, icon: '💡', color: 'from-emerald-500 to-teal-500' }] as stat}
					<div
						class={`p-5 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} group flex flex-col justify-between hover:-translate-y-1 ${TRANSITION.all}`}
					>
						<div class="mb-4 flex items-center justify-between">
							<span
								class="text-[18px] transition-transform group-hover:scale-110 group-hover:rotate-6"
								>{stat.icon}</span
							>
							<div class={`h-1 w-8 rounded-full bg-linear-to-r ${stat.color} opacity-20`}></div>
						</div>
						<div>
							<p
								class="mb-1 text-2xl leading-none font-black tracking-tighter text-zinc-900 dark:text-white"
							>
								{stat.value}
							</p>
							<p
								class={`text-[9px] font-black ${COLOR.textMuted} leading-none tracking-widest uppercase`}
							>
								{stat.label}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Engagement Velocity Graph -->
			<div
				class={`overflow-hidden ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} group shadow-sm`}
			>
				<div
					class="flex items-center justify-between border-b border-zinc-100 p-8 dark:border-zinc-800"
				>
					<div>
						<h3 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
							Engagement Velocity
						</h3>
						<p class={`text-xs font-medium ${COLOR.textMuted}`}>
							Normalized activity index across nodal points
						</p>
					</div>
					<div class="flex gap-2">
						{#each ['WEEK', 'MONTH', 'QUARTER'] as filter}
							<button
								class={`rounded-md border border-zinc-100 px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors ${COLOR.surfaceHover} dark:border-zinc-800`}
								>{filter}</button
							>
						{/each}
					</div>
				</div>
				<div
					class="p-8 transition-colors group-hover:bg-zinc-50/20 dark:group-hover:bg-zinc-900/10"
				>
					<OverviewGraph noCard={true} dataPoints={data.activityGraph ?? []} />
				</div>
			</div>
		</div>

		<div class="flex h-full flex-col gap-8 lg:col-span-4">
			<!-- Advanced Control Widget (Management Center) -->
			<div
				class={`flex flex-1 flex-col ${RADIUS.card} ${COLOR.card} relative overflow-hidden border-2 border-zinc-100 p-8 shadow-sm dark:border-zinc-800`}
			>
				<div
					class="pointer-events-none absolute -right-4 -bottom-4 rotate-12 text-8xl leading-none font-black tracking-tighter uppercase opacity-5 grayscale"
				>
					Control
				</div>
				<h3 class={`mb-8 text-xs font-black tracking-widest ${COLOR.textMuted} uppercase`}>
					Operational Center
				</h3>

				<div class="flex-1 space-y-3">
					<button
						class="flex w-full items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} group shadow-sm hover:border-blue-600/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
					>
						<div class="flex items-center gap-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm transition-transform group-hover:scale-110 dark:bg-blue-950 dark:text-blue-400"
							>
								<Icon name="archive" size={18} />
							</div>
							<span
								class="text-[11px] font-black tracking-tight text-zinc-700 uppercase dark:text-zinc-300"
								>Force Indexing</span
							>
						</div>
					</button>

					<button
						class="flex w-full items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} group shadow-sm hover:border-orange-600/30 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
					>
						<div class="flex items-center gap-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-sm transition-transform group-hover:scale-110 dark:bg-orange-950 dark:text-orange-400"
							>
								<Icon name="zap" size={18} />
							</div>
							<span
								class="text-[11px] font-black tracking-tight text-zinc-700 uppercase dark:text-zinc-300"
								>Purge Buffers</span
							>
						</div>
					</button>

					<a
						href="/app/admin/users"
						class={`flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} shadow-sm hover:border-zinc-200 ${COLOR.surfaceHover}`}
					>
						<div class="flex items-center gap-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 shadow-sm dark:bg-zinc-800 dark:text-zinc-400"
							>
								<Icon name="users" size={18} />
							</div>
							<span
								class="text-[11px] font-black tracking-tight text-zinc-700 uppercase dark:text-zinc-300"
								>Identity Audit</span
							>
						</div>
					</a>
				</div>
			</div>

			<!-- Strategic Health Card (Mentor Tip) -->
			<div
				class={`${RADIUS.card} group relative overflow-hidden border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-8 text-white shadow-xl`}
			>
				<div class="relative z-10 space-y-3">
					<h4 class="text-[10px] leading-none font-black tracking-widest text-blue-400 uppercase">
						Mentor Protocol
					</h4>
					<p class="text-xl leading-tight font-black tracking-tighter uppercase italic">
						Quality Insight Deployment
					</p>
					<p class="text-[10px] leading-relaxed font-medium opacity-60">
						Quality feedback is the fuel of learning. Take 15 minutes today to leave detailed
						comments on pending submissions to accelerate node growth.
					</p>
				</div>
				<div
					class="absolute -right-2 -bottom-2 text-7xl opacity-10 grayscale transition-transform duration-700 group-hover:rotate-12"
				>
					💡
				</div>
			</div>
		</div>
	</div>

	<!-- Oversight Ledger -->
	<PageSection noCard={true}>
		<div class="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
			<div class="flex items-center gap-6">
				<div
					class="group flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl transition-transform hover:scale-105 dark:bg-white dark:text-zinc-950"
				>
					<Icon name="file-text" size={24} />
				</div>
				<div class="space-y-1">
					<h2
						class="text-3xl leading-none font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
					>
						Ingress Queue
					</h2>
					<p class="text-[10px] font-black tracking-[0.2em] text-red-600 uppercase">
						Mentor Application Protocols
					</p>
				</div>
			</div>
			<a href="/app/admin/mentor-applications">
				<Button
					variant="ghost"
					class="h-10 rounded-full border border-zinc-200 px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-zinc-950 hover:text-white dark:border-zinc-800"
					>Full Ingress View</Button
				>
			</a>
		</div>

		<div
			class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} animate-in fade-in slide-in-from-bottom-8 shadow-2xl delay-500 duration-1000`}
		>
			<div
				class="h-1 bg-linear-to-r from-red-600/10 via-orange-500/10 to-transparent p-1 px-8"
			></div>
			<Table {columns} {rows} />
			<div
				class="flex justify-center border-t border-zinc-100 bg-zinc-50/50 px-8 py-4 dark:border-zinc-800 dark:bg-zinc-900/50"
			>
				<a
					href="/app/admin/mentor-applications"
					class="text-[9px] font-black tracking-[0.3em] text-red-600 uppercase italic hover:underline"
					>Access secure node for all records</a
				>
			</div>
		</div>
	</PageSection>
</div>
