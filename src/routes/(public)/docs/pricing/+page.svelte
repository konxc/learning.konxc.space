<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { renderMarkdown } from '$lib/utils/markdown';
	import pricingMarkdown from '$docs/PRICING.md?raw';

	const title = 'Pricing Framework — Naik Kelas by Koneksi';
	const description =
		'Framework pricing Naik Kelas: metodologi penetapan harga, perhitungan COGS, eksperimen, dan guardrails.';
	const html = renderMarkdown(pricingMarkdown);

	const breadcrumbs = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Tentang', href: '/tentang' },
		{ label: 'Pricing Framework', href: '/docs/pricing' }
	];
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://konxc.space/docs/pricing" />
</svelte:head>

<main class="doc-page" aria-labelledby="doc-title">
	<section class="doc-hero">
		<Breadcrumb {breadcrumbs} />
		<h1 id="doc-title" class="doc-title">Pricing Framework</h1>
		<p class="doc-summary">
			Panduan internal untuk menentukan harga produk Naik Kelas: komponen biaya, margin target,
			experimen A/B, dan guardrails keputusan bisnis.
		</p>
		<div class="doc-links">
			<a class="doc-link" href="/docs/brief-pricing">Lihat Pricing & Subscription Brief →</a>
			<a class="doc-link" href="/docs/roadmap">Lihat Product Roadmap →</a>
		</div>
	</section>

	<article class="doc-article" aria-label="Pricing Framework">
		<div class="doc-content" aria-live="polite">{@html html}</div>
	</article>
</main>
