<script lang="ts">
	interface AuroraProps {
		intensity?: number; // 0..1 multiplier
		blurPx?: number; // blur amount
		speedSec?: number; // animation duration
		insetPercent?: number; // how far to extend past container
		zIndex?: number;
		ariaHidden?: boolean;
		mode?: 'chill' | 'hardcore' | 'custom';
		colors?: string[]; // array of CSS colors used in gradient stops
	}

	const {
		intensity = 0.08,
		blurPx = 60,
		speedSec = 18,
		insetPercent = 20,
		zIndex = 0,
		ariaHidden = true,
		mode = 'chill',
		colors
	}: AuroraProps = $props();

	function getPalette(): string[] {
		if (colors && colors.length > 0) return colors;
		if (mode === 'hardcore') {
			return [
				'rgba(255,255,255,1)',
				'rgba(251, 146, 60, 1)' /* orange */,
				'rgba(59, 130, 246, 1)' /* blue */,
				'rgba(124, 58, 237, 1)' /* purple */,
				'rgba(255,255,255,1)'
			];
		}
		// chill default: tosca/teal tones
		return [
			'rgba(255,255,255,1)',
			'rgba(20, 184, 166, 1)' /* tosca */,
			'rgba(45, 212, 191, 1)' /* teal light */,
			'rgba(255,255,255,1)',
			'rgba(20, 184, 166, 1)'
		];
	}

	const palette = getPalette();
</script>

<div
	class="aurora-overlay"
	style="--aurora-intensity:{intensity}; --aurora-blur:{blurPx}px; --aurora-speed:{speedSec}s; --aurora-inset:{insetPercent}%; z-index:{zIndex}; --c1:{palette[0]}; --c2:{palette[1]}; --c3:{palette[2]}; --c4:{palette[3]}; --c5:{palette[4]}"
	aria-hidden={ariaHidden}
></div>

<style>
	.aurora-overlay {
		position: absolute;
		inset: calc(var(--aurora-inset) * -1%);
		background: conic-gradient(
			from 0deg at 50% 50%,
			color-mix(in srgb, var(--c1) calc(var(--aurora-intensity) * 100%), transparent),
			color-mix(in srgb, var(--c2) calc(var(--aurora-intensity) * 100%), transparent),
			color-mix(in srgb, var(--c3) calc(var(--aurora-intensity) * 100%), transparent),
			color-mix(in srgb, var(--c4) calc(var(--aurora-intensity) * 100%), transparent),
			color-mix(in srgb, var(--c5) calc(var(--aurora-intensity) * 100%), transparent)
		);
		filter: blur(var(--aurora-blur)) saturate(120%);
		animation: auroraShift var(--aurora-speed) ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes auroraShift {
		0% {
			transform: rotate(0deg) scale(1);
		}
		50% {
			transform: rotate(12deg) scale(1.05);
		}
		100% {
			transform: rotate(0deg) scale(1);
		}
	}

	@media (max-width: 480px) {
		.aurora-overlay {
			display: none;
		}
	}
</style>
