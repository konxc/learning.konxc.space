<script lang="ts">
	interface GlowOrbConfig {
		size: number; // px
		x: string; // e.g. '10%' or '120px'
		y: string; // e.g. '20%' or '-80px'
		color: string; // rgba(...)
		blurPx?: number; // default 18
		opacity?: number; // 0..1 default 0.35
		delaySec?: number; // animation delay
		hideOnMobile?: boolean;
	}

	interface GlowOrbsProps {
		orbs?: GlowOrbConfig[];
		speedSec?: number;
		zIndex?: number;
		ariaHidden?: boolean;
	}

	const { orbs = [], speedSec = 14, zIndex = 0, ariaHidden = true }: GlowOrbsProps = $props();
</script>

<div class="glow-orbs" style="z-index:{zIndex}" aria-hidden={ariaHidden}>
	{#each orbs as orb}
		<div
			class="orb{orb.hideOnMobile ? ' is-mobile-hidden' : ''}"
			style="
				width:{orb.size}px;
				height:{orb.size}px;
				left:{orb.x};
				top:{orb.y};
				filter: blur({orb.blurPx ?? 18}px);
				opacity:{orb.opacity ?? 0.35};
				animation: floatUp {speedSec}s ease-in-out infinite;
				animation-delay:{orb.delaySec ?? 0}s;
				background: radial-gradient(circle at 50% 50%, {orb.color}, transparent 70%);
			"
		></div>
	{/each}
</div>

<style>
	.glow-orbs {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.orb {
		position: absolute;
		border-radius: 999px;
	}

	@keyframes floatUp {
		0% {
			transform: translateY(0) translateX(0);
		}
		50% {
			transform: translateY(-18px) translateX(8px);
		}
		100% {
			transform: translateY(0) translateX(0);
		}
	}

	@media (max-width: 480px) {
		.orb.is-mobile-hidden {
			display: none;
		}
	}
</style>
