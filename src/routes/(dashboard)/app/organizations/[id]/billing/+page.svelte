<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const plans = [
		{
			name: 'Free',
			planType: 'free',
			price: 0,
			features: ['3 courses', '10 members', '1 workspace', '500MB storage', 'Community support']
		},
		{
			name: 'Pro',
			planType: 'pro',
			price: 99000,
			features: [
				'20 courses',
				'50 members',
				'5 workspaces',
				'5GB storage',
				'Email support',
				'Custom branding',
				'Analytics'
			]
		},
		{
			name: 'Enterprise',
			planType: 'enterprise',
			price: 499000,
			features: [
				'Unlimited courses',
				'Unlimited members',
				'Unlimited workspaces',
				'50GB storage',
				'Priority support',
				'Custom branding',
				'Analytics',
				'API access',
				'Custom domain',
				'SSO'
			]
		}
	];

	function formatPrice(price: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	}
</script>

<svelte:head>
	<title>Billing - {data.organization.name} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Billing & Plan" description="Manage your organization's subscription plan" />

	<div class="mb-8">
		<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Current Plan</h2>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-6`}>
			<div class="flex items-center justify-between">
				<div>
					<span class={`${TEXT.h3} ${COLOR.accent} capitalize`}>{data.currentPlan}</span>
					<p class={`${TEXT.body} ${COLOR.textMuted} mt-1`}>
						{formatPrice(data.planPrices[data.currentPlan] || 0)}/month
					</p>
				</div>
				{#if data.currentPlan !== 'free'}
					<form method="post" action="?/downgrade" use:enhance>
						<button
							type="submit"
							class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 ${TEXT.button} ${COLOR.textMuted} hover:${COLOR.textPrimary}`}
						>
							Downgrade to Free
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>

	<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>Available Plans</h2>
	<div class="grid gap-6 md:grid-cols-3">
		{#each plans as plan}
			<div
				class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-6 ${TRANSITION.all} ${
					data.currentPlan === plan.planType ? 'ring-2 ring-blue-500' : ''
				}`}
			>
				<div class="mb-4">
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary}`}>{plan.name}</h3>
					<div class="mt-2">
						<span class={`${TEXT.h2} ${COLOR.textPrimary}`}>{formatPrice(plan.price)}</span>
						<span class={`${TEXT.body} ${COLOR.textMuted}`}>/month</span>
					</div>
				</div>

				<ul class="mb-6 space-y-2">
					{#each plan.features as feature}
						<li class={`${TEXT.body} ${COLOR.textPrimary} flex items-center gap-2`}>
							<span class="text-green-500">✓</span>
							{feature}
						</li>
					{/each}
				</ul>

				{#if data.currentPlan === plan.planType}
					<div class={`${RADIUS.button} bg-blue-50 py-3 text-center ${TEXT.button} text-blue-600`}>
						Current Plan
					</div>
				{:else if plan.price > (data.planPrices[data.currentPlan] || 0)}
					<form method="post" action="?/upgrade" use:enhance>
						<input type="hidden" name="planType" value={plan.planType} />
						<button
							type="submit"
							class={`w-full ${RADIUS.button} ${COLOR.accentBg} py-3 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover}`}
						>
							Upgrade to {plan.name}
						</button>
					</form>
				{:else}
					<div
						class={`${RADIUS.button} border ${COLOR.cardBorder} py-3 text-center ${TEXT.button} ${COLOR.textMuted}`}
					>
						Contact Sales
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if form?.success && form?.data?.redirectUrl}
		<script>
			window.location.href = '{form.data.redirectUrl}';
		</script>
	{/if}
</PageWrapper>
