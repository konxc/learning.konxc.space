<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Leaderboard — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="🏆 Leaderboard" />

	<!-- User's Stats -->
	{#if data.userXP}
		<div class={`mb-8 ${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border-2 border-amber-200 bg-amber-50/50 p-6`}>
			<div class="flex items-center gap-6">
				<div class="text-center">
					<p class="text-4xl font-black text-amber-500">#{data.userRank || '-'}</p>
					<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted}`}>Your Rank</p>
				</div>
				<div class="flex-1">
					<div class="flex items-center justify-between mb-2">
						<span class="text-sm font-bold text-gray-700">Level {data.userXP.level}</span>
						<span class="text-sm font-bold text-purple-600">{data.userXP.points} XP</span>
					</div>
					<div class="h-3 w-full overflow-hidden rounded-full bg-gray-200">
						<div class="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: {Math.min((data.userXP.points % 100), 100)}%"></div>
					</div>
					<div class="mt-2 flex items-center justify-between text-xs">
						<span class="text-gray-500">{data.userXP.streakDays} day streak 🔥</span>
						<span class="text-gray-500">{100 - (data.userXP.points % 100)} XP to next level</span>
					</div>
				</div>
			</div>
			
			{#if data.userBadges.length > 0}
				<div class="mt-4 pt-4 border-t border-amber-200">
					<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted} mb-2`}>Your Badges</p>
					<div class="flex flex-wrap gap-2">
						{#each data.userBadges as badge}
							<div class="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
								<span>{badge.icon || '🏅'}</span>
								<span>{badge.name}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Top 3 Podium -->
	{#if data.leaderboard.length >= 3}
		<div class="mb-8 flex justify-center items-end gap-4">
			<!-- 2nd Place -->
			<div class="text-center">
				<div class="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold">🥈</div>
				<p class={`font-bold ${COLOR.textPrimary}`}>{data.leaderboard[1].fullName || data.leaderboard[1].username}</p>
				<p class="text-sm text-gray-500">{data.leaderboard[1].points} XP</p>
				<div class="mt-2 h-24 w-20 rounded-t-lg bg-gray-300 flex items-end justify-center pb-2">
					<span class="text-2xl font-bold text-gray-500">2</span>
				</div>
			</div>
			
			<!-- 1st Place -->
			<div class="text-center -mt-4">
				<div class="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold">🥇</div>
				<p class={`font-bold ${COLOR.textPrimary}`}>{data.leaderboard[0].fullName || data.leaderboard[0].username}</p>
				<p class="text-sm text-gray-500">{data.leaderboard[0].points} XP</p>
				<div class="mt-2 h-32 w-24 rounded-t-lg bg-gradient-to-t from-amber-300 to-amber-200 flex items-end justify-center pb-2">
					<span class="text-3xl font-bold text-amber-600">1</span>
				</div>
			</div>
			
			<!-- 3rd Place -->
			<div class="text-center">
				<div class="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-bold">🥉</div>
				<p class={`font-bold ${COLOR.textPrimary}`}>{data.leaderboard[2].fullName || data.leaderboard[2].username}</p>
				<p class="text-sm text-gray-500">{data.leaderboard[2].points} XP</p>
				<div class="mt-2 h-16 w-16 rounded-t-lg bg-orange-200 flex items-end justify-center pb-2">
					<span class="text-xl font-bold text-orange-500">3</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- Full Leaderboard -->
	<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}>
		<table class="w-full text-left">
			<thead>
				<tr class="border-b border-gray-100 bg-gray-50/70">
					<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Rank</th>
					<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Student</th>
					<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Level</th>
					<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>XP</th>
					<th class={`px-5 py-3 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Streak</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-50">
				{#each data.leaderboard as entry}
					<tr class={entry.userId === data.userXP?.userId ? 'bg-blue-50/50' : 'hover:bg-gray-50'}>
						<td class="px-5 py-3">
							<span class={`text-lg font-black ${entry.rank <= 3 ? 'text-amber-500' : 'text-gray-400'}`}>
								{entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
							</span>
						</td>
						<td class="px-5 py-3">
							<p class={`font-semibold ${COLOR.textPrimary}`}>{entry.fullName || entry.username}</p>
						</td>
						<td class="px-5 py-3">
							<span class="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
								Lv. {entry.level}
							</span>
						</td>
						<td class="px-5 py-3">
							<span class="font-bold text-gray-700">{entry.points}</span>
						</td>
						<td class="px-5 py-3">
							{#if entry.streakDays > 0}
								<span class="text-orange-500">🔥 {entry.streakDays}</span>
							{:else}
								<span class="text-gray-400">-</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		
		{#if data.leaderboard.length === 0}
			<div class="py-12 text-center">
				<p class={`${COLOR.textSecondary}`}>No XP data yet. Start learning to earn points!</p>
			</div>
		{/if}
	</div>
</PageWrapper>
