<script lang="ts">
	import SocialProofMetric from '$lib/components/SocialProofMetric.svelte';
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { SOCIAL_PROOF_METRICS, PARTNERS, MEDIA_MENTIONS } from '$lib/config/socialProof';
	import { BENEFITS_OVERLAY_CONFIG } from '$lib/config/overlayConfigs';

	// Glow orbs configuration
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? BENEFITS_OVERLAY_CONFIG.glowOrbs.hardcore
			: BENEFITS_OVERLAY_CONFIG.glowOrbs.chill
	);
</script>

<section id="social-proof" class="social-proof" aria-labelledby="social-proof-title">
	<div class="social-proof-container">
		<h2 id="social-proof-title" class="social-proof-title">Dipercaya oleh Ribuan Pelajar</h2>
		<p class="social-proof-subtitle">
			Bergabunglah dengan ribuan pelajar yang telah meraih kesuksesan dengan program Naik Kelas
		</p>

		<!-- Metrics -->
		<div class="social-proof-metrics" role="list" aria-label="Social proof metrics">
			{#each SOCIAL_PROOF_METRICS as metric}
				<div class="metric-item" role="listitem">
					<SocialProofMetric {metric} />
				</div>
			{/each}
		</div>

		<!-- Partners -->
		{#if PARTNERS.length > 0}
			<div class="social-proof-partners">
				<h3 class="partners-title">Partner Kami</h3>
				<div class="partners-list" role="list" aria-label="Partner organizations">
					{#each PARTNERS as partner}
						<div class="partner-item" role="listitem">
							{#if partner.url}
								<a
									href={partner.url}
									target="_blank"
									rel="noopener noreferrer"
									class="partner-link"
								>
									{#if partner.logo}
										<OptimizedImage
											src={partner.logo}
											alt="{partner.name} logo"
											width={120}
											height={60}
											loading="lazy"
											decoding="async"
											objectFit="contain"
											class="partner-logo"
										/>
									{:else}
										<span class="partner-name">{partner.name}</span>
									{/if}
								</a>
							{:else if partner.logo}
								<OptimizedImage
									src={partner.logo}
									alt="{partner.name} logo"
									width={120}
									height={60}
									loading="lazy"
									decoding="async"
									objectFit="contain"
									class="partner-logo"
								/>
							{:else}
								<span class="partner-name">{partner.name}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Media Mentions -->
		{#if MEDIA_MENTIONS.length > 0}
			<div class="social-proof-media">
				<h3 class="media-title">Featured In</h3>
				<div class="media-list" role="list" aria-label="Media mentions">
					{#each MEDIA_MENTIONS as mention}
						<div class="media-item" role="listitem">
							{#if mention.url}
								<a href={mention.url} target="_blank" rel="noopener noreferrer" class="media-link">
									{#if mention.logo}
										<OptimizedImage
											src={mention.logo}
											alt="{mention.source} logo"
											width={100}
											height={40}
											loading="lazy"
											decoding="async"
											objectFit="contain"
											class="media-logo"
										/>
									{:else}
										<span class="media-source">{mention.source}</span>
									{/if}
									{#if mention.date}
										<span class="media-date">{mention.date}</span>
									{/if}
								</a>
							{:else}
								<div class="media-content">
									{#if mention.logo}
										<OptimizedImage
											src={mention.logo}
											alt="{mention.source} logo"
											width={100}
											height={40}
											loading="lazy"
											decoding="async"
											objectFit="contain"
											class="media-logo"
										/>
									{:else}
										<span class="media-source">{mention.source}</span>
									{/if}
									{#if mention.date}
										<span class="media-date">{mention.date}</span>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<AuroraOverlay {...BENEFITS_OVERLAY_CONFIG.aurora} mode={$brandMode} />
	<GlowOrbs zIndex={BENEFITS_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />
</section>

<style lang="postcss">
	@reference "../../app.css";

	.social-proof {
		@apply section-padding;
		background: linear-gradient(
			to bottom,
			var(--color-bg-lighter) 0%,
			var(--color-bg-light) 50%,
			var(--color-bg-lighter) 100%
		);
		position: relative;
		overflow: hidden;
	}

	.social-proof-container {
		@apply mx-auto max-w-[1200px] container-padding;
	}

	.social-proof-title {
		@apply relative lg-mb-15 mb-8 inline-block text-center text-4xl font-semibold text-(--color-primary-dark) md:mb-10 md:text-5xl lg:text-6xl;
		left: 50%;
		transform: translateX(-50%);
	}

	.social-proof-title::after {
		content: '';
		display: block;
		margin: 14px auto 0;
		width: 120px;
		height: 5px;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--color-primary-soft-blue), transparent);
		opacity: 0.5;
	}

	.social-proof-subtitle {
		@apply mx-auto lg-mb-15 mb-8 max-w-[700px] text-center text-lg text-(--color-primary-medium) md:mb-12;
	}

	.social-proof-metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 25px;
		@apply lg-mb-15 mb-8 md:mb-12;
	}

	.metric-item {
		transition:
			transform 0.3s ease,
			filter 0.3s ease;
		will-change: transform, filter;
	}

	.metric-item:hover {
		transform: translateY(-6px);
		filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.12));
	}

	.social-proof-partners,
	.social-proof-media {
		margin-top: 60px;
		padding-top: 60px;
		border-top: 1px solid var(--color-bg-hero-end, rgba(0, 0, 0, 0.1));
	}

	.partners-title,
	.media-title {
		@apply mb-10 text-center text-3xl font-semibold text-(--color-primary-dark);
	}

	.partners-list,
	.media-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 40px;
	}

	.partner-item,
	.media-item {
		transition: transform 0.3s ease;
	}

	.partner-item:hover,
	.media-item:hover {
		transform: scale(1.1);
	}

	.partner-link {
		display: block;
		text-decoration: none;
		color: inherit;
	}

	:global(.partner-logo) {
		max-width: 120px;
		height: auto;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.partner-link:hover :global(.partner-logo),
	.partner-item:hover :global(.partner-logo) {
		opacity: 1;
	}

	.partner-name {
		@apply text-lg font-medium text-(--color-primary-medium);
	}

	.media-link,
	.media-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: inherit;
	}

	:global(.media-logo) {
		max-width: 100px;
		height: auto;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.media-link:hover :global(.media-logo),
	.media-item:hover :global(.media-logo) {
		opacity: 1;
	}

	.media-source {
		@apply text-base font-medium text-(--color-primary-dark);
	}

	.media-date {
		@apply text-sm text-(--color-primary-medium);
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.social-proof-metrics {
			grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
			gap: 20px;
		}
	}

	@media (max-width: 768px) {
		.social-proof-title {
			@apply text-3xl;
		}

		.social-proof-subtitle {
			@apply text-base;
		}

		.social-proof-metrics {
			grid-template-columns: repeat(2, 1fr);
			gap: 15px;
			@apply mb-10;
		}

		.social-proof-partners,
		.social-proof-media {
			margin-top: 40px;
			padding-top: 40px;
		}

		.partners-title,
		.media-title {
			@apply text-2xl;
		}

		.partners-list,
		.media-list {
			gap: 30px;
		}
	}

	@media (max-width: 480px) {
		.social-proof-title {
			@apply text-2xl;
		}

		.social-proof-subtitle {
			@apply text-sm;
		}

		.social-proof-metrics {
			grid-template-columns: 1fr;
			gap: 15px;
		}
	}
</style>
