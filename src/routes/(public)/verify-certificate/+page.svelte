<script lang="ts">
	import type { PageData } from './$types';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION, GRADIENT } from '$lib/config/design';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	let searchSerial = $state($page.url.searchParams.get('serial') || '');

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchSerial.trim()) {
			window.location.href = `?serial=${encodeURIComponent(searchSerial.trim())}`;
		}
	}
</script>

<svelte:head>
	<title>Verifikasi Sertifikat — Naik Kelas</title>
</svelte:head>

<div class="relative min-h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8">
	<!-- High-Fidelity Background -->
	<div class="absolute inset-0 z-0">
		<div class="absolute inset-0 bg-linear-to-br from-blue-100/30 via-white to-indigo-100/30 dark:from-blue-900/10 dark:via-zinc-950 dark:to-indigo-900/10"></div>
		
		<!-- Sophisticated background pattern (subtle) -->
		<div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 40px 40px;"></div>
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

	<div class="relative z-10 w-full max-w-2xl mx-auto space-y-10">
		<!-- Header -->
		<div class="text-center space-y-4">
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300 text-xs font-black tracking-widest uppercase">
				Official Verification Portal
			</div>
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} tracking-tight`}>
				Validasi Sertifikat Digital
			</h1>
			<p class={`${TEXT.body} ${COLOR.textSecondary} max-w-md mx-auto`}>
				Pastikan keaslian sertifikat yang diterbitkan oleh platform Naik Kelas untuk menjamin kualitas kompetensi.
			</p>
		</div>

		<!-- Search Section -->
		<div 
			class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl ${ELEVATION.card} p-8`}
		>
			<form onsubmit={handleSearch} class="space-y-6">
				<div class="flex flex-col gap-2">
					<label for="serial" class={`${TEXT.small} font-black tracking-widest text-zinc-400 uppercase`}>
						Nomor Serial Sertifikat
					</label>
					<div class="flex flex-col sm:flex-row gap-3">
						<input
							type="text"
							id="serial"
							bind:value={searchSerial}
							placeholder="NK-2026-XXXXX"
							class={`flex-1 ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:bg-zinc-800/50`}
						/>
						<button
							type="submit"
							class={`px-8 py-3 ${RADIUS.button} ${COLOR.accentBg} text-sm font-black tracking-widest text-white uppercase ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg active:scale-95`}
						>
							Verifikasi
						</button>
					</div>
					<p class="text-[10px] text-zinc-500 italic">
						*Dapat ditemukan di bagian bawah atau link QR sertifikat
					</p>
				</div>
			</form>
		</div>

		<!-- Dynamic Result Section -->
		{#if data.certificate}
			<div
				class={`overflow-hidden ${RADIUS.card} border-2 border-green-500/20 bg-green-50/30 dark:bg-green-950/20 backdrop-blur-xl ${ELEVATION.card} p-1 animation-in slide-in-from-bottom-5 duration-700`}
			>
				<div class={`bg-white/80 dark:bg-zinc-900/80 ${RADIUS.card} p-8`}>
					<div class="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
						<div class="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-3xl shadow-inner">
							✅
						</div>
						<div class="text-center md:text-left space-y-1">
							<h3 class={`${TEXT.h3} text-green-700 dark:text-green-400 font-black`}>Sertifikat Valid</h3>
							<p class={`${TEXT.body} ${COLOR.textSecondary}`}>Data sertifikat ditemukan secara resmi dalam sistem kami.</p>
						</div>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
						<div class="space-y-1">
							<p class={`${TEXT.small} font-black tracking-widest text-zinc-400 uppercase`}>Nama Pemilik</p>
							<p class={`${TEXT.h4} ${COLOR.textPrimary}`}>
								{data.certificate.user.fullName || data.certificate.user.username}
							</p>
						</div>
						<div class="space-y-1">
							<p class={`${TEXT.small} font-black tracking-widest text-zinc-400 uppercase`}>Program Belajar</p>
							<p class={`${TEXT.h4} ${COLOR.textPrimary}`}>{data.certificate.course.title}</p>
						</div>
						<div class="space-y-1">
							<p class={`${TEXT.small} font-black tracking-widest text-zinc-400 uppercase`}>Tanggal Terbit</p>
							<p class={`${TEXT.body} font-bold ${COLOR.textPrimary}`}>
								{new Date(data.certificate.issuedAt).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})}
							</p>
						</div>
						<div class="space-y-1">
							<p class={`${TEXT.small} font-black tracking-widest text-zinc-400 uppercase`}>Nomor Serial</p>
							<p class="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md w-fit font-bold">
								{data.certificate.serial}
							</p>
						</div>
					</div>

					<div class="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
						<div class="flex items-center gap-3">
							<div class="h-8 w-8 rounded bg-blue-600 flex items-center justify-center font-black text-[10px] text-white italic">NK</div>
							<p class="text-[10px] text-zinc-500 font-bold leading-tight">
								Naik Kelas by Koneksi Platform<br/>Verified Official Digital Credential
							</p>
						</div>
						<button class="text-xs font-bold text-blue-600 hover:underline">
							Download PDF Original
						</button>
					</div>
				</div>
			</div>
		{:else if data.error}
			<div
				class={`overflow-hidden ${RADIUS.card} border-2 border-red-500/20 bg-red-50/30 dark:bg-red-950/20 backdrop-blur-xl ${ELEVATION.card} p-8 animation-in slide-in-from-bottom-5 duration-700`}
			>
				<div class="flex flex-col md:flex-row items-center gap-6">
					<div class="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-2xl">
						❌
					</div>
					<div class="text-center md:text-left space-y-1">
						<h3 class={`${TEXT.h3} text-red-700 dark:text-red-400 font-black`}>Sertifikat Tidak Ditemukan</h3>
						<p class={`${TEXT.body} ${COLOR.textSecondary}`}>{data.error}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Trust Footer -->
		<div class="pt-10 text-center space-y-4">
			<div class="flex items-center justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
				<img src="/logo-koneksi.png" alt="Koneksi" class="h-8 object-contain" />
				<span class="h-6 w-px bg-zinc-300"></span>
				<img src="/logo-asib.png" alt="Yayasan ASIB" class="h-8 object-contain" />
			</div>
			<p class="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
				Powered by Naik Kelas Learning Management System &copy; 2026
			</p>
		</div>
	</div>
</div>
