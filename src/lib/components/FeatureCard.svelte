<script lang="ts">
	interface Props {
		icon: string;
		title: string;
		description: string;
	}
	let { icon, title, description }: Props = $props();
</script>

<article class="feature-card" aria-labelledby="feature-{title}">
	<div class="feature-icon" aria-hidden="true" role="presentation">{icon}</div>
	<h3 id="feature-{title}">{title}</h3>
	<p>{description}</p>
</article>

<style>
	.feature-card {
		padding: 40px 30px;
		background: var(--color-bg-light);
		border-radius: 12px;
		border: 1px solid var(--color-bg-hero-end);
		transition: all 0.3s ease;
	}

	.feature-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
	}

	.feature-icon {
		font-size: 2.5em;
		margin-bottom: 20px;
	}

	.feature-card h3 {
		font-size: 1.4em;
		color: var(--color-primary-dark);
		margin-bottom: 15px;
	}

	.feature-card p {
		color: var(--color-primary-medium);
		line-height: 1.7;
	}
</style>
