<script lang="ts">
	import type { FullAutoFill } from 'svelte/elements';
	import { COLOR, RADIUS, TEXT, TRANSITION, SPACING } from '$lib/config/design';

	type AutoCompleteValue = FullAutoFill | 'on' | 'off';

	interface Props {
		label: string;
		type?: string;
		name: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		autocomplete?: AutoCompleteValue | null;
		pattern?: string;
		minlength?: number;
		maxlength?: number;
		hint?: string;
	}

	let {
		label,
		type = 'text',
		name,
		value = $bindable(''),
		placeholder,
		required = false,
		autocomplete,
		pattern,
		minlength,
		maxlength,
		hint
	}: Props = $props();
</script>

<div class="flex flex-col gap-2">
	<label 
		for={name}
		class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
	>
		{label}
		{#if required}<span class="text-red-500 ml-1">*</span>{/if}
	</label>
	
	<div class="relative group">
		<input
			{type}
			id={name}
			{name}
			{required}
			{autocomplete}
			{placeholder}
			{pattern}
			{minlength}
			{maxlength}
			bind:value
			class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none border ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50`}
		/>
	</div>
	
	{#if hint}
		<p class={`${TEXT.small} ${COLOR.textMuted} mt-1 leading-relaxed`}>
			{hint}
		</p>
	{/if}
</div>
