<script lang="ts">
	import type { HeadlineVariant } from '$lib/data/headlineVariants';
	import { headlineVariants } from '$lib/data/headlineVariants';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import FlyingIcons from '$lib/components/decor/FlyingIcons.svelte';
	import ScrollHint from '$lib/components/ScrollHint.svelte';
	import BrandModeToggle from '$lib/components/BrandModeToggle.svelte';
	import HeroLogo from '$lib/components/HeroLogo.svelte';
	import HeroTagline from '$lib/components/HeroTagline.svelte';
	import RotatingText from '$lib/components/RotatingText.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { HERO_OVERLAY_CONFIG } from '$lib/config/overlayConfigs';

	interface Props {
		logo?: string;
		tagline?: string;
		headline?: string;
		headlinePart2?: string;
		description?: string;
	}

	const {
		logo = 'Naik Kelas',
		tagline = 'by Koneksi × Yayasan Klub Fisika',
		headline: defaultHeadline,
		headlinePart2: defaultHeadlinePart2,
		description: defaultDescription
	}: Props = $props();

	// Prepare default variant jika props custom diberikan
	const defaultVariant: HeadlineVariant | undefined =
		defaultHeadline && defaultHeadlinePart2 && defaultDescription
			? {
					headline: defaultHeadline,
					headlinePart2: defaultHeadlinePart2,
					description: defaultDescription
				}
			: undefined;

	// Glow orbs configuration
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? HERO_OVERLAY_CONFIG.glowOrbs.hardcore
			: HERO_OVERLAY_CONFIG.glowOrbs.chill
	);
</script>

<section
	id="hero"
	class="hero-bg relative flex min-h-screen flex-col justify-between overflow-hidden bg-linear-to-br from-bg-hero to-bg-hero-end"
	aria-labelledby="hero-heading"
	aria-label="Hero section - Program Naik Kelas"
>
	<div class="relative z-10 mb-4 pt-6 text-center min-[640px]:pt-8 md:pt-10 lg:pt-12">
		<HeroLogo {logo} />
		<HeroTagline {tagline} />
	</div>
	<div
		class="hero-inner relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-12 text-center min-[640px]:px-6 md:px-8"
	>
		<RotatingText variants={headlineVariants} {defaultVariant} />
	</div>
	<!-- Desktop: Tombol terpisah seperti biasa -->
	<div
		class="scroll-hint-wrapper relative z-10 hidden h-32 items-end px-4 pb-6 md:flex md:items-start md:justify-center"
	>
		<ScrollHint />
	</div>
	<!-- Desktop/Tablet: BrandModeToggle di pojok kanan atas -->
	<div
		class="brand-mode-toggle-wrapper absolute top-0 right-0 z-10 hidden pt-6 pr-6 md:block lg:pt-8 lg:pr-8"
	>
		<BrandModeToggle />
	</div>

	<!-- Mobile: Wrapper untuk kedua tombol di pojok kanan bawah -->
	<div
		class="floating-buttons-mobile relative z-10 flex h-32 items-end justify-end pr-4 pb-4 md:hidden"
		data-mobile-wrapper="true"
	>
		<div class="flex flex-col items-end gap-3">
			<BrandModeToggle />
			<ScrollHint />
		</div>
	</div>
	<AuroraOverlay {...HERO_OVERLAY_CONFIG.aurora} mode={$brandMode} />
	<GlowOrbs zIndex={HERO_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />
	<FlyingIcons zIndex={2} intensity={0.8} interactionMode="subtle" flyingMode="gentle" />
</section>

<style>
	/* Custom CSS hanya untuk efek yang tidak tersedia di Tailwind CSS 4 */

	/* Fallback untuk browser yang tidak support dvh - fallback ke 100vh */
	@supports not (height: 100dvh) {
		.hero-bg {
			height: 100vh;
		}
	}

	/* Desktop: Safe area support untuk wrapper ScrollHint */
	@supports (padding-bottom: env(safe-area-inset-bottom)) {
		.scroll-hint-wrapper {
			padding-bottom: calc(1rem + env(safe-area-inset-bottom));
		}
	}

	@media (min-width: 769px) {
		.scroll-hint-wrapper {
			padding-bottom: 1rem;
		}
	}

	/* Desktop/Tablet: BrandModeToggle positioning - pojok kanan atas */
	.brand-mode-toggle-wrapper {
		/* Safe area support untuk desktop/tablet */
		@supports (padding-top: env(safe-area-inset-top)) {
			padding-top: calc(1.5rem + env(safe-area-inset-top));
			padding-right: calc(1.5rem + env(safe-area-inset-right, 0px));
		}
	}

	@media (min-width: 769px) {
		.brand-mode-toggle-wrapper {
			padding-top: 1.5rem;
			padding-right: 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.brand-mode-toggle-wrapper {
			padding-top: 2rem;
			padding-right: 2rem;
		}
	}

	/* Mobile: Wrapper untuk kedua tombol di pojok kanan bawah */
	/* Menggunakan struktur yang sama dengan scroll-hint-wrapper */
	/* Safe area support untuk menghindari navbar Android/iOS */
	@supports (padding-bottom: env(safe-area-inset-bottom)) {
		.floating-buttons-mobile {
			padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 2rem);
			padding-right: calc(env(safe-area-inset-right, 0px) + 1.25rem);
		}
	}

	/* Fallback untuk browser yang tidak support safe-area-inset */
	@media (max-width: 768px) {
		.floating-buttons-mobile {
			padding-bottom: 3rem; /* Extra space untuk mobile navbar */
			padding-right: 1.25rem;
		}
	}

	@media (max-width: 480px) {
		.floating-buttons-mobile {
			padding-bottom: 3.25rem; /* Extra space untuk mobile navbar */
			padding-right: 0.75rem; /* Lebih mepet ke tepi kanan */
		}
	}

	/* Tombol di dalam wrapper mobile menggunakan relative positioning */
	/* Tidak perlu override karena komponen sudah tidak memiliki positioning logic */

	/* Smooth transition ke CTA section - gradient fade di bagian bawah */
	.hero-bg::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 200px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(102, 126, 234, 0.1) 30%,
			rgba(102, 126, 234, 0.3) 60%,
			var(--color-gradient-purple-start) 100%
		);
		pointer-events: none;
		z-index: 1;
	}

	@media (max-width: 768px) {
		.hero-bg::after {
			height: 140px;
		}
	}
</style>
