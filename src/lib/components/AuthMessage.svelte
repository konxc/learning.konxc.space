<script lang="ts">
	import { RADIUS, SPACING, TEXT, COLOR, ELEVATION } from '$lib/config/design';

	interface Props {
		type: 'error' | 'success';
		message: string;
	}

	let { type, message }: Props = $props();
</script>

<div 
	class={`flex items-start gap-3 p-4 mb-6 ${RADIUS.card} ${ELEVATION.base} border animate-in fade-in slide-in-from-top-1 duration-500
	${type === 'error' 
		? 'bg-red-50/50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-300' 
		: 'bg-green-50/50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-300'}`}
>
	<span class="text-lg">
		{type === 'error' ? '⚠️' : '✅'}
	</span>
	<div class="flex-1">
		<p class={`${TEXT.small} font-bold mb-0.5`}>
			{type === 'error' ? 'Kesalahan Sistem' : 'Berhasil'}
		</p>
		<p class={`${TEXT.small} opacity-90 leading-relaxed`}>
			{message}
		</p>
	</div>
</div>
