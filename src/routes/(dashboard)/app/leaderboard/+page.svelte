<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { fly, fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	function getInitials(name: string | null) {
		if (!name) return '?';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.substring(0, 2);
	}

	const medals = ['🥇', '🥈', '🥉'];
	const medalColors = [
		'from-amber-400 to-yellow-600',
		'from-zinc-300 to-slate-500',
		'from-orange-400 to-amber-700'
	];

	function setFilter(key: string, value: string) {
		const url = new URL($page.url);
		if (value) {
			url.searchParams.set(key, value);
		} else {
			url.searchParams.delete(key);
		}
		// Clear the other filter
		if (key === 'cohortId') url.searchParams.delete('courseId');
		if (key === 'courseId') url.searchParams.delete('cohortId');
		goto(url.toString());
	}

	// Is current user in top 50?
	const userInTop = $derived(data.leaderboard.some((e) => e.userId === data.currentUserId));
	const userEntry = $derived(data.leaderboard.find((e) => e.userId === data.currentUserId));
</script>

<svelte:head>
	<title>Hall of Fame — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="flex flex-col gap-10">
		<!-- Header -->
		<header
			class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
			in:fade={{ duration: 600 }}
		>
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<div
						class="h-2 w-2 animate-pulse rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
					></div>
					<span class={`${TEXT.small} ${COLOR.textMuted} tracking-[0.25em]`}
						>HALL OF FAME · GLOBAL RANKINGS</span
					>
				</div>
				<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>
					The <span
						class="bg-linear-to-r from-amber-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent"
						>Elite Board</span
					>
				</h1>
			</div>

			<!-- Filter Controls -->
			<div class="flex flex-wrap items-center gap-3">
				<select
					value={data.filters.cohortId}
					onchange={(e) => setFilter('cohortId', (e.currentTarget as HTMLSelectElement).value)}
					class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-2 text-sm ${COLOR.textPrimary} outline-none focus:border-blue-500`}
					aria-label="Filter by cohort"
				>
					<option value="">Semua Cohort</option>
					{#each data.cohorts as cohort}
						<option value={cohort.id}>{cohort.name}</option>
					{/each}
				</select>

				<select
					value={data.filters.courseId}
					onchange={(e) => setFilter('courseId', (e.currentTarget as HTMLSelectElement).value)}
					class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-2 text-sm ${COLOR.textPrimary} outline-none focus:border-blue-500`}
					aria-label="Filter by course"
				>
					<option value="">Semua Kursus</option>
					{#each data.courses as course}
						<option value={course.id}>{course.title}</option>
					{/each}
				</select>
			</div>
		</header>

		<!-- Podium (top 3) -->
		{#if data.leaderboard.length >= 3}
			<div
				class={`relative overflow-hidden rounded-[2rem] bg-zinc-900 p-8 text-white shadow-2xl`}
				in:fly={{ y: 30, duration: 600 }}
			>
				<div
					class="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[80px]"
				></div>
				<div
					class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-purple-600/10 blur-[80px]"
				></div>

				<div class="relative z-10 flex items-end justify-center gap-6 py-6">
					<!-- 2nd -->
					<div class="flex flex-col items-center gap-3" in:fly={{ y: 20, delay: 400 }}>
						<div class="h-14 w-14 overflow-hidden rounded-full border-4 border-zinc-400 shadow-xl">
							<div
								class="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-200 to-slate-400 text-lg font-black text-zinc-900"
							>
								{getInitials(data.leaderboard[1].fullName)}
							</div>
						</div>
						<div class="text-center">
							<p class="max-w-[90px] truncate text-xs font-black uppercase">
								{data.leaderboard[1].fullName ?? data.leaderboard[1].username}
							</p>
							<p class="text-[10px] text-zinc-400">{data.leaderboard[1].points} XP</p>
						</div>
						<div
							class="flex h-28 w-24 items-center justify-center rounded-t-2xl border-x border-t border-white/10 bg-zinc-400/20"
						>
							<span class="text-4xl font-black text-zinc-400 opacity-50">2nd</span>
						</div>
					</div>

					<!-- 1st -->
					<div class="flex flex-col items-center gap-4" in:fly={{ y: 20, delay: 600 }}>
						<div class="animate-bounce text-3xl">👑</div>
						<div
							class="h-20 w-20 overflow-hidden rounded-full border-4 border-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.3)]"
						>
							<div
								class="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-200 to-yellow-600 text-2xl font-black text-amber-900"
							>
								{getInitials(data.leaderboard[0].fullName)}
							</div>
						</div>
						<div class="text-center">
							<p class="max-w-[120px] truncate text-sm font-black uppercase">
								{data.leaderboard[0].fullName ?? data.leaderboard[0].username}
							</p>
							<p class="text-xs text-amber-400">{data.leaderboard[0].points} XP</p>
						</div>
						<div
							class="flex h-48 w-32 items-center justify-center rounded-t-2xl border-x border-t border-white/20 bg-amber-500/20 shadow-xl"
						>
							<span class="text-5xl font-black text-amber-400 opacity-60">1st</span>
						</div>
					</div>

					<!-- 3rd -->
					<div class="flex flex-col items-center gap-3" in:fly={{ y: 20, delay: 800 }}>
						<div
							class="h-12 w-12 overflow-hidden rounded-full border-4 border-orange-600 shadow-xl"
						>
							<div
								class="flex h-full w-full items-center justify-center bg-linear-to-br from-orange-300 to-amber-700 text-base font-black text-orange-950"
							>
								{getInitials(data.leaderboard[2].fullName)}
							</div>
						</div>
						<div class="text-center">
							<p class="max-w-[90px] truncate text-xs font-black uppercase">
								{data.leaderboard[2].fullName ?? data.leaderboard[2].username}
							</p>
							<p class="text-[10px] text-zinc-400">{data.leaderboard[2].points} XP</p>
						</div>
						<div
							class="flex h-20 w-20 items-center justify-center rounded-t-2xl border-x border-t border-white/10 bg-orange-400/20"
						>
							<span class="text-3xl font-black text-orange-400 opacity-40">3rd</span>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Full Rankings Table -->
		<div
			class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.card} border ${COLOR.cardBorder} overflow-hidden`}
		>
			<div class="border-b px-6 py-4 ${COLOR.cardBorder}">
				<h2 class={`${TEXT.h4} ${COLOR.textPrimary}`}>Full Rankings</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr
							class="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50"
						>
							<th
								class={`px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}
								>RANK</th
							>
							<th
								class={`px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}
								>STUDENT</th
							>
							<th
								class={`px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}
								>LEVEL</th
							>
							<th
								class={`px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}
								>XP</th
							>
							<th
								class={`px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}
								>DELTA</th
							>
							<th
								class={`px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase ${COLOR.textMuted}`}
								>STREAK</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-zinc-50 dark:divide-zinc-800">
						{#each data.leaderboard as entry, i}
							{@const isMe = entry.userId === data.currentUserId}
							<tr
								class={`group ${TRANSITION.colors} hover:bg-zinc-50 dark:hover:bg-white/5 ${isMe ? 'bg-blue-50/50 ring-1 ring-blue-500/20 ring-inset dark:bg-blue-500/5' : ''}`}
								in:fly={{ y: 16, delay: 300 + i * 30 }}
							>
								<td class="px-6 py-4">
									{#if entry.rank <= 3}
										<div
											class={`flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br ${medalColors[entry.rank - 1]} text-base shadow`}
										>
											{medals[entry.rank - 1]}
										</div>
									{:else}
										<span class="text-sm font-bold text-zinc-400">#{entry.rank}</span>
									{/if}
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div
											class={`h-9 w-9 overflow-hidden rounded-xl border-2 border-white shadow-sm dark:border-zinc-700 ${isMe ? 'bg-blue-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
										>
											<div
												class={`flex h-full w-full items-center justify-center text-xs font-black ${isMe ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'}`}
											>
												{getInitials(entry.fullName)}
											</div>
										</div>
										<div>
											<span
												class={`text-sm font-black ${isMe ? 'text-blue-600 dark:text-blue-400' : COLOR.textPrimary}`}
											>
												{entry.fullName ?? entry.username}
												{#if isMe}
													<span
														class="ml-1 rounded bg-blue-100 px-1 py-0.5 text-[8px] font-black tracking-wider text-blue-600 uppercase dark:bg-blue-900/40 dark:text-blue-300"
														>YOU</span
													>
												{/if}
											</span>
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<span
										class="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-[10px] font-black text-purple-600 dark:text-purple-400"
									>
										LV.{entry.level}
									</span>
								</td>
								<td class="px-6 py-4">
									<span class={`text-sm font-black ${COLOR.textPrimary}`}
										>{entry.points.toLocaleString()}</span
									>
								</td>
								<td class="px-6 py-4">
									{#if entry.rankDelta > 0}
										<span class="text-xs font-bold text-emerald-600 dark:text-emerald-400"
											>↑{entry.rankDelta}</span
										>
									{:else if entry.rankDelta < 0}
										<span class="text-xs font-bold text-rose-600 dark:text-rose-400"
											>↓{Math.abs(entry.rankDelta)}</span
										>
									{:else}
										<span class={`text-xs ${COLOR.textMuted}`}>—</span>
									{/if}
								</td>
								<td class="px-6 py-4">
									{#if entry.streakDays > 0}
										<span
											class="rounded-lg border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-xs font-black text-orange-600 dark:text-orange-400"
										>
											🔥 {entry.streakDays}
										</span>
									{:else}
										<span class={`text-xs ${COLOR.textMuted}`}>—</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>

				{#if data.leaderboard.length === 0}
					<div class="py-16 text-center" in:fade>
						<p class="mb-3 text-4xl">📭</p>
						<p class={`${TEXT.h4} ${COLOR.textPrimary}`}>Belum ada data</p>
						<p class={`text-sm ${COLOR.textMuted}`}>Mulai belajar untuk masuk leaderboard!</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Sticky user rank (if not in top 50) -->
		{#if !userInTop && data.userXP && data.userRank > 0}
			<div
				class={`sticky bottom-4 ${RADIUS.card} border border-blue-500/30 bg-blue-50/95 p-4 shadow-xl backdrop-blur-sm dark:bg-blue-950/90`}
				in:fly={{ y: 20 }}
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div
							class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-xs font-black text-white"
						>
							{getInitials(data.userXP.userId)}
						</div>
						<div>
							<p class="text-sm font-black text-blue-700 dark:text-blue-300">Posisi kamu</p>
							<p class="text-xs text-blue-600 dark:text-blue-400">{data.userXP.points} XP</p>
						</div>
					</div>
					<span class="text-2xl font-black text-blue-600 dark:text-blue-400">#{data.userRank}</span>
				</div>
			</div>
		{/if}
	</div>
</PageWrapper>
