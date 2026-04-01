<script lang="ts">
	import { COLOR, RADIUS, TEXT, ELEVATION } from '$lib/config/design';

	interface TrendPoint {
		date: string;
		commission: number;
		sales: number;
	}

	interface SalesTrendChartProps {
		data: TrendPoint[];
	}

	let { data }: SalesTrendChartProps = $props();

	const WIDTH = 600;
	const HEIGHT = 160;
	const PAD_X = 8;
	const PAD_Y = 16;

	function formatIDR(n: number): string {
		if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
		if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
		return String(n);
	}

	function formatDate(iso: string): string {
		const d = new Date(iso);
		return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
	}

	const maxCommission = $derived(Math.max(...data.map((d) => d.commission), 1));

	// Build SVG polyline points for commission line
	const points = $derived(
		data
			.map((d, i) => {
				const x = PAD_X + (i / (data.length - 1)) * (WIDTH - PAD_X * 2);
				const y = PAD_Y + (1 - d.commission / maxCommission) * (HEIGHT - PAD_Y * 2);
				return `${x},${y}`;
			})
			.join(' ')
	);

	// Area fill path
	const areaPath = $derived(() => {
		if (data.length === 0) return '';
		const pts = data.map((d, i) => {
			const x = PAD_X + (i / (data.length - 1)) * (WIDTH - PAD_X * 2);
			const y = PAD_Y + (1 - d.commission / maxCommission) * (HEIGHT - PAD_Y * 2);
			return { x, y };
		});
		const lineStr = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
		const bottomRight = `L${pts[pts.length - 1].x},${HEIGHT - PAD_Y}`;
		const bottomLeft = `L${pts[0].x},${HEIGHT - PAD_Y} Z`;
		return `${lineStr} ${bottomRight} ${bottomLeft}`;
	});

	// Tooltip state
	let hoveredIndex = $state<number | null>(null);

	function getTooltipX(i: number): number {
		return PAD_X + (i / (data.length - 1)) * (WIDTH - PAD_X * 2);
	}
	function getTooltipY(i: number): number {
		return PAD_Y + (1 - data[i].commission / maxCommission) * (HEIGHT - PAD_Y * 2);
	}

	// Show only every 5th label to avoid crowding
	const labelIndices = $derived(
		data.map((_, i) => i).filter((i) => i % 5 === 0 || i === data.length - 1)
	);
</script>

<div class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.base} p-5`}>
	<div class="mb-3 flex items-center justify-between">
		<p class={`text-sm font-bold ${COLOR.textPrimary}`}>Tren Komisi 30 Hari</p>
		{#if hoveredIndex !== null}
			<div class="text-right">
				<p class={`text-xs ${COLOR.textMuted}`}>{formatDate(data[hoveredIndex].date)}</p>
				<p class="text-sm font-bold text-blue-600 dark:text-blue-400">
					Rp {data[hoveredIndex].commission.toLocaleString('id-ID')}
				</p>
			</div>
		{:else}
			<p class={`text-xs ${COLOR.textMuted}`}>Hover untuk detail</p>
		{/if}
	</div>

	<svg
		viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
		class="w-full"
		style="height: 120px;"
		role="img"
		aria-label="Grafik tren komisi 30 hari terakhir"
	>
		<defs>
			<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25"></stop>
				<stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02"></stop>
			</linearGradient>
		</defs>

		<!-- Area fill -->
		{#if data.length > 1}
			<path d={areaPath()} fill="url(#areaGrad)"></path>

			<!-- Line -->
			<polyline
				{points}
				fill="none"
				stroke="#3b82f6"
				stroke-width="2"
				stroke-linejoin="round"
				stroke-linecap="round"
			></polyline>
		{/if}

		<!-- Invisible hit areas for hover -->
		{#each data as point, i}
			{@const x = PAD_X + (i / (data.length - 1)) * (WIDTH - PAD_X * 2)}
			<rect
				x={x - (WIDTH / data.length) * 0.5}
				y={0}
				width={WIDTH / data.length}
				height={HEIGHT}
				fill="transparent"
				onmouseenter={() => (hoveredIndex = i)}
				onmouseleave={() => (hoveredIndex = null)}
				role="presentation"
			></rect>
		{/each}

		<!-- Hover dot -->
		{#if hoveredIndex !== null}
			<circle
				cx={getTooltipX(hoveredIndex)}
				cy={getTooltipY(hoveredIndex)}
				r="4"
				fill="#3b82f6"
				stroke="white"
				stroke-width="2"
			></circle>
		{/if}

		<!-- X-axis labels -->
		{#each labelIndices as i}
			{@const x = PAD_X + (i / (data.length - 1)) * (WIDTH - PAD_X * 2)}
			<text
				{x}
				y={HEIGHT}
				text-anchor="middle"
				font-size="9"
				fill="currentColor"
				class="text-zinc-400 dark:text-zinc-500">{formatDate(data[i].date)}</text
			>
		{/each}
	</svg>

	<!-- Zero state -->
	{#if data.every((d) => d.commission === 0)}
		<p class={`mt-2 text-center text-xs ${COLOR.textMuted}`}>
			Belum ada data komisi dalam 30 hari terakhir
		</p>
	{/if}
</div>
