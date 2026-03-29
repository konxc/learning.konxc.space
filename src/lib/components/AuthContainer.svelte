<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { COLOR, RADIUS, TEXT, TRANSITION, SPACING, ELEVATION } from '$lib/config/design';

	interface Props {
		title: string;
		subtitle: string;
		children: Snippet;
		hideHeader?: boolean;
	}

	let {
		title,
		subtitle,
		children,
		hideHeader = false
	}: Props = $props();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-zinc-950 flex items-center justify-center p-4 md:p-8">
	<!-- High-Fidelity Background -->
	<div class="absolute inset-0 z-0">
		<div class="absolute inset-0 bg-linear-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-blue-950/20 dark:via-zinc-950 dark:to-purple-950/20"></div>
		
		<!-- Floating Glow Orbs -->
		<div class="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-400/20 blur-[120px] animate-pulse"></div>
		<div class="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-purple-400/20 blur-[120px] animate-pulse [animation-delay:2s]"></div>
		<div class="absolute top-[20%] right-[10%] h-[30%] w-[30%] rounded-full bg-indigo-400/10 blur-[100px] animate-pulse [animation-delay:4s]"></div>
	</div>

	<!-- Back Button -->
	<a 
		href="/" 
		class={`absolute top-6 left-6 z-20 flex h-10 w-10 items-center justify-center ${RADIUS.button} border ${COLOR.cardBorder} bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md ${TRANSITION.all} hover:scale-110 active:scale-95 shadow-sm group`}
		aria-label="Back to home"
	>
		<svg 
			class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" 
			fill="none" 
			viewBox="0 0 24 24" 
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</a>

	<!-- Main Container -->
	<div 
		class={`relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} bg-white/70 dark:bg-zinc-900/40 backdrop-blur-2xl ${ELEVATION.card} transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
	>
		<!-- Left Panel: Brand / Info (Hidden on mobile) -->
		<div class="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-zinc-900 dark:bg-black p-12 flex-col justify-between text-white">
			<div class="relative z-10">
				<div class="mb-8 flex items-center gap-2">
					<div class="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white italic">NK</div>
					<span class="text-xl font-black tracking-tighter italic">NAIK KELAS</span>
				</div>
				
				<h2 class="text-3xl font-black leading-tight mb-6">Learn. Build.<br/>Scale.</h2>
				<p class="text-zinc-400 text-sm leading-relaxed max-w-xs">
					Platform pembelajaran berbasis komunitas untuk para kreator, builder, dan entrepreneur masa depan.
				</p>
			</div>

			<div class="relative z-10">
				<div class="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
					<div class="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">✨</div>
					<div>
						<p class="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Status</p>
						<p class="text-xs font-bold">120+ Active Learners Online</p>
					</div>
				</div>
			</div>

			<!-- Decorative element for left panel -->
			<div class="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
				<div class="absolute top-[-20%] right-[-20%] w-full h-full bg-blue-600 rounded-full blur-[100px]"></div>
			</div>
		</div>

		<!-- Right Panel: Form Content -->
		<div class="lg:col-span-7 p-8 md:p-12">
			{#if !hideHeader}
				<div class="mb-10">
					<h1 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2`}>{title}</h1>
					<p class={`${TEXT.body} ${COLOR.textSecondary}`}>{subtitle}</p>
				</div>
			{/if}

			{@render children()}
		</div>
	</div>
</div>

<style>
	/* Custom animations if needed */
	:global(body) {
		overflow-x: hidden;
	}
</style>
