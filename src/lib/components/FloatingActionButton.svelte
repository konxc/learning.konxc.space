<script lang="ts">
	import { fly } from 'svelte/transition';

	interface Props {
		/** Text tombol */
		label: string;
		/** Icon (opsional) - bisa berupa emoji atau string */
		icon?: string;
		/** Handler untuk onClick */
		onClick: () => void;
		/** Aria label untuk accessibility */
		ariaLabel?: string;
		/** Apakah tombol memiliki animasi bounce (default: false) */
		animate?: boolean;
		/** Additional classes */
		class?: string;
	}

	let { label, icon, onClick, ariaLabel, animate = false, class: className = '' }: Props = $props();

	// Base classes menggunakan Tailwind CSS 4 best practices
	const baseClasses = $derived(
		'flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/30 px-4 py-2 text-xs font-medium text-slate-700/90 backdrop-blur-md transition-all duration-300 hover:bg-white/40 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft-blue active:scale-95'
	);

	// Responsive size classes
	const sizeClasses = $derived(
		'max-[480px]:px-3 max-[480px]:py-1.5 max-[480px]:text-xs md:text-sm lg:text-base'
	);

	// Animation classes - hanya untuk scroll variant
	const animationClasses = $derived(animate ? 'animate-bounce hover:animate-none' : '');

	// Combined classes
	const buttonClasses = $derived(
		`${baseClasses} ${sizeClasses} ${animationClasses} ${className}`.trim()
	);
</script>

<button
	class={buttonClasses}
	style="-webkit-backdrop-filter: blur(12px);"
	onclick={onClick}
	aria-label={ariaLabel || label}
	type="button"
>
	{#if icon}
		<span aria-hidden="true">{icon}</span>
	{/if}
	<span>{label}</span>
</button>
