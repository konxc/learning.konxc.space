<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { COLOR, RADIUS, TEXT, SPACING, ELEVATION, GRADIENT } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	const tierConfig: Record<
		string,
		{ label: string; icon: string; color: string; bgColor: string }
	> = {
		starter: { label: 'Starter', icon: '🌱', color: 'text-zinc-600', bgColor: 'bg-zinc-100' },
		learner: { label: 'Learner', icon: '📚', color: 'text-blue-600', bgColor: 'bg-blue-100' },
		achiever: { label: 'Achiever', icon: '⭐', color: 'text-purple-600', bgColor: 'bg-purple-100' },
		champion: { label: 'Champion', icon: '🏆', color: 'text-amber-600', bgColor: 'bg-amber-100' },
		legend: { label: 'Legend', icon: '👑', color: 'text-rose-600', bgColor: 'bg-rose-100' }
	};

	const currentTierConfig = $derived(tierConfig[data.currentTier || 'starter']);
	const progressPercent = $derived(() => {
		const tracker = data.tracker;
		if (!tracker || !tracker.totalPoints) return 0;
		const tierInfo = data.tierInfo;
		if (!tierInfo || tierInfo.max === Infinity) return 100;
		const progress = ((tracker.totalPoints - tierInfo.min) / (tierInfo.max - tierInfo.min)) * 100;
		return Math.min(100, Math.max(0, progress));
	});

	function getActivityIcon(type: string) {
		switch (type) {
			case 'lesson_complete':
				return 'check-circle';
			case 'checkpoint':
				return 'flag';
			case 'discussion':
				return 'message-circle';
			case 'referral':
				return 'users';
			case 'streak':
				return 'flame';
			case 'certificate':
				return 'award';
			default:
				return 'star';
		}
	}

	function getActivityLabel(type: string) {
		switch (type) {
			case 'lesson_complete':
				return 'Menyelesaikan Pelajaran';
			case 'checkpoint':
				return 'Submit Checkpoint';
			case 'discussion':
				return 'Diskusi';
			case 'referral':
				return 'Referral';
			case 'streak':
				return 'Streak Harian';
			case 'certificate':
				return 'Sertifikat';
			default:
				return 'Aktivitas';
		}
	}

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Tracker - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Tracker Saya"
		description="Pantau progres belajar, streak, dan poin penghargaan kamu."
	/>

	<div class="space-y-6">
		<!-- Tier Card -->
		<div
			class={`${RADIUS.card} ${currentTierConfig.bgColor} border border-current/10 p-6 ${ELEVATION.card}`}
		>
			<div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
				<div class="flex items-center gap-4">
					<div
						class="flex h-20 w-20 items-center justify-center rounded-2xl {currentTierConfig.bgColor} text-4xl"
					>
						{currentTierConfig.icon}
					</div>
					<div>
						<p class="text-sm {currentTierConfig.color} font-bold tracking-wider uppercase">
							Tier {currentTierConfig.label}
						</p>
						<p class="text-3xl font-black {currentTierConfig.color}">
							{data.tracker?.totalPoints || 0} Poin
						</p>
						{#if data.tierInfo?.next}
							<p class="text-sm text-zinc-500">
								{data.tierInfo.max - (data.tracker?.totalPoints || 0)} poin lagi ke {data.tierInfo
									.next}
							</p>
						{/if}
					</div>
				</div>

				<!-- Progress Bar -->
				{#if data.tierInfo?.next}
					<div class="w-full md:w-64">
						<div class="mb-1 flex justify-between text-xs text-zinc-500">
							<span>{data.tierInfo.min}</span>
							<span>{data.tierInfo.max}</span>
						</div>
						<div class="h-3 overflow-hidden rounded-full bg-white/50">
							<div
								class="h-full rounded-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-500"
								style="width: {progressPercent()}%"
							></div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<Icon name="flame" size={24} class="mx-auto mb-2 text-orange-500" />
				<p class="text-2xl font-bold">{data.tracker?.currentStreak || 0}</p>
				<p class="text-xs text-zinc-500">Streak Saat Ini</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<Icon name="zap" size={24} class="mx-auto mb-2 text-amber-500" />
				<p class="text-2xl font-bold">{data.tracker?.weeklyPoints || 0}</p>
				<p class="text-xs text-zinc-500">Poin Minggu Ini</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<Icon name="book-open" size={24} class="mx-auto mb-2 text-blue-500" />
				<p class="text-2xl font-bold">{data.tracker?.totalLessonsCompleted || 0}</p>
				<p class="text-xs text-zinc-500">Pelajaran Selesai</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<Icon name="trophy" size={24} class="mx-auto mb-2 text-purple-500" />
				<p class="text-2xl font-bold">{data.tracker?.earnedCertificates || 0}</p>
				<p class="text-xs text-zinc-500">Sertifikat</p>
			</div>
		</div>

		<!-- Activity Stats -->
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<p class="text-xl font-bold">{data.tracker?.totalCheckpointsCompleted || 0}</p>
				<p class="text-xs text-zinc-500">Checkpoint</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<p class="text-xl font-bold">{data.tracker?.totalDiscussions || 0}</p>
				<p class="text-xs text-zinc-500">Diskusi</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<p class="text-xl font-bold">{data.tracker?.totalReferrals || 0}</p>
				<p class="text-xs text-zinc-500">Referral</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
				<p class="text-xl font-bold">{data.tracker?.longestStreak || 0}</p>
				<p class="text-xs text-zinc-500">Streak Terpanjang</p>
			</div>
		</div>

		<!-- Tier Benefits -->
		<div
			class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${SPACING.cardPadding} ${ELEVATION.card}`}
		>
			<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Benefit Tier {currentTierConfig.label}</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{#if data.currentTier === 'starter'}
					<div class="rounded-lg bg-zinc-50 p-4">
						<Icon name="book-open" size={20} class="mb-2 text-zinc-400" />
						<p class="font-medium">Akses Dasar</p>
						<p class="text-sm text-zinc-500">Akses semua course yang dibeli</p>
					</div>
					<div class="rounded-lg bg-zinc-50 p-4">
						<Icon name="message-circle" size={20} class="mb-2 text-zinc-400" />
						<p class="font-medium">Forum Diskusi</p>
						<p class="text-sm text-zinc-500">Berpartisipasi dalam diskusi</p>
					</div>
					<div class="rounded-lg bg-zinc-50 p-4">
						<Icon name="award" size={20} class="mb-2 text-zinc-400" />
						<p class="font-medium">Sertifikat</p>
						<p class="text-sm text-zinc-500">Dapatkan sertifikat kelulusan</p>
					</div>
				{:else if data.currentTier === 'learner'}
					<div class="rounded-lg bg-blue-50 p-4">
						<Icon name="tag" size={20} class="mb-2 text-blue-500" />
						<p class="font-medium">Kupon Eksklusif</p>
						<p class="text-sm text-blue-600">Akses kupon diskon khusus</p>
					</div>
					<div class="rounded-lg bg-blue-50 p-4">
						<Icon name="bar-chart" size={20} class="mb-2 text-blue-500" />
						<p class="font-medium">Progress Report</p>
						<p class="text-sm text-blue-600">Laporan detail progress belajar</p>
					</div>
					<div class="rounded-lg bg-blue-50 p-4">
						<Icon name="message-circle" size={20} class="mb-2 text-blue-500" />
						<p class="font-medium">Priority Support</p>
						<p class="text-sm text-blue-600">Respon lebih cepat</p>
					</div>
				{:else if data.currentTier === 'achiever'}
					<div class="rounded-lg bg-purple-50 p-4">
						<Icon name="percent" size={20} class="mb-2 text-purple-500" />
						<p class="font-medium">Affiliate Upgrade</p>
						<p class="text-sm text-purple-600">Rate komisi lebih tinggi</p>
					</div>
					<div class="rounded-lg bg-purple-50 p-4">
						<Icon name="eye" size={20} class="mb-2 text-purple-500" />
						<p class="font-medium">Early Access</p>
						<p class="text-sm text-purple-600">Akses course baru lebih dulu</p>
					</div>
					<div class="rounded-lg bg-purple-50 p-4">
						<Icon name="users" size={20} class="mb-2 text-purple-500" />
						<p class="font-medium">Mentor Session</p>
						<p class="text-sm text-purple-600">1x sesi konsultasi per bulan</p>
					</div>
				{:else if data.currentTier === 'champion'}
					<div class="rounded-lg bg-amber-50 p-4">
						<Icon name="crown" size={20} class="mb-2 text-amber-500" />
						<p class="font-medium">Beta Features</p>
						<p class="text-sm text-amber-600">Akses fitur baru sebelum rilis</p>
					</div>
					<div class="rounded-lg bg-amber-50 p-4">
						<Icon name="headphones" size={20} class="mb-2 text-amber-500" />
						<p class="font-medium">VIP Support</p>
						<p class="text-sm text-amber-600">Support prioritas 24/7</p>
					</div>
					<div class="rounded-lg bg-amber-50 p-4">
						<Icon name="award" size={20} class="mb-2 text-amber-500" />
						<p class="font-medium">Exclusive Badge</p>
						<p class="text-sm text-amber-600">Badge profil khusus</p>
					</div>
				{:else}
					<div class="rounded-lg bg-rose-50 p-4">
						<Icon name="crown" size={20} class="mb-2 text-rose-500" />
						<p class="font-medium">Revenue Share</p>
						<p class="text-sm text-rose-600">Bagian dari revenue platform</p>
					</div>
					<div class="rounded-lg bg-rose-50 p-4">
						<Icon name="users" size={20} class="mb-2 text-rose-500" />
						<p class="font-medium">Mentor Network</p>
						<p class="text-sm text-rose-600">Akses eksklusif ke jaringan mentor</p>
					</div>
					<div class="rounded-lg bg-rose-50 p-4">
						<Icon name="star" size={20} class="mb-2 text-rose-500" />
						<p class="font-medium">All Benefits</p>
						<p class="text-sm text-rose-600">Semua benefit dari tier sebelumnya</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Recent Activities -->
		<div
			class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${SPACING.cardPadding} ${ELEVATION.card}`}
		>
			<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Aktivitas Terbaru</h3>

			{#if data.activities && data.activities.length > 0}
				<div class="space-y-3">
					{#each data.activities as activity}
						<div class="flex items-center gap-4 rounded-lg bg-zinc-50 p-3">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600"
							>
								<Icon name={getActivityIcon(activity.activityType)} size={18} />
							</div>
							<div class="flex-1">
								<p class="font-medium">
									{activity.description || getActivityLabel(activity.activityType)}
								</p>
								<p class="text-xs text-zinc-500">{formatDate(activity.createdAt)}</p>
							</div>
							<div class="text-right">
								<span class="font-bold text-emerald-600">+{activity.points}</span>
								<p class="text-xs text-zinc-500">poin</p>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="py-8 text-center">
					<Icon name="activity" size={48} class="mx-auto mb-4 text-zinc-300" />
					<p class="text-zinc-500">Belum ada aktivitas</p>
					<p class="text-sm text-zinc-400">Mulai belajar untuk mengumpulkan poin!</p>
				</div>
			{/if}
		</div>

		<!-- How to Earn Points -->
		<div
			class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${SPACING.cardPadding} ${ELEVATION.card}`}
		>
			<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Cara Mendapatkan Poin</h3>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
				<div class="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
					<span class="text-2xl">📖</span>
					<div>
						<p class="font-medium">Selesai Pelajaran</p>
						<p class="text-sm font-bold text-emerald-600">+10 poin</p>
					</div>
				</div>
				<div class="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
					<span class="text-2xl">✅</span>
					<div>
						<p class="font-medium">Lulus Quiz</p>
						<p class="text-sm font-bold text-emerald-600">+15 poin</p>
					</div>
				</div>
				<div class="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
					<span class="text-2xl">📋</span>
					<div>
						<p class="font-medium">Submit Checkpoint</p>
						<p class="text-sm font-bold text-emerald-600">+25 poin</p>
					</div>
				</div>
				<div class="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
					<span class="text-2xl">🔥</span>
					<div>
						<p class="font-medium">Login Harian</p>
						<p class="text-sm font-bold text-emerald-600">+5 poin/hari</p>
					</div>
				</div>
				<div class="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
					<span class="text-2xl">💬</span>
					<div>
						<p class="font-medium">Posting Diskusi</p>
						<p class="text-sm font-bold text-emerald-600">+5 poin</p>
					</div>
				</div>
				<div class="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
					<span class="text-2xl">🤝</span>
					<div>
						<p class="font-medium">Referral</p>
						<p class="text-sm font-bold text-emerald-600">+30 poin</p>
					</div>
				</div>
				<div class="flex items-center gap-3 rounded-lg bg-amber-50 p-3">
					<span class="text-2xl">🎯</span>
					<div>
						<p class="font-medium">Streak 7 Hari</p>
						<p class="text-sm font-bold text-amber-600">+50 poin</p>
					</div>
				</div>
				<div class="flex items-center gap-3 rounded-lg bg-amber-50 p-3">
					<span class="text-2xl">🏅</span>
					<div>
						<p class="font-medium">Streak 30 Hari</p>
						<p class="text-sm font-bold text-amber-600">+100 poin</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</PageWrapper>
