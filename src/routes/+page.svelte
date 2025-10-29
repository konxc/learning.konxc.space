<script lang="ts">
	import HeroSection from '$lib/sections/HeroSection.svelte';
	import AboutSection from '$lib/sections/AboutSection.svelte';
	import ProgramSection from '$lib/sections/ProgramSection.svelte';
	import BenefitsSection from '$lib/sections/BenefitsSection.svelte';
	import CTASection from '$lib/sections/CTASection.svelte';
	import FooterSection from '$lib/sections/FooterSection.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		// Client-side only code
		if (!browser) return;

		// Smooth scroll for anchor links with header offset
		const headerHeight = 70; // Approximate header height in pixels

		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', function (e) {
				e.preventDefault();
				const href = anchor.getAttribute('href');
				if (!href) return;

				const target = document.querySelector(href);
				if (target) {
					const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
					const finalPosition = targetPosition - headerHeight;

					window.scrollTo({
						top: finalPosition,
						behavior: 'smooth'
					});
				}
			});
		});
	});
</script>

<svelte:head>
	<title>Naik Kelas - Pelatihan Developer by Koneksi</title>
	<meta
		name="description"
		content="Program pelatihan intensif 2 bulan untuk menjadi developer. Belajar Python, Web Development, dan skills yang dibutuhkan industri tech."
	/>
	<meta
		name="keywords"
		content="pelatihan developer, bootcamp coding, belajar programming, python, web development, koneksi"
	/>
	<link rel="canonical" href="https://learning.konxc.space/" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://learning.konxc.space/" />
	<meta property="og:title" content="Naik Kelas - Pelatihan Developer by Koneksi" />
	<meta
		property="og:description"
		content="Program pelatihan intensif 2 bulan untuk menjadi developer. Belajar Python, Web Development, dan skills yang dibutuhkan industri tech."
	/>
	<meta property="og:image" content="https://learning.konxc.space/apple-icon-180x180.png" />
	<meta property="og:image:width" content="180" />
	<meta property="og:image:height" content="180" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:site_name" content="Naik Kelas by Koneksi" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://learning.konxc.space/" />
	<meta name="twitter:title" content="Naik Kelas - Pelatihan Developer by Koneksi" />
	<meta
		name="twitter:description"
		content="Program pelatihan intensif 2 bulan untuk menjadi developer. Belajar Python, Web Development, dan skills yang dibutuhkan industri tech."
	/>
	<meta name="twitter:image" content="https://learning.konxc.space/apple-icon-180x180.png" />

	<!-- Additional SEO -->
	<meta name="author" content="Koneksi" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<main id="main-content">
	<HeroSection />
	<AboutSection />
	<ProgramSection />
	<BenefitsSection />
	<CTASection />
</main>

<FooterSection />

<style>
	/* Optimize animations - reduce motion for users who prefer it */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
