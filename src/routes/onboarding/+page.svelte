<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { COLOR, RADIUS, TEXT, TRANSITION, SPACING, GRADIENT, ELEVATION } from '$lib/config/design';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import AuthMessage from '$lib/components/AuthMessage.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data, form }: { data: PageData; form: any } = $props();

	let selectedCourse = $state<any>(null);
	let couponCode = $state('');
	let finalPrice = $state<number | null>(null);
	let discountAmount = $state(0);
	let couponValidated = $state(false);
	let couponError = $state<string | null>(null);
	let isApplying = $state(false);

	async function handleValidateCoupon() {
		if (!selectedCourse || !couponCode) return;

		isApplying = true;
		couponError = null;

		const formData = new FormData();
		formData.append('couponCode', couponCode);
		formData.append('courseId', selectedCourse.id);

		try {
			const response = await fetch('?/validateCoupon', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.type === 'failure') {
				const failure = result.data ?? {};
				const failureData = failure.data ?? {};
				couponError = failure.message || failure.error || 'Kupon tidak valid';
				couponValidated = false;
				finalPrice = failureData.finalPrice ?? selectedCourse.price;
				discountAmount = failureData.discountAmount ?? 0;
			} else {
				const payload = result.data?.data ?? {};
				couponValidated = payload.isValid ?? true;
				finalPrice = payload.finalPrice ?? selectedCourse.price;
				discountAmount = payload.discountAmount ?? 0;
			}
		} catch (err) {
			couponError = 'Gagal memvalidasi kupon';
			couponValidated = false;
		} finally {
			isApplying = false;
		}
	}
</script>

<svelte:head>
	<title>Pathfinder Onboarding - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-5xl">
		<main class="space-y-12 py-12">
			<!-- Role-Based Pathfinder Header -->
			<header class="text-center space-y-4">
				<div class="inline-flex h-7 items-center gap-2 px-3 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/10">
					<Icon name="sparkle" size={13} strokeWidth={2.5} />
					<span class={`${TEXT.small} font-bold leading-none translate-y-[0.5px]`}>Onboarding Pathfinder</span>
				</div>
				
				{#if data.role === 'mentor'}
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>Selamat Datang, Expert Mentor! 🎓</h1>
					<p class={`${TEXT.secondary} max-w-2xl mx-auto`}>
						Lengkapi aktivasi akademi kamu untuk mulai membagikan ilmu dan membimbing generasi digital masa depan.
					</p>
				{:else if data.role === 'facilitator'}
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>Halo, Learning Facilitator! 👋</h1>
					<p class={`${TEXT.secondary} max-w-2xl mx-auto`}>
						Siapkan pusat fasilitasi kamu untuk mendampingi setiap batch dalam perjalanan transformasi digital mereka.
					</p>
				{:else}
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>Selamat Datang di Naik Kelas! 🚀</h1>
					<p class={`${TEXT.secondary} max-w-2xl mx-auto`}>
						Pilih jalur belajar pertama kamu untuk memulai petualangan transformasi digital yang berdampak nyata.
					</p>
				{/if}
			</header>

			{#if form?.error}
				<AuthMessage type="error" message={form.error} />
			{/if}

			{#if data.role === 'mentor'}
				<!-- Mentor Onboarding Node -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div class={`md:col-span-2 space-y-6`}>
						<div class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} space-y-8`}>
							<div class="space-y-2">
								<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Aktivasi Akademi Expert</h2>
								<p class={TEXT.secondary}>Konfigurasi profil mentor kamu untuk visibilitas maksimal.</p>
							</div>

							<div class="grid grid-cols-1 gap-6">
								<div class="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
									<div class="h-10 w-10 shrink-0 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
										<Icon name="user" size={20} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Verifikasi Profil</h4>
										<p class={TEXT.muted}>Pastikan nama lengkap dan bio kamu sudah sesuai dengan kualifikasi profesional.</p>
									</div>
								</div>
								
								<div class="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
									<div class="h-10 w-10 shrink-0 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
										<Icon name="graduation" size={20} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Keahlian & Portfolio</h4>
										<p class={TEXT.muted}>Tampilkan keahlian teknis kamu untuk membangun kepercayaan dengan calon siswa.</p>
									</div>
								</div>
							</div>

							<form method="POST" action="?/completeOnboarding" use:enhance>
								<AuthSubmitButton text="Aktifkan Dashboard Mentor" />
							</form>
						</div>
					</div>

					<aside class="space-y-6">
						<div class={`${RADIUS.card} ${GRADIENT.primary} p-8 text-white space-y-4 shadow-xl`}>
							<Icon name="info" size={32} />
							<h4 class={TEXT.h4}>Kenapa Mentor?</h4>
							<p class="text-sm opacity-80 leading-relaxed font-medium">
								Sebagai Mentor di Naik Kelas, Anda memiliki akses ke alat analisis performa siswa dan manajemen kurikulum yang canggih.
							</p>
						</div>
					</aside>
				</div>

			{:else if data.role === 'facilitator'}
				<!-- Facilitator Onboarding Node -->
				<div class="mx-auto max-w-2xl">
					<div class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} space-y-8 text-center`}>
						<div class="h-20 w-20 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
							<Icon name="users" size={40} />
						</div>
						
						<div class="space-y-2">
							<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Kesiapan Fasilitasi</h2>
							<p class={TEXT.secondary}>Pusat kendali fasilitasi kamu hampir siap digunakan.</p>
						</div>

						<p class={`${TEXT.body} ${COLOR.textSecondary}`}>
							Anda akan membimbing kelompok belajar (batch) melalui materi yang disediakan oleh Expert Mentor. Pastikan Anda siap memberikan pendampingan intensif.
						</p>

						<form method="POST" action="?/completeOnboarding" use:enhance>
							<AuthSubmitButton text="Buka Dashboard Fasilitator" />
						</form>
					</div>
				</div>

			{:else}
				<!-- Student (User) Onboarding Node -->
				<div class="space-y-8">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each data.courses as course}
							<button 
								class={`group text-left ${RADIUS.card} border-2 ${COLOR.card} ${SPACING.cardPadding} ${TRANSITION.all} relative overflow-hidden
								${selectedCourse?.id === course.id ? 'border-blue-600 ring-4 ring-blue-500/10' : 'border-zinc-200/50 dark:border-zinc-800/50 hover:border-blue-500/30'}`}
								onclick={() => {
									selectedCourse = course;
									finalPrice = course.price;
									couponValidated = false;
									couponCode = '';
									couponError = null;
									discountAmount = 0;
								}}
							>
								{#if selectedCourse?.id === course.id}
									<div class="absolute top-4 right-4 text-blue-600 bg-blue-50 rounded-full p-1">
										<Icon name="check" size={16} />
									</div>
								{/if}

								<div class="space-y-4">
									<div class="space-y-2">
										<h3 class={`${TEXT.h4} ${COLOR.textPrimary} group-hover:text-blue-600 transition-colors`}>{course.title}</h3>
										<p class={`${TEXT.muted} line-clamp-3 text-sm`}>{course.description}</p>
									</div>
									<div class="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-end">
										<div>
											<p class={TEXT.small}>Mulai dari</p>
											<p class="text-xl font-black text-blue-600">Rp {course.price.toLocaleString('id-ID')}</p>
										</div>
										<Icon name="arrow-right" size={20} class="text-zinc-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
									</div>
								</div>
							</button>
						{/each}
					</div>

					{#if selectedCourse}
						<div class="animate-in fade-in slide-in-from-bottom-5 duration-700">
							<div class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} space-y-8 max-w-2xl mx-auto shadow-2xl`}>
								<div class="flex items-center gap-4">
									<div class="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
										<Icon name="cart" size={24} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Checkout Jalur Belajar</h4>
										<p class={TEXT.muted}>{selectedCourse.title}</p>
									</div>
								</div>

								<div class="space-y-6">
									<div class="space-y-3">
										<label for="couponCode" class={`${TEXT.small} font-black text-zinc-500`}>Punya Kode Kupon? (Opsional)</label>
										<div class="flex gap-3">
											<input
												type="text"
												id="couponCode"
												bind:value={couponCode}
												placeholder="Masukkan kode kupon"
												class={`flex-1 ${SPACING.input} ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 dark:bg-zinc-800/50 outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
											/>
											<button
												type="button"
												onclick={handleValidateCoupon}
												class={`px-6 ${RADIUS.button} bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-all disabled:opacity-50`}
												disabled={isApplying || !couponCode}
											>
												{isApplying ? '...' : 'Gunakan'}
											</button>
										</div>
										{#if couponError}
											<p class="text-xs text-rose-500 font-semibold">{couponError}</p>
										{/if}
									</div>

									<div class={`p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 space-y-4`}>
										<div class="flex justify-between text-sm font-medium">
											<span class={COLOR.textSecondary}>Harga Awal</span>
											<span class={COLOR.textPrimary}>Rp {selectedCourse.price.toLocaleString('id-ID')}</span>
										</div>
										
										{#if couponValidated && discountAmount > 0}
											<div class="flex justify-between text-sm font-bold text-emerald-600">
												<span>Potongan Kupon</span>
												<span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
											</div>
										{/if}

										<div class="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
											<span class="text-base font-black uppercase tracking-tighter">Total Investasi</span>
											<span class="text-2xl font-black text-blue-600">Rp {finalPrice?.toLocaleString('id-ID')}</span>
										</div>
									</div>

									<form method="POST" action="?/enroll" use:enhance>
										<input type="hidden" name="courseId" value={selectedCourse.id} />
										<input type="hidden" name="couponCode" value={couponCode} />
										<AuthSubmitButton text="Mulai Belajar Sekarang" />
									</form>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</main>
	</div>
</PageWrapper>

<style>
	:global(.onboarding-container) {
		perspective: 1000px;
	}
</style>
