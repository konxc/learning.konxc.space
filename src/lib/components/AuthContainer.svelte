<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { onMount } from 'svelte';

	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle: string;
		children: Snippet;
		backButtonLabel?: string;
		hideHeader?: boolean;
	}

	let {
		title,
		subtitle,
		children,
		backButtonLabel = 'Beranda',
		hideHeader = false
	}: Props = $props();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<div class="auth-page">
	<!-- Animated Background Gradient -->
	<div class="bg-gradient"></div>
	<div class="bg-blobs">
		<div class="blob blob-1"></div>
		<div class="blob blob-2"></div>
		<div class="blob blob-3"></div>
	</div>

	<!-- Back to Home Button -->
	<a href="/" class="back-to-home" aria-label="Kembali ke Home">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12.5 15L7.5 10L12.5 5"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</a>

	<div class="auth-container-wrapper container mx-auto px-4 lg:px-8">
		<div class="auth-container" class:fade-in={mounted}>
			{#if !hideHeader}
				<div class="auth-header">
					<h1 class:fade-in={mounted} style="--delay: 0.1s">{title}</h1>
					<p class:fade-in={mounted} style="--delay: 0.2s">{subtitle}</p>
				</div>
			{/if}

			<div class:fade-in={mounted} style="--delay: 0.3s">
				{@render children()}
			</div>
		</div>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
		overflow-y: hidden; /* delegate scrolling to wrapper */
		padding: 20px 20px 32px; /* extra bottom padding to avoid cut off */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Animated Background Gradient */
	.bg-gradient {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			var(--color-bg-hero) 0%,
			var(--color-bg-hero-end) 50%,
			oklch(94% 0.01 280) 100%
		);
		z-index: 0;
	}

	/* Floating Blobs Animation */
	.bg-blobs {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		overflow: hidden;
		pointer-events: none;
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(60px);
		opacity: 0.4;
		animation: float 20s infinite ease-in-out;
	}

	.blob-1 {
		width: 400px;
		height: 400px;
		background: var(--color-gradient-purple-start);
		top: -100px;
		left: -100px;
		animation-delay: 0s;
	}

	.blob-2 {
		width: 300px;
		height: 300px;
		background: var(--color-gradient-purple-mid);
		bottom: -50px;
		right: -50px;
		animation-delay: 5s;
	}

	.blob-3 {
		width: 350px;
		height: 350px;
		background: var(--color-gradient-purple-end);
		top: 50%;
		left: 50%;
		margin-left: -175px;
		margin-top: -175px;
		animation-delay: 10s;
	}

	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(30px, -30px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
	}

	.back-to-home {
		position: fixed;
		top: 24px;
		left: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 44px;
		height: 44px;
		padding: 0;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(40px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 12px;
		text-decoration: none;
		color: var(--color-primary-dark);
		font-weight: 600;
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.1),
			0 2px 8px rgba(102, 126, 234, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1000;
	}

	.back-to-home:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.95);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.15),
			0 4px 12px rgba(102, 126, 234, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.95);
		border-color: rgba(102, 126, 234, 0.3);
	}

	.back-to-home svg {
		color: var(--color-primary-dark);
		transition: transform 0.3s ease;
		width: 20px;
		height: 20px;
	}

	.back-to-home:hover svg {
		transform: translateX(-2px);
	}

	.auth-container-wrapper {
		position: relative;
		z-index: 2;
		width: 100%;
		margin: 0 auto;
		padding: 20px 0 40px; /* extra bottom space for safe scroll */
		max-width: min(1100px, 92vw); /* responsive cap for all breakpoints */
		max-height: calc(100vh - 80px); /* wrapper scroll */
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		/* Hide scrollbars across browsers */
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE/Edge */
	}

	.auth-container-wrapper::-webkit-scrollbar {
		/* Chrome/Safari */
		display: none;
	}

	.auth-container {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.5);
		border-radius: 24px;
		padding: 40px;
		width: 100%;
		/* Let the PAGE scroll the whole card instead of card scrolling its contents */
		max-height: none;
		overflow: visible;
		max-width: 860px; /* default card width */
		margin: 0 auto; /* center the card */
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.08),
			0 4px 16px rgba(102, 126, 234, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.auth-container.fade-in {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--delay, 0s);
	}

	.auth-header {
		text-align: center;
		margin-bottom: 32px;
	}

	.auth-header h1 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 8px;
		font-weight: 700;
		opacity: 0;
		transform: translateY(10px);
		transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.auth-header h1.fade-in {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--delay, 0s);
	}

	.auth-header p {
		color: var(--color-primary-medium);
		font-size: 1em;
		line-height: 1.5;
		opacity: 0;
		transform: translateY(10px);
		transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.auth-header p.fade-in {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--delay, 0s);
	}

	.fade-in {
		opacity: 0;
		transform: translateY(10px);
		transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.fade-in.fade-in {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--delay, 0s);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.auth-page {
			padding: 16px;
		}

		.back-to-home {
			top: 16px;
			left: 16px;
			width: 40px;
			height: 40px;
		}

		.auth-container-wrapper {
			padding: 20px 0;
			max-height: calc(100vh - 64px);
		}
		.auth-container {
			padding: 32px 24px;
			border-radius: 20px;
			max-height: none;
			overflow: visible;
			max-width: 640px;
			margin: 0 auto;
		}

		.auth-header h1 {
			font-size: 1.75em;
		}

		.blob {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.auth-page {
			padding: 12px;
		}

		.auth-container {
			padding: 24px 20px;
			border-radius: 16px;
			max-width: 100%;
			max-height: none;
			overflow: visible;
		}

		.auth-header h1 {
			font-size: 1.5em;
		}

		/* Larger screens - keep card comfortable */
		@media (min-width: 1024px) {
			.auth-container {
				max-width: 900px;
			}
		}
		@media (min-width: 1280px) {
			.auth-container {
				max-width: 960px;
			}
		}

		.auth-header p {
			font-size: 0.9em;
		}
	}

	/* Landscape mobile orientation */
	@media (max-height: 600px) and (orientation: landscape) {
		.auth-page {
			padding: 12px;
		}

		.auth-container {
			padding: 24px;
		}

		.auth-header {
			margin-bottom: 20px;
		}

		.auth-header h1 {
			font-size: 1.5em;
		}
	}
</style>
