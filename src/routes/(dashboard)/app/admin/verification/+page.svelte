<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { enhance } from '$app/forms';
	import {
		COLOR,
		RADIUS,
		TEXT,
		SPACING,
		ELEVATION,
		ACTION,
		MODAL,
		TABLE,
		STATUS
	} from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let activeTab = $state<'ktp' | 'org'>('ktp');
	let rejectReason = $state('');
	let showRejectModal = $state(false);
	let rejectTargetId = $state('');
	let rejectType = $state<'ktp' | 'org'>('ktp');
	let processedFormKey = $state('');

	// Show form errors/success as toasts (with guard to prevent re-trigger on navigation)
	$effect(() => {
		const key = `${form?.error ?? ''}${form?.success ?? ''}${form?.message ?? ''}`;
		if (!key || key === processedFormKey) return;
		processedFormKey = key;
		if (form?.error) {
			toast.error(form.error);
		}
		if (form?.success && form?.message) {
			const type = (form as any).toastType;
			if (type === 'info') {
				toast.info(form.message);
			} else {
				toast.success(form.message);
			}
		}
	});

	function formatDate(date: Date | string | null) {
		if (!date) return '-';
		return new Date(date).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function openRejectModal(id: string, type: 'ktp' | 'org') {
		rejectTargetId = id;
		rejectType = type;
		rejectReason = '';
		showRejectModal = true;
	}
</script>

<svelte:head>
	<title>Admin Verification Queue - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Verification Queue"
		description="Review and approve KTP and organization verifications."
	/>

	<!-- Stats -->
	<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}>
			<p class={`text-sm ${COLOR.textMuted}`}>Pending KTP</p>
			<p class={`text-2xl font-bold ${TABLE.accentTextAmber}`}>{data.pendingKtp.length}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}>
			<p class={`text-sm ${COLOR.textMuted}`}>Pending Org</p>
			<p class={`text-2xl font-bold ${TABLE.accentText}`}>{data.pendingOrgs.length}</p>
		</div>
	</div>

	<!-- Tabs -->
	<div class="mb-6 flex gap-2">
		<button
			class={`${RADIUS.small} px-4 py-2 font-medium transition-colors ${activeTab === 'ktp' ? `${STATUS.warning.bg} ${STATUS.warning.text}` : `${COLOR.neutral} ${COLOR.textSecondary} ${COLOR.neutralHover}`}`}
			onclick={() => (activeTab = 'ktp')}
		>
			<div class="flex items-center gap-2">
				<Icon name="credit-card" size={16} />
				<span>KTP Verification ({data.pendingKtp.length})</span>
			</div>
		</button>
		<button
			class={`${RADIUS.small} px-4 py-2 font-medium transition-colors ${activeTab === 'org' ? `${STATUS.info.bg} ${STATUS.info.text}` : `${COLOR.neutral} ${COLOR.textSecondary} ${COLOR.neutralHover}`}`}
			onclick={() => (activeTab = 'org')}
		>
			<div class="flex items-center gap-2">
				<Icon name="building" size={16} />
				<span>Org Verification ({data.pendingOrgs.length})</span>
			</div>
		</button>
	</div>

	<!-- KTP Verification Tab -->
	{#if activeTab === 'ktp'}
		<div class="space-y-4">
			{#if data.pendingKtp.length === 0}
				<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-8 text-center`}>
					<Icon name="check-circle" size={48} class={`mx-auto mb-4 ${STATUS.success.text}`} />
					<p class={COLOR.textMuted}>Tidak ada verifikasi KTP yang pending</p>
				</div>
			{:else}
				{#each data.pendingKtp as verification}
					<div
						class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${SPACING.cardPadding} ${ELEVATION.card}`}
					>
						<div class="flex flex-col gap-4 md:flex-row md:items-start">
							<!-- User Info -->
							<div class="flex-1">
								<div class="flex items-center gap-3">
									<div
										class={`flex h-12 w-12 items-center justify-center rounded-full ${COLOR.neutral}`}
									>
										<Icon name="user" size={24} class={COLOR.textMuted} />
									</div>
									<div>
										<h4 class="font-bold">
											{verification.ktpName || verification.user?.fullName || 'Unknown'}
										</h4>
										<p class={`text-sm ${COLOR.textMuted}`}>{verification.user?.email}</p>
									</div>
								</div>
								<div class="mt-4 grid grid-cols-2 gap-4 text-sm">
									<div>
										<span class={COLOR.textMuted}>NIK:</span>
										<span class="ml-2 font-mono">{verification.ktpNumber}</span>
									</div>
									<div>
										<span class={COLOR.textMuted}>Tgl Lahir:</span>
										<span class="ml-2">{formatDate(verification.ktpDob)}</span>
									</div>
									<div class="col-span-2">
										<span class={COLOR.textMuted}>Alamat:</span>
										<span class="ml-2">{verification.ktpAddress}</span>
									</div>
									<div class="col-span-2">
										<span class={COLOR.textMuted}>Submitted:</span>
										<span class="ml-2">{formatDate(verification.createdAt)}</span>
									</div>
								</div>
							</div>

							<!-- Photos -->
							<div class="flex gap-4">
								<div>
									<p class={`mb-1 text-xs font-medium ${COLOR.textMuted}`}>Foto KTP</p>
									{#if verification.ktpPhotoUrl}
										<img
											src={verification.ktpPhotoUrl}
											alt="KTP"
											class="h-24 w-36 rounded-lg border object-cover"
										/>
									{:else}
										<div
											class={`flex h-24 w-36 items-center justify-center rounded-lg ${COLOR.neutral}`}
										>
											<Icon name="image" size={24} class={COLOR.textMuted} />
										</div>
									{/if}
								</div>
								<div>
									<p class={`mb-1 text-xs font-medium ${COLOR.textMuted}`}>Selfie + KTP</p>
									{#if verification.selfieWithKtpUrl}
										<img
											src={verification.selfieWithKtpUrl}
											alt="Selfie"
											class="h-24 w-36 rounded-lg border object-cover"
										/>
									{:else}
										<div
											class={`flex h-24 w-36 items-center justify-center rounded-lg ${COLOR.neutral}`}
										>
											<Icon name="image" size={24} class={COLOR.textMuted} />
										</div>
									{/if}
								</div>
							</div>

							<!-- Actions -->
							<div class="flex flex-col gap-2">
								<form method="POST" action="?/approveKtp" use:enhance>
									<input type="hidden" name="verificationId" value={verification.id} />
									<button
										type="submit"
										class={`flex w-full items-center justify-center gap-2 ${RADIUS.small} ${ACTION.approve} px-4 py-2 font-bold`}
									>
										<Icon name="check" size={16} />
										Approve
									</button>
								</form>
								<button
									type="button"
									class={`flex w-full items-center justify-center gap-2 ${RADIUS.small} ${ACTION.reject} px-4 py-2 font-bold`}
									onclick={() => openRejectModal(verification.id, 'ktp')}
								>
									<Icon name="x" size={16} />
									Reject
								</button>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}

	<!-- Organization Verification Tab -->
	{#if activeTab === 'org'}
		<div class="space-y-4">
			{#if data.pendingOrgs.length === 0}
				<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-8 text-center`}>
					<Icon name="check-circle" size={48} class={`mx-auto mb-4 ${STATUS.success.text}`} />
					<p class={COLOR.textMuted}>Tidak ada verifikasi organisasi yang pending</p>
				</div>
			{:else}
				{#each data.pendingOrgs as verification}
					<div
						class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${SPACING.cardPadding} ${ELEVATION.card}`}
					>
						<div class="flex flex-col gap-4 md:flex-row md:items-start">
							<!-- Org Info -->
							<div class="flex-1">
								<div class="flex items-center gap-3">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-full text-white"
										style="background-color: {verification.organization?.brandColor || '#4f46e5'}"
									>
										<Icon name="building" size={24} />
									</div>
									<div>
										<h4 class="font-bold">
											{verification.legalName || verification.organization?.name}
										</h4>
										<p class={`text-sm ${COLOR.textMuted}`}>{verification.organization?.slug}</p>
									</div>
								</div>
								<div class="mt-4 grid grid-cols-2 gap-4 text-sm">
									<div>
										<span class={COLOR.textMuted}>Tipe:</span>
										<span class="ml-2 capitalize">{verification.legalType}</span>
									</div>
									<div>
										<span class={COLOR.textMuted}>NPWP:</span>
										<span class="ml-2 font-mono">{verification.npwp || '-'}</span>
									</div>
									<div>
										<span class={COLOR.textMuted}>Penanggung Jawab:</span>
										<span class="ml-2">{verification.representativeName || '-'}</span>
									</div>
									<div>
										<span class={COLOR.textMuted}>Jabatan:</span>
										<span class="ml-2 capitalize">{verification.representativePosition || '-'}</span
										>
									</div>
									<div class="col-span-2">
										<span class={COLOR.textMuted}>Alamat:</span>
										<span class="ml-2"
											>{verification.legalAddress}, {verification.city}, {verification.province}</span
										>
									</div>
									<div class="col-span-2">
										<span class={COLOR.textMuted}>Submitted:</span>
										<span class="ml-2">{formatDate(verification.createdAt)}</span>
									</div>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex flex-col gap-2">
								<form method="POST" action="?/approveOrg" use:enhance>
									<input type="hidden" name="verificationId" value={verification.id} />
									<button
										type="submit"
										class={`flex w-full items-center justify-center gap-2 ${RADIUS.small} ${ACTION.approve} px-4 py-2 font-bold`}
									>
										<Icon name="check" size={16} />
										Approve
									</button>
								</form>
								<button
									type="button"
									class={`flex w-full items-center justify-center gap-2 ${RADIUS.small} ${ACTION.reject} px-4 py-2 font-bold`}
									onclick={() => openRejectModal(verification.id, 'org')}
								>
									<Icon name="x" size={16} />
									Reject
								</button>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}

	<!-- Reject Modal -->
	{#if showRejectModal}
		<div class={`fixed inset-0 z-50 flex items-center justify-center ${MODAL.overlay}`}>
			<div class={`w-full max-w-md ${RADIUS.card} ${MODAL.panel} p-6`}>
				<h3 class="mb-4 text-lg font-bold">Alasan Penolakan</h3>
				<form
					method="POST"
					action={rejectType === 'ktp' ? '?/rejectKtp' : '?/rejectOrg'}
					use:enhance={() => {
						return async ({ update }) => {
							showRejectModal = false;
							await update();
						};
					}}
				>
					<input type="hidden" name="verificationId" value={rejectTargetId} />
					<textarea
						name="rejectionReason"
						bind:value={rejectReason}
						placeholder="Masukkan alasan penolakan..."
						rows="4"
						class={`mb-4 w-full ${RADIUS.small} border ${COLOR.cardBorder} p-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20`}
						required
					></textarea>
					<div class="flex gap-2">
						<button
							type="button"
							class={`flex-1 ${RADIUS.small} ${COLOR.neutral} px-4 py-2 font-medium transition-colors ${COLOR.neutralHover}`}
							onclick={() => (showRejectModal = false)}
						>
							Batal
						</button>
						<button
							type="submit"
							class={`flex-1 ${RADIUS.small} bg-rose-600 px-4 py-2 font-bold text-white transition-colors hover:bg-rose-700`}
						>
							Konfirmasi Tolak
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</PageWrapper>
