<script lang="ts">
	import { COLOR, RADIUS, TEXT, TRANSITION, SPACING, ELEVATION } from '$lib/config/design';

	interface Props {
		text: string;
		disabled?: boolean;
		loading?: boolean;
		type?: 'submit' | 'button';
	}

	let { text, disabled = false, loading = false, type = 'submit' }: Props = $props();
</script>

<button 
	{type} 
	disabled={disabled || loading}
	class={`group relative flex w-full items-center justify-center ${SPACING.button} ${RADIUS.button} ${COLOR.accentBg} ${TEXT.button} font-bold text-white shadow-lg ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none`}
>
	{#if loading}
		<div class="flex items-center gap-2">
			<svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<span>Memproses...</span>
		</div>
	{:else}
		<span class="group-hover:translate-x-0.5 transition-transform">{text}</span>
	{/if}
</button>
