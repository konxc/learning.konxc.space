<script lang="ts">
	import type { PageData } from './$types';
	import { RADIUS, ELEVATION, TEXT, COLOR, GRADIENT, SPACING, TRANSITION } from '$lib/config/design';
	import { fade, fly, scale } from 'svelte/transition';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<PageWrapper>
	<PageHeader title="Achievements & Badges" description="Track your learning progress and unlock digital rewards.">
		<div class="flex items-center gap-4">
			<div class="flex flex-col items-end">
				<span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Current Level</span>
				<span class="text-2xl font-black text-blue-600 dark:text-blue-400">Level {data.level}</span>
			</div>
			<div class="h-12 w-12 rounded-full border-4 border-blue-100 bg-blue-50 flex items-center justify-center text-blue-600 font-black dark:border-blue-900/30 dark:bg-blue-900/10">
				{data.level}
			</div>
		</div>
	</PageHeader>

	<!-- Progress Progress Bar -->
	<PageSection>
		<div class="space-y-4">
			<div class="flex justify-between items-end">
				<div class="space-y-1">
					<h3 class="text-sm font-black tracking-widest text-zinc-400 uppercase">Experience Points</h3>
					<p class="text-3xl font-black text-zinc-900 dark:text-white">{data.xp} <span class="text-zinc-400">XP</span></p>
				</div>
				<p class="text-xs font-bold text-zinc-500">{data.nextLevelXP} XP to next level</p>
			</div>
			<div class="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-inner">
				<div class={`h-full ${GRADIENT.primary} shadow-lg transition-all duration-1000 ease-out`} style="width: {data.progressPercent}%"></div>
			</div>
		</div>
	</PageSection>

	<!-- Badges Grid -->
	<PageSection title="Badge Hub" description="Complete challenges and courses to unlock badges.">
		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
			{#each data.badges as badge}
				<div class="group relative flex flex-col items-center gap-4 p-6 {RADIUS.card} border {COLOR.cardBorder} {badge.isEarned ? `${COLOR.card} ${ELEVATION.card}` : 'bg-zinc-50/50 dark:bg-zinc-950/20 grayscale border-dashed'} transition-all hover:-translate-y-1">
					<!-- Badge Icon Circle -->
					<div class={`relative h-20 w-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${badge.isEarned ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-xl' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900'} `}>
						{#if badge.icon}
							<div class="text-4xl">{badge.icon}</div>
						{:else}
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
							</svg>
						{/if}

						{#if badge.isEarned}
							<div class="absolute -top-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg text-white">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</div>
						{/if}
					</div>

					<!-- Badge Details -->
					<div class="text-center space-y-1">
						<h4 class="text-xs font-black tracking-tight text-zinc-900 dark:text-white uppercase truncate px-2">{badge.name}</h4>
						<p class="text-[9px] font-bold text-zinc-400 leading-tight line-clamp-2 px-2 uppercase tracking-tighter">
							{badge.description}
						</p>
					</div>

					{#if badge.isEarned && badge.earnedAt}
						<div class="mt-2 text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-900/20 dark:text-emerald-400 uppercase tracking-widest">
							Earned {formatDate(badge.earnedAt)}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</PageSection>

	<!-- Career stats -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
		<PageSection title="Career Trajectory" description="Your alignment across the three pillars of digital mastery.">
			<div class="space-y-6">
				<div class="space-y-2">
					<div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
						<span>Digital Creator</span>
						<span>{data.tracks.creator}%</span>
					</div>
					<div class="h-2 w-full bg-zinc-100 rounded-full dark:bg-zinc-800">
						<div class="h-full bg-purple-600 rounded-full transition-all duration-1000" style="width: {data.tracks.creator}%"></div>
					</div>
				</div>
				<div class="space-y-2">
					<div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
						<span>Marketplace Seller</span>
						<span>{data.tracks.seller}%</span>
					</div>
					<div class="h-2 w-full bg-zinc-100 rounded-full dark:bg-zinc-800">
						<div class="h-full bg-orange-600 rounded-full transition-all duration-1000" style="width: {data.tracks.seller}%"></div>
					</div>
				</div>
				<div class="space-y-2">
					<div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
						<span>Strategic Affiliate</span>
						<span>{data.tracks.affiliate}%</span>
					</div>
					<div class="h-2 w-full bg-zinc-100 rounded-full dark:bg-zinc-800">
						<div class="h-full bg-blue-600 rounded-full transition-all duration-1000" style="width: {data.tracks.affiliate}%"></div>
					</div>
				</div>
			</div>
		</PageSection>

		<PageSection title="Mentorship Insights" description="Platform recognition and milestone feedback.">
			<div class="bg-zinc-900 rounded-2xl p-8 text-white min-h-[220px] flex flex-col justify-center">
				{#if data.insight}
					<div class="space-y-4" in:fade>
						<div class="flex items-center gap-3">
							<div class="h-1 w-12 bg-blue-500"></div>
							<span class="text-[10px] font-black tracking-widest uppercase text-blue-500">Senior Feedback</span>
						</div>
						<p class="text-lg font-black tracking-tight leading-relaxed italic">
							"{data.insight.feedback}"
						</p>
						<div class="pt-4 flex items-center gap-3">
							<div class="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-lg">👨‍🏫</div>
							<div>
								<p class="text-xs font-black uppercase leading-none">{data.insight.mentorName}</p>
								<p class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{data.insight.mentorRole || 'Lead Academic'}</p>
							</div>
						</div>
					</div>
				{:else}
					<div class="text-center space-y-4">
						<p class="text-zinc-500 text-sm font-medium">Belum ada feedback dari mentor untuk periode ini.</p>
						<p class="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-600">Selesaikan tugas aksi Anda!</p>
					</div>
				{/if}
			</div>
		</PageSection>
	</div>
</PageWrapper>
