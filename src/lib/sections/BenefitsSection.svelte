<script lang="ts">
	import BenefitCard from '$lib/components/BenefitCard.svelte';

	const benefits = [
		{
			icon: '📚',
			title: 'Materi Lengkap',
			description:
				'Akses ke learning platform, video tutorials, dan dokumentasi untuk belajar mandiri'
		},
		{
			icon: '🏆',
			title: 'Sertifikat',
			description: 'Certificate of completion yang bisa kamu pakai untuk portfolio dan CV'
		},
		{
			icon: '🌐',
			title: 'Portfolio Project',
			description: 'Project nyata yang hosted dan bisa kamu showcase ke recruiter'
		},
		{
			icon: '👥',
			title: 'Komunitas',
			description: 'Network dengan sesama learners dan akses ke developer community'
		},
		{
			icon: '💰',
			title: 'Peluang Kerja',
			description: 'Top graduates berkesempatan magang berbayar atau join tim Koneksi'
		},
		{
			icon: '🎓',
			title: 'Lifetime Access',
			description: 'Akses materi dan updates selamanya, termasuk alumni network'
		}
	];
</script>

<section class="benefits">
	<div class="benefits-container">
		<h2>Yang Kamu Dapatkan</h2>

		<div class="benefits-grid">
			{#each benefits as benefit}
				<BenefitCard {...benefit} />
			{/each}
		</div>
	</div>
</section>

<style>
	.benefits {
		padding: 100px 20px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
	}

	.benefits-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.benefits h2 {
		text-align: center;
		font-size: 2.5em;
		margin-bottom: 60px;
		color: white;
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 30px;
	}
</style>
