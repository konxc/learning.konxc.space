<script lang="ts">
	import { COLOR, RADIUS, TEXT, ELEVATION } from '$lib/config/design';

	interface Activity {
		date: string; // YYYY-MM-DD
		points: number;
	}

	interface Props {
		activities: Activity[];
	}

	const { activities }: Props = $props();

	// Build a map of date → points
	const activityMap = $derived(() => {
		const map = new Map<string, number>();
		for (const a of activities) {
			map.set(a.date, (map.get(a.date) ?? 0) + a.points);
		}
		return map;
	});

	// Generate last 30 days (oldest first)
	const days = $derived(() => {
		const result: Array<{ date: string; label: string; points: number }> = [];
		for (let i = 29; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const key = d.toISOString().slice(0, 10);
			result.push({
				date: key,
				label: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(d),
				points: activityMap().get(key) ?? 0
			});
		}
		return result;
	});

	// Color intensity based on points
	function getIntensityStyle(points: number): string {
		if (points === 0) return '';
		if (points <= 10) return 'background-color: #bbf7d0;'; // green-200
		if (points <= 30) return 'background-color: #4ade80;'; // green-400
		return 'background-color: #16a34a;'; // green-600
	}

	function getIntensityClass(points: number): string {
		if (points === 0) return 'bg-zinc-100 dark:bg-zinc-800';
		return ''; // handled by inline style for intensity
	}

	let tooltip = $state<{ date: string; points: number; label: string } | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	function showTooltip(e: MouseEvent, day: { date: string; points: number; label: string }) {
		tooltip = day;
		tooltipX = (e.currentTarget as HTMLElement).offsetLeft;
		tooltipY = (e.currentTarget as HTMLElement).offsetTop - 40;
	}

	function hideTooltip() {
		tooltip = null;
	}
</script>

<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} p-5`}>
	<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Aktivitas 30 Hari Terakhir</h3>

	<div class="relative">
		<!-- Grid: 6 kolom × 5 baris = 30 kotak -->
		<div class="grid grid-cols-6 gap-1.5">
			{#each days() as day}
				<button
					type="button"
					class={`h-8 w-full rounded-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${getIntensityClass(day.points)}`}
					style={getIntensityStyle(day.points)}
					onmouseenter={(e) => showTooltip(e, day)}
					onmouseleave={hideTooltip}
					aria-label="{day.label}: {day.points} poin"
				></button>
			{/each}
		</div>

		<!-- Tooltip -->
		{#if tooltip}
			<div
				class={`pointer-events-none absolute z-10 rounded-lg border ${COLOR.cardBorder} ${COLOR.card} px-3 py-2 text-xs shadow-lg`}
				style="left: {tooltipX}px; top: {tooltipY}px; transform: translateX(-25%);"
			>
				<p class={`font-bold ${COLOR.textPrimary}`}>{tooltip.label}</p>
				<p class={COLOR.textMuted}>
					{tooltip.points > 0 ? `${tooltip.points} poin` : 'Tidak ada aktivitas'}
				</p>
			</div>
		{/if}
	</div>

	<!-- Legend -->
	<div class="mt-3 flex items-center gap-3">
		<span class={`text-xs ${COLOR.textMuted}`}>Kurang</span>
		<div class="flex gap-1">
			<div class="h-4 w-4 rounded-sm bg-zinc-100 dark:bg-zinc-800"></div>
			<div class="h-4 w-4 rounded-sm" style="background-color: #bbf7d0;"></div>
			<div class="h-4 w-4 rounded-sm" style="background-color: #4ade80;"></div>
			<div class="h-4 w-4 rounded-sm" style="background-color: #16a34a;"></div>
		</div>
		<span class={`text-xs ${COLOR.textMuted}`}>Banyak</span>
	</div>
</div>
