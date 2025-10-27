<script lang="ts">
	interface Props {
		logo?: string;
		tagline?: string;
		headline?: string;
		headlinePart2?: string;
		description?: string;
	}
	let {
		logo = 'Naik Kelas',
		tagline = 'by Koneksi × Yayasan Klub Fisika',
		headline = 'Mulai Perjalanan Coding-mu',
		headlinePart2 = 'Dari Nol Hingga Siap Kerja',
		description = 'Program pelatihan intensif 2 bulan untuk menjadi developer. Belajar Python, Web Development, dan skills yang dibutuhkan industri tech.'
	}: Props = $props();
</script>

<section class="hero" aria-labelledby="hero-heading">
	<div class="logo" aria-label="Naik Kelas Program">{logo}</div>
	<p class="tagline">{tagline}</p>

	<h1 id="hero-heading">{headline}<br />{headlinePart2}</h1>
	<p>{description}</p>

	<div class="scroll-hint" role="status" aria-label="Scroll indicator">
		↓ Scroll untuk tahu lebih lanjut
	</div>
</section>

<style>
	.hero {
		background: linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-hero-end) 100%);
		padding: 80px 20px;
		text-align: center;
		min-height: 90vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.logo {
		font-size: 2.5em;
		font-weight: 700;
		color: var(--color-primary-soft-blue);
		margin-bottom: 10px;
		letter-spacing: -1px;
	}

	.tagline {
		font-size: 1.1em;
		color: var(--color-primary-medium);
		margin-bottom: 30px;
		font-weight: 300;
	}

	.hero h1 {
		font-size: 2.8em;
		color: var(--color-primary-dark);
		margin-bottom: 20px;
		font-weight: 600;
		line-height: 1.3;
	}

	.hero p {
		font-size: 1.2em;
		color: var(--color-text-secondary);
		max-width: 700px;
		margin: 0 auto 40px;
	}

	.scroll-hint {
		margin-top: 50px;
		color: var(--color-text-tertiary);
		font-size: 0.9em;
		animation: bounce 2s infinite;
	}

	/* Animation keyframes are defined in app.css */
</style>
