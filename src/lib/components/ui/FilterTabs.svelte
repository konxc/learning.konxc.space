<script lang="ts">
	import { RADIUS, COLOR, TRANSITION, ELEVATION } from '$lib/config/design';
	import { fly } from 'svelte/transition';

	export interface FilterTab {
		value: string;
		label: string;
		count?: number;
	}

	export interface FilterTabsProps {
		tabs: FilterTab[];
		activeValue: string;
		onChange?: (value: string) => void;
		variant?: 'pills' | 'underline' | 'buttons';
		class?: string;
	}

	let {
		tabs,
		activeValue,
		onChange,
		variant = 'underline',
		class: className = ''
	}: FilterTabsProps = $props();

	const variantClasses = $derived({
		pills: 'flex flex-wrap gap-2',
		underline: 'flex gap-8 border-b border-zinc-200 dark:border-zinc-700',
		buttons: 'flex gap-2'
	});

	function handleClick(value: string) {
		if (onChange) {
			onChange(value);
		}
	}
</script>

<div class={`${variantClasses[variant]} ${className}`}>
	{#each tabs as tab}
		{@const isActive = tab.value === activeValue}
		<button
			type="button"
			onclick={() => handleClick(tab.value)}
			class={`relative cursor-pointer whitespace-nowrap ${variant === 'pills' ? `${RADIUS.button} px-4 py-2` : variant === 'buttons' ? `${RADIUS.small} px-3 py-1.5` : 'pb-4 text-sm font-black tracking-widest uppercase'}`}
		>
			<span
				class={`relative z-10 ${isActive ? COLOR.textPrimary : `${COLOR.textMuted} hover:text-zinc-600 dark:hover:text-zinc-300`}`}
			>
				{tab.label}
				{#if tab.count !== undefined}
					<span class="ml-1 opacity-70">({tab.count})</span>
				{/if}
			</span>

			{#if variant === 'underline' && isActive}
				<div
					class={`absolute bottom-0 left-0 h-1 w-full rounded-full ${COLOR.accentBg}`}
					in:fly={{ y: 2, duration: 300 }}
				></div>
			{/if}

			{#if variant === 'pills' && isActive}
				<div class="absolute inset-0 rounded-xl bg-blue-50/50 dark:bg-blue-900/30"></div>
			{/if}
		</button>
	{/each}
</div>

<style>
	button {
		transition: all 200ms ease-out;
	}
	button:active {
		transform: scale(0.98);
	}
</style>
