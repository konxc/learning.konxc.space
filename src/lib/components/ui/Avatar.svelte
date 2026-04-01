<script lang="ts">
	import { RADIUS } from '$lib/config/design';

	interface AvatarProps {
		src?: string | null;
		alt?: string;
		name?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		rounded?: 'full' | 'lg' | 'md';
	}

	let { src, alt = '', name = '', size = 'md', rounded = 'full' }: AvatarProps = $props();

	const sizeClasses = {
		xs: 'h-6 w-6 text-[10px]',
		sm: 'h-8 w-8 text-xs',
		md: 'h-10 w-10 text-sm',
		lg: 'h-12 w-12 text-base',
		xl: 'h-16 w-16 text-lg'
	};

	const roundedClasses = {
		full: 'rounded-full',
		lg: 'rounded-xl',
		md: 'rounded-lg'
	};

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((w) => w[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	}
</script>

{#if src}
	<img {src} {alt} class={`${sizeClasses[size]} ${roundedClasses[rounded]} object-cover`} />
{:else}
	<div
		class={`flex ${sizeClasses[size]} ${roundedClasses[rounded]} items-center justify-center bg-linear-to-br from-blue-500 to-indigo-600 font-bold text-white`}
		aria-label={name || alt}
	>
		{getInitials(name || alt || '?')}
	</div>
{/if}
