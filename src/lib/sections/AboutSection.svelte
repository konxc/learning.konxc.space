<script lang="ts">
	import { onMount } from 'svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { careerStore } from '$lib/stores/career';
	import { get } from 'svelte/store';
	import { ABOUT_OVERLAY_CONFIG } from '$lib/config/overlayConfigs';
	import { DOMAIN_NARRATIVES, getAboutContent } from '$lib/config/contentConfig';
	import type { DomainNarrative } from '$lib/config/contentConfig';
	import { trackCTAClick } from '$lib/utils/analytics';
	import { communitySpotlight } from '$lib/data/communitySpotlight';
	import type { CommunitySpotlightEntry } from '$lib/data/communitySpotlight';

	// Get current domain from store
	let currentDomain = $state(get(careerStore));

	$effect(() => {
		const unsubscribe = careerStore.subscribe((value) => {
			currentDomain = value;
		});
		return unsubscribe;
	});

	// Get dynamic about content based on domain
	const aboutContent = $derived(getAboutContent(currentDomain));
	const domainNarrative = $derived(DOMAIN_NARRATIVES[currentDomain] as DomainNarrative);
	const highlightItems = $derived(aboutContent.items.slice(0, 3));
	const showcaseCards = $derived(aboutContent.items.slice(3, 5));
	const spotlightPublished = $derived(
		communitySpotlight.filter((entry) => entry.status === 'published') as CommunitySpotlightEntry[]
	);
	const spotlightUpcoming = $derived(
		communitySpotlight.filter(
			(entry) => entry.status === 'coming-soon'
		) as CommunitySpotlightEntry[]
	);

	const communityStats = [
		{
			value: '1.2K+',
			label: 'Learners Aktif',
			description: 'Belajar konsisten setiap minggu melalui study group dan sprint bersama mentor.'
		},
		{
			value: '85%',
			label: 'Completion Rate',
			description:
				'Peserta menuntaskan kurikulum intensif berkat dukungan komunitas dan accountability.'
		},
		{
			value: '50+',
			label: 'Mentor & Facilitator',
			description:
				'Praktisi industri siap mendampingi review project, office hour, dan career coaching.'
		}
	];

	// Glow orbs configuration
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? ABOUT_OVERLAY_CONFIG.glowOrbs.hardcore
			: ABOUT_OVERLAY_CONFIG.glowOrbs.chill
	);

	let sectionEl = $state<HTMLElement | null>(null);
	let overlaysVisible = $state(false);

	onMount(() => {
		if (typeof IntersectionObserver === 'undefined' || !sectionEl) {
			overlaysVisible = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						overlaysVisible = true;
						observer.disconnect();
					}
				});
			},
			{ rootMargin: '0px 0px 200px 0px', threshold: 0.1 }
		);

		observer.observe(sectionEl);

		return () => observer.disconnect();
	});
</script>

<section id="about" class="about" aria-labelledby="about-title" bind:this={sectionEl}>
	<div class="about-container">
		<div class="about-layout">
			<div class="about-copy">
				<span class="about-badge">Platform belajar berbasis komunitas</span>
				<h2 id="about-title" class="about-title">{aboutContent.title}</h2>
				<p class="about-subtitle">{aboutContent.subtitle}</p>

				<ul class="about-highlights" role="list">
					{#each highlightItems as highlight}
						<li role="listitem" class="highlight-item">
							<span class="highlight-icon" aria-hidden="true">{highlight.icon}</span>
							<div>
								<h3 class="highlight-title">{highlight.title}</h3>
								<p class="highlight-description">{highlight.description}</p>
							</div>
						</li>
					{/each}
				</ul>

				<div class="about-actions">
					<a
						class="about-primary"
						href="/waiting-list"
						onclick={() => trackCTAClick('about_section', 'Join Waiting List', '/waiting-list')}
					>
						🎯 Join Waiting List
					</a>
					<a
						class="about-link"
						href="/tentang#domains"
						onclick={() =>
							trackCTAClick('about_section', 'Pelajari Selengkapnya', '/tentang#domains')}
					>
						Pelajari selengkapnya
					</a>
				</div>
			</div>

			<div class="about-showcase" aria-label="Data komunitas Naik Kelas">
				<div class="about-stats">
					{#each communityStats as stat}
						<div class="stat-card">
							<span class="stat-value">{stat.value}</span>
							<span class="stat-label">{stat.label}</span>
							<p class="stat-description">{stat.description}</p>
						</div>
					{/each}
				</div>

				{#if showcaseCards.length > 0}
					<div class="showcase-cards" role="list" aria-label="Sorotan pembelajaran">
						{#each showcaseCards as feature}
							<div role="listitem" class="showcase-card">
								<FeatureCard {...feature} />
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<div class="domain-outlook" aria-label="Gambaran domain aktif">
			<h3 class="domain-outlook-title">{domainNarrative.title} Outlook</h3>
			<p class="domain-outlook-summary">{domainNarrative.futureVision}</p>
			<div class="domain-tokenization">
				<strong>Fokus tokenisasi konten</strong>
				<p>{domainNarrative.tokenizationFocus}</p>
			</div>
			<ul class="domain-initiatives" role="list">
				{#each domainNarrative.initiatives.slice(0, 3) as initiative}
					<li role="listitem">{initiative}</li>
				{/each}
			</ul>
		</div>

		{#if spotlightPublished.length > 0}
			<div class="spotlight-grid" aria-live="polite">
				{#each spotlightPublished as spotlight}
					<div class="spotlight-card" role="article">
						<span class="spotlight-badge">{spotlight.domain}</span>
						<h4 class="spotlight-title">{spotlight.name}</h4>
						<p class="spotlight-role">{spotlight.role}</p>
						<p class="spotlight-copy">{spotlight.story}</p>
						<p class="spotlight-highlight">{spotlight.highlight}</p>
						{#if spotlight.socialLinks.length > 0}
							<div class="spotlight-links">
								{#each spotlight.socialLinks as link}
									<a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="spotlight-placeholder" aria-live="polite">
				<h4 class="spotlight-title">Community Spotlight</h4>
				<p class="spotlight-copy">
					Profil alumni akan segera hadir di sini setelah mereka menyelesaikan sertifikasi akhir dan
					berpartisipasi dalam kampanye komunitas. Nantikan cerita lengkap serta portofolio mereka
					di pembaruan berikutnya.
				</p>
				<div class="spotlight-badge">Coming Soon</div>
				{#if spotlightUpcoming.length > 0}
					<ul class="spotlight-upcoming" role="list">
						{#each spotlightUpcoming as upcoming}
							<li role="listitem">{upcoming.name} · {upcoming.domain}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>

	{#if overlaysVisible}
		<AuroraOverlay {...ABOUT_OVERLAY_CONFIG.aurora} mode={$brandMode} />
		<GlowOrbs zIndex={ABOUT_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />
	{/if}
</section>

<style lang="postcss">
	@reference "../../app.css";

	.about {
		@apply section-padding-with-offset;
		background:
			linear-gradient(
				to bottom,
				rgba(255, 255, 255, 0.96) 0%,
				rgba(255, 255, 255, 0.92) 18%,
				rgba(248, 249, 252, 0.88) 36%,
				transparent 56%
			),
			linear-gradient(to bottom, rgba(248, 249, 252, 0.98) 0%, var(--color-bg-lighter) 100%);
		position: relative;
		overflow: hidden;
	}

	.about-container {
		@apply mx-auto max-w-[1200px] container-padding;
	}

	.about-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: 48px;
		align-items: stretch;
	}

	.about-copy {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.about-badge {
		@apply inline-flex w-fit items-center gap-2 rounded-full bg-(--color-primary-soft-blue,#667eea)/12 px-4 py-2 text-xs font-semibold tracking-[0.3em] text-(--color-primary-soft-blue,#667eea) uppercase;
		letter-spacing: 0.24em;
	}

	.about-title {
		@apply text-left text-4xl font-semibold text-(--color-primary-dark) md:text-5xl lg:text-6xl;
	}

	.about-title::after {
		content: none;
	}

	.about-subtitle {
		@apply text-lg text-(--color-primary-medium) md:text-xl;
		max-width: 36rem;
	}

	.about-highlights {
		display: flex;
		flex-direction: column;
		gap: 18px;
		margin: 0;
		padding: 0;
	}

	.highlight-item {
		display: flex;
		gap: 16px;
		padding: 18px 20px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.75);
		border: 1px solid rgba(102, 126, 234, 0.12);
		box-shadow: 0 16px 40px -28px rgba(15, 34, 65, 0.4);
		backdrop-filter: blur(12px);
		align-items: flex-start;
	}

	.highlight-icon {
		@apply text-2xl;
	}

	.highlight-title {
		@apply text-lg font-semibold text-(--color-primary-dark,#1a202c);
	}

	.highlight-description {
		@apply mt-1 text-sm text-(--color-primary-medium,#4a5568);
	}

	.about-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
	}

	.about-primary {
		@apply inline-flex items-center justify-center gap-2 rounded-full bg-(--color-primary-soft-blue,#667eea) px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200;
	}

	.about-primary:hover {
		transform: translateY(-2px);
	}

	.about-link {
		@apply inline-flex items-center gap-2 text-sm font-semibold text-(--color-primary-soft-blue,#667eea) underline-offset-4 transition-colors duration-200;
	}

	.about-link::after {
		content: '→';
		font-size: 0.95em;
	}

	.about-link:hover {
		@apply text-(--color-primary-dark,#4c63d2);
	}

	.about-showcase {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.domain-outlook {
		@apply mt-10 rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_20px_45px_-30px_rgba(15,34,65,0.3)];
		backdrop-filter: blur(12px);
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.domain-outlook-title {
		@apply text-lg font-semibold text-(--color-primary-dark,#1a202c);
	}

	.domain-outlook-summary {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.domain-tokenization {
		@apply rounded-2xl border border-(--color-primary-soft-blue,#667eea)/25 bg-(--color-primary-soft-blue,#667eea)/10 px-4 py-3;
	}

	.domain-tokenization strong {
		@apply text-xs font-semibold tracking-[0.2em] text-(--color-primary-soft-blue,#667eea) uppercase;
	}

	.domain-tokenization p {
		@apply mt-1 text-sm text-(--color-primary-medium,#4a5568);
	}

	.domain-initiatives {
		@apply space-y-2 pl-5 text-sm text-(--color-primary-medium,#4a5568);
		list-style: disc;
	}

	.domain-initiatives li {
		@apply leading-relaxed;
	}

	.spotlight-grid {
		@apply mt-10 grid gap-4 md:grid-cols-2;
	}

	.spotlight-card {
		@apply rounded-3xl border border-white/40 bg-white/75 p-6 text-left shadow-[0_20px_45px_-32px_rgba(15,34,65,0.3)];
		backdrop-filter: blur(12px);
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.spotlight-role {
		@apply text-sm font-semibold text-(--color-primary-soft-blue,#667eea);
	}

	.spotlight-highlight {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.spotlight-links {
		@apply flex flex-wrap gap-3;
	}

	.spotlight-links a {
		@apply text-xs font-semibold tracking-[0.2em] text-(--color-primary-soft-blue,#667eea) uppercase underline-offset-4 hover:underline;
	}

	.spotlight-placeholder {
		@apply mt-10 rounded-3xl border border-dashed border-white/40 bg-white/60 p-6 text-left shadow-[0_16px_40px_-32px_rgba(15,34,65,0.3)];
		backdrop-filter: blur(10px);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.spotlight-title {
		@apply text-base font-semibold tracking-[0.2em] text-(--color-primary-medium,#4a5568) uppercase;
	}

	.spotlight-copy {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.spotlight-badge {
		@apply inline-flex w-fit items-center rounded-full border border-(--color-primary-soft-blue,#667eea)/40 bg-(--color-primary-soft-blue,#667eea)/10 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-(--color-primary-soft-blue,#667eea) uppercase;
	}

	.spotlight-upcoming {
		@apply mt-3 list-disc pl-5 text-sm text-(--color-primary-medium,#4a5568);
	}

	.spotlight-upcoming li {
		@apply leading-relaxed;
	}

	.about-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 16px;
	}

	.stat-card {
		border-radius: 24px;
		padding: 22px 20px;
		background: radial-gradient(circle at top, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.6));
		border: 1px solid rgba(102, 126, 234, 0.18);
		box-shadow: 0 24px 45px -28px rgba(15, 34, 65, 0.35);
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.stat-value {
		@apply text-3xl font-semibold text-(--color-primary-dark,#1a202c);
	}

	.stat-label {
		@apply text-sm font-semibold tracking-[0.18em] text-(--color-primary-medium,#4a5b72) uppercase;
	}

	.stat-description {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.showcase-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 20px;
	}

	.showcase-card :global(.feature-card) {
		min-height: 100%;
		transition: transform 0.25s ease;
	}

	.showcase-card :global(.feature-card:hover) {
		transform: translateY(-6px);
	}

	/* Responsive: Tablet */
	@media (max-width: 1024px) {
		.about-layout {
			grid-template-columns: 1fr;
			gap: 36px;
		}

		.about-title {
			@apply text-4xl;
		}

		.about-subtitle {
			max-width: none;
		}

		.about-showcase {
			flex-direction: column;
		}
	}

	@media (max-width: 768px) {
		.about-badge {
			@apply text-[10px];
			letter-spacing: 0.22em;
		}

		.about-title {
			@apply text-3xl;
		}

		.about-subtitle {
			@apply text-base;
		}

		.highlight-title {
			@apply text-base;
		}

		.highlight-description {
			@apply text-xs;
		}

		.stat-value {
			@apply text-2xl;
		}
	}

	@media (max-width: 480px) {
		.about-title {
			@apply text-2xl;
		}

		.about-subtitle {
			@apply text-sm;
		}

		.stat-card {
			padding: 18px;
		}
	}
</style>
