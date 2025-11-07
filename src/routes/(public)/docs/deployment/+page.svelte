<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { renderMarkdown } from '$lib/utils/markdown';
	import deploymentMarkdown from '$docs/DEPLOYMENT.md?raw';

	const title = 'Deployment Guide — Naik Kelas by Koneksi';
	const description =
		'Panduan deployment Naik Kelas: requirement, konfigurasi, pipeline rilis, dan checklist operasi.';
	const html = renderMarkdown(deploymentMarkdown);

	const breadcrumbs = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Tentang', href: '/tentang' },
		{ label: 'Deployment Guide', href: '/docs/deployment' }
	];
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://konxc.space/docs/deployment" />
</svelte:head>

<main class="doc-page" aria-labelledby="doc-title">
	<section class="doc-hero">
		<Breadcrumb {breadcrumbs} />
		<h1 id="doc-title" class="doc-title">Deployment Guide</h1>
		<p class="doc-summary">
			Instruksi teknis untuk merilis Naik Kelas: infrastruktur, pipeline CI/CD, konfigurasi runtime,
			dan SOP operasional.
		</p>
		<div class="doc-links">
			<a class="doc-link" href="/docs/roadmap">Lihat Product Roadmap →</a>
			<a class="doc-link" href="/docs/pricing">Lihat Pricing Framework →</a>
		</div>
	</section>

	<article class="doc-article" aria-label="Deployment Guide">
		<div class="doc-content" aria-live="polite">{@html html}</div>
	</article>
</main>
