<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { careerStore } from '$lib/stores/career';
	import { get } from 'svelte/store';
	import { getCTAContent } from '$lib/config/contentConfig';
	import { trackCTAClick } from '$lib/utils/analytics';

	interface Props {
		/** Scroll threshold untuk show/hide (default: 150px) */
		scrollThreshold?: number;
		/** Hide saat user scroll ke bottom (default: true) */
		hideOnBottom?: boolean;
	}

	const { scrollThreshold = 150, hideOnBottom = true }: Props = $props();

	// ============================================
	// CONSTANTS
	// ============================================
	const HEADER_HEIGHT = 70;
	const SECTION_DETECTION_OFFSET = 150;
	const BOTTOM_SCROLL_THRESHOLD = 0.95;

	// Sections dimana FloatingCTA akan ditampilkan
	// Semua sections yang tidak ada di list ini akan di-hide
	const SECTION_LIST = ['benefits', 'testimonials', 'faq', 'social-proof'] as const;

	// Semua sections yang ada di halaman (untuk detection)
	// Diperlukan untuk detect section aktif dengan akurat
	const ALL_PAGE_SECTIONS = ['hero', 'register', 'program', ...SECTION_LIST] as const;

	// Mapping untuk secondary button (text dan target)
	// Hanya sections yang ada di config ini yang akan menampilkan tombol secondary
	const SECONDARY_BUTTON_CONFIG: Record<string, { text: string; target: string }> = {
		about: { text: 'Why Naik Kelas', target: 'about' },
		benefits: { text: 'Lihat Benefit', target: 'benefits' }
	};

	// ============================================
	// STATE
	// ============================================
	let currentDomain = $state(get(careerStore));
	let scrollY = $state(0);
	let scrollPercentage = $state(0);
	let currentSection = $state('');

	// ============================================
	// SUBSCRIPTIONS
	// ============================================
	$effect(() => {
		if (!browser) return;
		const unsubscribe = careerStore.subscribe((value) => {
			currentDomain = value;
		});
		return unsubscribe;
	});

	// ============================================
	// COMPUTED VALUES
	// ============================================
	const ctaContent = $derived(getCTAContent(currentDomain));

	// Cek apakah section saat ini ada di SECTION_LIST (FloatingCTA akan ditampilkan)
	const isSectionAllowed = $derived(
		currentSection !== '' && SECTION_LIST.includes(currentSection as any)
	);

	// Cek apakah sudah scroll melewati threshold
	const hasScrolledEnough = $derived(scrollY > scrollThreshold);

	// Cek apakah user di bottom page
	const isAtBottom = $derived(hideOnBottom && scrollPercentage > BOTTOM_SCROLL_THRESHOLD);

	// Visibility logic: muncul jika section allowed, sudah scroll cukup, dan tidak di bottom
	const isShown = $derived(isSectionAllowed && hasScrolledEnough && !isAtBottom);

	// Cek apakah section saat ini memiliki secondary button config
	const hasSecondaryButton = $derived(
		currentSection !== '' && currentSection in SECONDARY_BUTTON_CONFIG
	);

	// Secondary button config berdasarkan section (hanya jika ada di config)
	const secondaryButtonConfig = $derived(
		hasSecondaryButton ? SECONDARY_BUTTON_CONFIG[currentSection] : null
	);

	// ============================================
	// HELPER FUNCTIONS
	// ============================================
	/**
	 * Detect section yang sedang aktif berdasarkan scroll position
	 * Check semua sections (termasuk yang di-hide) untuk deteksi yang akurat
	 */
	function detectActiveSection(): string {
		if (!browser) return '';

		// Check dari bawah ke atas untuk menemukan section yang sedang aktif
		for (let i = ALL_PAGE_SECTIONS.length - 1; i >= 0; i--) {
			const sectionId = ALL_PAGE_SECTIONS[i];
			const section = document.getElementById(sectionId);

			if (section) {
				const rect = section.getBoundingClientRect();
				// Section aktif jika bagian atas sudah melewati threshold
				if (rect.top <= SECTION_DETECTION_OFFSET && rect.bottom > 0) {
					return sectionId;
				}
			}
		}

		return '';
	}

	/**
	 * Scroll ke element dengan offset header
	 */
	function scrollToElement(elementId: string, offset: number = HEADER_HEIGHT): void {
		if (!browser) return;

		const element = document.getElementById(elementId);
		if (!element) return;

		const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
		const finalPosition = targetPosition - offset;

		window.scrollTo({
			top: finalPosition,
			behavior: 'smooth'
		});
	}

	/**
	 * Scroll ke card stack dan posisikan di tengah layar
	 */
	function scrollToCardStack(): void {
		if (!browser) return;

		const benefitsSection = document.getElementById('benefits');
		if (!benefitsSection) return;

		const cardStackContainer = benefitsSection.querySelector('.card-stack-container');
		if (!cardStackContainer) {
			// Fallback: scroll ke section benefits
			scrollToElement('benefits');
			return;
		}

		const windowHeight = window.innerHeight;
		const cardStackRect = cardStackContainer.getBoundingClientRect();
		const cardStackTop = cardStackRect.top + window.pageYOffset;

		// Hitung posisi untuk memposisikan card stack di tengah layar
		const targetPosition = cardStackTop - windowHeight / 2 + cardStackRect.height / 2;

		window.scrollTo({
			top: targetPosition,
			behavior: 'smooth'
		});
	}

	// ============================================
	// EVENT HANDLERS
	// ============================================
	/**
	 * Handle scroll event - update scroll state dan detect active section
	 */
	function handleScroll(): void {
		if (!browser) return;

		scrollY = window.scrollY || window.pageYOffset;
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		scrollPercentage = (scrollY + windowHeight) / documentHeight;

		currentSection = detectActiveSection();
	}

	/**
	 * Scroll ke CTA section (register)
	 */
	function scrollToCTA(): void {
		if (!browser) return;

		// Track CTA click
		trackCTAClick('floating_button', ctaContent.primaryButton.text, ctaContent.primaryButton.href);

		scrollToElement('register');
	}

	/**
	 * Scroll ke secondary target (benefits card stack atau about section)
	 */
	function scrollToSecondary(): void {
		if (!browser || !secondaryButtonConfig) return;

		trackCTAClick(
			'floating_secondary',
			secondaryButtonConfig.text,
			`#${secondaryButtonConfig.target}`
		);

		if (secondaryButtonConfig.target === 'benefits') {
			scrollToCardStack();
		} else if (secondaryButtonConfig.target === 'about') {
			scrollToElement('about');
		}
	}

	// ============================================
	// LIFECYCLE
	// ============================================
	onMount(() => {
		if (!browser) return;

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Initial check

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

{#if isShown}
	<div
		class="fixed bottom-2 left-2 z-1000 max-md:right-4 max-md:left-4 md:bottom-5 md:left-5"
		role="complementary"
		aria-label="Floating call to action"
		transition:slide={{ axis: 'y', duration: 400 }}
	>
		<!-- Mobile: Two buttons side by side (horizontal) -->
		<div class="flex flex-row gap-2 max-md:w-full md:flex-row md:gap-3">
			<!-- Primary Button (Join Waiting List) - Full width -->
			<button
				class="flex flex-1 items-center justify-center gap-3 rounded-full bg-linear-to-br from-(--color-primary-soft-blue,#667eea) to-(--color-primary-dark,#764ba2) px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(102,126,234,0.4)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(102,126,234,0.5)] active:translate-y-0 active:shadow-[0_8px_25px_rgba(102,126,234,0.4)] motion-reduce:transition-none md:px-7 md:py-4 md:text-base"
				onclick={scrollToCTA}
				aria-label="Daftar sekarang - Scroll ke form pendaftaran"
			>
				<span class="font-semibold whitespace-nowrap">{ctaContent.primaryButton.text}</span>
			</button>

			<!-- Secondary Button (Lihat Benefit / Why Naik Kelas) - Mobile only, hanya tampil jika ada di config -->
			{#if hasSecondaryButton && secondaryButtonConfig}
				<button
					class="flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/90 px-4 py-3 text-sm font-semibold text-(--color-primary-dark) shadow-[0_4px_15px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:translate-y-0 active:shadow-[0_4px_15px_rgba(0,0,0,0.1)] motion-reduce:transition-none md:hidden"
					onclick={scrollToSecondary}
					aria-label="{secondaryButtonConfig.text} - Scroll ke {secondaryButtonConfig.target ===
					'benefits'
						? 'benefits card stack'
						: 'about section'}"
				>
					<span class="font-semibold whitespace-nowrap">{secondaryButtonConfig.text}</span>
				</button>
			{/if}
		</div>
	</div>
{/if}
