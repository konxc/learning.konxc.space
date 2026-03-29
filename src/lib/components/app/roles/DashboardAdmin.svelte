<script lang="ts">
	import OverviewGraph from '$lib/components/app/OverviewGraph.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, TEXT, SPACING, RADIUS, ELEVATION, GRADIENT, TRANSITION } from '$lib/config/design';
	import { fade, fly } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface DashboardAdminProps {
		data: any;
	}

	let { data }: DashboardAdminProps = $props();

	// Mock system pulse state
	const systemHealth = 98.4;
	const activeUsers = 12;

	const columns = [
		{ key: 'applicant', label: 'Candidate' },
		{ key: 'submittedAt', label: 'Timestamp' },
		{ key: 'status', label: 'Verdict' }
	];
	const rows = (data.pendingApplicationsList ?? []).map((a: any) => ({
		applicant: a.username ?? a.userId,
		submittedAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '-',
		status: a.status ?? 'Pending'
	}));
</script>

<div class="flex flex-col gap-10 md:gap-14 animate-in fade-in duration-1000">
	<!-- High-Fidelity Authority Header -->
	<header 
		class={`relative overflow-hidden p-10 ${RADIUS.card} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 shadow-2xl transition-all hover:shadow-red-500/5`}
	>
		<!-- Background Dynamic Elements -->
		<div class="absolute -top-20 -right-20 w-80 h-80 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-[100px] animate-pulse"></div>
		
		<div class="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
			<div class="space-y-6">
				<div class="flex items-center gap-3">
					<div class="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 text-[10px] font-black tracking-widest uppercase shadow-sm">
						Admin Command
					</div>
					<div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[9px] font-black uppercase tracking-tighter">
						<span class="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
						System Live
					</div>
				</div>
				
				<div class="space-y-2">
					<h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] text-zinc-900 dark:text-white">
						Platform <span class="bg-linear-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent italic">Oversight</span>
					</h1>
					<p class="max-w-xl text-base font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
						Central nervous system of Naik Kelas. Monitor health metrics, manage mentor ingress, and 
						audit total system value across all ecosystem nodes.
					</p>
				</div>
			</div>

			<!-- Real-time Pulse Widgets -->
			<div class="grid grid-cols-2 gap-4 lg:flex lg:flex-row items-center lg:gap-6">
				<div class={`p-6 ${RADIUS.card} bg-zinc-50 dark:bg-zinc-800/50 border ${COLOR.cardBorder} flex items-center gap-4 group hover:border-emerald-500/30 transition-colors`}>
					<div class="text-right">
						<p class="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Pulse Health</p>
						<p class="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter">{systemHealth}%</p>
					</div>
					<div class="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
						<Icon name="activity" size={20} />
					</div>
				</div>

				<div class={`p-6 ${RADIUS.card} bg-zinc-50 dark:bg-zinc-800/50 border ${COLOR.cardBorder} flex items-center gap-4 group hover:border-blue-500/30 transition-colors`}>
					<div class="text-right">
						<p class="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Concurrents</p>
						<p class="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter">{activeUsers}</p>
					</div>
					<div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
						<Icon name="users" size={20} />
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- High-Frequency Analytics Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden ${TRANSITION.all} hover:-translate-y-1`}>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Universal Ingress</span>
			<div class="mt-4 flex items-end gap-3">
				<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
					{data.stats.totalUsers || 0}
				</p>
				<span class="mb-1 text-[10px] font-black text-emerald-500 uppercase">+12%</span>
			</div>
			<div class="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
				<span class="text-[9px] font-bold text-zinc-400">S:{data.stats.totalStudents || 0} • M:{data.stats.totalMentors || 0}</span>
				<div class="h-1 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
					<div class="h-full bg-blue-600 w-3/4"></div>
				</div>
			</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden border-l-4 border-l-emerald-500 ${TRANSITION.all} hover:-translate-y-1`}>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Operational Tracks</span>
			<div class="mt-4 flex items-end gap-3">
				<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
					{data.stats.activeEnrollments || 0}
				</p>
				<span class="mb-1 text-[10px] font-black text-emerald-500 uppercase">Live</span>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-5 group-hover:opacity-10 transition-opacity">🎓</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden border-l-4 border-l-orange-500 ${TRANSITION.all} hover:-translate-y-1`}>
			<div class="flex items-center gap-2">
				<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Ecosystem Requests</span>
				{#if data.stats.pendingApplications > 0}
					<div class="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
				{/if}
			</div>
			<div class="mt-4 flex items-end gap-2">
				<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
					{data.stats.pendingApplications || 0}
				</p>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-5 group-hover:opacity-10 transition-opacity">📄</div>
		</div>

		<div class={`group relative p-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden border-l-4 border-l-blue-500 ${TRANSITION.all} hover:-translate-y-1`}>
			<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Global Catalog</span>
			<div class="mt-4 flex items-end gap-3">
				<p class="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
					{data.stats.publishedCourses || 0}
				</p>
				<span class="mb-1 text-[10px] font-black text-blue-500 uppercase">of {data.stats.totalCourses || 0}</span>
			</div>
			<div class="absolute bottom-4 right-4 text-3xl opacity-5 group-hover:opacity-10 transition-opacity">📦</div>
		</div>
	</div>

	<!-- System Performance Architecture -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
		<div class="lg:col-span-8 space-y-8">
			<!-- Strategic Sub-Protocol Stats -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-5">
				{#each [
					{ label: 'Creators', value: data.stats.trackCounts?.creator || 0, icon: '🎥', color: 'from-purple-500 to-indigo-500' },
					{ label: 'Sellers', value: data.stats.trackCounts?.seller || 0, icon: '🛒', color: 'from-orange-500 to-amber-500' },
					{ label: 'Affiliates', value: data.stats.trackCounts?.affiliate || 0, icon: '🔗', color: 'from-blue-500 to-cyan-500' },
					{ label: 'Learners', value: data.stats.trackCounts?.student || data.stats.totalStudents || 0, icon: '💡', color: 'from-emerald-500 to-teal-500' }
				] as stat}
					<div class={`p-5 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} flex flex-col justify-between group hover:-translate-y-1 ${TRANSITION.all}`}>
						<div class="flex items-center justify-between mb-4">
							<span class="text-[18px] group-hover:scale-110 group-hover:rotate-6 transition-transform">{stat.icon}</span>
							<div class={`h-1 w-8 rounded-full bg-linear-to-r ${stat.color} opacity-20`}></div>
						</div>
						<div>
							<p class="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter mb-1">{stat.value}</p>
							<p class="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">{stat.label}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Engagement Velocity Graph -->
			<div class={`overflow-hidden ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} shadow-sm group`}>
				<div class="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
					<div>
						<h3 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Engagement Velocity</h3>
						<p class="text-xs font-medium text-zinc-400">Normalized activity index across nodal points</p>
					</div>
					<div class="flex gap-2">
						{#each ['WEEK', 'MONTH', 'QUARTER'] as filter}
							<button class="px-3 py-1 text-[9px] font-bold border border-zinc-100 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 uppercase tracking-widest transition-colors">{filter}</button>
						{/each}
					</div>
				</div>
				<div class="p-8 group-hover:bg-zinc-50/20 dark:group-hover:bg-zinc-900/10 transition-colors">
					<OverviewGraph
						noCard={true}
						dataPoints={[40, 60, 45, 90, 100, 80, 50, 70, 85, 95, 110, 120]}
					/>
				</div>
			</div>
		</div>

		<div class="lg:col-span-4 flex flex-col gap-8 h-full">
			<!-- Advanced Control Widget (Management Center) -->
			<div class={`flex-1 flex flex-col ${RADIUS.card} ${COLOR.card} border-2 border-zinc-100 dark:border-zinc-800 p-8 shadow-sm overflow-hidden relative`}>
				<div class="absolute -right-4 -bottom-4 text-8xl opacity-5 grayscale rotate-12 pointer-events-none uppercase font-black tracking-tighter leading-none">Control</div>
				<h3 class="mb-8 text-xs font-black tracking-widest text-zinc-400 uppercase">Operational Center</h3>
				
				<div class="space-y-3 flex-1">
					<button class="flex w-full items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:border-blue-600/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 group shadow-sm">
						<div class="flex items-center gap-4">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-sm">
								<Icon name="archive" size={18} />
							</div>
							<span class="text-[11px] font-black uppercase tracking-tight text-zinc-700 dark:text-zinc-300">Force Indexing</span>
						</div>
					</button>

					<button class="flex w-full items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:border-orange-600/30 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 group shadow-sm">
						<div class="flex items-center gap-4">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400 group-hover:scale-110 transition-transform shadow-sm">
								<Icon name="zap" size={18} />
							</div>
							<span class="text-[11px] font-black uppercase tracking-tight text-zinc-700 dark:text-zinc-300">Purge Buffers</span>
						</div>
					</button>

					<a href="/app/admin/users" class="flex items-center justify-between p-4 ${RADIUS.button} border ${COLOR.cardBorder} ${COLOR.card} ${TRANSITION.all} hover:border-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm">
						<div class="flex items-center gap-4">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 shadow-sm">
								<Icon name="users" size={18} />
							</div>
							<span class="text-[11px] font-black uppercase tracking-tight text-zinc-700 dark:text-zinc-300">Identity Audit</span>
						</div>
					</a>
				</div>
			</div>

			<!-- Strategic Health Card (Mentor Tip) -->
			<div class={`${RADIUS.card} bg-linear-to-br from-zinc-900 to-zinc-950 p-8 text-white relative overflow-hidden group shadow-xl border border-zinc-800`}>
				<div class="relative z-10 space-y-3">
					<h4 class="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Mentor Protocol</h4>
					<p class="text-xl font-black italic tracking-tighter leading-tight uppercase">Quality Insight Deployment</p>
					<p class="text-[10px] font-medium leading-relaxed opacity-60">
						Quality feedback is the fuel of learning. Take 15 minutes today to leave detailed comments on pending submissions to accelerate node growth.
					</p>
				</div>
				<div class="absolute -right-2 -bottom-2 text-7xl opacity-10 grayscale transition-transform group-hover:rotate-12 duration-700">💡</div>
			</div>
		</div>
	</div>

	<!-- Oversight Ledger -->
	<PageSection noCard={true}>
		<div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
			<div class="flex items-center gap-6">
				<div class="h-14 w-14 rounded-2xl bg-zinc-950 flex items-center justify-center text-white dark:bg-white dark:text-zinc-950 shadow-xl group hover:scale-105 transition-transform">
					<Icon name="file-text" size={24} />
				</div>
				<div class="space-y-1">
					<h2 class="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none uppercase italic">Ingress Queue</h2>
					<p class="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Mentor Application Protocols</p>
				</div>
			</div>
			<a href="/app/admin/mentor-applications">
				<Button variant="ghost" class="h-10 px-6 text-[10px] font-black tracking-widest uppercase border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-950 hover:text-white transition-all">Full Ingress View</Button>
			</a>
		</div>

		<div class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500`}>
			<div class="p-1 px-8 bg-linear-to-r from-red-600/10 via-orange-500/10 to-transparent h-1"></div>
			<Table {columns} {rows} />
			<div class="px-8 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
				<a href="/app/admin/mentor-applications" class="text-[9px] font-black text-red-600 hover:underline uppercase tracking-[0.3em] italic">Access secure node for all records</a>
			</div>
		</div>
	</PageSection>
</div>
