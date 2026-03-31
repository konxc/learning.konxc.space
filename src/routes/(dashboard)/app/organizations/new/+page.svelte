<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { COLOR, RADIUS, TEXT, SPACING, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let orgName = $state('');
	let brandColor = $state('#4f46e5');
	let isSubmitting = $state(false);
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
			toast.success(form.message);
		}
	});

	// Color presets
	const colorPresets = [
		'#4f46e5',
		'#059669',
		'#dc2626',
		'#d97706',
		'#7c3aed',
		'#0891b2',
		'#be185d'
	];
</script>

<svelte:head>
	<title>Buat Organisasi - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Buat Organisasi Baru"
		description="Buat ruang pembelajaran digital untuk tim atau komunitas kamu."
	/>

	<main class="mx-auto max-w-2xl">
		<!-- KTP Verified Badge -->
		<div
			class={`${RADIUS.card} border border-emerald-200 bg-emerald-50 p-4 ${ELEVATION.card} dark:border-emerald-800 dark:bg-emerald-900/20`}
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white"
				>
					<Icon name="check-circle" size={20} />
				</div>
				<div>
					<p class="font-bold text-emerald-800 dark:text-emerald-200">KTP Terverifikasi</p>
					<p class="text-sm text-emerald-600 dark:text-emerald-400">
						{data.user.fullName || data.user.username}
					</p>
				</div>
			</div>
		</div>

		<!-- Organization Form -->
		<div
			class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card} mt-6`}
		>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>Detail Organisasi</h3>

			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="space-y-6"
			>
				<AuthFormField
					label="Nama Organisasi"
					name="name"
					type="text"
					bind:value={orgName}
					placeholder="Contoh: Koneksi Digital, Yayasan Pendidikan"
					required
				/>

				<!-- Brand Color -->
				<div class="space-y-3">
					<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>Warna Brand Organisasi</p>
					<div class="flex flex-wrap gap-2" role="group" aria-label="Pilih warna brand">
						{#each colorPresets as color}
							<button
								type="button"
								class="h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 {brandColor ===
								color
									? 'scale-110 border-zinc-900'
									: 'border-transparent'}"
								style="background-color: {color}"
								aria-label="Pilih warna {color}"
								aria-pressed={brandColor === color}
								onclick={() => (brandColor = color)}
							></button>
						{/each}
					</div>
					<div class="flex items-center gap-3">
						<input
							type="color"
							bind:value={brandColor}
							class="h-10 w-10 cursor-pointer rounded-lg border-0"
						/>
						<span class="text-sm text-zinc-500">Atau pilih warna custom</span>
					</div>
					<input type="hidden" name="brandColor" value={brandColor} />
				</div>

				<!-- Preview -->
				<div class="space-y-3">
					<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>Preview</p>
					<div class="rounded-xl border p-4" style="border-color: {brandColor}30">
						<div class="flex items-center gap-3">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl text-white"
								style="background-color: {brandColor}"
							>
								<Icon name="building" size={24} />
							</div>
							<div>
								<p class="font-bold" style="color: {brandColor}">
									{orgName || 'Nama Organisasi'}
								</p>
								<p class="text-xs text-zinc-500">
									/ {(orgName || 'nama-organisasi').toLowerCase().replace(/\s+/g, '-')}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div
					class="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
				>
					<div class="flex gap-2">
						<Icon name="info" size={18} class="mt-0.5 shrink-0" />
						<div>
							<p class="font-medium">Setelah Organisasi Dibuat:</p>
							<ul class="mt-1 list-inside list-disc space-y-1">
								<li>Anda menjadi Owner organisasi</li>
								<li>Dapat mengundang Mentor dan Facilitator</li>
								<li>Dapat membuat course dan kelas</li>
								<li>Bisa verifikasi organisasi untuk badge "Trusted"</li>
							</ul>
						</div>
					</div>
				</div>

				<AuthSubmitButton
					text={isSubmitting ? 'Membuat...' : 'Buat Organisasi'}
					disabled={isSubmitting}
				/>
			</form>
		</div>
	</main>
</PageWrapper>
