<script lang="ts">
	import HeroSection from '$lib/sections/HeroSection.svelte';
	import AboutSection from '$lib/sections/AboutSection.svelte';
	import ProgramSection from '$lib/sections/ProgramSection.svelte';
	import BenefitsSection from '$lib/sections/BenefitsSection.svelte';
	import CTASection from '$lib/sections/CTASection.svelte';
	import FooterSection from '$lib/sections/FooterSection.svelte';
	import LazySection from '$lib/components/LazySection.svelte';
	import FloatingCTA from '$lib/components/FloatingCTA.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { careerStore } from '$lib/stores/career';
	import { get } from 'svelte/store';
	import {
		getDefaultSEOConfig,
		getLandingPageStructuredData,
		getKeywordsString,
		getSEOConfig
	} from '$lib/utils/seo';
	import { trackPageView, initScrollDepthTracking, trackDomainChange } from '$lib/utils/analytics';

	// Get SEO config (default to Developer, will update dynamically if needed)
	let seoConfig = $state(getDefaultSEOConfig());
	let structuredData = $state(getLandingPageStructuredData('Developer'));

	onMount(() => {
		// Client-side only code
		if (!browser) return;

		// Track initial page view
		trackPageView('/', seoConfig.title);

		// Initialize scroll depth tracking
		const scrollDepthCleanup = initScrollDepthTracking();

		// Track previous domain untuk detect changes
		let previousDomain = get(careerStore);

		// Update SEO when domain changes (client-side only)
		const unsubscribe = careerStore.subscribe((domain) => {
			if (domain) {
				// Track domain change
				if (domain !== previousDomain) {
					trackDomainChange(previousDomain, domain);
					previousDomain = domain;
				}

				seoConfig = getSEOConfig(domain);
				structuredData = getLandingPageStructuredData(domain);
			}
		});

		return () => {
			unsubscribe();
			scrollDepthCleanup();
		};
	});
</script>

<svelte:head>
	<title>{seoConfig.title}</title>
	<meta name="description" content={seoConfig.description} />
	<meta name="keywords" content={getKeywordsString(seoConfig.keywords)} />
	<link rel="canonical" href="https://learning.konxc.space/" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://learning.konxc.space/" />
	<meta property="og:title" content={seoConfig.ogTitle} />
	<meta property="og:description" content={seoConfig.ogDescription} />
	<meta property="og:image" content="https://learning.konxc.space/apple-icon-180x180.png" />
	<meta property="og:image:width" content="180" />
	<meta property="og:image:height" content="180" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:site_name" content="Naik Kelas by Koneksi" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://learning.konxc.space/" />
	<meta name="twitter:title" content={seoConfig.twitterTitle} />
	<meta name="twitter:description" content={seoConfig.twitterDescription} />
	<meta name="twitter:image" content="https://learning.konxc.space/apple-icon-180x180.png" />

	<!-- Additional SEO -->
	<meta name="author" content="Koneksi" />
	<meta name="robots" content="index, follow" />

	<!-- Structured Data for SEO -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<!-- Skip to main content link untuk accessibility -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<main id="main-content" aria-label="Main content">
	<HeroSection />
	<CTASection />
	<ProgramSection />
	<BenefitsSection />
	<AboutSection />
	<!-- Lazy load TestimonialsSection (below fold, non-critical) -->
	<LazySection
		component={() => import('$lib/sections/TestimonialsSection.svelte')}
		showSkeleton={true}
		rootMargin="100px"
	/>
	<!-- Lazy load FAQSection (below fold, non-critical) -->
	<LazySection
		component={() => import('$lib/sections/FAQSection.svelte')}
		showSkeleton={true}
		rootMargin="100px"
	/>
	<!-- Lazy load SocialProofSection (below fold, non-critical) -->
	<LazySection
		component={() => import('$lib/sections/SocialProofSection.svelte')}
		showSkeleton={true}
		rootMargin="100px"
	/>
</main>

<!-- Floating CTA - Sticky button untuk conversion -->
<FloatingCTA scrollThreshold={100} hideOnBottom={true} />

<FooterSection />

<style>
	/* Skip to content link untuk accessibility */
	.skip-link {
		position: fixed;
		top: -40px;
		left: 0;
		background: var(--color-primary-dark, #1a202c);
		color: white;
		padding: 12px 24px;
		text-decoration: none;
		font-weight: 600;
		border-radius: 0 0 4px 0;
		z-index: 10000;
		transition: top 0.2s ease;
		/* Sembunyikan dari viewport saat tidak focus */
		clip: rect(0, 0, 0, 0);
		clip-path: inset(50%);
	}

	.skip-link:focus {
		top: 0;
		outline: 3px solid var(--color-primary-soft-blue, #667eea);
		outline-offset: 2px;
		/* Tampilkan saat focus */
		clip: auto;
		clip-path: none;
	}

	/* Optimize animations - reduce motion for users who prefer it */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}

		.skip-link {
			transition: none;
		}
	}
</style>
