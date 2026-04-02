<script lang="ts">
	import type { PageData } from './$types';
	import PaymentProofUpload from '$lib/components/PaymentProofUpload.svelte';
	import { page } from '$app/stores';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	const selectedCourse = data.selectedCourseId
		? data.enrollments.find((e) => e.course.id === data.selectedCourseId)
		: null;

	const showSuccess = $page.url.searchParams.has('success');
	const paymentStatus = $page.url.searchParams.get('status');
	const orderId = $page.url.searchParams.get('orderId');

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	}

	function getStatusBadge(status: string | undefined) {
		switch (status) {
			case 'pending':
				return { label: 'Menunggu Verifikasi', class: COLOR.warningBg };
			case 'approved':
				return { label: 'Terverifikasi', class: COLOR.successBg };
			case 'rejected':
				return { label: 'Ditolak', class: COLOR.errorBg };
			default:
				return null;
		}
	}
</script>

<svelte:head>
	<title>Pembayaran - Naik Kelas</title>
	{#if data.midtransClientKey}
		<script
			src="https://app.sandbox.midtrans.com/snap/snap.js"
			data-client-key={data.midtransClientKey}
		></script>
	{/if}
</svelte:head>

<PageWrapper>
	<PageHeader title="Pembayaran" />

	{#if paymentStatus === 'success'}
		<PageSection>
			<div
				class={`${RADIUS.card} ${SPACING.cardPadding} ${COLOR.success} border ${COLOR.successBorder}`}
				role="alert"
			>
				<div class="flex items-start gap-4">
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900"
					>
						<svg
							class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<div>
						<p class={`${TEXT.h3} ${COLOR.textPrimary}`}>Pembayaran Berhasil!</p>
						<p class={`${TEXT.body} ${COLOR.textSecondary} mt-1`}>
							Pembayaran telah diproses. Silakan tunggu verifikasi dari admin untuk mengakses
							kursus.
						</p>
						{#if orderId}
							<p class={`mt-3 text-sm ${COLOR.textMuted}`}>
								Order ID: <span class="font-mono font-medium">{orderId}</span>
							</p>
						{/if}
					</div>
				</div>
			</div>
		</PageSection>
	{:else if paymentStatus === 'error'}
		<PageSection>
			<div
				class={`${RADIUS.card} ${SPACING.cardPadding} ${COLOR.error} border ${COLOR.errorBorder}`}
				role="alert"
			>
				<div class="flex items-start gap-4">
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900"
					>
						<svg
							class="h-5 w-5 text-rose-600 dark:text-rose-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<div>
						<p class={`${TEXT.h3} ${COLOR.textPrimary}`}>Pembayaran Gagal</p>
						<p class={`${TEXT.body} ${COLOR.textSecondary} mt-1`}>
							Terjadi masalah dengan pembayaran Anda. Silakan coba lagi atau gunakan metode transfer
							manual.
						</p>
					</div>
				</div>
			</div>
		</PageSection>
	{:else if paymentStatus === 'pending'}
		<PageSection>
			<div
				class={`${RADIUS.card} ${SPACING.cardPadding} ${COLOR.warning} border ${COLOR.warningBorder}`}
				role="alert"
			>
				<div class="flex items-start gap-4">
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900"
					>
						<svg
							class="h-5 w-5 text-amber-600 dark:text-amber-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div>
						<p class={`${TEXT.h3} ${COLOR.textPrimary}`}>Menunggu Pembayaran</p>
						<p class={`${TEXT.body} ${COLOR.textSecondary} mt-1`}>
							Pembayaran Anda sedang diproses. Silakan tunggu sebentar.
						</p>
					</div>
				</div>
			</div>
		</PageSection>
	{:else if showSuccess}
		<PageSection>
			<div
				class={`${RADIUS.card} ${SPACING.cardPadding} ${COLOR.success} border ${COLOR.successBorder}`}
				role="alert"
			>
				<div class="flex items-center gap-3">
					<svg
						class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<p class={`${TEXT.body} ${COLOR.textPrimary}`}>
						Bukti pembayaran berhasil diunggah. Admin akan memverifikasi segera.
					</p>
				</div>
			</div>
		</PageSection>
	{/if}

	{#if selectedCourse}
		<PageSection>
			<PaymentProofUpload
				courseId={selectedCourse.course.id}
				courseTitle={selectedCourse.course.title}
				existingProof={selectedCourse.paymentProof}
				midtransClientKey={data.midtransClientKey}
			/>
		</PageSection>
	{:else}
		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-5`}>Kursus Menunggu Pembayaran</h2>

			{#if data.enrollments.length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
					>
						<svg
							class="h-8 w-8 text-zinc-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<p class={`mb-4 ${COLOR.textSecondary}`}>Tidak ada kursus yang menunggu pembayaran</p>
					<a
						href="/app/learning/courses"
						class={`inline-flex items-center gap-2 ${COLOR.accent} ${TRANSITION.colors} hover:underline`}
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Kembali ke Kursus Saya
					</a>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					{#each data.enrollments as enrollment}
						{@const badge = getStatusBadge(enrollment.paymentProof?.status)}
						<div
							class={`enrollment-card group ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} p-6 transition-all ${ELEVATION.base} hover:${ELEVATION.cardHover}`}
						>
							<div class="mb-4 flex items-start justify-between">
								<h3 class={`${TEXT.h3} ${COLOR.textPrimary} line-clamp-2`}>
									{enrollment.course.title}
								</h3>
								{#if badge}
									<span
										class={`inline-block shrink-0 ${RADIUS.badge} px-2.5 py-1 ${TEXT.small} font-semibold ${badge.class}`}
									>
										{badge.label}
									</span>
								{/if}
							</div>

							<p class={`price mb-4 text-lg font-bold ${COLOR.accent}`}>
								{formatPrice(enrollment.course.price)}
							</p>

							{#if !enrollment.paymentProof}
								<p class={`mb-4 text-sm ${COLOR.textMuted}`}>Belum ada bukti pembayaran</p>
							{/if}

							<a
								href="/app/payments?courseId={enrollment.course.id}"
								class={`inline-flex w-full items-center justify-center gap-2 no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base} group-hover:${ELEVATION.cardHover}`}
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
									/>
								</svg>
								{enrollment.paymentProof ? 'Lihat Detail' : 'Bayar Sekarang'}
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</PageSection>
	{/if}
</PageWrapper>
