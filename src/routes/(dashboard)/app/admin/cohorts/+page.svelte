<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form?: ActionData | null } = $props();

	let showCreateForm = $state(false);
	let creating = $state(false);

	const statusColors: Record<string, string> = {
		upcoming: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
		active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
		completed: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
	};
</script>

<svelte:head>
	<title>Kelola Batch — Admin</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Kelola Batch / Cohort">
		<button
			onclick={() => (showCreateForm = !showCreateForm)}
			class={`inline-flex items-center gap-2 ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg`}
		>
			<Icon name={showCreateForm ? 'x' : 'plus'} size={18} />
			{showCreateForm ? 'Tutup' : 'Tambah Batch'}
		</button>
	</PageHeader>

	{#if form?.error}
		<div
			class="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400"
		>
			<Icon name="alert-circle" size={18} class="inline mr-2" />
			{form.error}
		</div>
	{/if}

	{#if form?.success && form?.message}
		<div
			class="animate-in fade-in mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-bold text-green-700 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400"
		>
			<Icon name="check-circle" size={18} class="inline mr-2" />
			{form.message}
		</div>
	{/if}

	<!-- Create Form -->
	{#if showCreateForm}
		<div
			class={`mb-8 ${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} animate-in fade-in slide-in-from-top-4 p-6 duration-300`}
		>
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>Buat Batch Baru</h2>
			<form
				method="POST"
				action="?/create"
				class="grid grid-cols-1 gap-5 sm:grid-cols-2"
				use:enhance={() => {
					creating = true;
					return async ({ update }) => {
						await update();
						creating = false;
						if (form?.success) showCreateForm = false;
					};
				}}
			>
				<div class="sm:col-span-2">
					<label
						for="name"
						class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
					>
						Nama Batch <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						placeholder="contoh: Batch Digital Marketing – April 2026"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
					/>
				</div>

				<div class="sm:col-span-2">
					<label
						for="courseId"
						class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
					>
						Kursus <span class="text-red-500">*</span>
					</label>
					<select
						id="courseId"
						name="courseId"
						required
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
					>
						<option value="">-- Pilih Kursus --</option>
						{#each data.courses as course}
							<option value={course.id}>{course.title}</option>
						{/each}
					</select>
				</div>

				<div>
					<label
						for="startDate"
						class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
					>
						Tanggal Mulai <span class="text-red-500">*</span>
					</label>
					<input
						type="date"
						id="startDate"
						name="startDate"
						required
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
					/>
				</div>

				<div>
					<label
						for="endDate"
						class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
					>
						Tanggal Selesai <span class="text-gray-400">(Opsional)</span>
					</label>
					<input
						type="date"
						id="endDate"
						name="endDate"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
					/>
				</div>

				<div class="flex gap-3 sm:col-span-2">
					<button
						type="submit"
						disabled={creating}
						class={`${RADIUS.button} ${COLOR.accentBg} px-8 py-3 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50`}
					>
						{creating ? 'Menyimpan...' : 'Simpan Batch'}
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

	<!-- Admin Stats Summary -->
	{#if data.adminStats.totalStudents > 0}
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
				<p class={`text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}>
					Total Students
				</p>
				<p class={`text-3xl font-black ${COLOR.textPrimary} mt-1`}>
					{data.adminStats.totalStudents}
				</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
				<p class={`text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}>
					Active Students
				</p>
				<p class="mt-1 text-3xl font-black text-green-600">{data.adminStats.activeStudents}</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
				<p class={`text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}>
					Pending Payments
				</p>
				<p class="mt-1 text-3xl font-black text-amber-600">{data.adminStats.pendingPayments}</p>
			</div>
		</div>
	{/if}

	<!-- Cohorts Table -->
	{#if data.cohorts.length === 0}
		<div class="flex flex-col items-center justify-center py-20 text-center">
			<div class="mb-4 text-5xl">📅</div>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Belum Ada Batch</h3>
			<p class={`${COLOR.textSecondary} max-w-sm text-sm`}>
				Buat batch pertama untuk mulai mengelompokkan peserta per periode program.
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
								>Nama Batch</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted} hidden md:table-cell`}
								>Kursus</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted} hidden sm:table-cell`}
								>Periode</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Peserta</th
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
						{#each data.cohorts as cohort}
							<tr class="transition-colors hover:bg-blue-50/20">
								<td class="px-5 py-4">
									<p class={`text-sm font-bold ${COLOR.textPrimary}`}>{cohort.name}</p>
									<p class="mt-0.5 text-[10px] text-gray-400">#{cohort.id.slice(0, 8)}</p>
								</td>
								<td class="hidden px-5 py-4 md:table-cell">
									<p class={`text-sm ${COLOR.textSecondary} max-w-[200px] truncate`}>
										{cohort.courseTitle}
									</p>
								</td>
								<td class="hidden px-5 py-4 sm:table-cell">
									<p class={`text-xs ${COLOR.textMuted}`}>
										{new Date(cohort.startDate).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'short',
											year: 'numeric'
										})}
										{#if cohort.endDate}
											<span class="mx-1">→</span>
											{new Date(cohort.endDate).toLocaleDateString('id-ID', {
												day: 'numeric',
												month: 'short',
												year: 'numeric'
											})}
										{/if}
									</p>
								</td>
								<td class="px-5 py-4">
									<div class="flex flex-col gap-1">
										<div class="flex items-center gap-2">
											<span class="text-lg font-black text-blue-600">{cohort.enrollmentCount}</span>
											<span class={`text-xs ${COLOR.textMuted}`}>peserta</span>
										</div>
										{#if cohort.stats && cohort.enrollmentCount > 0}
											<div class="flex gap-2 text-[10px]">
												{#if cohort.stats.tracks.creator > 0}
													<span class="text-purple-600 dark:text-purple-400">{cohort.stats.tracks.creator}</span>
												{/if}
												{#if cohort.stats.tracks.seller > 0}
													<span class="text-orange-600 dark:text-orange-400">{cohort.stats.tracks.seller}</span>
												{/if}
												{#if cohort.stats.tracks.affiliate > 0}
													<span class="text-teal-600 dark:text-teal-400">{cohort.stats.tracks.affiliate}</span>
												{/if}
											</div>
										{/if}
									</div>
								</td>
								<td class="px-5 py-4">
									<span
										class={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${statusColors[cohort.status] ?? 'bg-gray-100 text-gray-500'}`}
									>
										{#if cohort.status === 'upcoming'}
											<Icon name="clock" size={12} />
										{:else if cohort.status === 'active'}
											<Icon name="check" size={12} />
										{:else}
											<Icon name="flag" size={12} />
										{/if}
										{cohort.status}
									</span>
								</td>
								<td class="px-5 py-4">
									<div class="flex items-center gap-2">
										<a
											href="/app/admin/cohorts/{cohort.id}"
											class="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 no-underline transition-all hover:bg-blue-100"
										>
											Detail
										</a>
										<form method="POST" action="?/updateStatus">
											<input type="hidden" name="cohortId" value={cohort.id} />
											<input
												type="hidden"
												name="status"
												value={cohort.status === 'active'
													? 'completed'
													: cohort.status === 'upcoming'
														? 'active'
														: 'active'}
											/>
											<button
												type="submit"
												class={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
													cohort.status === 'active'
														? 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
														: 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
												}`}
											>
												{cohort.status === 'active'
													? 'Selesaikan'
													: cohort.status === 'upcoming'
														? 'Aktifkan'
														: 'Aktifkan Kembali'}
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</PageWrapper>
