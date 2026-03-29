<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import DashboardHeader from '$lib/components/layouts/DashboardHeader.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, GRADIENT, TRANSITION, SPACING } from '$lib/config/design';
	import { fly, fade, scale } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	// Helper to generate initials for avatar
	function getInitials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.substring(0, 2);
	}

	// Helper for medals
	const medals = ['🥇', '🥈', '🥉'];
	const medalColors = [
		'from-amber-400 to-yellow-600',
		'from-zinc-300 to-slate-500',
		'from-orange-400 to-amber-700'
	];
</script>

<svelte:head>
	<title>Hall of Fame — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="flex flex-col gap-12 lg:gap-14">
		<!-- Unified Header Strategy (Matches Dashboards) -->
		<header
			class="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end"
			in:fade={{ duration: 800 }}
		>
			<div class="space-y-4">
				<div class="flex items-center gap-2.5">
					<div class="h-2 w-2 animate-pulse rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"></div>
					<span class={`${TEXT.small} ${COLOR.textMuted} tracking-[0.25em]`}
						>HALL OF FAME • GLOBAL RANKINGS</span
					>
				</div>
				<h1 class="text-4xl md:text-5xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">
					The <span
						class="bg-linear-to-r from-amber-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent"
						>Elite Board</span
					>
				</h1>
				<p class={`${TEXT.secondary} max-w-xl font-medium leading-relaxed`}>
					Celebrating the top achievers and most active students in the Naik Kelas ecosystem. 
					Are you ready to claim your spot at the top?
				</p>
			</div>

			<!-- Premium Dashboard Controls -->
		</header>

		<!-- Hall of Fame: Showcase Section -->
		<div
			class={`relative overflow-hidden rounded-[2.5rem] bg-zinc-900 p-8 lg:p-12 text-white shadow-2xl`}
			in:fly={{ y: 40, duration: 800 }}
		>
			<!-- Background Decorations -->
			<div class="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]"></div>
			<div class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px]"></div>

			<div class="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
				
				<!-- Left: Your Current Status -->
				<div class="lg:col-span-4 space-y-8">
					<div in:fade={{ delay: 200 }}>
						<span class="inline-block rounded-full bg-blue-500/20 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase border border-blue-500/30 mb-4">
							Performance Status
						</span>
						<h1 class="text-4xl font-black tracking-tighter lg:text-5xl">Your Current Standing</h1>
					</div>

					{#if data.userXP}
						<div 
							class="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
							in:fly={{ x: -20, delay: 400 }}
						>
							<div class="flex items-center justify-between mb-8">
								<div class="flex items-baseline gap-2">
									<span class="text-5xl font-black tracking-tighter text-blue-400">#{data.userRank || '-'}</span>
									<span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Rank</span>
								</div>
								<div class="h-10 w-10 flex items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg font-black text-sm">
									Lv.{data.userXP.level}
								</div>
							</div>

							<div class="space-y-4">
								<div class="flex items-center justify-between text-sm">
									<span class="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Experience points</span>
									<span class="font-black text-white">{data.userXP.points} XP</span>
								</div>
								<div class="h-2 w-full overflow-hidden rounded-full bg-white/5 shadow-inner">
									<div
										class="h-full rounded-full bg-linear-to-r from-blue-400 via-blue-500 to-purple-600 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
										style="width: {Math.min(data.userXP.points % 100, 100)}%"
									></div>
								</div>
								<div class="flex items-center justify-between text-[11px] font-bold text-zinc-500">
									<span>NEXT LEVEL</span>
									<span class="tracking-widest">{100 - (data.userXP.points % 100)} XP TO GO</span>
								</div>
							</div>

							{#if data.userBadges.length > 0}
								<div class="mt-8 flex flex-wrap gap-2 pt-6 border-t border-white/5">
									{#each data.userBadges as badge}
										<div class="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-all hover:bg-white/10 hover:scale-110 border border-white/5 hover:border-white/20">
											<span class="text-lg">{badge.icon || '🏅'}</span>
											<!-- Tooltip if needed, omitted for brevity -->
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Right: The Champions Podium -->
				<div class="lg:col-span-8">
					{#if data.leaderboard.length >= 3}
						<div class="flex items-end justify-center gap-4 py-8">
							<!-- 🥈 2nd Place -->
							<div class="flex flex-col items-center gap-4" in:fly={{ y: 20, delay: 600 }}>
								<div class="relative">
									<div class="h-16 w-16 overflow-hidden rounded-full border-4 border-zinc-400 shadow-2xl">
										<div class="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-200 to-slate-400 font-black text-xl text-zinc-900">
											{getInitials(data.leaderboard[1].fullName || data.leaderboard[1].username)}
										</div>
									</div>
									<div class="absolute -bottom-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-400 text-[10px] font-bold text-zinc-900 shadow-lg border-2 border-zinc-900">
										2
									</div>
								</div>
								<div class="text-center">
									<p class="max-w-[100px] truncate text-xs font-black tracking-tight uppercase mb-1">
										{data.leaderboard[1].fullName || data.leaderboard[1].username}
									</p>
									<span class="text-[10px] font-bold text-zinc-500 tracking-widest">{data.leaderboard[1].points} XP</span>
								</div>
								<div class="h-32 w-28 rounded-t-3xl bg-linear-to-t from-white/5 to-zinc-400/20 backdrop-blur-md flex flex-col items-center justify-center border-t border-x border-white/10">
									<span class="text-4xl font-black text-zinc-400 drop-shadow-lg opacity-50">2nd</span>
								</div>
							</div>

							<!-- 🥇 1st Place -->
							<div class="flex flex-col items-center gap-6" in:fly={{ y: 20, delay: 800 }}>
								<div class="relative">
									<div class="h-24 w-24 overflow-hidden rounded-full border-4 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
										<div class="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-200 to-yellow-600 font-black text-2xl text-amber-900">
											{getInitials(data.leaderboard[0].fullName || data.leaderboard[0].username)}
										</div>
									</div>
									<div class="absolute -bottom-2 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-amber-900 shadow-lg border-2 border-zinc-900">
										<span class="leading-none">🏆</span>
									</div>
									<!-- Floating Crown Decoration -->
									<div class="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl animate-bounce">👑</div>
								</div>
								<div class="text-center">
									<p class="max-w-[140px] truncate text-sm font-black tracking-tighter uppercase mb-1 drop-shadow-md">
										{data.leaderboard[0].fullName || data.leaderboard[0].username}
									</p>
									<span class="text-xs font-bold text-amber-400 tracking-widest leading-none drop-shadow-sm">{data.leaderboard[0].points} XP</span>
								</div>
								<div class="h-56 w-36 rounded-t-3xl bg-linear-to-t from-white/10 to-amber-500/20 backdrop-blur-md flex flex-col items-center justify-center border-t border-x border-white/20 shadow-2xl relative">
									<div class="absolute inset-0 bg-amber-400/5 blur-xl"></div>
									<span class="text-6xl font-black text-amber-400 drop-shadow-lg opacity-60">1st</span>
								</div>
							</div>

							<!-- 🥉 3rd Place -->
							<div class="flex flex-col items-center gap-3" in:fly={{ y: 20, delay: 1000 }}>
								<div class="relative">
									<div class="h-14 w-14 overflow-hidden rounded-full border-4 border-orange-600 shadow-2xl">
										<div class="flex h-full w-full items-center justify-center bg-linear-to-br from-orange-300 to-amber-700 font-black text-lg text-orange-950">
											{getInitials(data.leaderboard[2].fullName || data.leaderboard[2].username)}
										</div>
									</div>
									<div class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-lg border-2 border-zinc-900">
										3
									</div>
								</div>
								<div class="text-center">
									<p class="max-w-[100px] truncate text-xs font-black tracking-tight uppercase mb-1">
										{data.leaderboard[2].fullName || data.leaderboard[2].username}
									</p>
									<span class="text-[10px] font-bold text-zinc-500 tracking-widest">{data.leaderboard[2].points} XP</span>
								</div>
								<div class="h-24 w-24 rounded-t-3xl bg-linear-to-t from-white/5 to-orange-400/20 backdrop-blur-md flex flex-col items-center justify-center border-t border-x border-white/10">
									<span class="text-3xl font-black text-orange-400 drop-shadow-lg opacity-40">3rd</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Competitive Rankings Table -->
		<div class="space-y-6">
			<div class="flex items-end justify-between px-6">
				<div>
					<h2 class="text-2xl font-black tracking-tight">Full Rankings</h2>
					<p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Showing top performers per track</p>
				</div>
				<div class="flex items-center gap-2">
					<div class="flex items-center gap-1.5 rounded-full bg-white border border-zinc-100 p-1 pr-3 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
						<div class="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px]">🔥</div>
						<span class="text-[10px] font-black tracking-widest">GLOBAL HEAT</span>
					</div>
				</div>
			</div>

			<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.card} border ${COLOR.cardBorder} overflow-hidden`}>
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
							<th class={`px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}>RANK</th>
							<th class={`px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}>STUDENT</th>
							<th class={`px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}>LEVEL</th>
							<th class={`px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}>TOTAL XP</th>
							<th class={`px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}>MOMENTUM</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-zinc-50 dark:divide-zinc-800">
						{#each data.leaderboard as entry, i}
							{@const isMe = entry.userId === data.userXP?.userId}
							<tr 
								class={`group transition-all hover:bg-zinc-50 dark:hover:bg-white/5 ${isMe ? 'bg-blue-50/50 dark:bg-blue-500/5 ring-1 ring-inset ring-blue-500/20' : ''}`}
								in:fly={{ y: 20, delay: 500 + i * 50 }}
							>
								<!-- Rank Column -->
								<td class="px-8 py-5">
									<div class="flex items-center gap-3">
										{#if entry.rank <= 3}
											<div class={`h-8 w-8 flex items-center justify-center rounded-lg bg-linear-to-br ${medalColors[entry.rank-1]} text-base shadow-lg`}>
												{medals[entry.rank-1]}
											</div>
										{:else if entry.rank <= 10}
											<div class="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-100 text-xs font-black text-zinc-500 dark:bg-zinc-800">
												#{entry.rank}
											</div>
										{:else}
											<span class="pl-2 text-sm font-bold text-zinc-400">#{entry.rank}</span>
										{/if}
									</div>
								</td>

								<!-- Student Column -->
								<td class="px-8 py-5">
									<div class="flex items-center gap-4">
										<div class="h-10 w-10 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-700 shadow-sm transition-transform group-hover:scale-110">
											<div class={`flex h-full w-full items-center justify-center text-xs font-black ${isMe ? 'bg-blue-500 text-white' : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'}`}>
												{getInitials(entry.fullName || entry.username)}
											</div>
										</div>
										<div class="flex flex-col">
											<span class={`text-sm font-black tracking-tight ${isMe ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-white'}`}>
												{entry.fullName || entry.username}
												{#if isMe}
													<span class="ml-2 text-[8px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-sm uppercase tracking-[0.1em] dark:bg-blue-900/40 dark:text-blue-300">YOU</span>
												{/if}
											</span>
											<span class="text-[10px] font-bold text-zinc-400 tracking-wider">MEMBER SINCE {new Date().getFullYear()}</span>
										</div>
									</div>
								</td>

								<!-- Level Column -->
								<td class="px-8 py-5">
									<div class="flex items-center gap-2">
										<div class="flex h-7 w-12 items-center justify-center rounded-lg bg-linear-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-[10px] font-black text-purple-600 dark:text-purple-400">
											LV. {entry.level}
										</div>
									</div>
								</td>

								<!-- Points Column -->
								<td class="px-8 py-5">
									<div class="flex flex-col">
										<span class="text-sm font-black text-zinc-900 dark:text-white leading-none">{entry.points.toLocaleString()}</span>
										<span class="text-[9px] font-black text-zinc-400 tracking-widest uppercase mt-1">ACCUMULATED</span>
									</div>
								</td>

								<!-- Momentum / Streak Column -->
								<td class="px-8 py-5">
									{#if entry.streakDays > 0}
										<div class="flex items-center gap-2">
											<div class="flex h-7 px-3 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-black text-orange-600 dark:text-orange-400">
												🔥 {entry.streakDays}
											</div>
											<div class="h-1.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
												<div class="h-full bg-orange-500 rounded-full" style="width: {Math.min(10 + entry.streakDays * 5, 100)}%"></div>
											</div>
										</div>
									{:else}
										<span class="text-xs font-bold text-zinc-300">-</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>

				{#if data.leaderboard.length === 0}
					<div class="flex flex-col items-center justify-center py-20 text-center" in:fade>
						<div class="h-20 w-20 rounded-full bg-zinc-50 flex items-center justify-center text-4xl mb-4 dark:bg-zinc-800">📭</div>
						<p class="text-lg font-black text-zinc-900 dark:text-white">The board is silent...</p>
						<p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">Start learning to claim your spot in the Hall of Fame</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</PageWrapper>

