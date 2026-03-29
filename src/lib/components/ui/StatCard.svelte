<script lang="ts">
	import { COLOR, RADIUS, ELEVATION, TEXT, TRANSITION } from '$lib/config/design';

	let {
		value,
		label,
		icon,
		trend,
		variant = 'default'
	}: {
		value: string | number;
		label: string;
		icon?: string;
		trend?: string;
		variant?: 'default' | 'success' | 'warning' | 'error' | 'accent' | 'purple';
	} = $props();

	const variantStyles: Record<string, string> = {
		default: `${COLOR.cardBorder} ${COLOR.card}`,
		success: 'border-green-200 bg-green-50 dark:border-green-800/30 dark:bg-green-900/20',
		warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800/30 dark:bg-yellow-900/20',
		error: 'border-red-200 bg-red-50 dark:border-red-800/30 dark:bg-red-900/20',
		accent: 'border-blue-200 bg-blue-50 dark:border-blue-800/30 dark:bg-blue-900/20',
		purple: 'border-purple-200 bg-purple-50 dark:border-purple-800/30 dark:bg-purple-900/20'
	};

	const valueColor: Record<string, string> = {
		default: 'text-neutral-900 dark:text-white',
		success: 'text-green-600 dark:text-green-400',
		warning: 'text-yellow-600 dark:text-yellow-400',
		error: 'text-red-600 dark:text-red-400',
		accent: 'text-blue-600 dark:text-blue-400',
		purple: 'text-purple-600 dark:text-purple-400'
	};
</script>

<div
	class={`flex flex-col gap-2 rounded-2xl border p-5 ${variantStyles[variant]} ${ELEVATION.base} ${TRANSITION.all} hover:${ELEVATION.cardHover}`}
>
	<div class="flex items-start justify-between">
		<span class="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
		{#if icon}
			<span class="text-xl">{icon}</span>
		{/if}
	</div>
	<div class="flex items-end justify-between">
		<span class="text-3xl font-black tracking-tight {valueColor[variant]}">{value}</span>
		{#if trend}
			<span
				class={`text-xs font-bold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'} dark:text-green-400 dark:opacity-80`}
			>
				{trend}
			</span>
		{/if}
	</div>
</div>
