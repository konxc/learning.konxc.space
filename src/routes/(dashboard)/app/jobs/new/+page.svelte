<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { formToast } from '$lib/utils/formEnhance';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showCreateForm = $state(false);
	let isRemote = $state(false);
	let selectedOrg = $state(data.memberships[0]?.id || '');

	const statusColors: Record<string, string> = {
		active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
		closed: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
		draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
	};

	const jobTypeLabels: Record<string, string> = {
		'full-time': 'Full-time',
		'part-time': 'Part-time',
		contract: 'Contract',
		internship: 'Internship'
	};

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium'
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Manage Job Postings - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mb-8 flex items-start justify-between">
		<PageHeader
			title="Job Postings"
			description="Kelola lowongan pekerjaan untuk organisasi Anda"
		/>
		<button
			onclick={() => (showCreateForm = !showCreateForm)}
			class={`${RADIUS.button} ${showCreateForm ? 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300' : COLOR.accentBg} px-5 py-2.5 text-xs font-bold tracking-widest text-white uppercase shadow-lg ${TRANSITION.all} hover:-translate-y-0.5`}
		>
			{showCreateForm ? '✕ Batal' : '+ Buat Lowongan'}
		</button>
	</div>

	{#if form?.error}
		<div
			class={`mb-6 ${RADIUS.button} border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400`}
			role="alert"
		>
			{form.error}
		</div>
	{/if}

	<!-- Create Form -->
	{#if showCreateForm}
		<div
			class={`mb-8 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-8 ${ELEVATION.card}`}
		>
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>Buat Lowongan Baru</h2>

			<form
				method="POST"
				action="?/create"
				use:enhance={formToast({
					success: 'Lowongan berhasil dibuat!',
					error: 'Gagal membuat lowongan',
					onSuccess: () => {
						showCreateForm = false;
						window.location.reload();
					}
				})}
				class="space-y-6"
			>
				<!-- Organization Select -->
				<div class="flex flex-col gap-2">
					<label for="orgId" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
						Organisasi <span class="text-red-500">*</span>
					</label>
					<select
						id="orgId"
						name="orgId"
						required
						bind:value={selectedOrg}
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					>
						{#each data.memberships as org}
							<option value={org.id}>{org.name}</option>
						{/each}
					</select>
				</div>

				<!-- Title -->
				<div class="flex flex-col gap-2">
					<label for="title" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
						Judul Posisi <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="title"
						name="title"
						required
						placeholder="Contoh: Frontend Developer"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					/>
				</div>

				<!-- Description -->
				<div class="flex flex-col gap-2">
					<label for="description" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
						Deskripsi Pekerjaan <span class="text-red-500">*</span>
					</label>
					<textarea
						id="description"
						name="description"
						required
						rows="5"
						placeholder="Jelaskan tanggung jawab, kualifikasi, dan benefit dari posisi ini..."
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} min-h-[120px] resize-y focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					></textarea>
				</div>

				<!-- Job Type & Visibility -->
				<div class="grid gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<label for="jobType" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
							Tipe Pekerjaan
						</label>
						<select
							id="jobType"
							name="jobType"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						>
							<option value="full-time">Full-time</option>
							<option value="part-time">Part-time</option>
							<option value="contract">Contract</option>
							<option value="internship">Internship</option>
						</select>
					</div>

					<div class="flex flex-col gap-2">
						<label for="visibility" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
							Visibilitas
						</label>
						<select
							id="visibility"
							name="visibility"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						>
							<option value="internal">Internal (Anggota Organisasi)</option>
							<option value="public">Publik (Semua Pengguna)</option>
						</select>
					</div>
				</div>

				<!-- Location -->
				<div class="grid gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<label for="location" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
							Lokasi
						</label>
						<input
							type="text"
							id="location"
							name="location"
							placeholder="Contoh: Jakarta Selatan"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>

					<div class="flex flex-col justify-end gap-2">
						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="checkbox"
								name="isRemote"
								value={isRemote ? 'true' : 'false'}
								bind:checked={isRemote}
								class="h-5 w-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class={`text-sm font-semibold ${COLOR.textPrimary}`}>Tersedia Remote</span>
						</label>
						<p class={`text-xs ${COLOR.textMuted}`}>
							Centang jika posisi bisa dikerjakan dari mana saja
						</p>
					</div>
				</div>

				<!-- Salary Range -->
				<div>
					<p class={`text-sm font-semibold ${COLOR.textPrimary} mb-2`}>Rentang Gaji (Opsional)</p>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="flex flex-col gap-2">
							<label for="salaryMin" class={`text-xs ${COLOR.textMuted}`}>Minimum (Rp)</label>
							<input
								type="number"
								id="salaryMin"
								name="salaryMin"
								min="0"
								placeholder="5000000"
								class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
						</div>
						<div class="flex flex-col gap-2">
							<label for="salaryMax" class={`text-xs ${COLOR.textMuted}`}>Maksimum (Rp)</label>
							<input
								type="number"
								id="salaryMax"
								name="salaryMax"
								min="0"
								placeholder="10000000"
								class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
						</div>
					</div>
				</div>

				<!-- Submit -->
				<div class="flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
					<button
						type="submit"
						class={`${RADIUS.button} ${COLOR.accentBg} px-8 py-3 text-xs font-bold tracking-widest text-white uppercase shadow-lg ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-xl`}
					>
						Publikasikan Lowongan
					</button>
					<button
						type="button"
						onclick={() => (showCreateForm = false)}
						class={`${RADIUS.button} border ${COLOR.cardBorder} px-8 py-3 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
					>
						Batal
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Existing Jobs List -->
	<div
		class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden`}
	>
		<div
			class="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50"
		>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Lowongan Saya ({data.jobs.length})</h3>
		</div>

		{#if data.jobs.length === 0}
			<div class="py-16 text-center">
				<div class="mb-4 text-6xl">💼</div>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Belum Ada Lowongan</h3>
				<p class={`${COLOR.textMuted}`}>
					Klik tombol "Buat Lowongan" untuk mulai memposting lowongan kerja.
				</p>
			</div>
		{:else}
			<div class="divide-y divide-zinc-50 dark:divide-zinc-800">
				{#each data.jobs as job}
					<div
						class="flex items-center justify-between p-5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
					>
						<div class="min-w-0 flex-1">
							<div class="mb-1 flex items-center gap-3">
								<a
									href="/app/jobs/{job.id}"
									class={`font-bold ${COLOR.textPrimary} hover:${COLOR.accent} truncate`}
								>
									{job.title}
								</a>
								<span
									class={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${statusColors[job.status] || statusColors.draft}`}
								>
									{job.status}
								</span>
							</div>
							<div class="flex items-center gap-3 text-xs">
								<span class={COLOR.textMuted}>{job.organization.name}</span>
								<span class="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
								<span class={COLOR.textMuted}>{jobTypeLabels[job.jobType] || job.jobType}</span>
								<span class="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
								<span class={COLOR.textMuted}>{job.visibility}</span>
								<span class="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
								<span class={COLOR.textMuted}>{formatDate(job.createdAt)}</span>
							</div>
						</div>

						<div class="flex items-center gap-2">
							<a
								href="/app/jobs/{job.id}"
								class={`${RADIUS.button} border ${COLOR.cardBorder} px-3 py-2 text-xs font-bold ${COLOR.textPrimary} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
							>
								Lihat
							</a>
							<a
								href="/app/jobs/applications?jobId={job.id}"
								class={`${RADIUS.button} border ${COLOR.cardBorder} px-3 py-2 text-xs font-bold ${COLOR.accent} ${TRANSITION.all} hover:bg-blue-50 dark:hover:bg-blue-900/20`}
							>
								Lamaran
							</a>
							{#if job.status === 'active'}
								<form
									method="POST"
									action="?/closeJob"
									use:enhance={formToast({
										success: 'Lowongan ditutup',
										error: 'Gagal menutup lowongan',
										withUpdate: false,
										onSuccess: () => window.location.reload()
									})}
								>
									<input type="hidden" name="jobId" value={job.id} />
									<button
										type="submit"
										class={`${RADIUS.button} border border-red-200 px-3 py-2 text-xs font-bold text-red-600 ${TRANSITION.all} hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20`}
									>
										Tutup
									</button>
								</form>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Quick Links -->
	<div class="mt-8 grid gap-4 md:grid-cols-3">
		<a
			href="/app/jobs"
			class={`flex items-center gap-3 ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} p-4 ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
		>
			<div
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30"
			>
				<Icon name="search" size={20} />
			</div>
			<div>
				<p class={`text-sm font-bold ${COLOR.textPrimary}`}>Browse Semua Lowongan</p>
				<p class={`text-xs ${COLOR.textMuted}`}>Lihat lowongan dari semua organisasi</p>
			</div>
		</a>
		<a
			href="/app/jobs/applications"
			class={`flex items-center gap-3 ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} p-4 ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
		>
			<div
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30"
			>
				<Icon name="file-text" size={20} />
			</div>
			<div>
				<p class={`text-sm font-bold ${COLOR.textPrimary}`}>Kelola Lamaran</p>
				<p class={`text-xs ${COLOR.textMuted}`}>Review dan proses lamaran masuk</p>
			</div>
		</a>
		<a
			href="/app/organizations"
			class={`flex items-center gap-3 ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} p-4 ${TRANSITION.all} hover:-translate-y-1 ${ELEVATION.cardHover}`}
		>
			<div
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30"
			>
				<Icon name="building" size={20} />
			</div>
			<div>
				<p class={`text-sm font-bold ${COLOR.textPrimary}`}>Organisasi</p>
				<p class={`text-xs ${COLOR.textMuted}`}>Kelola organisasi Anda</p>
			</div>
		</a>
	</div>
</PageWrapper>
