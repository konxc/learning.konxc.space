<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import type { Error } from '@sveltejs/kit';

	let { error, status }: { error: Error; status: number } = $props();

	let mouseX = $state(0);
	let mouseY = $state(0);
	let particles = $state<
		Array<{ id: number; x: number; y: number; vx: number; vy: number; size: number }>
	>([]);
	let floatingOffset = $state(0);
	let isHovering = $state(false);

	// Check if it's a 404 error
	const is404 = $derived(status === 404);

	// Generate floating particles
	onMount(() => {
		// Create initial particles
		const initParticles = () => {
			particles = Array.from({ length: 20 }, (_, i) => ({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				size: Math.random() * 4 + 2
			}));
		};

		initParticles();

		// Animate particles
		const interval = setInterval(() => {
			particles = particles.map((p) => ({
				...p,
				x: (p.x + p.vx + 100) % 100,
				y: (p.y + p.vy + 100) % 100
			}));
		}, 100);

		// Floating animation
		const floatInterval = setInterval(() => {
			floatingOffset = (floatingOffset + 0.5) % 360;
		}, 50);

		return () => {
			clearInterval(interval);
			clearInterval(floatInterval);
		};
	});

	function handleMouseMove(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		mouseX = ((e.clientX - rect.left) / rect.width) * 100;
		mouseY = ((e.clientY - rect.top) / rect.height) * 100;
	}

	function goHome() {
		goto('/');
	}

	function goBack() {
		if (typeof window !== 'undefined') {
			window.history.back();
		}
	}
</script>

<svelte:head>
	<title>{status === 404 ? '404 - Page Not Found' : 'Error'} - Naik Kelas</title>
</svelte:head>

<div
	role="presentation"
	class="error-page-container relative flex min-h-screen flex-col items-center justify-center overflow-hidden ${COLOR.bg} ${COLOR.textPrimary}"
	onmousemove={handleMouseMove}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
>
	<!-- Floating particles background -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		{#each particles as particle (particle.id)}
			<div
				class="absolute rounded-full bg-blue-400/20 blur-sm transition-opacity duration-300 dark:bg-blue-500/20"
				style="left: {particle.x}%; top: {particle.y}%; width: {particle.size}px; height: {particle.size}px; opacity: {isHovering
					? 0.6
					: 0.3};"
			></div>
		{/each}
	</div>

	<!-- Gradient orb that follows mouse -->
	<div
		class="absolute -z-10 h-96 w-96 rounded-full bg-linear-to-br from-blue-400/30 via-purple-400/20 to-pink-400/30 blur-3xl transition-all duration-700 ease-out"
		style="left: {mouseX}%; top: {mouseY}%; transform: translate(-50%, -50%);"
	></div>

	<div class="relative z-10 mx-auto max-w-2xl px-6 text-center">
		<!-- Animated 404 or Error Code -->
		<div
			class="mb-8 inline-block"
			style="transform: translateY({Math.sin((floatingOffset * Math.PI) / 180) *
				10}px) rotate({Math.sin((floatingOffset * Math.PI) / 180) *
				5}deg); transition: transform 0.5s ease-out;"
		>
			{#if is404}
				<!-- Playful 404 Display -->
				<div class="relative">
					<h1
						class="text-[120px] leading-none font-black md:text-[160px] ${COLOR.textPrimary} select-none"
						style="text-shadow: 0 0 40px rgba(59, 130, 246, 0.3), 0 10px 30px rgba(59, 130, 246, 0.2);"
					>
						<span
							class="inline-block ${TRANSITION.all} hover:scale-110"
							style="transform: rotate({Math.sin((floatingOffset * Math.PI) / 180) * 3}deg);"
							>4</span
						>
						<span
							class="mx-2 inline-block text-6xl md:text-8xl ${COLOR.accent} ${TRANSITION.all} hover:scale-125"
							style="animation: spin 3s linear infinite; display: inline-block;">🚀</span
						>
						<span
							class="inline-block ${TRANSITION.all} hover:scale-110"
							style="transform: rotate({-Math.sin((floatingOffset * Math.PI) / 180) * 3}deg);"
							>4</span
						>
					</h1>
				</div>
			{:else}
				<!-- Error Code Display -->
				<h1
					class="text-[100px] leading-none font-black md:text-[140px] ${COLOR.textPrimary} select-none"
					style="text-shadow: 0 0 40px rgba(239, 68, 68, 0.3), 0 10px 30px rgba(239, 68, 68, 0.2);"
				>
					{status}
				</h1>
			{/if}
		</div>

		<!-- Error Message -->
		<div class="mb-8">
			{#if is404}
				<h2
					class={`${TEXT.h2} ${COLOR.textPrimary} mb-4 font-bold`}
					style="animation: fadeInUp 0.6s ease-out 0.2s both;"
				>
					Oops! Halaman tidak ditemukan 🎯
				</h2>
				<p
					class={`${TEXT.body} ${COLOR.textSecondary} mx-auto mb-2 max-w-lg`}
					style="animation: fadeInUp 0.6s ease-out 0.4s both;"
				>
					Sepertinya halaman yang Anda cari sudah terbang ke luar angkasa!
				</p>
				<p
					class={`${TEXT.small} ${COLOR.textMuted} mb-6`}
					style="animation: fadeInUp 0.6s ease-out 0.6s both;"
				>
					Tapi jangan khawatir, kita bisa kembali ke Bumi dengan aman 🚀
				</p>
			{:else}
				<h2
					class={`${TEXT.h2} ${COLOR.textPrimary} mb-4 font-bold`}
					style="animation: fadeInUp 0.6s ease-out 0.2s both;"
				>
					Terjadi kesalahan ⚠️
				</h2>
				<p
					class={`${TEXT.body} ${COLOR.textSecondary} mx-auto mb-6 max-w-lg`}
					style="animation: fadeInUp 0.6s ease-out 0.4s both;"
				>
					{error?.message || 'Maaf, terjadi kesalahan saat memuat halaman.'}
				</p>
			{/if}
		</div>

		<!-- Action Buttons -->
		<div
			class="flex flex-col items-center justify-center gap-4 sm:flex-row"
			style="animation: fadeInUp 0.6s ease-out 0.8s both;"
		>
			<button
				type="button"
				onclick={goHome}
				class={`group inline-flex items-center gap-2 ${RADIUS.button} bg-blue-500/85 text-white dark:bg-blue-500/75 ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base} hover:scale-105 hover:bg-blue-500/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 focus-visible:ring-offset-2 dark:hover:bg-blue-400/90`}
			>
				<span class="transition-transform group-hover:-translate-x-1">🏠</span>
				<span>Kembali ke Beranda</span>
				<span class="transition-transform group-hover:translate-x-1">→</span>
			</button>

			{#if is404}
				<button
					type="button"
					onclick={goBack}
					class={`group inline-flex items-center gap-2 ${RADIUS.button} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.button} ${TEXT.button} ${COLOR.textPrimary} ${TRANSITION.all} ${ELEVATION.base} hover:${ELEVATION.hover} hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`}
				>
					<span class="transition-transform group-hover:-translate-x-1">←</span>
					<span>Kembali Sebelumnya</span>
				</button>
			{/if}
		</div>

		<!-- Fun Interactive Element -->
		{#if is404}
			<div
				class="mt-12 ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card} mx-auto max-w-md"
				style="animation: fadeInUp 0.6s ease-out 1s both;"
			>
				<p class={`${TEXT.small} ${COLOR.textSecondary} mb-3`}>
					💡 <strong>Tips:</strong> Gerakkan mouse Anda untuk melihat efek interaktif!
				</p>
				<div class="flex items-center justify-center gap-2 ${TEXT.small} ${COLOR.textMuted}">
					<span>Gerakkan mouse →</span>
					<span class="text-2xl ${TRANSITION.all}" style="transform: rotate({mouseX / 2}deg);">
						🎨
					</span>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.error-page-container {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
	}

	@media (prefers-reduced-motion: reduce) {
		.error-page-container *,
		.error-page-container *::before,
		.error-page-container *::after {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
