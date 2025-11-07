<script lang="ts">
	import BenefitCard from '$lib/components/BenefitCard.svelte';
	import CardStack from '$lib/components/CardStack.svelte';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { careerStore } from '$lib/stores/career';
	import { get } from 'svelte/store';
	import { BENEFITS_OVERLAY_CONFIG } from '$lib/config/overlayConfigs';
	import { getBenefitsContent } from '$lib/config/contentConfig';

	// Get current domain from store
	let currentDomain = $state(get(careerStore));

	$effect(() => {
		const unsubscribe = careerStore.subscribe((value) => {
			currentDomain = value;
		});
		return unsubscribe;
	});

	// Get dynamic benefits content based on domain
	const benefitsContent = $derived(getBenefitsContent(currentDomain));

	// Glow orbs configuration
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? BENEFITS_OVERLAY_CONFIG.glowOrbs.hardcore
			: BENEFITS_OVERLAY_CONFIG.glowOrbs.chill
	);
</script>

<section id="benefits" class="benefits" aria-labelledby="benefits-title">
	<!-- Header: Title & Subtitle (dalam container) -->
	<div class="benefits-container benefits-header">
		<h2 id="benefits-title" class="benefits-title">{benefitsContent.title}</h2>
		<p class="benefits-subtitle">{benefitsContent.subtitle}</p>
	</div>

	<!-- Mobile: Card Stack (hanya tampil di mobile) -->
	<div class="benefits-stack-wrapper benefits-stack-mobile">
		{#key currentDomain}
			<CardStack items={benefitsContent.items} duration={400}>
				{#snippet children({ item })}
					<BenefitCard {...item} />
				{/snippet}
			</CardStack>
		{/key}
	</div>

	<!-- Tablet/Desktop: Grid (hanya tampil di tablet/desktop) -->
	<div class="benefits-container benefits-grid-wrapper benefits-grid-desktop">
		<div class="benefits-grid" role="list" aria-label="Benefits list">
			{#each benefitsContent.items as benefit}
				<div role="listitem">
					<BenefitCard {...benefit} />
				</div>
			{/each}
		</div>
	</div>

	<AuroraOverlay {...BENEFITS_OVERLAY_CONFIG.aurora} mode={$brandMode} />
	<GlowOrbs zIndex={BENEFITS_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />
</section>

<style lang="postcss">
	@reference "../../app.css";

	.benefits {
		@apply section-padding-with-offset;
		/* Background base color */
		background-color: var(--color-gradient-purple-start);
		/* Background gradient overlay */
		background-image:
			linear-gradient(
				to bottom,
				transparent 0%,
				transparent 50%,
				rgba(102, 126, 234, 0.2) 75%,
				rgba(102, 126, 234, 0.5) 90%,
				var(--color-gradient-purple-start) 100%
			),
			linear-gradient(
				135deg,
				var(--color-gradient-purple-start) 0%,
				var(--color-gradient-purple-mid) 100%
			);
		color: white;
		position: relative;
		overflow: hidden;
		/* Ensure section is visible */
		z-index: 1;
	}

	.benefits-container {
		@apply mx-auto max-w-[1200px];
		position: relative;
		z-index: 2; /* Above overlay */
	}

	.benefits-header {
		@apply container-padding;
	}

	.benefits-title {
		@apply relative lg-mb-15 mb-8 inline-block text-center text-4xl text-white md:mb-10 md:text-5xl lg:text-6xl;
		left: 50%;
		transform: translateX(-50%);
	}

	.benefits-title::after {
		content: '';
		display: block;
		margin: 12px auto 0;
		width: 120px;
		height: 6px;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.2) 0%,
			rgba(255, 255, 255, 0.6) 50%,
			rgba(255, 255, 255, 0.2) 100%
		);
		box-shadow: 0 2px 16px rgba(255, 255, 255, 0.25);
	}

	.benefits-subtitle {
		@apply mx-auto lg-mb-15 mb-8 max-w-[700px] text-center text-lg text-white/90 md:mb-12;
	}

	/* ============================================
	   MOBILE: Card Stack
	   ============================================ */
	.benefits-stack-wrapper {
		@apply relative flex items-center justify-center;
		z-index: 2; /* Above overlay */
		min-height: 500px;
		width: 100%;
	}

	.benefits-stack-mobile {
		display: block; /* Visible di mobile */
	}

	/* ============================================
	   TABLET/DESKTOP: Grid
	   ============================================ */
	.benefits-grid-wrapper {
		@apply container-padding;
		display: none; /* Hidden di mobile */
		position: relative;
		padding: clamp(22px, 5vw, 40px);
		border-radius: 28px;
		overflow: hidden;
		border: 1px solid rgba(99, 102, 241, 0.28);
		background: linear-gradient(140deg, rgba(255, 255, 255, 0.22), rgba(124, 58, 237, 0.12));
		backdrop-filter: blur(18px);
		box-shadow: 0 32px 70px rgba(88, 102, 241, 0.18);
	}

	.benefits-grid {
		@apply grid;
		gap: clamp(18px, 3vw, 28px);
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		align-items: stretch; /* Cards dalam row sama tinggi */
	}

	/* Wrapper untuk stretch */
	.benefits-grid > div[role='listitem'] {
		display: flex;
		height: 100%;
	}

	/* Tablet: 2 columns */
	@media (min-width: 769px) {
		.benefits-stack-mobile {
			display: none; /* Hidden di tablet/desktop */
		}

		.benefits-grid-desktop {
			display: block; /* Visible di tablet/desktop */
		}

		.benefits-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Desktop: 3 columns */
	@media (min-width: 1024px) {
		.benefits-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Responsive: Mobile */
	@media (max-width: 768px) {
		.benefits-title {
			@apply text-3xl;
		}

		.benefits-subtitle {
			@apply text-base;
		}

		.benefits-stack-wrapper {
			min-height: 450px;
		}
	}

	/* Responsive: Small mobile */
	@media (max-width: 480px) {
		.benefits-title {
			@apply text-2xl;
		}

		.benefits-subtitle {
			@apply text-sm;
		}
	}
</style>
