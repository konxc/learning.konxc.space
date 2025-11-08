<script lang="ts">
	import { RADIUS, ELEVATION, COLOR, SPACING, TEXT, TRANSITION } from '$lib/config/design';

	interface KpiCardProps {
		label: string;
		value?: string | number;
		hint?: string | null;
		accent?: boolean;
	}

	let { label, value = 0, hint = null, accent = false }: KpiCardProps = $props();
</script>

<div
	class={`group ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card} ${ELEVATION.cardHover} ${ELEVATION.transition} ${TRANSITION.all}`}
>
	<div class={`${TEXT.muted} mb-2 tracking-wider uppercase`}>{label}</div>
	<div class={`text-3xl font-bold md:text-4xl ${accent ? COLOR.accent : COLOR.textPrimary} mb-1`}>
		{value}
	</div>
	{#if hint}
		<div class={`${TEXT.small} ${COLOR.textSecondary} mt-2`}>{hint}</div>
	{/if}
</div>
