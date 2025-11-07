<script lang="ts">
	import FAQItem from '$lib/components/FAQItem.svelte';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { careerStore } from '$lib/stores/career';
	import { get } from 'svelte/store';
	import { getFAQ, searchFAQ, getFAQCategories, type FAQItem as FAQEntry } from '$lib/config/faq';
	import { getFAQStructuredData } from '$lib/utils/seo';
	import { trackSearch } from '$lib/utils/analytics';
	import { BENEFITS_OVERLAY_CONFIG } from '$lib/config/overlayConfigs';

	const faqSchema = $derived(() => ({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: allFAQs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	}));

	// Get current domain from store
	let currentDomain = $state(get(careerStore));

	$effect(() => {
		const unsubscribe = careerStore.subscribe((value) => {
			currentDomain = value;
			searchQuery = '';
			filteredFAQs = getFAQ(value);
		});
		return unsubscribe;
	});

	// FAQ data
	const allFAQs = $derived.by(() => getFAQ(currentDomain));
	let filteredFAQs = $state<FAQEntry[]>([]);
	let searchQuery = $state('');
	let selectedCategory = $state<string | null>(null);
	let categories = $derived(getFAQCategories(currentDomain));

	const resultDescription = $derived.by(() => {
		const count = filteredFAQs.length;
		const base = count === 0 ? 'Tidak ada pertanyaan' : `${count} pertanyaan`;
		const trimmedSearch = searchQuery.trim();
		if (trimmedSearch) {
			return `${base} untuk pencarian “${trimmedSearch}”`;
		}
		if (selectedCategory) {
			return `${base} dalam kategori ${selectedCategory}`;
		}
		return `${base} untuk semua kategori`;
	});

	// Search functionality
	$effect(() => {
		if (searchQuery.trim()) {
			filteredFAQs = searchFAQ(currentDomain, searchQuery);
		} else if (selectedCategory) {
			filteredFAQs = allFAQs.filter((faq) => faq.category === selectedCategory);
		} else {
			filteredFAQs = allFAQs;
		}
	});

	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		selectedCategory = null; // Reset category filter saat search

		// Track search jika ada query
		if (searchQuery.trim()) {
			trackSearch(searchQuery, filteredFAQs.length);
		}
	}

	function handleCategoryFilter(category: string | null) {
		selectedCategory = category;
		searchQuery = ''; // Reset search saat filter category
	}

	// Generate structured data untuk SEO
	const faqStructuredData = $derived(
		getFAQStructuredData(
			allFAQs.map((faq) => ({
				question: faq.question,
				answer: faq.answer
			}))
		)
	);

	// Glow orbs configuration
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? BENEFITS_OVERLAY_CONFIG.glowOrbs.hardcore
			: BENEFITS_OVERLAY_CONFIG.glowOrbs.chill
	);
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
</svelte:head>

<section id="faq" class="faq" aria-labelledby="faq-title">
	<div class="faq-container">
		<h2 id="faq-title" class="faq-title">Pertanyaan yang Sering Diajukan</h2>
		<p class="faq-subtitle">Temukan jawaban untuk pertanyaan umum tentang program Naik Kelas</p>

		<!-- Search and Filter -->
		<div class="faq-controls">
			<div class="faq-search">
				<input
					type="search"
					placeholder="Cari pertanyaan..."
					value={searchQuery}
					oninput={handleSearch}
					class="faq-search-input"
					aria-label="Cari pertanyaan"
				/>
				<span class="faq-search-icon" aria-hidden="true">🔍</span>
			</div>

			{#if categories.length > 0}
				<div class="faq-categories" role="group" aria-label="Filter kategori FAQ">
					<button
						type="button"
						class="faq-category-btn"
						class:active={selectedCategory === null && !searchQuery.trim()}
						onclick={() => handleCategoryFilter(null)}
						aria-pressed={selectedCategory === null && !searchQuery.trim()}
					>
						Semua
					</button>
					{#each categories as category}
						<button
							type="button"
							class="faq-category-btn"
							class:active={selectedCategory === category}
							onclick={() => handleCategoryFilter(category)}
							aria-pressed={selectedCategory === category}
						>
							{category}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<div class="faq-result-info" role="status" aria-live="polite">
			{resultDescription}
		</div>

		<!-- FAQ Items -->
		{#if filteredFAQs.length === 0}
			<div class="faq-empty" role="status" aria-live="polite">
				<p>Tidak ada pertanyaan yang ditemukan.</p>
				{#if searchQuery.trim()}
					<button
						type="button"
						class="faq-clear-search"
						onclick={() => {
							searchQuery = '';
							selectedCategory = null;
						}}
					>
						Hapus pencarian
					</button>
				{/if}
			</div>
		{:else}
			<div class="faq-list" role="list" aria-label="FAQ items">
				{#each filteredFAQs as faq (faq.id)}
					<div role="listitem">
						<FAQItem {faq} />
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<AuroraOverlay {...BENEFITS_OVERLAY_CONFIG.aurora} mode={$brandMode} />
	<GlowOrbs zIndex={BENEFITS_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />
</section>

<style lang="postcss">
	@reference "../../app.css";

	.faq {
		@apply section-padding;
		/* Background base color */
		background-color: var(--color-bg-lighter);
		/* Background gradient overlay */
		background-image: linear-gradient(
			to bottom,
			var(--color-bg-lighter) 0%,
			var(--color-bg-light) 50%,
			var(--color-bg-lighter) 100%
		);
		position: relative;
		overflow: hidden;
		/* Ensure section is visible */
		z-index: 1;
	}

	.faq-container {
		@apply mx-auto max-w-[900px] container-padding;
		position: relative;
		z-index: 2; /* Above overlay */
	}

	.faq-title {
		@apply relative lg-mb-15 mb-8 inline-block text-center text-4xl font-semibold text-(--color-primary-dark) md:mb-10 md:text-5xl lg:text-6xl;
		left: 50%;
		transform: translateX(-50%);
	}

	.faq-title::after {
		content: '';
		display: block;
		margin: 14px auto 0;
		width: 120px;
		height: 5px;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--color-primary-soft-blue), transparent);
		opacity: 0.5;
	}

	.faq-subtitle {
		@apply mx-auto lg-mb-15 mb-8 max-w-[700px] text-center text-lg text-(--color-primary-medium) md:mb-12;
	}

	.faq-controls {
		@apply mb-8 flex flex-col gap-6;
	}

	.faq-search {
		position: relative;
		width: 100%;
	}

	.faq-search-input {
		@apply w-full rounded-xl border-2 bg-(--color-bg-light,#ffffff) px-5 py-4 pr-12 text-base text-(--color-primary-dark) transition-all duration-300;
		border-color: var(--color-bg-hero-end, rgba(0, 0, 0, 0.1));
	}

	.faq-search-input:focus {
		outline: none;
		border-color: var(--color-primary-soft-blue, #667eea);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.faq-search-icon {
		@apply pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl;
	}

	.faq-categories {
		display: flex;
		gap: 12px;
		overflow-x: auto;
		padding-bottom: 6px;
		margin: 0 -4px;
		scroll-snap-type: x mandatory;
	}

	.faq-categories::-webkit-scrollbar {
		display: none;
	}

	.faq-category-btn {
		@apply cursor-pointer rounded-full border bg-(--color-bg-light,#ffffff) px-5 text-sm font-semibold transition-all duration-200;
		border-color: var(--color-bg-hero-end, rgba(0, 0, 0, 0.12));
		color: var(--color-primary-medium);
		min-height: 44px;
		white-space: nowrap;
		padding-top: 10px;
		padding-bottom: 10px;
		scroll-snap-align: center;
	}

	.faq-category-btn:hover {
		border-color: var(--color-primary-soft-blue, #667eea);
		color: var(--color-primary-soft-blue, #667eea);
		background: rgba(102, 126, 234, 0.08);
	}

	.faq-category-btn.active {
		background: var(--color-primary-soft-blue, #667eea);
		color: white;
		border-color: transparent;
		box-shadow: 0 12px 30px -15px rgba(102, 126, 234, 0.7);
	}

	.faq-result-info {
		@apply mb-6 text-sm font-medium text-(--color-primary-medium);
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.faq-empty {
		@apply px-5 py-12 text-center text-(--color-primary-medium);
	}

	.faq-clear-search {
		@apply mt-4 inline-flex items-center justify-center rounded-full bg-(--color-primary-soft-blue,#667eea) px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200;
	}

	.faq-clear-search:hover {
		@apply bg-(--color-primary-dark,#4c63d2) shadow-lg;
		transform: translateY(-1px);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.faq-title {
			@apply text-3xl;
		}

		.faq-subtitle {
			@apply text-base;
		}

		.faq-search-input {
			@apply px-4 py-3 pr-12 text-sm;
		}

		.faq-result-info {
			@apply text-xs;
		}
	}

	@media (min-width: 1024px) {
		.faq-controls {
			@apply mb-10 flex-row items-start justify-between;
		}

		.faq-search {
			max-width: 360px;
		}

		.faq-categories {
			@apply justify-start;
		}

		.faq-result-info {
			@apply mb-8;
		}
	}

	@media (max-width: 480px) {
		.faq-title {
			@apply text-2xl;
		}

		.faq-subtitle {
			@apply text-sm;
		}
	}
</style>
