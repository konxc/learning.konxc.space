<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { formatDateTime } from '$lib/utils/format';

	let { data }: { data: PageData } = $props();

	let expandedProof = $state(false);
	let imageCache: Map<string, string> = $state(new Map());
	let rejectionNotes = $state('');

	const proof = data.proof;

	async function loadProofImage() {
		if (imageCache.has(proof.id)) {
			return imageCache.get(proof.id)!;
		}

		// Fetch image data
		const response = await fetch(`/dashboard/admin/payments/${proof.id}/image`);
		const imageData = await response.json();
		const imageUrl = `data:${imageData.mime};base64,${imageData.dataBase64}`;

		imageCache.set(proof.id, imageUrl);
		return imageUrl;
	}

	function formatPrice(price: number): string {
		return `Rp ${price.toLocaleString('id-ID')}`;
	}

	async function handleApprove() {
		const formData = new FormData();
		formData.append('proofId', proof.id);

		const response = await fetch('?/approve', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			toast.success('Pembayaran disetujui');
			await goto('/dashboard/admin/payments', { invalidateAll: true });
		} else {
			toast.error('Gagal menyetujui');
		}
	}

	async function handleReject() {
		const formData = new FormData();
		formData.append('proofId', proof.id);
		formData.append('notes', rejectionNotes);

		const response = await fetch('?/reject', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			toast.info('Pembayaran ditolak');
			await goto('/dashboard/admin/payments', { invalidateAll: true });
		} else {
			toast.error('Gagal menolak');
		}
	}
</script>

<svelte:head>
	<title>View Payment Proof - Admin</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Detail Bukti Pembayaran"
		description="Verifikasi bukti pembayaran dan tentukan keputusan"
	/>

	<PageSection>
		<div class="space-y-6">
			<!-- Proof Info -->
			<div class="space-y-4">
				<div>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>{proof.course.title}</h3>
					<p class={TEXT.secondary}>
						<strong>User:</strong> {proof.user.fullName || proof.user.username} ({proof.user.email})
					</p>
					<p class={TEXT.secondary}>
						<strong>Harga:</strong> {formatPrice(proof.course.price)}
					</p>
					<p class={TEXT.secondary}>
						<strong>Status:</strong> <span class="font-semibold">{proof.status}</span>
					</p>
					<p class={TEXT.secondary}>
						<strong>Upload:</strong> {formatDateTime(proof.createdAt)}
					</p>
					{#if proof.notes}
						<p class={TEXT.secondary}>
							<strong>Catatan:</strong> {proof.notes}
						</p>
					{/if}
				</div>
			</div>

			<!-- Proof Image -->
			<div>
				<button
					type="button"
					onclick={() => {
						expandedProof = !expandedProof;
						if (expandedProof) {
							loadProofImage();
						}
					}}
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${COLOR.card} ${TRANSITION.colors} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2`}
				>
					{expandedProof ? 'Sembunyikan' : 'Lihat Bukti Pembayaran'}
				</button>

				{#if expandedProof}
					<div class={`mt-4 ${RADIUS.small} overflow-hidden`}>
						{#await loadProofImage() then imageUrl}
							<img
								src={imageUrl}
								alt="Bukti pembayaran"
								class="w-full h-auto"
								loading="lazy"
								decoding="async"
							/>
						{/await}
					</div>
				{/if}
			</div>

			<!-- Actions -->
			{#if proof.status === 'pending'}
				<div class="flex flex-col gap-4 border-t border-gray-200 pt-6 dark:border-neutral-800">
					<button
						type="button"
						onclick={handleApprove}
						class={`inline-flex items-center justify-center ${RADIUS.button} bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/70 focus-visible:ring-offset-2`}
					>
						Setujui Pembayaran
					</button>

					<div class="flex flex-col gap-2">
						<input
							type="text"
							placeholder="Catatan penolakan (opsional)"
							value={rejectionNotes}
							oninput={(e) => {
								rejectionNotes = (e.target as HTMLInputElement).value;
							}}
							class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.button} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
						<button
							type="button"
							onclick={handleReject}
							class={`inline-flex items-center justify-center ${RADIUS.button} bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600/70 focus-visible:ring-offset-2`}
						>
							Tolak Pembayaran
						</button>
					</div>
				</div>
			{/if}

			<!-- Back Button -->
			<div>
				<a
					href="/dashboard/admin/payments"
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${TRANSITION.colors} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2`}
				>
					← Kembali ke daftar
				</a>
			</div>
		</div>
	</PageSection>
</PageWrapper>

