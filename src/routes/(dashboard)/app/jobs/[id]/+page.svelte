<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { toast } from '$lib/stores/toastStore';

	let { data, form }: { data: PageData; form?: ActionData } = $props();

	const jobTypeLabels: Record<string, string> = {
		'full-time': 'Full-time',
		'part-time': 'Part-time',
		contract: 'Contract',
		internship: 'Internship'
	};

	function formatSalary(min: number | null, max: number | null) {
		if (!min && !max) return null;
		const fmt = (n: number) =>
			new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
				minimumFractionDigits: 0
			}).format(n);
		if (min && max) return `${fmt(min)} - ${fmt(max)}`;
		if (min) return `Mulai dari ${fmt(min)}`;
		if (max) return `Hingga ${fmt(max)}`;
		return null;
	}

	function formatDate(date: Date | null) {
		if (!date) return '-';
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(date));
	}

	function parseJsonArray(str: string | null): string[] {
		if (!str) return [];
		try {
			return JSON.parse(str);
		} catch {
			return [str];
		}
	}

	const requirements = $derived(parseJsonArray(data.job.requirements));
	const responsibilities = $derived(parseJsonArray(data.job.responsibilities));

	let showApplyForm = $state(false);
	let applying = $state(false);
	let withdrawing = $state(false);
</script>

<svelte:head>
	<title>{data.job.title} - {data.job.organization.name} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<!-- Back navigation -->
	<a
		href="/app/jobs"
		class={`mb-6 inline-flex items-center gap-2 text-sm ${COLOR.textMuted} ${TRANSITION.all} hover:${COLOR.accent}`}
	>
		<Icon name="arrow-left" size={16} />
		Kembali ke Daftar Lowongan
	</a>

	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Main Content -->
		<div class="lg:col-span-2">
			<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-8 ${ELEVATION.card}`}>
				<!-- Header -->
				<div class="mb-8">
					<div class="mb-4 flex items-start gap-4">
						<div
							class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-2xl shadow-sm dark:bg-zinc-800"
						>
							{#if data.job.organization.logoUrl}
								<img
									src={data.job.organization.logoUrl}
									alt={data.job.organization.name}
									class="h-full w-full rounded-2xl object-cover"
								/>
							{:else}
								<span class="font-bold text-zinc-500">
									{data.job.organization.name.charAt(0)}
								</span>
							{/if}
						</div>
						<div>
							<h1 class={`${TEXT.h1} ${COLOR.textPrimary} leading-tight`}>
								{data.job.title}
							</h1>
							<a
								href="/app/organizations/{data.job.organization.id}"
								class={`text-lg ${COLOR.accent} hover:underline`}
							>
								{data.job.organization.name}
							</a>
						</div>
					</div>

					<!-- Tags -->
					<div class="flex flex-wrap gap-2">
						<span
							class="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200"
						>
							{jobTypeLabels[data.job.jobType] || data.job.jobType}
						</span>
						{#if data.job.isRemote}
							<span
								class="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-800 dark:bg-green-900 dark:text-green-200"
							>
								Remote
							</span>
						{/if}
						{#if data.job.location}
							<span
								class="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
							>
								📍 {data.job.location}
							</span>
						{/if}
						{#if formatSalary(data.job.salaryMin, data.job.salaryMax)}
							<span
								class="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
							>
								💰 {formatSalary(data.job.salaryMin, data.job.salaryMax)}
							</span>
						{/if}
					</div>
				</div>

				<!-- Description -->
				<div class="mb-8">
					<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Deskripsi Pekerjaan</h2>
					<div class={`prose prose-sm max-w-none ${COLOR.textSecondary}`}>
						{#each data.job.description.split('\n') as paragraph}
							{#if paragraph.trim()}
								<p class="mb-3 leading-relaxed">{paragraph}</p>
							{/if}
						{/each}
					</div>
				</div>

				<!-- Responsibilities -->
				{#if responsibilities.length > 0}
					<div class="mb-8">
						<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Tanggung Jawab</h2>
						<ul class="space-y-2">
							{#each responsibilities as item}
								<li class="flex items-start gap-3">
									<Icon name="check-circle" size={18} class="mt-0.5 shrink-0 text-green-500" />
									<span class={`text-sm ${COLOR.textSecondary}`}>{item}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Requirements -->
				{#if requirements.length > 0}
					<div class="mb-8">
						<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Kualifikasi</h2>
						<ul class="space-y-2">
							{#each requirements as item}
								<li class="flex items-start gap-3">
									<Icon name="check" size={18} class="mt-0.5 shrink-0 text-blue-500" />
									<span class={`text-sm ${COLOR.textSecondary}`}>{item}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Meta -->
				<div
					class="flex items-center gap-4 border-t border-zinc-100 pt-6 text-xs text-zinc-400 dark:border-zinc-800"
				>
					<span>Diposting: {formatDate(data.job.createdAt)}</span>
					{#if data.job.expiresAt}
						<span>• Berakhir: {formatDate(data.job.expiresAt)}</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Sidebar: Apply -->
		<div class="lg:col-span-1">
			<div
				class={`sticky top-24 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-6 ${ELEVATION.card}`}
			>
				{#if data.hasApplied && data.application}
					<!-- Already applied -->
					<div class="mb-4 flex items-center gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50"
						>
							<Icon name="check" size={20} />
						</div>
						<div>
							<p class="text-sm font-bold text-green-800 dark:text-green-300">Sudah Melamar</p>
							<p class="text-xs text-green-600 capitalize dark:text-green-400">
								Status: {data.application.status}
							</p>
						</div>
					</div>

					{#if data.application.status === 'pending'}
						<form
							method="POST"
							action="?/withdraw"
							use:enhance={() => {
								withdrawing = true;
								return async ({ result }) => {
									withdrawing = false;
									if (result.type === 'success') {
										toast.success('Lamaran berhasil ditarik');
										window.location.reload();
									}
								};
							}}
						>
							<button
								type="submit"
								disabled={withdrawing}
								class={`${RADIUS.button} w-full border border-red-200 px-4 py-3 text-xs font-bold tracking-widest text-red-600 uppercase ${TRANSITION.all} hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20`}
							>
								{withdrawing ? 'Menarik...' : 'Tarik Lamaran'}
							</button>
						</form>
					{/if}
				{:else if data.isOrgMember}
					<div class="rounded-xl bg-zinc-50 p-6 text-center dark:bg-zinc-800/50">
						<Icon name="info" size={32} class="mx-auto mb-3 text-zinc-400" />
						<p class={`text-sm ${COLOR.textMuted}`}>
							Anda adalah anggota organisasi ini, jadi tidak perlu melamar.
						</p>
					</div>
				{:else if !showApplyForm}
					<div class="text-center">
						<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Tertarik?</h3>
						<p class={`mb-6 text-sm ${COLOR.textMuted}`}>Kirim lamaran Anda untuk posisi ini</p>
						<button
							onclick={() => (showApplyForm = true)}
							class={`${RADIUS.button} w-full ${COLOR.accentBg} px-6 py-4 text-xs font-bold tracking-widest text-white uppercase shadow-xl ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-2xl`}
						>
							Kirim Lamaran
						</button>
					</div>
				{:else}
					<form
						method="POST"
						action="?/apply"
						use:enhance={() => {
							applying = true;
							return async ({ result }) => {
								applying = false;
								if (result.type === 'success') {
									toast.success('Lamaran berhasil dikirim!');
									window.location.reload();
								} else if (result.type === 'failure') {
									const d = result.data as { error?: string } | undefined;
									toast.error(d?.error || 'Gagal mengirim lamaran');
								}
							};
						}}
						class="space-y-5"
					>
						<div>
							<label
								for="proposedRole"
								class={`mb-1.5 block text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
							>
								Posisi yang Dilamar
							</label>
							<input
								id="proposedRole"
								type="text"
								name="proposedRole"
								placeholder="Contoh: Frontend Developer"
								class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} bg-transparent px-4 py-3 text-sm ${COLOR.textPrimary} transition-all outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
							/>
						</div>

						<div>
							<label
								for="coverLetter"
								class={`mb-1.5 block text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
							>
								Cover Letter
							</label>
							<textarea
								id="coverLetter"
								name="coverLetter"
								rows="4"
								placeholder="Ceritakan mengapa Anda cocok untuk posisi ini..."
								class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} bg-transparent px-4 py-3 text-sm ${COLOR.textPrimary} transition-all outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
							></textarea>
						</div>

						<div>
							<label
								for="resumeUrl"
								class={`mb-1.5 block text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
							>
								Link Resume/CV
							</label>
							<input
								id="resumeUrl"
								type="url"
								name="resumeUrl"
								placeholder="https://drive.google.com/..."
								class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} bg-transparent px-4 py-3 text-sm ${COLOR.textPrimary} transition-all outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
							/>
						</div>

						<div>
							<label
								for="portfolioUrl"
								class={`mb-1.5 block text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
							>
								Link Portfolio
							</label>
							<input
								id="portfolioUrl"
								type="url"
								name="portfolioUrl"
								placeholder="https://..."
								class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} bg-transparent px-4 py-3 text-sm ${COLOR.textPrimary} transition-all outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
							/>
						</div>

						<div class="flex gap-3 pt-2">
							<button
								type="button"
								onclick={() => (showApplyForm = false)}
								class={`flex-1 ${RADIUS.button} border ${COLOR.cardBorder} px-4 py-3 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
							>
								Batal
							</button>
							<button
								type="submit"
								disabled={applying}
								class={`flex-1 ${RADIUS.button} ${COLOR.accentBg} px-4 py-3 text-xs font-bold tracking-widest text-white uppercase shadow-lg ${TRANSITION.all} hover:shadow-xl disabled:opacity-50`}
							>
								{applying ? 'Mengirim...' : 'Kirim Lamaran'}
							</button>
						</div>
					</form>
				{/if}
			</div>
		</div>
	</div>
</PageWrapper>
