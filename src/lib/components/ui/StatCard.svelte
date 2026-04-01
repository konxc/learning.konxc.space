<script lang="ts">
	import { COLOR, RADIUS, ELEVATION, TEXT, TRANSITION, STATUS } from '$lib/config/design';

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
		success: `${STATUS.success.border} ${STATUS.success.bg}`,
		warning: `${STATUS.pending.border} ${STATUS.pending.bg}`,
		error: `${STATUS.error.border} ${STATUS.error.bg}`,
		accent: `${STATUS.info.border} ${STATUS.info.bg}`,
		purple: `${STATUS.purple.border} ${STATUS.purple.bg}`
	};

	const valueColor: Record<string, string> = {
		default: 'text-neutral-900 dark:text-white',
		success: STATUS.success.text,
		warning: STATUS.pending.text,
		error: STATUS.error.text,
		accent: STATUS.info.text,
		purple: STATUS.purple.text
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
