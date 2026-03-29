<script lang="ts">
	import type { PageData } from './$types';
	import { RADIUS, TEXT, COLOR, SPACING, TRANSITION, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();
	const { organization, courses, isMember } = data;
	const brandColor = organization.brandColor || '#2563eb';
</script>

<svelte:head>
	<title>{organization.name} - Learning Hub | Naik Kelas</title>
	<meta name="description" content={`Explore exclusive courses from ${organization.name} on Naik Kelas LMS platform.`}>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-neutral-950">
	<!-- Hero Section -->
	<header class="relative overflow-hidden py-16 md:py-24 text-white" style="background: {brandColor}">
		<!-- Pattern Overlay -->
		<div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
		<div class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
		<div class="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-3xl"></div>

		<div class="container mx-auto px-6 relative z-10">
			<div class="flex flex-col items-center text-center max-w-3xl mx-auto">
				<div class="h-24 w-24 rounded-2xl bg-white p-4 shadow-xl mb-6">
					{#if organization.logoUrl}
						<img src={organization.logoUrl} alt={organization.name} class="h-full w-full object-contain" />
					{:else}
						<div class="h-full w-full flex items-center justify-center text-4xl font-black" style="color: {brandColor}">
							{organization.name[0]}
						</div>
					{/if}
				</div>
				<h1 class="text-4xl md:text-5xl font-black tracking-tight mb-4">{organization.name}</h1>
				<p class="text-lg opacity-90 mb-8 leading-relaxed">Selamat datang di hub pembelajaran resmi {organization.name}. Temukan materi eksklusif dan tingkatkan keahlian tim Anda bersama kami.</p>
				
				<div class="flex gap-4">
					{#if isMember}
						<a href="/app/overview" class={`px-8 py-3 ${RADIUS.button} bg-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95`} style="color: {brandColor}">
							Buka Dashboard Dashboard Saya
						</a>
					{:else}
						<a href="/login" class={`px-8 py-3 ${RADIUS.button} bg-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95`} style="color: {brandColor}">
							Gabung Sekarang
						</a>
						<button class={`px-8 py-3 ${RADIUS.button} bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-all`}>
							Kontak Admin
						</button>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="container mx-auto px-6 -mt-8 pb-20 relative z-20">
		<div class="flex flex-col gap-12">
			<!-- Statistics Bar -->
			<div class={`${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} ${ELEVATION.card} p-6 grid grid-cols-2 md:grid-cols-4 gap-6`}>
				<div class="text-center md:border-r border-gray-100 dark:border-neutral-800">
					<p class="text-3xl font-black mb-1" style="color: {brandColor}">{courses.length}</p>
					<p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Kursus Tersedia</p>
				</div>
				<div class="text-center md:border-r border-gray-100 dark:border-neutral-800">
					<p class="text-3xl font-black mb-1" style="color: {brandColor}">100%</p>
					<p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Sertifikat Resmi</p>
				</div>
				<div class="text-center md:border-r border-gray-100 dark:border-neutral-800">
					<p class="text-3xl font-black mb-1" style="color: {brandColor}">24/7</p>
					<p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Akses Fleksibel</p>
				</div>
				<div class="text-center">
					<p class="text-3xl font-black mb-1" style="color: {brandColor}">HQ</p>
					<p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Kualitas Materi</p>
				</div>
			</div>

			<!-- Course Grid -->
			<section>
				<div class="flex items-center justify-between mb-8">
					<h2 class={TEXT.h2}>Katalog Kursus Internal</h2>
					<div class="h-1 flex-1 mx-6 bg-gray-100 dark:bg-neutral-800 rounded-full"></div>
				</div>

				{#if courses.length === 0}
					<div class="py-20 text-center opacity-50">
						<div class="text-6xl mb-4">📖</div>
						<p class={TEXT.body}>Belum ada kursus publik yang tersedia saat ini.</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{#each courses as course}
							<div class={`${COLOR.card} ${RADIUS.card} border ${COLOR.cardBorder} ${ELEVATION.base} ${ELEVATION.cardHover} ${ELEVATION.transition} flex flex-col overflow-hidden`}>
								<div class="relative h-48 overflow-hidden">
									{#if course.thumbnailUrl}
										<img src={course.thumbnailUrl} alt={course.title} class="h-full w-full object-cover" />
									{:else}
										<div class="h-full w-full flex items-center justify-center bg-gray-100 text-6xl">📚</div>
									{/if}
									<div class="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-black shadow-sm" style="color: {brandColor}">
										{course.duration ? `${course.duration} Weeks` : 'Self-paced'}
									</div>
								</div>

								<div class="p-6 flex-1 flex flex-col">
									<h3 class={`${TEXT.h3} mb-2 line-clamp-1`}>{course.title}</h3>
									<p class={`${TEXT.small} ${COLOR.textMuted} mb-6 line-clamp-3`}>{course.description}</p>
									
									<div class="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-gray-50 dark:border-neutral-800">
										<div class="font-black" style="color: {brandColor}">
											{course.price === 0 ? 'FREE' : `Rp ${course.price.toLocaleString('id-ID')}`}
										</div>
										<a href={`/app/explore/${course.id}`} class={`px-4 py-2 ${RADIUS.button} bg-gray-900 text-white text-xs font-bold hover:bg-black transition-all`}>
											Lihat Detail
										</a>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		</div>
	</main>

	<!-- Footer -->
	<footer class="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 py-12">
		<div class="container mx-auto px-6 text-center">
			<div class="flex items-center justify-center gap-2 mb-4 opacity-50">
				<span class="text-sm font-bold tracking-widest uppercase">Powered by</span>
				<div class="h-6 w-px bg-gray-300"></div>
				<span class="font-black text-indigo-600">Naik Kelas LMS</span>
			</div>
			<p class="text-xs text-gray-400">© 2026 {organization.name}. Hak Cipta Dilindungi Undang-Undang.</p>
		</div>
	</footer>
</div>

<style>
	/* Subtle animations */
	.container {
		max-width: 1200px;
	}
</style>
