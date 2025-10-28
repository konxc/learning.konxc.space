<script lang="ts">
	import TimelineItem from '$lib/components/TimelineItem.svelte';

	const timelineItems = [
		{
			title: 'Minggu 1-2',
			subtitle: 'Foundation Setup',
			description:
				'Kenalan dengan environment development, Git, terminal basics, dan tech stack modern. Persiapan mental dan tools untuk jadi developer.'
		},
		{
			title: 'Minggu 3-4',
			subtitle: 'Python Programming',
			description:
				'Belajar logic programming, data structures, dan problem solving dengan Python. Latihan dengan real case studies.'
		},
		{
			title: 'Minggu 5-6',
			subtitle: 'Web Development',
			description:
				'HTML, CSS, JavaScript fundamentals. Build responsive websites dan interactive UI components.'
		},
		{
			title: 'Minggu 7-8',
			subtitle: 'Final Project',
			description:
				'Bangun aplikasi web lengkap dari nol. Code review, presentation, dan assessment untuk peluang rekrutmen.'
		}
	];
</script>

<section class="program">
	<div class="program-container">
		<h2>Apa yang Akan Kamu Pelajari?</h2>

		<div class="timeline">
			{#each timelineItems as item}
				<TimelineItem {...item} />
			{/each}
		</div>
	</div>
</section>

<style>
	.program {
		padding: 100px 20px;
		background: linear-gradient(to bottom, #ffffff 0%, var(--color-bg-lighter) 100%);
	}

	.program-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.program h2 {
		text-align: center;
		font-size: 2.5em;
		color: var(--color-primary-dark);
		margin-bottom: 60px;
	}

	.timeline {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 2px;
		height: 100%;
		background: linear-gradient(
			to bottom,
			var(--color-bg-hero-end),
			var(--color-primary-soft-blue)
		);
	}

	/* Responsive timeline */
	@media (max-width: 768px) {
		.program {
			padding: 60px 20px;
		}

		.program h2 {
			font-size: 1.8em;
			margin-bottom: 40px;
		}

		.timeline::before {
			left: 30px;
		}
	}
</style>
