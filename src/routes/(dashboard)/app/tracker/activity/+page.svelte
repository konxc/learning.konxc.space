<script lang="ts">
	import type { PageData } from './$types';
	import { COLOR, RADIUS, ELEVATION } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	const ACTIVITY_ICONS: Record<string, string> = {
		lesson_complete: 'check-circle',
		checkpoint_submit: 'flag',
		quiz_pass: 'zap',
		daily_login: 'log-in',
		streak_7: 'flame',
		streak_30: 'flame',
		streak_100: 'flame',
		course_complete: 'award',
		discussion_post: 'message-square',
		referral: 'users'
	};

	const ACTIVITY_LABELS: Record<string, string> = {
		lesson_complete: 'Menyelesaikan Pelajaran',
		checkpoint_submit: 'Submit Checkpoint',
		quiz_pass: 'Lulus Quiz',
		daily_login: 'Login Harian',
		streak_7: 'Streak 7 Hari',
		streak_30: 'Streak 30 Hari',
		streak_100: 'Streak 100 Hari',
		course_complete: 'Menyelesaikan Kursus',
		discussion_post: 'Post Diskusi',
		referral: 'Referral'
	};

	function formatDate(date: Date | string): string {
		const d = new Date(date);
		return d.toLocaleString('id-ID', {
			weekday: 'short',
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const currentFilter = $derived(data.filter);
</script>

<svelte:head>
	<title>Aktivitas - Naik Kelas</title>
</svelte:head>

<div class="space-y-8">
	<!-- Stats Summary -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class={`rounded-2xl border p-6 ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card}`}>
			<p class={`text-sm ${COLOR.textMuted}`}>Total Poin</p>
			<p class={`mt-1 text-3xl font-bold ${COLOR.textPrimary}`}>{data.xp?.points ?? 0}</p>
			<p class={`mt-1 text-xs ${COLOR.textSecondary}`}>Level {data.xp?.level ?? 1}</p>
		</div>
		<div class={`rounded-2xl border p-6 ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card}`}>
			<p class={`text-sm ${COLOR.textMuted}`}>Streak Saat Ini</p>
			<p class={`mt-1 text-3xl font-bold ${COLOR.textPrimary}`}>
				{data.tracker?.currentStreak ?? 0} <span class="text-lg">hari</span>
			</p>
			<p class={`mt-1 text-xs ${COLOR.textSecondary}`}>
				Terpanjang: {data.tracker?.longestStreak ?? 0} hari
			</p>
		</div>
		<div class={`rounded-2xl border p-6 ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card}`}>
			<p class={`text-sm ${COLOR.textMuted}`}>Tier</p>
			<p class={`mt-1 text-3xl font-bold uppercase ${COLOR.accent}`}>
				{data.tracker?.tier ?? 'starter'}
			</p>
			<p class={`mt-1 text-xs ${COLOR.textSecondary}`}>
				{data.tracker?.weeklyPoints ?? 0} poin minggu ini
			</p>
		</div>
	</div>

	<!-- Filter -->
	<div class="flex items-center gap-2">
		<a
			href="?period=week"
			class={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${currentFilter === 'week' ? `${COLOR.accentBg} text-white` : `${COLOR.neutral} ${COLOR.textSecondary} ${COLOR.neutralHover}`}`}
		>
			Minggu Ini
		</a>
		<a
			href="?period=month"
			class={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${currentFilter === 'month' ? `${COLOR.accentBg} text-white` : `${COLOR.neutral} ${COLOR.textSecondary} ${COLOR.neutralHover}`}`}
		>
			Bulan Ini
		</a>
		<a
			href="?period=all"
			class={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${currentFilter === 'all' ? `${COLOR.accentBg} text-white` : `${COLOR.neutral} ${COLOR.textSecondary} ${COLOR.neutralHover}`}`}
		>
			Semua
		</a>
	</div>

	<!-- Activity List -->
	<div class="space-y-3">
		{#each data.activities as activity}
			<div
				class={`flex items-center gap-4 rounded-xl border p-4 ${COLOR.card} ${COLOR.cardBorder} transition-all hover:shadow-sm`}
			>
				<div
					class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${COLOR.neutral}`}
				>
					<Icon
						name={ACTIVITY_ICONS[activity.activityType] ?? 'activity'}
						size={20}
						class={COLOR.accent}
					/>
				</div>
				<div class="min-w-0 flex-1">
					<p class={`text-sm font-medium ${COLOR.textPrimary}`}>
						{ACTIVITY_LABELS[activity.activityType] ?? activity.activityType}
					</p>
					{#if activity.description}
						<p class={`mt-0.5 text-xs ${COLOR.textMuted}`}>{activity.description}</p>
					{/if}
					<p class={`mt-0.5 text-xs ${COLOR.textMuted}`}>{formatDate(activity.createdAt)}</p>
				</div>
				<div class={`text-sm font-bold ${COLOR.accent}`}>+{activity.points}</div>
			</div>
		{:else}
			<div class={`rounded-2xl border p-12 text-center ${COLOR.card} ${COLOR.cardBorder}`}>
				<Icon name="activity" size={48} class={`mx-auto mb-4 ${COLOR.textMuted}`} />
				<p class={`${COLOR.textMuted}`}>Belum ada aktivitas</p>
			</div>
		{/each}
	</div>
</div>
