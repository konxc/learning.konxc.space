<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		logo: string;
	}

	let { logo }: Props = $props();

	let animate = $state(false);

	onMount(() => {
		const timeout = setTimeout(() => (animate = true), 100);
		return () => {
			clearTimeout(timeout);
		};
	});

	const badges = [
		{ emoji: '🚀', size: 'lg', radius: 82, speed: 18, delay: 0, depth: 0.6 },
		{ emoji: '🎨', size: 'sm', radius: 68, speed: 22, delay: 3, depth: -0.3 },
		{ emoji: '🤝', size: 'md', radius: 86, speed: 24, delay: 1.5, depth: 0.2 },
		{ emoji: '📚', size: 'xs', radius: 74, speed: 20, delay: 4.2, depth: -0.4 },
		{ emoji: '💡', size: 'sm', radius: 90, speed: 26, delay: 2.4, depth: 0.4 }
	];
</script>

<div class="logo-wrapper" aria-label="Naik Kelas logo">
	<div class="orbit" aria-hidden="true" class:ready={animate}>
		{#each badges as badge, index}
			<span
				class={`orbit-badge badge-${badge.size}`}
				style={`--radius:${badge.radius}px; --speed:${badge.speed}s; --delay:${badge.delay}s; --depth:${badge.depth}; --index:${index};`}
			>
				<span class="badge-inner">{badge.emoji}</span>
			</span>
		{/each}
	</div>
	<div class="hero-logo" class:animate>
		<span class="logo-text">{logo}</span>
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	.logo-wrapper {
		@apply relative mx-auto flex items-center justify-center;
		width: clamp(180px, 34vw, 240px);
		perspective: 720px;
		transform-style: preserve-3d;
	}

	.hero-logo {
		@apply relative flex items-center justify-center;
		transform: translateZ(20px);
		transform-style: preserve-3d;
	}

	.hero-logo.animate {
		animation: pulse 6s ease-in-out infinite;
	}

	.logo-text {
		@apply text-[2rem] font-bold text-transparent min-[640px]:text-[2.5rem] md:text-[3rem];
		background: linear-gradient(120deg, #2c7be5 0%, #667eea 35%, #9f7aea 70%, #f6ad55 100%);
		background-clip: text;
		-webkit-background-clip: text;
		letter-spacing: -0.02em;
		background-size: 250% 250%;
		animation: gradientShift 8s ease-in-out infinite;
	}

	.orbit {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		pointer-events: none;
		z-index: 0;
		transform-style: preserve-3d;
	}

	.orbit-badge {
		@apply absolute flex items-center justify-center rounded-full border border-white/35 bg-white/85 text-sm shadow-[0_6px_14px_rgba(31,41,55,0.22)];
		inset: 50%;
		transform-origin: center;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0);
		filter: brightness(1);
		will-change: transform, filter;
		z-index: calc(1 + var(--depth));
	}

	.orbit.ready .orbit-badge {
		animation:
			spawn 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) 1 both,
			orbit var(--speed) linear calc(var(--delay) + 0.6s) infinite;
	}

	.badge-inner {
		@apply flex h-full w-full items-center justify-center;
	}

	.badge-lg {
		height: 28px;
		width: 28px;
		font-size: 0.95rem;
	}

	.badge-md {
		height: 24px;
		width: 24px;
		font-size: 0.85rem;
	}

	.badge-sm {
		height: 22px;
		width: 22px;
		font-size: 0.8rem;
	}

	.badge-xs {
		height: 18px;
		width: 18px;
		font-size: 0.7rem;
	}

	@keyframes orbit {
		0% {
			opacity: 1;
			transform: rotateZ(0deg) translateX(var(--radius)) rotateZ(0deg) translateZ(60px) scale(1);
			filter: brightness(1.12);
		}
		25% {
			transform: rotateZ(90deg) translateX(var(--radius)) rotateZ(-90deg) translateZ(20px)
				scale(0.96);
			filter: brightness(1);
		}
		50% {
			transform: rotateZ(180deg) translateX(var(--radius)) rotateZ(-180deg) translateZ(-60px)
				scale(0.86);
			filter: brightness(0.78);
		}
		75% {
			transform: rotateZ(270deg) translateX(var(--radius)) rotateZ(-270deg) translateZ(20px)
				scale(0.96);
			filter: brightness(1);
		}
		100% {
			opacity: 1;
			transform: rotateZ(360deg) translateX(var(--radius)) rotateZ(-360deg) translateZ(60px)
				scale(1);
			filter: brightness(1.12);
		}
	}

	@keyframes spawn {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
		100% {
			opacity: 1;
			transform: rotateZ(0deg) translateX(var(--radius)) rotateZ(0deg) translateZ(60px) scale(1);
			filter: brightness(1.12);
		}
	}

	@keyframes gradientShift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.03);
		}
	}
</style>
