<script lang="ts">
	import TestimonialsCarousel from '$lib/components/TestimonialsCarousel.svelte';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { careerStore } from '$lib/stores/career';
	import { get } from 'svelte/store';
	import { getFeaturedTestimonials } from '$lib/config/testimonials';
	import { TESTIMONIALS_OVERLAY_CONFIG } from '$lib/config/overlayConfigs';
	import { getTestimonialsContent } from '$lib/config/contentConfig';

	// Get current domain from store
	let currentDomain = $state(get(careerStore));

	$effect(() => {
		const unsubscribe = careerStore.subscribe((value) => {
			currentDomain = value;
		});
		return unsubscribe;
	});

	// Get testimonials for current domain
	const testimonials = $derived(getFeaturedTestimonials(currentDomain, 3));

	// Get dynamic testimonials content based on domain
	const testimonialsContent = $derived(getTestimonialsContent(currentDomain));

	// Glow orbs configuration
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? TESTIMONIALS_OVERLAY_CONFIG.glowOrbs.hardcore
			: TESTIMONIALS_OVERLAY_CONFIG.glowOrbs.chill
	);

	// Container untuk carousel
	let gridContainer: HTMLElement | null = $state(null);
</script>

<section id="testimonials" class="testimonials" aria-labelledby="testimonials-title">
	<!-- Header: Title & Subtitle (dalam container) -->
	<div class="testimonials-container testimonials-header">
		<h2 id="testimonials-title" class="testimonials-title">{testimonialsContent.title}</h2>
		<p class="testimonials-subtitle">{testimonialsContent.subtitle}</p>
	</div>

	<!-- Carousel (full width di mobile, dalam container di desktop) -->
	{#if testimonials.length === 0}
		<div class="testimonials-container">
			<div class="testimonials-empty" role="status" aria-live="polite">
				<p>Memuat testimonials untuk domain <strong>{currentDomain}</strong>...</p>
			</div>
		</div>
	{:else}
		<div class="testimonials-carousel-wrapper" bind:this={gridContainer}>
			<TestimonialsCarousel {testimonials} />
		</div>
	{/if}

	<AuroraOverlay {...TESTIMONIALS_OVERLAY_CONFIG.aurora} mode={$brandMode} />
	<GlowOrbs zIndex={TESTIMONIALS_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />
</section>

<style lang="postcss">
	@reference "../../app.css";

	.testimonials {
		@apply section-padding;
		/* Background base color */
		background-color: var(--color-bg-lighter);
		/* Background gradient overlay */
		background-image:
			linear-gradient(
				to bottom,
				transparent 0%,
				transparent 50%,
				rgba(102, 126, 234, 0.15) 75%,
				rgba(102, 126, 234, 0.3) 90%,
				var(--color-bg-lighter) 100%
			),
			linear-gradient(to bottom, var(--color-bg-lighter) 0%, var(--color-bg-light) 100%);
		position: relative;
		overflow: hidden;
		/* Ensure section is visible */
		z-index: 1;
	}

	.testimonials-container {
		@apply mx-auto max-w-[1200px];
		position: relative;
		z-index: 2; /* Above overlay */
	}

	.testimonials-header {
		@apply container-padding;
	}

	.testimonials-title {
		@apply relative lg-mb-15 mb-8 inline-block text-center text-4xl font-semibold text-(--color-primary-dark) md:mb-10 md:text-5xl lg:text-6xl;
		left: 50%;
		transform: translateX(-50%);
	}

	.testimonials-title::after {
		content: '';
		display: block;
		margin: 12px auto 0;
		width: 120px;
		height: 6px;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			rgba(102, 126, 234, 0.2) 0%,
			rgba(102, 126, 234, 0.6) 50%,
			rgba(102, 126, 234, 0.2) 100%
		);
		box-shadow: 0 2px 16px rgba(102, 126, 234, 0.25);
	}

	.testimonials-subtitle {
		@apply mx-auto lg-mb-15 mb-8 max-w-[700px] text-center text-lg text-(--color-primary-medium) md:mb-12;
	}

	.testimonials-carousel-wrapper {
		@apply relative;
		z-index: 2; /* Above overlay */
		/* Mobile: Full width tanpa padding container */
		width: 100%;
	}

	/* Desktop: Carousel masuk ke dalam container dengan max-width */
	@media (min-width: 769px) {
		.testimonials-carousel-wrapper {
			@apply mx-auto container-padding;
			max-width: 1200px;
		}
	}

	.testimonials-empty {
		@apply px-5 py-12 text-center text-(--color-primary-medium);
	}

	/* Responsive: Mobile */
	@media (max-width: 768px) {
		.testimonials-title {
			@apply text-3xl;
		}

		.testimonials-subtitle {
			@apply text-base;
		}
	}

	/* Responsive: Small mobile */
	@media (max-width: 480px) {
		.testimonials-title {
			@apply text-2xl;
		}

		.testimonials-subtitle {
			@apply text-sm;
		}
	}
</style>
