<script lang="ts">
	import HeroSection from '$lib/sections/HeroSection.svelte';
	import AboutSection from '$lib/sections/AboutSection.svelte';
	import ProgramSection from '$lib/sections/ProgramSection.svelte';
	import BenefitsSection from '$lib/sections/BenefitsSection.svelte';
	import CTASection from '$lib/sections/CTASection.svelte';
	import FooterSection from '$lib/sections/FooterSection.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		// Smooth scroll for anchor links
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', function (e) {
				e.preventDefault();
				const target = document.querySelector(anchor.getAttribute('href') || '');
				if (target) {
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://learning.konxc.space/" />
	<meta property="og:title" content="Naik Kelas - Pelatihan Developer by Koneksi" />
	<meta
		property="og:description"
		content="Program pelatihan intensif 2 bulan untuk menjadi developer. Belajar Python, Web Development, dan skills yang dibutuhkan industri tech."
	/>

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://learning.konxc.space/" />
	<meta property="twitter:title" content="Naik Kelas - Pelatihan Developer by Koneksi" />
	<meta
		property="twitter:description"
		content="Program pelatihan intensif 2 bulan untuk menjadi developer. Belajar Python, Web Development, dan skills yang dibutuhkan industri tech."
	/>
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
