<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';

	let { data, form }: { data: PageData; form?: ActionData | null } = $props();

	let showCreateForm = $state(false);
	let creating = $state(false);

	const statusColors: Record<string, string> = {
		active: 'bg-green-100 text-green-700',
		inactive: 'bg-gray-100 text-gray-600'
	};
</script>

<svelte:head>
	<title>Partner Management — Admin</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Partner / Organisasi">
		<button
			onclick={() => (showCreateForm = !showCreateForm)}
			class={`inline-flex items-center gap-2 ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg`}
		>
			{showCreateForm ? '✕ Tutup' : '+ Tambah Partner'}
		</button>
	</PageHeader>

	{#if showCreateForm}
		<div
			class={`mb-8 ${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} animate-in fade-in slide-in-from-top-4 p-6 duration-300`}
		>
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>Tambah Partner Baru</h2>
			<form
				method="POST"
				action="?/create"
				class="grid grid-cols-1 gap-5"
				use:enhance={() => {
					creating = true;
					return async ({ result, update }) => {
						await update();
						creating = false;
						if (result.type === 'success') {
							toast.success('Partner berhasil ditambahkan!');
							showCreateForm = false;
						} else if (result.type === 'failure') {
							const errorMsg = (result.data as any)?.error || 'Gagal menambahkan partner';
							toast.error(errorMsg);
						}
					};
				}}
			>
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label
							for="id"
							class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
						>
							Partner ID <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="id"
							name="id"
							required
							placeholder="contoh: yayasan-asib"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						/>
						<p class="mt-1 text-xs text-gray-400">ID unik untuk partner (tanpa spasi)</p>
					</div>

					<div>
						<label
							for="name"
							class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
						>
							Nama Partner <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							placeholder="contoh: Yayasan ASIB"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						/>
					</div>
				</div>

				<div>
					<label
						for="description"
						class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
					>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows="2"
						placeholder="Deskripsi partner..."
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
					></textarea>
				</div>

				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label
							for="contactEmail"
							class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
						>
							Email Kontak
						</label>
						<input
							type="email"
							id="contactEmail"
							name="contactEmail"
							placeholder="email@partner.com"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						/>
					</div>

					<div>
						<label
							for="contactPhone"
							class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
						>
							Telepon
						</label>
						<input
							type="tel"
							id="contactPhone"
							name="contactPhone"
							placeholder="+62xxx"
							class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
						/>
					</div>
				</div>

				<div class="flex gap-3">
					<button
						type="submit"
						disabled={creating}
						class={`${RADIUS.button} ${COLOR.accentBg} px-8 py-3 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50`}
					>
						{creating ? 'Menyimpan...' : 'Simpan Partner'}
					</button>
					<button
						type="button"
						onclick={() => (showCreateForm = false)}
						class={`${RADIUS.button} border ${COLOR.cardBorder} px-6 py-3 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.all} hover:bg-gray-50`}
					>
						Batal
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Stats Summary -->
	{#if data.partners.length > 0}
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<StatCard value={data.stats.totalPartners} label="Total Partners" variant="default" />
			<StatCard
				value={data.stats.totalEnrollments}
				label="Total Student Enrollments"
				variant="accent"
			/>
		</div>
	{/if}

	<!-- Partners Table -->
	{#if data.partners.length === 0}
		<div class="flex flex-col items-center justify-center py-20 text-center">
			<div class="mb-4 text-5xl">🏢</div>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Belum Ada Partner</h3>
			<p class={`${COLOR.textSecondary} max-w-sm text-sm`}>
				Tambahkan partner/organisasi untuk melacak siswa dari yayasan atau institusi tertentu.
			</p>
		</div>
	{:else}
		<div
			class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}
		>
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-gray-100 bg-gray-50/70">
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Partner</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Kontak</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Students</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Tracks</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Status</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Aksi</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each data.partners as partner}
							<tr class="transition-colors hover:bg-blue-50/20">
								<td class="px-5 py-4">
									<p class={`text-sm font-bold ${COLOR.textPrimary}`}>{partner.name}</p>
									<p class="mt-0.5 text-[10px] text-gray-400">#{partner.id}</p>
									{#if partner.description}
										<p class={`text-xs ${COLOR.textMuted} mt-1 max-w-[200px] truncate`}>
											{partner.description}
										</p>
									{/if}
								</td>
								<td class="px-5 py-4">
									{#if partner.contactEmail}
										<p class={`text-xs ${COLOR.textSecondary}`}>{partner.contactEmail}</p>
									{/if}
									{#if partner.contactPhone}
										<p class={`text-xs ${COLOR.textMuted}`}>{partner.contactPhone}</p>
									{/if}
									{#if !partner.contactEmail && !partner.contactPhone}
										<span class={`text-xs ${COLOR.textMuted}`}>-</span>
									{/if}
								</td>
								<td class="px-5 py-4">
									<div class="flex flex-col gap-1">
										<span class="text-lg font-black text-blue-600">{partner.totalStudents}</span>
										<div class="flex gap-2 text-[10px]">
											<span class="text-green-600">{partner.activeStudents} aktif</span>
											<span class="text-gray-400">{partner.completedStudents} selesai</span>
										</div>
									</div>
								</td>
								<td class="px-5 py-4">
									<div class="flex gap-2 text-xs">
										{#if partner.tracks.creator > 0}
											<span class="text-purple-600">🎥 {partner.tracks.creator}</span>
										{/if}
										{#if partner.tracks.seller > 0}
											<span class="text-orange-600">🛒 {partner.tracks.seller}</span>
										{/if}
										{#if partner.tracks.affiliate > 0}
											<span class="text-teal-600">🔗 {partner.tracks.affiliate}</span>
										{/if}
									</div>
								</td>
								<td class="px-5 py-4">
									<span
										class={`inline-block rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${statusColors[partner.status] ?? 'bg-gray-100 text-gray-500'}`}
									>
										{partner.status}
									</span>
								</td>
								<td class="px-5 py-4">
									<form
										method="POST"
										action="?/updateStatus"
										use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'success') {
													toast.success('Status partner diperbarui!');
												} else if (result.type === 'failure') {
													const errorMsg =
														(result.data as any)?.error || 'Gagal memperbarui status';
													toast.error(errorMsg);
												}
											};
										}}
									>
										<input type="hidden" name="partnerId" value={partner.id} />
										<input
											type="hidden"
											name="status"
											value={partner.status === 'active' ? 'inactive' : 'active'}
										/>
										<button
											type="submit"
											class={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
												partner.status === 'active'
													? 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
													: 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
											}`}
										>
											{partner.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</PageWrapper>
