<script lang="ts">
	import { RADIUS, TEXT, COLOR, ELEVATION } from '$lib/config/design';

	interface PlanLimiterProps {
		requiredPlan?: 'free' | 'pro' | 'enterprise';
		currentPlan?: string;
		featureName?: string;
		children?: any;
	}

	let { 
		requiredPlan = 'pro', 
		currentPlan = 'free', 
		featureName = 'This feature',
		children 
	}: PlanLimiterProps = $props();

	const hasAccess = $derived(
		currentPlan === 'enterprise' || 
		(currentPlan === 'pro' && requiredPlan !== 'enterprise') ||
		(currentPlan === 'free' && requiredPlan === 'free')
	);
</script>

{#if hasAccess}
	{@render children?.()}
{:else}
	<div class={`${COLOR.card} ${RADIUS.card} border-2 border-dashed ${COLOR.cardBorder} p-8 text-center bg-gray-50/50 dark:bg-neutral-900/50`}>
		<div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 text-xl">
			🔒
		</div>
		<h3 class={`${TEXT.h3} mb-2`}>{featureName} is a {requiredPlan.toUpperCase()} feature</h3>
		<p class={`${TEXT.body} ${COLOR.textMuted} mb-6 max-w-sm mx-auto`}>
			Upgrade your organization plan to unlock advanced management capabilities and premium learning features.
		</p>
		<button class={`px-6 py-2 ${RADIUS.button} bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all ${ELEVATION.base}`}>
			Upgrade to {requiredPlan.toUpperCase()}
		</button>
	</div>
{/if}
