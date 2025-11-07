<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { renderMarkdown } from '$lib/utils/markdown';
	import roadmapMarkdown from '$docs/ROADMAP.md?raw';

	const title = 'Product Roadmap — Naik Kelas by Koneksi';
	const description =
		'Roadmap produk Naik Kelas: fase pengembangan, prioritas fitur, dan deliverables lintas tim.';
	const html = renderMarkdown(roadmapMarkdown);

	const breadcrumbs = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Tentang', href: '/tentang' },
		{ label: 'Product Roadmap', href: '/docs/roadmap' }
	];
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://konxc.space/docs/roadmap" />
</svelte:head>

<main class="doc-page" aria-labelledby="doc-title">
	<section class="doc-hero">
		<Breadcrumb {breadcrumbs} />
		<h1 id="doc-title" class="doc-title">Product Roadmap</h1>
		<p class="doc-summary">
			Ringkasan siklus pengembangan produk Naik Kelas: fokus triwulan, deliverables utama, dan
			dependensi lintas tim konten, teknologi, dan komunitas.
		</p>
		<div class="doc-links">
			<a class="doc-link" href="/docs/pricing">Lihat Pricing Framework →</a>
			<a class="doc-link" href="/docs/deployment">Lihat Deployment Guide →</a>
		</div>
	</section>

	<article class="doc-article" aria-label="Product Roadmap">
		<div class="doc-content" aria-live="polite">{@html html}</div>
	</article>
</main>
