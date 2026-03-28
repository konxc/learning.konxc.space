<script lang="ts">
	import { RADIUS, TEXT, COLOR, ELEVATION, GRADIENT, TRANSITION } from '$lib/config/design';

	interface PlanLimiterProps {
		requiredPlan?: 'free' | 'pro' | 'enterprise';
		currentPlan?: string;
		featureName?: string;
		children?: import('svelte').Snippet;
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

	const planLabels: Record<string, string> = {
		pro: 'Pro',
		enterprise: 'Enterprise'
	};
</script>

{#if hasAccess}
	{@render children?.()}
{:else}
	<div
		class={`relative overflow-hidden ${RADIUS.card} border border-zinc-200/50 bg-zinc-50/50 dark:border-zinc-800/50 dark:bg-zinc-900/30`}
	>
		<!-- Blurred preview of locked content -->
		<div class="pointer-events-none select-none opacity-30 blur-[2px] p-6">
			{#if children}
				{@render children()}
			{:else}
				<div class="h-32 w-full"></div>
			{/if}
		</div>

		<!-- Lock overlay -->
		<div
			class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-sm dark:bg-zinc-900/60"
		>
			<div
				class={`flex h-12 w-12 items-center justify-center rounded-2xl ${GRADIENT.primary} text-white shadow-lg`}
			>
				<svg
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			</div>
			<div class="px-4 text-center">
				<p class={`${TEXT.h4} ${COLOR.textPrimary} mb-1`}>
					{featureName}
				</p>
				<p class={`text-xs ${COLOR.textMuted}`}>
					Fitur ini membutuhkan paket <span
						class="font-bold text-blue-600 dark:text-blue-400"
						>{planLabels[requiredPlan] || requiredPlan}</span
					>
				</p>
			</div>
			<button
				class={`mt-2 ${RADIUS.button} ${GRADIENT.primary} px-5 py-2 text-xs font-bold tracking-wide text-white shadow-lg ${TRANSITION.all} hover:shadow-xl hover:shadow-blue-500/20 active:scale-95`}
			>
				Upgrade ke {planLabels[requiredPlan] || requiredPlan} →
			</button>
		</div>
	</div>
{/if}
