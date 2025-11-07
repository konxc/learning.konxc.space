<script lang="ts">
	import type { CareerOption } from '$lib/stores/career';

	interface Props {
		variant?: 'dots' | 'line' | 'gradient' | 'pulse' | 'wave' | 'icon';
		size?: 'sm' | 'md' | 'lg';
		spacing?: number; // spacing dalam rem
		animated?: boolean;
		dotCount?: number; // jumlah dot untuk wave variant
		currentDomain?: CareerOption; // Domain yang sedang aktif untuk variant 'icon'
	}

	let {
		variant = 'wave',
		size = 'md',
		spacing = 1.5,
		animated = true,
		dotCount = 5,
		currentDomain = 'Developer'
	}: Props = $props();

	// Mapping ikon untuk setiap domain
	const domainIcons: Record<CareerOption, string> = {
		Developer: '💻',
		Akademik: '📚',
		'Bisnis & UMKM': '💼',
		'UI/UX Design': '🎨',
		'Outdoor Adventure': '🏔️'
	};

	const currentIcon = $derived(domainIcons[currentDomain] || domainIcons['Developer']);

	const sizeClasses = {
		sm: 'w-12 h-1 md:w-16',
		md: 'w-20 h-1.5 md:w-24',
		lg: 'w-32 h-2 md:w-40'
	};

	const dotSizeClasses = {
		sm: 'w-1.5 h-1.5',
		md: 'w-2 h-2',
		lg: 'w-2.5 h-2.5'
	};
</script>

<div
	class="hero-spacer group relative flex items-center justify-center max-md:my-4"
	style="margin: {variant === 'icon' ? '0' : `${spacing}rem`} auto;"
>
	{#if variant === 'dots'}
		<!-- Variant: Animated Dots -->
		<div class="flex items-center gap-2 md:gap-3">
			{#each Array(3) as _, i}
				<div
					class="spacer-dot rounded-full bg-(--color-primary-soft-blue) opacity-60 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:opacity-90 {animated
						? 'animate-pulse'
						: ''}"
					style="
						width: {size === 'sm' ? '0.375rem' : size === 'md' ? '0.5rem' : '0.625rem'};
						height: {size === 'sm' ? '0.375rem' : size === 'md' ? '0.5rem' : '0.625rem'};
						animation-delay: {i * 0.2}s;
					"
				></div>
			{/each}
		</div>
	{:else if variant === 'line'}
		<!-- Variant: Simple Animated Line -->
		<div
			class="spacer-line rounded-full bg-gradient-to-r from-transparent via-(--color-primary-soft-blue) to-transparent opacity-50 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:opacity-90 {sizeClasses[
				size
			]} {animated ? 'animate-pulse' : ''}"
		></div>
	{:else if variant === 'gradient'}
		<!-- Variant: Gradient Line dengan Animation -->
		<div
			class="spacer-gradient rounded-full opacity-50 shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:opacity-90 {sizeClasses[
				size
			]} {animated ? 'animate-gradient-shift' : ''}"
		></div>
	{:else if variant === 'wave'}
		<!-- Variant: Wave Pulse Dots - bergerak seperti gelombang -->
		<div class="flex items-center gap-2 md:gap-3">
			{#each Array(dotCount) as _, i}
				<div
					class="spacer-wave-dot rounded-full bg-(--color-primary-soft-blue) {animated
						? 'animate-wave-pulse'
						: ''}"
					style="
						width: {size === 'sm' ? '0.375rem' : size === 'md' ? '0.5rem' : '0.625rem'};
						height: {size === 'sm' ? '0.375rem' : size === 'md' ? '0.5rem' : '0.625rem'};
						animation-delay: {i * 0.15}s;
						--dot-index: {i};
					"
				></div>
			{/each}
		</div>
	{:else if variant === 'pulse'}
		<!-- Variant: Pulse Dots -->
		<div class="flex items-center gap-2 md:gap-3">
			{#each Array(3) as _, i}
				<div
					class="spacer-pulse relative rounded-full bg-(--color-primary-soft-blue) transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:opacity-90 {animated
						? 'animate-ping'
						: ''}"
					style="
						width: {size === 'sm' ? '0.375rem' : size === 'md' ? '0.5rem' : '0.625rem'};
						height: {size === 'sm' ? '0.375rem' : size === 'md' ? '0.5rem' : '0.625rem'};
						animation-delay: {i * 0.15}s;
						animation-duration: 2s;
					"
				></div>
			{/each}
		</div>
	{:else if variant === 'icon'}
		<!-- Variant: Domain Icon -->
		<div
			class="spacer-icon my-2 flex items-center justify-center transition-all duration-300 ease-in-out group-hover:scale-110 sm:my-4 {animated
				? 'animate-bounce-subtle'
				: ''}"
			style="
				font-size: {size === 'sm' ? '2rem' : size === 'md' ? '2.5rem' : '3rem'};
			"
			role="img"
			aria-label="Ikon untuk domain {currentDomain}"
		>
			{currentIcon}
		</div>
	{/if}
</div>

<style>
	/* Custom CSS hanya untuk efek yang tidak tersedia di Tailwind CSS 4 */

	/* Gradient animation untuk gradient variant */
	@keyframes gradient-shift {
		0%,
		100% {
			background: linear-gradient(
				90deg,
				transparent 0%,
				var(--color-primary-soft-blue) 50%,
				transparent 100%
			);
			opacity: 0.4;
		}
		50% {
			background: linear-gradient(
				90deg,
				transparent 0%,
				var(--color-gradient-purple-start) 50%,
				transparent 100%
			);
			opacity: 0.7;
		}
	}

	.spacer-gradient {
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--color-primary-soft-blue) 50%,
			transparent 100%
		);
	}

	.animate-gradient-shift {
		animation: gradient-shift 3s ease-in-out infinite;
	}

	/* Wave pulse animation - gerakan gelombang yang playful dan interaktif */
	@keyframes wave-pulse {
		0%,
		100% {
			transform: translateY(0) scale(1);
			opacity: 0.6;
		}
		25% {
			transform: translateY(calc(-8px * (1 + var(--dot-index, 0) * 0.1))) scale(1.25);
			opacity: 0.85;
		}
		50% {
			transform: translateY(calc(-14px * (1 + var(--dot-index, 0) * 0.12))) scale(1.4);
			opacity: 1;
		}
		75% {
			transform: translateY(calc(-6px * (1 + var(--dot-index, 0) * 0.08))) scale(1.15);
			opacity: 0.75;
		}
	}

	.spacer-wave-dot {
		animation: wave-pulse 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		transition:
			transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.3s ease,
			filter 0.3s ease;
	}

	/* Group hover effects menggunakan Tailwind classes */
	.group:hover .spacer-wave-dot {
		transform: translateY(-6px) scale(1.2);
		opacity: 1;
		filter: brightness(1.2);
	}

	/* Icon animation - subtle bounce untuk icon variant */
	@keyframes bounce-subtle {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-8px) scale(1.05);
		}
	}

	.animate-bounce-subtle {
		animation: bounce-subtle 2s ease-in-out infinite;
	}

	/* Hover effects sudah menggunakan Tailwind group utilities di HTML */
</style>
