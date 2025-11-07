<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const sections = [
		{
			title: 'Business Model Canvas',
			description:
				'Ikhtisar menyeluruh struktur bisnis Naik Kelas: segmen pelanggan, proposisi nilai, kanal, revenue stream, dan eksperimen prioritas.',
			href: '/docs/bmc'
		},
		{
			title: 'Pricing & Subscription Brief',
			description:
				'Detail model pricing, subscription, struktur biaya, revenue mix, dan opsi kemitraan untuk diskusi dengan mitra.',
			href: '/docs/brief-pricing'
		},
		{
			title: 'Product Roadmap',
			description:
				'Garis besar pengembangan produk Naik Kelas, prioritas fitur, dan deliverables yang direncanakan.',
			href: '/docs/roadmap'
		},
		{
			title: 'Pricing Framework',
			description:
				'Framework penetapan harga Naik Kelas: metodologi, perhitungan COGS, eksperimen harga, dan guardrails.',
			href: '/docs/pricing'
		},
		{
			title: 'Deployment Guide',
			description:
				'Panduan lengkap deployment Naik Kelas: requirement, konfigurasi infrastruktur, dan langkah rilis.',
			href: '/docs/deployment'
		}
	];

	const breadcrumbs = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Dokumentasi', href: '/docs' }
	];
</script>

<svelte:head>
	<title>Dokumen Internal — Naik Kelas by Koneksi</title>
	<meta
		name="description"
		content="Daftar dokumen internal Naik Kelas: Business Model Canvas dan Pricing & Subscription Brief. Akses dibatasi untuk tim internal dan mitra."
	/>
	<link rel="canonical" href="https://konxc.space/docs" />
</svelte:head>

<main class="docs-index" aria-labelledby="docs-index-title">
	<section class="docs-header">
		<Breadcrumb {breadcrumbs} />
		<h1 id="docs-index-title">Dokumen Internal</h1>
		<p>
			Kumpulan dokumen kerja Naik Kelas by Koneksi. Mohon jaga kerahasiaan dan jangan dibagikan
			tanpa persetujuan tim.
		</p>
	</section>

	<section class="docs-grid" aria-label="Daftar dokumen">
		{#each sections as section}
			<a class="docs-card" href={section.href}>
				<h2>{section.title}</h2>
				<p>{section.description}</p>
			</a>
		{/each}
	</section>
</main>
