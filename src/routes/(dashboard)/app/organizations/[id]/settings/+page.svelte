<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { COLOR, RADIUS, TEXT, SPACING, ELEVATION, TRANSITION, INPUT } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Settings form state
	let orgName = $state(data.organization.name);
	let orgSlug = $state(data.organization.slug);
	let brandColor = $state(data.organization.brandColor ?? '#4f46e5');
	let isSubmittingSettings = $state(false);

	// Logo form state
	let logoBase64 = $state('');
	let logoPreview = $state(data.organization.logoUrl ?? '');
	let isSubmittingLogo = $state(false);

	// Track last processed form to avoid duplicate toasts
	let lastFormKey = $state('');

	$effect(() => {
		const key = JSON.stringify({
			err: form?.error,
			msg: (form as { message?: string } | null)?.message
		});
		if (key === lastFormKey) return;
		lastFormKey = key;
		if (form?.error) {
			toast.error(form.error);
		} else if ((form as { message?: string } | null)?.message) {
			toast.success((form as { message?: string }).message!);
		}
	});

	const colorPresets = [
		'#4f46e5',
		'#059669',
		'#dc2626',
		'#d97706',
		'#7c3aed',
		'#0891b2',
		'#be185d'
	];

	function handleLogoUpload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		if (file.size > 500 * 1024) {
			toast.error('Ukuran logo maksimal 500KB');
			input.value = '';
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			logoBase64 = result;
			logoPreview = result;
		};
		reader.readAsDataURL(file);
	}
</script>

<svelte:head>
	<title>Pengaturan - {data.organization.name} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Pengaturan Organisasi"
		description="Kelola informasi dan tampilan {data.organization.name}"
	/>

	<!-- Section 1: General Settings -->
	<PageSection>
		<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Pengaturan Umum</h3>

		<div
			class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} ${SPACING.cardPadding}`}
		>
			<form
				method="POST"
				action="?/updateSettings"
				use:enhance={() => {
					isSubmittingSettings = true;
					return async ({ update }) => {
						isSubmittingSettings = false;
						await update();
					};
				}}
			>
				<div class="space-y-5">
					<!-- Org Name -->
					<div class="space-y-1.5">
						<label for="orgName" class={`block ${TEXT.small} font-bold ${COLOR.textPrimary}`}>
							Nama Organisasi <span class="text-rose-500">*</span>
						</label>
						<input
							id="orgName"
							name="name"
							type="text"
							bind:value={orgName}
							minlength={3}
							required
							class={`w-full ${RADIUS.input} border ${INPUT.border} ${INPUT.bg} ${INPUT.text} ${INPUT.placeholder} ${INPUT.focus} ${SPACING.input} text-sm ${TRANSITION.colors}`}
						/>
						{#if orgName.length > 0 && orgName.length < 3}
							<p class="text-xs text-rose-500">Minimal 3 karakter</p>
						{/if}
					</div>

					<!-- Slug -->
					<div class="space-y-1.5">
						<label for="orgSlug" class={`block ${TEXT.small} font-bold ${COLOR.textPrimary}`}>
							Slug URL
						</label>
						<input
							id="orgSlug"
							name="slug"
							type="text"
							bind:value={orgSlug}
							placeholder="contoh-slug"
							class={`w-full ${RADIUS.input} border ${INPUT.border} ${INPUT.bg} ${INPUT.text} ${INPUT.placeholder} ${INPUT.focus} ${SPACING.input} font-mono text-sm ${TRANSITION.colors}`}
						/>
						<p class={`text-xs ${COLOR.textMuted}`}>
							Hanya huruf kecil, angka, dan tanda hubung (-). Contoh: <span class="font-mono"
								>nama-organisasi</span
							>
						</p>
					</div>

					<!-- Brand Color -->
					<div class="space-y-3">
						<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>Warna Brand</p>
						<div class="flex flex-wrap gap-2" role="group" aria-label="Pilih warna brand">
							{#each colorPresets as color}
								<button
									type="button"
									class={`h-10 w-10 rounded-full border-2 ${TRANSITION.colors} hover:scale-110 ${brandColor === color ? 'scale-110 border-zinc-900 dark:border-zinc-100' : 'border-transparent'}`}
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
								aria-label="Pilih warna custom"
							/>
							<span class={`text-sm ${COLOR.textMuted}`}>Atau pilih warna custom</span>
						</div>
						<input type="hidden" name="brandColor" value={brandColor} />
					</div>

					<!-- Preview -->
					<div class="space-y-2">
						<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>Preview</p>
						<div class={`${RADIUS.small} border p-4`} style="border-color: {brandColor}30">
							<div class="flex items-center gap-3">
								{#if logoPreview}
									<img src={logoPreview} alt="Logo" class="h-12 w-12 rounded-xl object-cover" />
								{:else}
									<div
										class="flex h-12 w-12 items-center justify-center rounded-xl text-white"
										style="background-color: {brandColor}"
									>
										<Icon name="building" size={24} />
									</div>
								{/if}
								<div>
									<p class="font-bold" style="color: {brandColor}">
										{orgName || 'Nama Organisasi'}
									</p>
									<p class="font-mono text-xs text-zinc-500">/{orgSlug || 'slug'}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-6 flex justify-end">
					<button
						type="submit"
						disabled={isSubmittingSettings}
						class={`${RADIUS.button} bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white ${TRANSITION.colors} hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50`}
					>
						{isSubmittingSettings ? 'Menyimpan...' : 'Simpan Pengaturan'}
					</button>
				</div>
			</form>
		</div>
	</PageSection>

	<!-- Section 2: Logo -->
	<PageSection>
		<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Logo Organisasi</h3>

		<div
			class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} ${SPACING.cardPadding}`}
		>
			<form
				method="POST"
				action="?/updateLogo"
				use:enhance={() => {
					isSubmittingLogo = true;
					return async ({ update }) => {
						isSubmittingLogo = false;
						await update();
					};
				}}
			>
				<div class="space-y-5">
					<!-- Current Logo / Placeholder -->
					<div class="flex items-center gap-5">
						{#if logoPreview}
							<img
								src={logoPreview}
								alt="Logo {data.organization.name}"
								class="h-20 w-20 rounded-xl object-cover"
							/>
						{:else}
							<div
								class="flex h-20 w-20 items-center justify-center rounded-xl text-white"
								style="background-color: {brandColor}"
							>
								<Icon name="building" size={32} />
							</div>
						{/if}

						<div class="space-y-2">
							<p class={`text-sm font-medium ${COLOR.textPrimary}`}>
								{logoPreview ? 'Logo saat ini' : 'Belum ada logo'}
							</p>
							<p class={`text-xs ${COLOR.textMuted}`}>Format: JPG, PNG, GIF. Maks 500KB.</p>
							<label
								class={`inline-flex cursor-pointer items-center gap-2 ${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-medium ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
							>
								<Icon name="upload" size={14} />
								Pilih Gambar
								<input type="file" accept="image/*" class="hidden" onchange={handleLogoUpload} />
							</label>
						</div>
					</div>

					<input type="hidden" name="logoBase64" value={logoBase64} />
				</div>

				<div class="mt-6 flex justify-end">
					<button
						type="submit"
						disabled={isSubmittingLogo}
						class={`${RADIUS.button} bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white ${TRANSITION.colors} hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50`}
					>
						{isSubmittingLogo ? 'Menyimpan...' : 'Simpan Logo'}
					</button>
				</div>
			</form>
		</div>
	</PageSection>
</PageWrapper>
