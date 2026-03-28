<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/layouts/Logo.svelte';

	onMount(() => {
		// Redirect to overview after 1.8 seconds
		const timer = setTimeout(() => {
			goto('/dashboard/overview');
		}, 1800);

		return () => clearTimeout(timer);
	});
</script>

<svelte:head>
	<title>Memuat Dashboard - Naik Kelas</title>
</svelte:head>

<div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950">
	<div class="relative flex flex-col items-center">
		<!-- Animated Logo Container -->
		<div class="mb-12 flex flex-col items-center">
			<div class="h-24 w-24 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 shadow-2xl flex items-center justify-center shadow-blue-500/30 animate-pulse">
				<Logo size="lg" showText={false} />
			</div>
			<div class="mt-8 text-4xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
				Naik<span class="text-neutral-900 dark:text-white">Kelas.</span>
			</div>
		</div>

		<!-- Progress/Loading Indicator -->
		<div class="w-64">
			<div class="mb-3 flex items-center justify-between px-1">
				<span class="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Menyiapkan Dashboard</span>
				<span class="text-[10px] font-bold text-gray-400">Please wait...</span>
			</div>
			<div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-900">
				<div
					class="h-full bg-linear-to-r from-blue-600 to-indigo-600 animate-loading-bar"
				></div>
			</div>
		</div>

		<!-- Tagline -->
		<p class="mt-12 text-sm text-gray-500 font-medium tracking-wide dark:text-gray-400">
			Melompat lebih tinggi, belajar lebih baik.
		</p>
	</div>
</div>

<style>
	@keyframes loading-bar {
		0% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(-20%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.animate-loading-bar {
		width: 100%;
		animation: loading-bar 2s ease-in-out infinite;
	}

	:global(body) {
		overflow: hidden;
	}
</style>
