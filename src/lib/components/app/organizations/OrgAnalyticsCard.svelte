<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { COLOR, RADIUS, ELEVATION } from '$lib/config/design';

	interface Props {
		title: string;
		value: string | number;
		subtitle?: string;
		icon?: string;
		color?: 'blue' | 'emerald' | 'amber' | 'purple';
	}

	let { title, value, subtitle, icon, color = 'blue' }: Props = $props();

	const iconBg: Record<NonNullable<Props['color']>, string> = {
		blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
		emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
		amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
		purple: 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400'
	};

	const valueColor: Record<NonNullable<Props['color']>, string> = {
		blue: 'text-blue-600 dark:text-blue-400',
		emerald: 'text-emerald-600 dark:text-emerald-400',
		amber: 'text-amber-600 dark:text-amber-400',
		purple: 'text-purple-600 dark:text-purple-400'
	};
</script>

<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} p-5`}>
	<div class="flex items-start gap-4">
		{#if icon}
			<div
				class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg[color]}`}
			>
				<Icon name={icon} size={20} />
			</div>
		{/if}
		<div class="min-w-0 flex-1">
			<p class={`text-xs font-semibold tracking-widest uppercase ${COLOR.textMuted}`}>{title}</p>
			<p class={`mt-1 text-2xl font-bold ${valueColor[color]}`}>{value}</p>
			{#if subtitle}
				<p class={`mt-0.5 text-xs ${COLOR.textMuted}`}>{subtitle}</p>
			{/if}
		</div>
	</div>
</div>
