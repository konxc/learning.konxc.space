<script lang="ts">
	import type { SocialProofMetric } from '$lib/config/socialProof';

	interface Props {
		metric: SocialProofMetric;
	}

	let { metric }: Props = $props();
</script>

<div class="metric-card" aria-label="{metric.label}: {metric.value} {metric.suffix || ''}">
	{#if metric.icon}
		<div class="metric-icon" aria-hidden="true">{metric.icon}</div>
	{/if}
	<div class="metric-content">
		<div class="metric-value">{metric.value}</div>
		<div class="metric-label">{metric.label}</div>
		{#if metric.suffix}
			<div class="metric-suffix">{metric.suffix}</div>
		{/if}
	</div>
</div>

<style>
	.metric-card {
		background: var(--color-bg-light, #ffffff);
		border-radius: 16px;
		padding: 30px 25px;
		border: 1px solid var(--color-bg-hero-end, rgba(0, 0, 0, 0.05));
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15px;
	}

	.metric-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
		border-color: var(--color-primary-soft-blue, rgba(102, 126, 234, 0.2));
	}

	.metric-icon {
		font-size: 3em;
		line-height: 1;
	}

	.metric-content {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.metric-value {
		font-size: 2.5em;
		font-weight: 700;
		color: var(--color-primary-dark, #1a202c);
		line-height: 1;
	}

	.metric-label {
		font-size: 1em;
		font-weight: 600;
		color: var(--color-primary-dark, #1a202c);
		margin-top: 5px;
	}

	.metric-suffix {
		font-size: 0.85em;
		color: var(--color-primary-medium, #718096);
		margin-top: 2px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.metric-card {
			padding: 25px 20px;
		}

		.metric-icon {
			font-size: 2.5em;
		}

		.metric-value {
			font-size: 2em;
		}

		.metric-label {
			font-size: 0.9em;
		}
	}
</style>

