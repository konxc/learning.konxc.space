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

<section id="hero" class="hero" aria-labelledby="hero-heading">
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
		min-height: 100vh;
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

	/* Responsive: Desktop large */
	@media (max-width: 1920px) {
		.hero h1 {
			font-size: 3.2em;
		}
	}

	/* Responsive: Tablet */
	@media (max-width: 1024px) {
		.hero {
			padding: 70px 20px;
		}

		.hero h1 {
			font-size: 2.3em;
		}

		.hero p {
			font-size: 1.1em;
		}
	}

	/* Responsive: Mobile */
	@media (max-width: 768px) {
		.hero {
			padding: 60px 20px;
			min-height: 100vh;
		}

		.logo {
			font-size: 2em;
		}

		.tagline {
			font-size: 1em;
		}

		.hero h1 {
			font-size: 1.8em;
		}

		.hero p {
			font-size: 1em;
		}

		.scroll-hint {
			margin-top: 30px;
			font-size: 0.85em;
		}
	}

	/* Responsive: Small mobile */
	@media (max-width: 480px) {
		.hero {
			padding: 50px 20px;
			min-height: 100vh;
		}

		.logo {
			font-size: 1.7em;
		}

		.tagline {
			font-size: 0.95em;
		}

		.hero h1 {
			font-size: 1.5em;
			line-height: 1.2;
		}

		.hero p {
			font-size: 0.95em;
		}

		.scroll-hint {
			margin-top: 20px;
			font-size: 0.8em;
		}
	}
</style>
