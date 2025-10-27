<script lang="ts">
	interface Props {
		icon: string;
		title: string;
		description: string;
	}
	let { icon, title, description }: Props = $props();
</script>

<article class="benefit-item" aria-labelledby="benefit-{title}">
	<h3 id="benefit-{title}"><span aria-hidden="true">{icon}</span> {title}</h3>
	<p>{description}</p>
</article>

<style>
	.benefit-item {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		padding: 30px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
	}

	.benefit-item:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: scale(1.05);
	}

	.benefit-item h3 {
		font-size: 1.3em;
		margin-bottom: 10px;
	}
</style>
