<script lang="ts">
	let { children } = $props();
</script>

<div class="onboarding-layout">
	{@render children?.()}
</div>

<style>
	.onboarding-layout {
		min-height: 100vh;
		background: var(--color-bg-hero);
		display: block;
	}

	/* Container spacing aligns with onboarding page styles */
	.onboarding-layout :global(.onboarding-container) {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 20px;
	}

	@media (max-width: 768px) {
		.onboarding-layout :global(.onboarding-container) {
			padding: 28px 16px;
		}
	}
</style>
