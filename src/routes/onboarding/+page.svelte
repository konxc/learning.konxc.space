<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import {
		COLOR,
		RADIUS,
		TEXT,
		TRANSITION,
		SPACING,
		GRADIENT,
		ELEVATION
	} from '$lib/config/design';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import AuthMessage from '$lib/components/AuthMessage.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data, form }: { data: PageData; form: any } = $props();

	// Course selection state
	let selectedCourse = $state<any>(null);
	let selectedTrack = $state<string | null>(null);

	// Coupon state
	let couponCode = $state('');
	let finalPrice = $state<number | null>(null);
	let discountAmount = $state(0);
	let couponValidated = $state(false);
	let couponError = $state<string | null>(null);
	let isApplying = $state(false);

	// Facilitator organization selection - auto-select if invited
	let selectedOrganization = $state<string | null>(data.invitedOrgId ?? null);

	// Check if this is an invitation flow
	let isInvitationFlow = $derived(!!data.invitedOrgId);

	// Track options
	const trackOptions = [
		{
			id: 'creator',
			name: 'Content Creator',
			icon: '🎬',
			description: 'Buat konten & bangun audience'
		},
		{
			id: 'seller',
			name: 'E-Commerce Seller',
			icon: '🛒',
			description: 'Jual produk & optimasi marketplace'
		},
		{
			id: 'affiliate',
			name: 'Affiliate Pro',
			icon: '🔗',
			description: 'Komisi pasif dari rekomendasi'
		}
	];

	// Simplified coupon response handling
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
			const isSuccess = result.type === 'success';
			const payload = result.data?.data ?? result.data ?? {};

			if (isSuccess && payload.isValid) {
				couponValidated = true;
				finalPrice = payload.finalPrice ?? selectedCourse.price;
				discountAmount = payload.discountAmount ?? 0;
			} else {
				couponValidated = false;
				couponError = payload.error || 'Kupon tidak valid';
				finalPrice = payload.finalPrice ?? selectedCourse.price;
				discountAmount = 0;
			}
		} catch {
			couponError = 'Gagal memvalidasi kupon';
			couponValidated = false;
		} finally {
			isApplying = false;
		}
	}

	// Check if course has tracks enabled
	function hasTrackSelection(course: any): boolean {
		return course?.featuresConfig?.tracks === true;
	}
</script>

<svelte:head>
	<title>Pathfinder Onboarding - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-5xl">
		<main class="space-y-12 py-12">
			<!-- Role-Based Pathfinder Header -->
			<header class="space-y-4 text-center">
				<div
					class="inline-flex h-7 items-center gap-2 rounded-full border border-blue-500/10 bg-blue-500/10 px-3 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
				>
					<Icon name="sparkle" size={13} strokeWidth={2.5} />
					<span class={`${TEXT.small} translate-y-[0.5px] leading-none font-bold`}
						>{isInvitationFlow ? 'Undangan Diterima' : 'Onboarding Pathfinder'}</span
					>
				</div>

				{#if data.role === 'mentor'}
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>Selamat Datang, Expert Mentor! 🎓</h1>
					<p class={`${TEXT.secondary} mx-auto max-w-2xl`}>
						{isInvitationFlow
							? `Anda telah diundang untuk menjadi mentor. Lengkapi aktivasi akademi kamu untuk mulai membagikan ilmu.`
							: 'Lengkapi aktivasi akademi kamu untuk mulai membagikan ilmu dan membimbing generasi digital masa depan.'}
					</p>
				{:else if data.role === 'facilitator'}
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>
						{isInvitationFlow ? 'Undangan Diterima! 👋' : 'Halo, Learning Facilitator! 👋'}
					</h1>
					<p class={`${TEXT.secondary} mx-auto max-w-2xl`}>
						{isInvitationFlow
							? 'Anda telah diundang untuk menjadi fasilitator. Aktivasi akun untuk mulai mendampingi.'
							: 'Siapkan pusat fasilitasi kamu untuk mendampingi setiap batch dalam perjalanan transformasi digital mereka.'}
					</p>
				{:else}
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>Selamat Datang di Naik Kelas! 🚀</h1>
					<p class={`${TEXT.secondary} mx-auto max-w-2xl`}>
						Pilih jalur belajar pertama kamu untuk memulai petualangan transformasi digital yang
						berdampak nyata.
					</p>
				{/if}
			</header>

			{#if form?.error}
				<AuthMessage type="error" message={form.error} />
			{/if}

			{#if data.role === 'mentor'}
				<!-- Mentor Onboarding Node -->
				<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
					<div class={`space-y-6 md:col-span-2`}>
						<div
							class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} space-y-8`}
						>
							<div class="space-y-2">
								{#if isInvitationFlow}
									<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>
										Selamat Datang, Expert Mentor! Undangan Diterima
									</h2>
									<p class={TEXT.secondary}>
										Anda telah diundang untuk menjadi mentor di {data.organizations[0]?.name}.
										Lengkapi profil untuk memulai.
									</p>
								{:else}
									<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Aktivasi Akademi Expert</h2>
									<p class={TEXT.secondary}>
										Konfigurasi profil mentor kamu untuk visibilitas maksimal.
									</p>
								{/if}
							</div>

							<div class="grid grid-cols-1 gap-6">
								<div class="flex items-start gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-500"
									>
										<Icon name="user" size={20} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Verifikasi Profil</h4>
										<p class={TEXT.muted}>Lengkapi nama lengkap, bio, dan foto profil kamu.</p>
									</div>
								</div>

								<div class="flex items-start gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-500"
									>
										<Icon name="graduation" size={20} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Keahlian & Portfolio</h4>
										<p class={TEXT.muted}>
											Tambahkan keahlian, pengalaman, dan link portfolio kamu.
										</p>
									</div>
								</div>

								<div class="flex items-start gap-4 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-500"
									>
										<Icon name="settings" size={20} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Preferensi Mentor</h4>
										<p class={TEXT.muted}>
											Atur preferensi notifikasi dan metode pembayaran komisi.
										</p>
									</div>
								</div>
							</div>

							<form method="POST" action="?/redirectToSettings" use:enhance>
								<AuthSubmitButton text="Lengkapi Profil di Settings" />
							</form>
						</div>
					</div>

					<aside class="space-y-6">
						<div class={`${RADIUS.card} ${GRADIENT.primary} space-y-4 p-8 text-white shadow-xl`}>
							<Icon name="info" size={32} />
							<h4 class={TEXT.h4}>Kenapa Mentor?</h4>
							<p class="text-sm leading-relaxed font-medium opacity-80">
								Sebagai Mentor di Naik Kelas, Anda memiliki akses ke alat analisis performa siswa
								dan manajemen kurikulum yang canggih.
							</p>
						</div>
					</aside>
				</div>
			{:else if data.role === 'facilitator'}
				<!-- Facilitator Onboarding Node -->
				<div class="mx-auto max-w-2xl">
					<div
						class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} space-y-8`}
					>
						<div class="text-center">
							<div
								class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500"
							>
								<Icon name="users" size={40} />
							</div>

							<div class="space-y-2">
								{#if isInvitationFlow}
									<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>
										Selamat Datang! Undangan Diterima
									</h2>
									<p class={TEXT.secondary}>
										Anda telah diundang untuk menjadi fasilitator di {data.organizations[0]?.name}.
									</p>
								{:else}
									<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Kesiapan Fasilitasi</h2>
									<p class={TEXT.secondary}>Pusat kendali fasilitasi kamu hampir siap digunakan.</p>
								{/if}
							</div>
						</div>

						{#if isInvitationFlow}
							<!-- Invitation Flow: Show selected organization -->
							<div
								class={`${RADIUS.card} border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20`}
							>
								<div class="flex items-center gap-3">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600"
									>
										<Icon name="building" size={20} />
									</div>
									<div>
										<p class="text-sm font-medium text-emerald-800 dark:text-emerald-200">
											Organisasi:
										</p>
										<p class="font-bold text-emerald-900 dark:text-emerald-100">
											{data.organizations[0]?.name}
										</p>
									</div>
								</div>
							</div>
						{:else}
							<!-- Regular Flow: Organization selection -->
							<p class={`${TEXT.body} ${COLOR.textSecondary} text-center`}>
								Anda akan membimbing kelompok belajar (batch) melalui materi yang disediakan oleh
								Expert Mentor. Pilih organisasi yang ingin Anda fasilitasi.
							</p>

							<!-- Organization Selection -->
							{#if data.organizations && data.organizations.length > 0}
								<div class="space-y-3">
									<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>Pilih Organisasi</p>
									<div class="grid grid-cols-1 gap-3">
										{#each data.organizations as org}
											<button
												type="button"
												class={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
													selectedOrganization === org.id
														? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10 dark:bg-emerald-900/20'
														: 'border-zinc-200 hover:border-emerald-500/30 dark:border-zinc-700 dark:hover:border-emerald-500/30'
												}`}
												onclick={() => (selectedOrganization = org.id)}
											>
												<div
													class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"
												>
													<Icon name="building" size={20} />
												</div>
												<div class="flex-1">
													<h4 class="font-bold">{org.name}</h4>
													<p class="text-xs text-zinc-500">/{org.slug}</p>
												</div>
												{#if selectedOrganization === org.id}
													<Icon name="check" size={20} class="text-emerald-500" />
												{/if}
											</button>
										{/each}
									</div>
								</div>
							{/if}
						{/if}

						<form method="POST" action="?/completeOnboarding" use:enhance>
							<input type="hidden" name="organizationId" value={selectedOrganization ?? ''} />
							<AuthSubmitButton
								text="Buka Dashboard Fasilitator"
								disabled={!selectedOrganization}
							/>
						</form>
					</div>
				</div>
			{:else}
				<!-- Student (User) Onboarding Node -->
				<div class="space-y-8">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{#each data.courses as course}
							<button
								class={`group text-left ${RADIUS.card} border-2 ${COLOR.card} ${SPACING.cardPadding} ${TRANSITION.all} relative overflow-hidden
								${selectedCourse?.id === course.id ? 'border-blue-600 ring-4 ring-blue-500/10' : 'border-zinc-200/50 hover:border-blue-500/30 dark:border-zinc-800/50'}`}
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
									<div class="absolute top-4 right-4 rounded-full bg-blue-50 p-1 text-blue-600">
										<Icon name="check" size={16} />
									</div>
								{/if}

								<div class="space-y-4">
									<div class="space-y-2">
										<h3
											class={`${TEXT.h4} ${COLOR.textPrimary} transition-colors group-hover:text-blue-600`}
										>
											{course.title}
										</h3>
										<p class={`${TEXT.muted} line-clamp-3 text-sm`}>{course.description}</p>
									</div>
									<div
										class="flex items-end justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800"
									>
										<div>
											<p class={TEXT.small}>Mulai dari</p>
											<p class="text-xl font-black text-blue-600">
												Rp {course.price.toLocaleString('id-ID')}
											</p>
										</div>
										<Icon
											name="arrow-right"
											size={20}
											class="text-zinc-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500"
										/>
									</div>
								</div>
							</button>
						{/each}
					</div>

					{#if selectedCourse}
						<div class="animate-in fade-in slide-in-from-bottom-5 duration-700">
							<div
								class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} mx-auto max-w-2xl space-y-8 shadow-2xl`}
							>
								<div class="flex items-center gap-4">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white"
									>
										<Icon name="cart" size={24} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Checkout Jalur Belajar</h4>
										<p class={TEXT.muted}>{selectedCourse.title}</p>
									</div>
								</div>

								<div class="space-y-6">
									<!-- Track Selection (only for courses with tracks enabled) -->
									{#if hasTrackSelection(selectedCourse)}
										<div class="space-y-3">
											<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
												Pilih Jalur Spesialisasi
											</p>
											<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
												{#each trackOptions as track}
													<button
														type="button"
														class={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
															selectedTrack === track.id
																? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/10 dark:bg-blue-900/20'
																: 'border-zinc-200 hover:border-blue-500/30 dark:border-zinc-700 dark:hover:border-blue-500/30'
														}`}
														onclick={() => (selectedTrack = track.id)}
													>
														<span class="text-2xl">{track.icon}</span>
														<div>
															<p class="text-sm font-bold">{track.name}</p>
															<p class="text-xs text-zinc-500">{track.description}</p>
														</div>
														{#if selectedTrack === track.id}
															<Icon
																name="check"
																size={16}
																class="absolute top-2 right-2 text-blue-500"
															/>
														{/if}
													</button>
												{/each}
											</div>
										</div>
									{/if}
									<div class="space-y-3">
										<label for="couponCode" class={`${TEXT.small} font-black text-zinc-500`}
											>Punya Kode Kupon? (Opsional)</label
										>
										<div class="flex gap-3">
											<input
												type="text"
												id="couponCode"
												bind:value={couponCode}
												placeholder="Masukkan kode kupon"
												class={`flex-1 ${SPACING.input} ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 outline-hidden transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-zinc-800/50`}
											/>
											<button
												type="button"
												onclick={handleValidateCoupon}
												class={`px-6 ${RADIUS.button} bg-zinc-900 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50`}
												disabled={isApplying || !couponCode}
											>
												{isApplying ? '...' : 'Gunakan'}
											</button>
										</div>
										{#if couponError}
											<p class="text-xs font-semibold text-rose-500">{couponError}</p>
										{/if}
									</div>

									<div class={`space-y-4 rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900/50`}>
										<div class="flex justify-between text-sm font-medium">
											<span class={COLOR.textSecondary}>Harga Awal</span>
											<span class={COLOR.textPrimary}
												>Rp {selectedCourse.price.toLocaleString('id-ID')}</span
											>
										</div>

										{#if couponValidated && discountAmount > 0}
											<div class="flex justify-between text-sm font-bold text-emerald-600">
												<span>Potongan Kupon</span>
												<span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
											</div>
										{/if}

										<div
											class="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800"
										>
											<span class="text-base font-black tracking-tighter uppercase"
												>Total Investasi</span
											>
											<span class="text-2xl font-black text-blue-600"
												>Rp {finalPrice?.toLocaleString('id-ID')}</span
											>
										</div>
									</div>

									<form method="POST" action="?/enroll" use:enhance>
										<input type="hidden" name="courseId" value={selectedCourse.id} />
										<input type="hidden" name="couponCode" value={couponCode} />
										<input type="hidden" name="track" value={selectedTrack ?? ''} />
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
