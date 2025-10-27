<script lang="ts">
	import FeatureCard from '$lib/components/FeatureCard.svelte';

	const features = [
		{
			icon: '🎯',
			title: 'Mulai dari Nol',
			description:
				'Tidak ada syarat pengalaman coding. Kami akan memandu kamu step by step dari fundamental hingga mahir.'
		},
		{
			icon: '💼',
			title: 'Langsung ke Industri',
			description:
				'Belajar skills yang langsung applicable. Top graduates berkesempatan magang atau join tim developer Koneksi.'
		},
		{
			icon: '🤝',
			title: 'Mentoring Personal',
			description:
				'Belajar langsung dari developer berpengalaman. Weekly office hours dan code review untuk perkembangan maksimal.'
		},
		{
			icon: '🚀',
			title: 'Project-Based',
			description:
				'Tidak hanya teori! Bangun portfolio project nyata yang bisa kamu tunjukkan ke calon employer.'
		}
	];
</script>

<section class="about">
	<div class="about-container">
		<h2>Kenapa Naik Kelas?</h2>
		<p class="about-subtitle">
			Kami percaya setiap orang punya potensi jadi developer hebat. Yang kamu butuhkan hanya
			bimbingan yang tepat dan kesempatan untuk berkembang.
		</p>

		<div class="features">
			{#each features as feature}
				<FeatureCard {...feature} />
			{/each}
		</div>
	</div>
</section>

<style>
	.about {
		padding: 100px 20px;
		background: #ffffff;
	}

	.about-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.about h2 {
		text-align: center;
		font-size: 2.5em;
		color: var(--color-primary-dark);
		margin-bottom: 20px;
		font-weight: 600;
	}

	.about-subtitle {
		text-align: center;
		font-size: 1.1em;
		color: var(--color-primary-medium);
		max-width: 700px;
		margin: 0 auto 60px;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 40px;
		margin-top: 50px;
	}
</style>
