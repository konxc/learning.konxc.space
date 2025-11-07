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
</script>

<svelte:head>
	<title>Payment Proofs - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Bukti Pembayaran" />

	{#if showSuccess}
		<PageSection>
			<div
				class={`success-message ${RADIUS.button} ${SPACING.cardPadding} ${COLOR.success}`}
				role="alert"
			>
				Bukti pembayaran berhasil diupload! Admin akan meninjaunya.
			</div>
		</PageSection>
	{/if}

	{#if selectedCourse}
		<PageSection>
			<PaymentProofUpload
				courseId={selectedCourse.course.id}
				courseTitle={selectedCourse.course.title}
				existingProof={selectedCourse.paymentProof}
			/>
		</PageSection>
	{:else}
		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-5`}>Kursus yang Menunggu Pembayaran</h2>

			{#if data.enrollments.length === 0}
				<div class="text-center">
					<p class={`mb-4 ${COLOR.textSecondary}`}>Tidak ada kursus yang menunggu pembayaran</p>
					<a
						href="/dashboard/my-courses"
						class={`inline-flex items-center ${COLOR.accent} ${TRANSITION.colors} hover:underline`}
						>Kembali ke My Courses</a
					>
				</div>
			{:else}
				<div class="courses-grid grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					{#each data.enrollments as enrollment}
						<div
							class={`enrollment-card ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} p-6 ${ELEVATION.base}`}
						>
							<h3 class={`${TEXT.h2} ${COLOR.textPrimary} mb-3`}>{enrollment.course.title}</h3>
							<p class={`price ${COLOR.textSecondary} mb-4`}>
								Harga: Rp {enrollment.course.price.toLocaleString('id-ID')}
							</p>

							{#if enrollment.paymentProof}
								<div class="proof-status mb-4">
									{#if enrollment.paymentProof.status === 'pending'}
										<span
											class={`badge pending px-3 py-1 ${RADIUS.badge} ${TEXT.small} font-semibold ${COLOR.warningBg}`}
											>Sedang ditinjau</span
										>
									{:else if enrollment.paymentProof.status === 'approved'}
										<span
											class={`badge approved px-3 py-1 ${RADIUS.badge} ${TEXT.small} font-semibold ${COLOR.successBg}`}
											>Disetujui</span
										>
									{:else}
										<span
											class={`badge rejected px-3 py-1 ${RADIUS.badge} ${TEXT.small} font-semibold ${COLOR.errorBg}`}
											>Ditolak</span
										>
									{/if}
								</div>
							{/if}

							<a
								href="/dashboard/payments?courseId={enrollment.course.id}"
								class={`inline-flex w-full items-center justify-center no-underline ${RADIUS.button} ${COLOR.accentBg} text-white ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${ELEVATION.base} ${ELEVATION.hover}`}
							>
								{enrollment.paymentProof ? 'Upload Ulang' : 'Upload Bukti Pembayaran'}
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</PageSection>
	{/if}
</PageWrapper>
