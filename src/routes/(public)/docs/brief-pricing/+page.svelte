<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { renderMarkdown } from '$lib/utils/markdown';
	import briefMarkdown from '$docs/BRIEF_PRICING_SUBSCRIPTION.md?raw';

	const title = 'Pricing & Subscription Brief — Naik Kelas';
	const description =
		'Ringkasan struktur pricing, subscription, model kemitraan, dan proyeksi revenue Naik Kelas by Koneksi.';
	const html = renderMarkdown(briefMarkdown);

	const breadcrumbs = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Tentang', href: '/tentang' },
		{ label: 'Pricing & Subscription Brief', href: '/docs/brief-pricing' }
	];
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://konxc.space/docs/brief-pricing" />
</svelte:head>

<main class="doc-page" aria-labelledby="doc-title">
	<section class="doc-hero">
		<Breadcrumb {breadcrumbs} />
		<h1 id="doc-title" class="doc-title">Pricing & Subscription Brief</h1>
		<p class="doc-summary">
			Dokumen kerja untuk meeting kemitraan dan diskusi pricing Naik Kelas: model produk, struktur
			biaya, revenue mix, opsi kemitraan, hingga roadmap implementasi.
		</p>
		<a class="doc-link" href="/docs/bmc">Lihat Business Model Canvas →</a>
	</section>

	<article class="doc-article" aria-label="Pricing & Subscription Brief">
		<div class="doc-content" aria-live="polite">{@html html}</div>
	</article>
</main>
