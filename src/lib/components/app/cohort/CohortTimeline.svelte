<script lang="ts">
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';

	interface Checkpoint {
		weekNumber: number;
		title: string;
		dueDate: Date | null;
		submissionCount: number;
		totalStudents: number;
	}

	interface Props {
		startDate: Date;
		checkpoints: Checkpoint[];
	}

	const { startDate, checkpoints }: Props = $props();

	const now = new Date();

	const activeWeek = $derived(
		Math.ceil((now.getTime() - new Date(startDate).getTime()) / (7 * 24 * 60 * 60 * 1000))
	);

	// Next upcoming checkpoint with a due date
	const nextCheckpoint = $derived(
		checkpoints
			.filter((c) => c.dueDate !== null && new Date(c.dueDate) > now)
			.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())[0] ?? null
	);

	function formatCountdown(dueDate: Date | null): string {
		if (!dueDate) return '';
		const diff = new Date(dueDate).getTime() - now.getTime();
		if (diff <= 0) return 'Sudah lewat';
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		if (days > 0) return `${days}h ${hours}j lagi`;
		return `${hours}j lagi`;
	}

	function formatDate(d: Date | null): string {
		if (!d) return '-';
		return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(d));
	}

	function getCheckpointStatus(cp: Checkpoint): 'past' | 'current' | 'upcoming' {
		if (cp.weekNumber < activeWeek) return 'past';
		if (cp.weekNumber === activeWeek) return 'current';
		return 'upcoming';
	}
</script>

<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} p-6`}>
	<div class="mb-4 flex items-center justify-between">
		<h3 class={`${TEXT.h4} ${COLOR.textPrimary}`}>Timeline Cohort</h3>
		{#if nextCheckpoint}
			<div
				class="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
			>
				⏰ {nextCheckpoint.title}: {formatCountdown(nextCheckpoint.dueDate)}
			</div>
		{/if}
	</div>

	<p class={`mb-4 text-xs ${COLOR.textMuted}`}>
		Minggu aktif: <span class="font-bold">{Math.max(0, activeWeek)}</span> · Mulai: {formatDate(
			startDate
		)}
	</p>

	<!-- Horizontal scroll container -->
	<div class="overflow-x-auto pb-2">
		<div class="flex min-w-max items-end gap-4 px-1 py-2">
			{#each checkpoints as cp}
				{@const status = getCheckpointStatus(cp)}
				{@const submissionPct =
					cp.totalStudents > 0 ? Math.round((cp.submissionCount / cp.totalStudents) * 100) : 0}
				<div class="flex flex-col items-center gap-2" style="min-width: 100px;">
					<!-- Node -->
					<div
						class={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-black ${TRANSITION.all} ${
							status === 'current'
								? 'border-blue-500 bg-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.5)]'
								: status === 'past'
									? 'border-emerald-500 bg-emerald-500 text-white'
									: 'border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
						}`}
					>
						{#if status === 'past'}
							✓
						{:else}
							W{cp.weekNumber}
						{/if}
						{#if status === 'current'}
							<span class="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-blue-400"
							></span>
						{/if}
					</div>

					<!-- Connector line (except last) -->
					<div class="absolute"></div>

					<!-- Label -->
					<div class="text-center">
						<p
							class={`text-xs leading-tight font-bold ${
								status === 'current'
									? COLOR.accent
									: status === 'past'
										? 'text-emerald-600 dark:text-emerald-400'
										: COLOR.textMuted
							}`}
						>
							{cp.title.length > 14 ? cp.title.slice(0, 12) + '…' : cp.title}
						</p>
						{#if cp.dueDate}
							<p class={`text-[10px] ${COLOR.textMuted}`}>{formatDate(cp.dueDate)}</p>
						{/if}
					</div>

					<!-- Submission progress bar -->
					<div class="w-full">
						<div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
							<div
								class={`h-full rounded-full ${TRANSITION.all} ${
									status === 'past' ? 'bg-emerald-500' : 'bg-blue-500'
								}`}
								style="width: {submissionPct}%"
							></div>
						</div>
						<p class={`mt-0.5 text-center text-[9px] ${COLOR.textMuted}`}>
							{cp.submissionCount}/{cp.totalStudents}
						</p>
					</div>
				</div>

				<!-- Connector between nodes -->
				{#if cp !== checkpoints[checkpoints.length - 1]}
					<div
						class={`mb-8 h-0.5 w-8 shrink-0 ${
							getCheckpointStatus(cp) === 'past' ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-700'
						}`}
					></div>
				{/if}
			{/each}

			{#if checkpoints.length === 0}
				<p class={`text-sm ${COLOR.textMuted} py-4`}>Belum ada checkpoint untuk cohort ini.</p>
			{/if}
		</div>
	</div>
</div>
