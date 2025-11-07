<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { renderMarkdown } from '$lib/utils/markdown';
	import bmcMarkdown from '$docs/BUSINESS_MODEL_CANVAS.md?raw';

	const title = 'Business Model Canvas — Naik Kelas';
	const description =
		'Ikhtisar Business Model Canvas Naik Kelas by Koneksi, mencakup segmen pelanggan, proposisi nilai, kanal distribusi, arus pendapatan, dan eksperimen prioritas.';
	const html = renderMarkdown(bmcMarkdown);

	const breadcrumbs = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Tentang', href: '/tentang' },
		{ label: 'Business Model Canvas', href: '/docs/bmc' }
	];
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://konxc.space/docs/bmc" />
</svelte:head>

<main class="doc-page" aria-labelledby="doc-title">
	<section class="doc-hero">
		<Breadcrumb {breadcrumbs} />
		<h1 id="doc-title" class="doc-title">Business Model Canvas</h1>
		<p class="doc-summary">
			Dokumen ini merangkum struktur bisnis Naik Kelas: segmen pelanggan, proposisi nilai, kanal
			distribusi, arus pendapatan, serta eksperimen prioritas yang menjadi fokus pengembangan.
		</p>
		<a class="doc-link" href="/docs/brief-pricing">Baca juga: Brief Pricing & Subscription →</a>
	</section>

	<article class="doc-article" aria-label="Business Model Canvas">
		<div class="doc-content" aria-live="polite">{@html html}</div>
	</article>
</main>
