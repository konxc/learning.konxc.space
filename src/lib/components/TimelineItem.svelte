<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		description: string;
	}
	let { title, subtitle, description }: Props = $props();
</script>

<div class="timeline-item">
	<div class="timeline-dot"></div>
	<div class="timeline-content">
		<h3>{title}</h3>
		<p>
			{#if subtitle}
				<strong>{subtitle}</strong>
				<br />
			{/if}
			{description}
		</p>
	</div>
</div>

<style>
	.timeline-item {
		margin-bottom: 50px;
		position: relative;
	}

	.timeline-content {
		background: white;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
		width: 45%;
	}

	.timeline-item:nth-child(odd) .timeline-content {
		margin-left: 55%;
	}

	.timeline-item:nth-child(even) .timeline-content {
		margin-right: 55%;
		text-align: right;
	}

	.timeline-dot {
		position: absolute;
		left: 50%;
		transform: translate(-50%, 20px);
		width: 20px;
		height: 20px;
		background: var(--color-primary-soft-blue);
		border: 4px solid var(--color-bg-lighter);
		border-radius: 50%;
		z-index: 1;
	}

	.timeline-content h3 {
		color: var(--color-primary-dark);
		font-size: 1.5em;
		margin-bottom: 10px;
	}

	.timeline-content p {
		color: var(--color-primary-medium);
	}

	@media (max-width: 768px) {
		.timeline-content {
			width: calc(100% - 80px);
			margin-left: 80px !important;
			margin-right: 0 !important;
			text-align: left !important;
		}

		.timeline-dot {
			left: 30px;
		}
	}
</style>
