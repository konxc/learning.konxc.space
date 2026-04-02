<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { enhance } from '$app/forms';
	import { COLOR, RADIUS, TEXT, SPACING, ELEVATION, TRANSITION, INPUT } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';
	import type { OrgRole } from '$lib/constants/roles';
	import { ORG_ROLES, ROLE_ALIASES } from '$lib/constants/roles';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Wizard state
	let step = $state<1 | 2 | 3>(1);
	let orgName = $state('');
	let description = $state('');
	let brandColor = $state('#4f46e5');
	let logoBase64 = $state('');
	let logoPreview = $state('');
	let inviteEmails = $state<Array<{ email: string; role: string }>>([]);
	let emailInput = $state('');
	let emailRole = $state<string>('member');
	let isSubmitting = $state(false);
	let processedFormKey = $state('');

	// Derived
	let slugPreview = $derived(
		orgName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
	);

	let step1Valid = $derived(orgName.trim().length >= 3);

	// Toast on form result
	$effect(() => {
		const key = form?.error ?? '';
		if (!key || key === processedFormKey) return;
		processedFormKey = key;
		if (form?.error) toast.error(form.error);
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

	// Invite roles (exclude owner)
	const inviteRoles = ORG_ROLES.filter((r) => r !== 'owner');

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

	function addEmail() {
		const trimmed = emailInput.trim();
		if (!trimmed || !trimmed.includes('@')) {
			toast.error('Masukkan email yang valid');
			return;
		}
		if (inviteEmails.some((e) => e.email === trimmed)) {
			toast.error('Email sudah ditambahkan');
			return;
		}
		inviteEmails = [...inviteEmails, { email: trimmed, role: emailRole }];
		emailInput = '';
		emailRole = 'member';
	}

	function removeEmail(index: number) {
		inviteEmails = inviteEmails.filter((_, i) => i !== index);
	}

	function goNext() {
		if (step === 1 && step1Valid) step = 2;
		else if (step === 2) step = 3;
	}

	function goBack() {
		if (step === 2) step = 1;
		else if (step === 3) step = 2;
	}
</script>

<svelte:head>
	<title>Buat Organisasi - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Buat Organisasi Baru"
		description="Buat ruang pembelajaran digital untuk tim atau komunitas kamu."
	/>

	<main class="mx-auto max-w-2xl space-y-6">
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

		<!-- Step Indicator -->
		<div class="flex items-center justify-center gap-2">
			{#each [1, 2, 3] as s}
				<div class="flex items-center gap-2">
					<div
						class={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${TRANSITION.colors} ${
							step === s
								? 'bg-blue-600 text-white'
								: step > s
									? 'bg-emerald-500 text-white'
									: 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'
						}`}
					>
						{#if step > s}
							<Icon name="check" size={14} />
						{:else}
							{s}
						{/if}
					</div>
					<span class={`text-sm font-medium ${step === s ? COLOR.textPrimary : COLOR.textMuted}`}>
						{s === 1 ? 'Info Dasar' : s === 2 ? 'Undang Anggota' : 'Konfirmasi'}
					</span>
					{#if s < 3}
						<div class="mx-1 h-px w-8 bg-zinc-200 dark:bg-zinc-700"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Card -->
		<div
			class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card}`}
		>
			<!-- ── STEP 1: Basic Info ── -->
			{#if step === 1}
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>Info Dasar Organisasi</h3>

				<div class="space-y-5">
					<!-- Org Name -->
					<div class="space-y-1.5">
						<label for="orgName" class={`block ${TEXT.small} font-bold ${COLOR.textPrimary}`}>
							Nama Organisasi <span class="text-rose-500">*</span>
						</label>
						<input
							id="orgName"
							type="text"
							bind:value={orgName}
							placeholder="Contoh: Koneksi Digital, Yayasan Pendidikan"
							minlength={3}
							required
							class={`w-full ${RADIUS.input} border ${INPUT.border} ${INPUT.bg} ${INPUT.text} ${INPUT.placeholder} ${INPUT.focus} ${SPACING.input} text-sm ${TRANSITION.colors}`}
						/>
						{#if orgName.length > 0 && orgName.length < 3}
							<p class="text-xs text-rose-500">Minimal 3 karakter</p>
						{/if}
					</div>

					<!-- Slug Preview -->
					{#if slugPreview}
						<div class={`${RADIUS.small} bg-zinc-50 px-3 py-2 dark:bg-zinc-800`}>
							<p class={`${TEXT.small} ${COLOR.textMuted} mb-0.5`}>URL Slug</p>
							<p class="font-mono text-sm text-blue-600 dark:text-blue-400">/{slugPreview}</p>
						</div>
					{/if}

					<!-- Description -->
					<div class="space-y-1.5">
						<label for="description" class={`block ${TEXT.small} font-bold ${COLOR.textPrimary}`}>
							Deskripsi <span class={COLOR.textMuted}>(opsional)</span>
						</label>
						<textarea
							id="description"
							bind:value={description}
							placeholder="Ceritakan tentang organisasi kamu..."
							rows={3}
							class={`w-full ${RADIUS.input} border ${INPUT.border} ${INPUT.bg} ${INPUT.text} ${INPUT.placeholder} ${INPUT.focus} ${SPACING.input} text-sm ${TRANSITION.colors} resize-none`}
						></textarea>
					</div>

					<!-- Logo Upload -->
					<div class="space-y-2">
						<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
							Logo Organisasi <span class={COLOR.textMuted}>(opsional, maks 500KB)</span>
						</p>
						<div class="flex items-center gap-4">
							{#if logoPreview}
								<img
									src={logoPreview}
									alt="Logo preview"
									class="h-16 w-16 rounded-xl object-cover"
								/>
							{:else}
								<div
									class="flex h-16 w-16 items-center justify-center rounded-xl text-white"
									style="background-color: {brandColor}"
								>
									<Icon name="building" size={28} />
								</div>
							{/if}
							<label
								class={`cursor-pointer ${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-medium ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
							>
								Pilih Gambar
								<input type="file" accept="image/*" class="hidden" onchange={handleLogoUpload} />
							</label>
						</div>
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
									<p class="text-xs text-zinc-500">/{slugPreview || 'nama-organisasi'}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-6 flex justify-end">
					<button
						type="button"
						onclick={goNext}
						disabled={!step1Valid}
						class={`${RADIUS.button} bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white ${TRANSITION.colors} hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50`}
					>
						Lanjut →
					</button>
				</div>

				<!-- ── STEP 2: Invite Members ── -->
			{:else if step === 2}
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Undang Anggota</h3>
				<p class={`text-sm ${COLOR.textSecondary} mb-6`}>
					Opsional — kamu bisa undang anggota nanti.
				</p>

				<div class="space-y-4">
					<!-- Add email row -->
					<div class="flex gap-2">
						<input
							type="email"
							bind:value={emailInput}
							placeholder="email@contoh.com"
							class={`flex-1 ${RADIUS.input} border ${INPUT.border} ${INPUT.bg} ${INPUT.text} ${INPUT.placeholder} ${INPUT.focus} ${SPACING.input} text-sm ${TRANSITION.colors}`}
							onkeydown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									addEmail();
								}
							}}
						/>
						<select
							bind:value={emailRole}
							class={`${RADIUS.input} border ${INPUT.border} ${INPUT.bg} ${INPUT.text} ${INPUT.focus} px-3 py-2.5 text-sm ${TRANSITION.colors}`}
							aria-label="Role untuk undangan"
						>
							{#each inviteRoles as role}
								<option value={role}>{ROLE_ALIASES[role] ?? role}</option>
							{/each}
						</select>
						<button
							type="button"
							onclick={addEmail}
							class={`${RADIUS.button} bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white ${TRANSITION.colors} shrink-0 hover:bg-blue-700`}
						>
							Tambah
						</button>
					</div>

					<!-- Email list -->
					{#if inviteEmails.length > 0}
						<ul class="space-y-2">
							{#each inviteEmails as invite, i}
								<li
									class={`flex items-center justify-between ${RADIUS.small} border ${COLOR.cardBorder} px-4 py-2.5`}
								>
									<div class="flex items-center gap-3">
										<Icon name="mail" size={16} class={COLOR.textMuted} />
										<span class={`text-sm ${COLOR.textPrimary}`}>{invite.email}</span>
										<span
											class={`rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300`}
										>
											{ROLE_ALIASES[invite.role] ?? invite.role}
										</span>
									</div>
									<button
										type="button"
										onclick={() => removeEmail(i)}
										class={`${COLOR.textMuted} ${TRANSITION.colors} hover:text-rose-500`}
										aria-label="Hapus {invite.email}"
									>
										<Icon name="x" size={16} />
									</button>
								</li>
							{/each}
						</ul>
					{:else}
						<p class={`text-center text-sm ${COLOR.textMuted} py-4`}>
							Belum ada email yang ditambahkan.
						</p>
					{/if}
				</div>

				<div class="mt-6 flex justify-between">
					<button
						type="button"
						onclick={goBack}
						class={`${RADIUS.button} border ${COLOR.cardBorder} px-6 py-2.5 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
					>
						← Kembali
					</button>
					<button
						type="button"
						onclick={goNext}
						class={`${RADIUS.button} bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white ${TRANSITION.colors} hover:bg-blue-700`}
					>
						Lanjut →
					</button>
				</div>

				<!-- ── STEP 3: Confirmation ── -->
			{:else}
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>Konfirmasi</h3>

				<div class="space-y-4">
					<!-- Summary card -->
					<div
						class={`${RADIUS.small} border ${COLOR.cardBorder} divide-y divide-zinc-100 dark:divide-zinc-800`}
					>
						<div class="flex items-center gap-4 p-4">
							{#if logoPreview}
								<img src={logoPreview} alt="Logo" class="h-14 w-14 rounded-xl object-cover" />
							{:else}
								<div
									class="flex h-14 w-14 items-center justify-center rounded-xl text-white"
									style="background-color: {brandColor}"
								>
									<Icon name="building" size={28} />
								</div>
							{/if}
							<div>
								<p class={`text-lg font-bold ${COLOR.textPrimary}`}>{orgName}</p>
								<p class="font-mono text-sm text-blue-600 dark:text-blue-400">/{slugPreview}</p>
							</div>
						</div>

						{#if description}
							<div class="px-4 py-3">
								<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted} mb-1`}>
									Deskripsi
								</p>
								<p class={`text-sm ${COLOR.textSecondary}`}>{description}</p>
							</div>
						{/if}

						<div class="px-4 py-3">
							<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted} mb-1`}>
								Warna Brand
							</p>
							<div class="flex items-center gap-2">
								<div class="h-5 w-5 rounded-full" style="background-color: {brandColor}"></div>
								<span class={`font-mono text-sm ${COLOR.textSecondary}`}>{brandColor}</span>
							</div>
						</div>

						<div class="px-4 py-3">
							<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted} mb-1`}>
								Undangan
							</p>
							<p class={`text-sm ${COLOR.textSecondary}`}>
								{inviteEmails.length > 0
									? `${inviteEmails.length} orang akan diundang`
									: 'Tidak ada undangan'}
							</p>
						</div>
					</div>

					<!-- Actual form for submission -->
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
					>
						<input type="hidden" name="name" value={orgName} />
						<input type="hidden" name="description" value={description} />
						<input type="hidden" name="brandColor" value={brandColor} />
						<input type="hidden" name="logoBase64" value={logoBase64} />
						<input type="hidden" name="inviteEmails" value={JSON.stringify(inviteEmails)} />

						<div class="mt-6 flex justify-between">
							<button
								type="button"
								onclick={goBack}
								class={`${RADIUS.button} border ${COLOR.cardBorder} px-6 py-2.5 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
							>
								← Kembali
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								class={`${RADIUS.button} bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white ${TRANSITION.colors} hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50`}
							>
								{isSubmitting ? 'Membuat...' : 'Buat Organisasi'}
							</button>
						</div>
					</form>
				</div>
			{/if}
		</div>
	</main>
</PageWrapper>
