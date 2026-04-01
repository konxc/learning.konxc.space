<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toastStore';
	import { COLOR, RADIUS, TEXT, ELEVATION, SPACING } from '$lib/config/design';

	let { data }: { data: PageData } = $props();
	const app = data.application;

	let adminNotes = $state(app.adminNotes ?? '');
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Review Aplikasi: {app.fullName} - Admin</title>
</svelte:head>

<PageWrapper>
	<div class="mb-6 flex items-center gap-4">
		<a href="/app/admin/mentor-applications" class={`text-sm ${COLOR.accent} hover:underline`}>
			← Kembali ke Daftar
		</a>
	</div>

	<PageHeader title="Review Aplikasi Mentor" description={`Aplikasi dari ${app.fullName}`} />

	<div class="mt-6 grid gap-6 lg:grid-cols-3">
		<!-- Detail Aplikasi -->
		<div class="space-y-4 lg:col-span-2">
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.base} p-6`}>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Informasi Pelamar</h3>
				<dl class="space-y-3">
					{#each [{ label: 'Nama Lengkap', value: app.fullName }, { label: 'Email', value: app.email }, { label: 'Telepon', value: app.phone }, { label: 'Username', value: `@${app.user.username}` }, { label: 'Expertise', value: app.expertise }, { label: 'Pengalaman', value: `${app.yearsExperience} tahun` }] as item}
						<div class="flex gap-4">
							<dt class={`w-36 shrink-0 text-sm font-medium ${COLOR.textMuted}`}>{item.label}</dt>
							<dd class={`text-sm ${COLOR.textPrimary}`}>{item.value}</dd>
						</div>
					{/each}
				</dl>
			</div>

			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.base} p-6`}>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Bio</h3>
				<p class={`text-sm leading-relaxed ${COLOR.textSecondary}`}>{app.bio}</p>
			</div>

			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.base} p-6`}>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Motivasi</h3>
				<p class={`text-sm leading-relaxed ${COLOR.textSecondary}`}>{app.motivation}</p>
			</div>

			{#if app.portfolioUrl || app.githubUrl || app.linkedinUrl}
				<div
					class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.base} p-6`}
				>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Links</h3>
					<div class="space-y-2">
						{#if app.portfolioUrl}
							<a
								href={app.portfolioUrl}
								target="_blank"
								class={`block text-sm ${COLOR.accent} hover:underline`}>🌐 Portfolio</a
							>
						{/if}
						{#if app.githubUrl}
							<a
								href={app.githubUrl}
								target="_blank"
								class={`block text-sm ${COLOR.accent} hover:underline`}>💻 GitHub</a
							>
						{/if}
						{#if app.linkedinUrl}
							<a
								href={app.linkedinUrl}
								target="_blank"
								class={`block text-sm ${COLOR.accent} hover:underline`}>💼 LinkedIn</a
							>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- Panel Keputusan -->
		<div class="space-y-4">
			<!-- Status Badge -->
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.base} p-6`}>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted} mb-2`}>
					Status Saat Ini
				</p>
				<span
					class={`inline-block px-3 py-1 ${RADIUS.badge} text-sm font-bold capitalize ${
						app.status === 'approved'
							? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
							: app.status === 'rejected'
								? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
								: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
					}`}
				>
					{app.status}
				</span>
			</div>

			<!-- Keputusan Form -->
			{#if app.status === 'pending'}
				<div
					class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.base} p-6`}
				>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Buat Keputusan</h3>

					<div class="mb-4">
						<label for="adminNotes" class={`block text-sm font-medium ${COLOR.textPrimary} mb-1`}>
							Catatan Admin (opsional)
						</label>
						<textarea
							id="adminNotes"
							bind:value={adminNotes}
							rows="4"
							placeholder="Catatan untuk pelamar..."
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} px-3 py-2 text-sm outline-none focus:border-blue-500 ${COLOR.card}`}
						></textarea>
					</div>

					<div class="flex flex-col gap-3">
						<form
							method="POST"
							action="?/approve"
							use:enhance={() => {
								submitting = true;
								return async ({ result }) => {
									submitting = false;
									if (result.type === 'redirect') {
										toast.success('Aplikasi disetujui dan role diupgrade ke mentor');
									}
								};
							}}
						>
							<input type="hidden" name="adminNotes" value={adminNotes} />
							<Button type="submit" variant="success" class="w-full" disabled={submitting}>
								✅ Setujui Aplikasi
							</Button>
						</form>

						<form
							method="POST"
							action="?/reject"
							use:enhance={() => {
								submitting = true;
								return async ({ result }) => {
									submitting = false;
									if (result.type === 'redirect') {
										toast.success('Aplikasi ditolak');
									}
								};
							}}
						>
							<input type="hidden" name="adminNotes" value={adminNotes} />
							<Button type="submit" variant="danger" class="w-full" disabled={submitting}>
								❌ Tolak Aplikasi
							</Button>
						</form>
					</div>
				</div>
			{:else}
				<div
					class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.base} p-6`}
				>
					<p class={`text-sm ${COLOR.textMuted}`}>Aplikasi ini sudah diproses.</p>
					{#if app.adminNotes}
						<p class={`mt-2 text-sm ${COLOR.textSecondary}`}>Catatan: {app.adminNotes}</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</PageWrapper>
