<script lang="ts">
	import type { PageData } from './$types';
	import { RADIUS, ELEVATION, TEXT, COLOR, GRADIENT, SPACING } from '$lib/config/design';
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	const { certificate, user, course } = data.certificate;

	let isVerified = $state(false);

	onMount(() => {
		// Animation delay simulation for "Verification" feel
		setTimeout(() => {
			isVerified = true;
		}, 800);
	});

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Verify Certificate - {user.fullName || user.username}</title>
	<meta name="description" content="Verify Naik Kelas digital certificate for {user.fullName || user.username}" />
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4 dark:bg-zinc-950 sm:py-20">
	<div class="mx-auto max-w-4xl">
		<!-- Branding Header -->
		<div class="mb-12 text-center" in:fly={{ y: -20, duration: 800 }}>
			<div class="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm dark:border-blue-900/30 dark:bg-blue-950/20">
				<div class="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
				<span class="text-xs font-black tracking-widest text-blue-600 uppercase">Credential Verification Service</span>
			</div>
			<h1 class="text-3xl font-black tracking-tighter text-zinc-900 md:text-4xl dark:text-white">Naik Kelas <span class="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Academy</span></h1>
		</div>

		<!-- Main Verification Card -->
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.card} relative overflow-hidden border ${COLOR.cardBorder} p-1 md:p-2 shadow-2xl`} in:scale={{ start: 0.95, duration: 800 }}>
			<!-- Verification Status Ribbon -->
			{#if isVerified}
				<div class="absolute top-0 right-0 p-8" in:fade={{ delay: 1000 }}>
					<div class="flex flex-col items-center gap-2">
						<div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
						</div>
						<div class="text-[10px] font-black tracking-widest text-emerald-600 uppercase">Verified Authentic</div>
					</div>
				</div>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-12">
				<!-- Certificate Visualization -->
				<div class="relative bg-slate-100 p-8 md:col-span-5 dark:bg-zinc-900 md:p-12">
					<div class="aspect-3/4 w-full rounded-lg bg-white shadow-xl dark:bg-zinc-800 flex flex-col justify-between p-6 border-4 border-slate-100 dark:border-zinc-700">
						<div class="text-center">
							<h3 class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-4">Official Certificate</h3>
							<div class="mx-auto w-12 h-12 rounded-full bg-blue-600 mb-2 flex items-center justify-center text-white font-black text-xs">NK</div>
						</div>
						
						<div class="text-center px-2">
							<p class="text-[6px] font-medium text-slate-400 mb-1">Presented to</p>
							<p class="text-[10px] font-bold text-slate-900 dark:text-white leading-tight mb-4">{user.fullName || user.username}</p>
							
							<p class="text-[6px] font-medium text-slate-400 mb-1">For completing</p>
							<p class="text-[8px] font-black text-slate-800 dark:text-zinc-200 uppercase tracking-tight">{course.title}</p>
						</div>

						<div class="flex justify-between items-end border-t border-slate-50 pt-4">
							<div class="text-left">
								<p class="text-[5px] text-slate-400">Serial</p>
								<p class="text-[5px] font-mono text-slate-600">{certificate.serial}</p>
							</div>
							<div class="text-right">
								<p class="text-[5px] text-slate-400">Date</p>
								<p class="text-[5px] text-slate-600">{formatDate(certificate.issuedAt)}</p>
							</div>
						</div>
					</div>
					
					<!-- Decorative elements -->
					<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
				</div>

				<!-- Verification Form/Details -->
				<div class="p-8 md:col-span-7 md:p-16">
					<div class="space-y-10">
						<div class="space-y-4">
							<h2 class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Validation Status</h2>
							<p class="text-slate-500 dark:text-slate-400 leading-relaxed">
								This digital credential has been issued by Naik Kelas Academy and is officially verified against our learning management records.
							</p>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 border-y border-slate-100 py-8 dark:border-zinc-800">
							<div class="space-y-1">
								<p class="text-[10px] font-black tracking-widest text-slate-400 uppercase">Learner Name</p>
								<p class="text-lg font-bold text-zinc-900 dark:text-white">{user.fullName || user.username}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] font-black tracking-widest text-slate-400 uppercase">Serial ID</p>
								<p class="text-lg font-bold font-mono text-zinc-900 dark:text-white">{certificate.serial}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] font-black tracking-widest text-slate-400 uppercase">Course Mastered</p>
								<p class="text-lg font-bold text-zinc-900 dark:text-white">{course.title}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] font-black tracking-widest text-slate-400 uppercase">Issuance Date</p>
								<p class="text-lg font-bold text-zinc-900 dark:text-white">{formatDate(certificate.issuedAt)}</p>
							</div>
						</div>

						<div class="pt-4 flex flex-col sm:flex-row gap-4">
							<a href="/public/courses" class={`flex-1 flex justify-center items-center gap-2 ${RADIUS.button} px-6 py-4 bg-zinc-900 text-white font-bold transition-transform hover:-translate-y-1 active:scale-95 dark:bg-white dark:text-zinc-900`}>
								Explore Curriculum
							</a>
							<button onclick={() => window.print()} class={`flex-1 flex justify-center items-center gap-2 ${RADIUS.button} px-6 py-4 border border-slate-200 text-slate-700 font-bold transition-all hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900`}>
								Download Statement
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Trust badges -->
		<div class="mt-16 flex flex-wrap justify-center items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
			<span class="text-lg font-black tracking-tighter text-zinc-700 dark:text-zinc-400">KONEKSI DIGITAL</span>
			<span class="text-lg font-black tracking-tighter text-zinc-700 dark:text-zinc-400">YAYASAN ASIB</span>
			<span class="text-lg font-black tracking-tighter text-zinc-700 dark:text-zinc-400">NAIK KELAS ACADEMY</span>
		</div>
	</div>
</div>

<style>
	@media print {
		:global(body) {
			background: white !important;
		}
		.min-h-screen {
			background: white !important;
			padding: 0 !important;
		}
		button, a {
			display: none !important;
		}
		.mb-12, .mt-16 {
			display: none !important;
		}
		.shadow-2xl, .shadow-xl {
			box-shadow: none !important;
			border: 1px solid #e2e8f0 !important;
		}
		.max-w-4xl {
			max-width: 100% !important;
		}
	}
</style>
