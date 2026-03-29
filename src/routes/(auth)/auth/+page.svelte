<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { COLOR, RADIUS, ELEVATION, TRANSITION } from '$lib/config/design';

	let visible = $state(false);
	let fading = $state(false);

	onMount(() => {
		// Trigger entrance animation
		requestAnimationFrame(() => {
			visible = true;
		});

		// Start fade out before redirect
		const fadeTimer = setTimeout(() => {
			fading = true;
		}, 900);

		// Redirect after animation
		const redirectTimer = setTimeout(() => {
			goto('/auth/signin', { replaceState: true });
		}, 1200);

		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(redirectTimer);
		};
	});
</script>

<svelte:head>
	<title>Naik Kelas - Redirecting...</title>
</svelte:head>

<div class="splash-container" class:visible class:fading>
	<!-- Animated Background -->
	<div class="splash-bg">
		<div class="gradient-base"></div>
		<div class="glow-orb glow-1"></div>
		<div class="glow-orb glow-2"></div>
		<div class="glow-orb glow-3"></div>
	</div>

	<!-- Content -->
	<div class="splash-content">
		<!-- Logo Icon -->
		<div class="logo-wrapper">
			<div class="logo-icon">
				<div class="logo-gradient"></div>
				<span class="logo-emoji">📚</span>
				<div class="logo-ring"></div>
			</div>
		</div>

		<!-- Brand Text -->
		<div class="brand-text">
			<span class="brand-naik">Naik</span>
			<span class="brand-kelas">Kelas</span>
		</div>

		<!-- Loading Indicator -->
		<div class="loading-wrapper">
			<div class="loading-dots">
				<span class="dot"></span>
				<span class="dot"></span>
				<span class="dot"></span>
			</div>
			<p class="loading-text">Preparing your experience...</p>
		</div>
	</div>
</div>

<style>
	.splash-container {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.splash-container.visible {
		opacity: 1;
	}

	.splash-container.fading {
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	/* Dark mode support */
	:global(.dark) .splash-container {
		background: #09090b;
	}

	/* Background Effects */
	.splash-bg {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.gradient-base {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(239, 246, 255, 0.5) 0%,
			rgba(255, 255, 255, 1) 50%,
			rgba(245, 243, 255, 0.5) 100%
		);
	}

	:global(.dark) .gradient-base {
		background: linear-gradient(
			135deg,
			rgba(24, 24, 27, 1) 0%,
			rgba(9, 9, 11, 1) 50%,
			rgba(24, 24, 27, 1) 100%
		);
	}

	.glow-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(100px);
		animation: pulse 3s ease-in-out infinite;
	}

	.glow-1 {
		top: -10%;
		left: -10%;
		width: 50%;
		height: 50%;
		background: rgba(59, 130, 246, 0.15);
	}

	.glow-2 {
		bottom: -10%;
		right: -10%;
		width: 50%;
		height: 50%;
		background: rgba(139, 92, 246, 0.15);
		animation-delay: 1s;
	}

	.glow-3 {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60%;
		height: 60%;
		background: rgba(236, 72, 153, 0.08);
		animation-delay: 2s;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	/* Content */
	.splash-content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		animation: contentEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		transform: translateY(20px);
		opacity: 0;
	}

	@keyframes contentEnter {
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* Logo */
	.logo-wrapper {
		perspective: 1000px;
	}

	.logo-icon {
		position: relative;
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 1.25rem;
		overflow: hidden;
		animation: logoFloat 3s ease-in-out infinite;
		box-shadow:
			0 8px 30px rgba(0, 0, 0, 0.08),
			0 4px 12px rgba(0, 0, 0, 0.04);
	}

	:global(.dark) .logo-icon {
		box-shadow:
			0 8px 30px rgba(0, 0, 0, 0.3),
			0 4px 12px rgba(0, 0, 0, 0.2);
	}

	@keyframes logoFloat {
		0%,
		100% {
			transform: translateY(0) rotateX(0deg);
		}
		25% {
			transform: translateY(-4px) rotateX(2deg);
		}
		50% {
			transform: translateY(-6px) rotateX(0deg);
		}
		75% {
			transform: translateY(-4px) rotateX(-2deg);
		}
	}

	.logo-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
		background-size: 200% 200%;
		animation: gradientShift 4s ease-in-out infinite;
	}

	@keyframes gradientShift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	.logo-emoji {
		position: relative;
		z-index: 10;
		font-size: 2.5rem;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
		animation: emojiBounce 2s ease-in-out infinite;
	}

	@keyframes emojiBounce {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	.logo-ring {
		position: absolute;
		inset: 0;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 1.25rem;
		animation: ringPulse 2s ease-out infinite;
	}

	@keyframes ringPulse {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}
		100% {
			transform: scale(1.4);
			opacity: 0;
		}
	}

	/* Brand Text */
	.brand-text {
		display: flex;
		gap: 0.375rem;
		font-size: 1.75rem;
		font-weight: 800;
		letter-spacing: -0.03em;
	}

	.brand-naik {
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: wordBounce 2s ease-in-out infinite;
	}

	.brand-kelas {
		color: #18181b;
		animation: wordBounce 2s ease-in-out infinite;
		animation-delay: 0.15s;
	}

	:global(.dark) .brand-kelas {
		color: #fafafa;
	}

	@keyframes wordBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	/* Loading */
	.loading-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.loading-dots {
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		animation: dotBounce 1.4s ease-in-out infinite;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes dotBounce {
		0%,
		80%,
		100% {
			transform: scale(0.6);
			opacity: 0.4;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.loading-text {
		font-size: 0.875rem;
		color: #71717a;
		font-weight: 500;
		animation: textFade 1.5s ease-in-out infinite;
	}

	:global(.dark) .loading-text {
		color: #a1a1aa;
	}

	@keyframes textFade {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.splash-container,
		.splash-content,
		.logo-icon,
		.logo-gradient,
		.logo-emoji,
		.logo-ring,
		.brand-naik,
		.brand-kelas,
		.dot,
		.loading-text,
		.glow-orb {
			animation: none !important;
		}

		.splash-container.visible {
			opacity: 1;
		}

		.splash-content {
			opacity: 1;
			transform: none;
		}
	}
</style>
