<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { formToast } from '$lib/utils/formEnhance';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let selectedIds = $state<Set<string>>(new Set());
	let bulkScore = $state(75);
	let bulkNotes = $state('');
	let showBulkForm = $state(false);

	const allIds = $derived(data.submissions.map((s) => s.id));
	const allSelected = $derived(selectedIds.size === allIds.length && allIds.length > 0);

	function toggleAll() {
		if (allSelected) {
			selectedIds = new Set();
		} else {
			selectedIds = new Set(allIds);
		}
	}

	function toggleOne(id: string) {
		const next = new Set(selectedIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedIds = next;
	}

	function formatDate(d: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}).format(new Date(d));
	}
</script>

<svelte:head>
	<title>Grading Queue — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-5xl">
		<PageHeader
			title="Grading Queue"
			description="Submission yang menunggu penilaian dari kursus kamu"
		/>

		<!-- Bulk action bar -->
		{#if selectedIds.size > 0}
			<div
				class={`mb-6 flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 dark:border-blue-900/50 dark:bg-blue-950/30`}
			>
				<span class="text-sm font-semibold text-blue-700 dark:text-blue-400">
					{selectedIds.size} submission dipilih
				</span>
				<button
					onclick={() => (showBulkForm = !showBulkForm)}
					class={`px-4 py-2 text-sm font-semibold ${RADIUS.button} ${COLOR.accentBg} text-white ${TRANSITION.colors} hover:bg-blue-700`}
				>
					Bulk Grade
				</button>
			</div>
		{/if}

		<!-- Bulk grade form -->
		{#if showBulkForm && selectedIds.size > 0}
			<div
				class={`mb-6 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} p-6`}
			>
				<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>
					Bulk Grade ({selectedIds.size} submission)
				</h3>
				<form
					method="post"
					action="?/bulkGrade"
					use:enhance={formToast({
						success: 'Submission berhasil dinilai',
						error: 'Gagal menilai submission',
						onSuccess: () => {
							selectedIds = new Set();
							showBulkForm = false;
						}
					})}
					class="space-y-4"
				>
					<input type="hidden" name="submissionIds" value={[...selectedIds].join(',')} />

					<div class="flex flex-col gap-2">
						<label for="bulk-score" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
							Score (0-100)
						</label>
						<div class="flex items-center gap-3">
							<input
								id="bulk-score"
								type="number"
								name="score"
								bind:value={bulkScore}
								min="0"
								max="100"
								required
								class={`w-32 ${RADIUS.input} border ${COLOR.cardBorder} px-3 py-2 text-sm ${COLOR.textPrimary} outline-none ${TRANSITION.colors} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10`}
							/>
							<!-- Quick score buttons -->
							{#each [0, 25, 50, 75, 100] as qs}
								<button
									type="button"
									onclick={() => (bulkScore = qs)}
									class={`px-3 py-1.5 text-xs font-semibold ${RADIUS.small} ${TRANSITION.colors} ${
										bulkScore === qs
											? `${COLOR.accentBg} text-white`
											: `${COLOR.neutral} ${COLOR.textSecondary} hover:bg-zinc-200 dark:hover:bg-zinc-700`
									}`}
								>
									{qs}
								</button>
							{/each}
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<label for="bulk-notes" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
							Catatan (opsional)
						</label>
						<textarea
							id="bulk-notes"
							name="notes"
							bind:value={bulkNotes}
							rows="3"
							placeholder="Feedback singkat untuk semua submission..."
							class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-2 text-sm ${COLOR.textPrimary} outline-none ${TRANSITION.colors} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10`}
						></textarea>
					</div>

					<div class="flex gap-3">
						<button
							type="submit"
							class={`px-5 py-2.5 text-sm font-semibold ${RADIUS.button} ${COLOR.accentBg} text-white ${TRANSITION.colors} hover:bg-blue-700`}
						>
							Simpan Penilaian
						</button>
						<button
							type="button"
							onclick={() => (showBulkForm = false)}
							class={`px-5 py-2.5 text-sm font-semibold ${RADIUS.button} ${COLOR.neutral} ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-200 dark:hover:bg-zinc-700`}
						>
							Batal
						</button>
					</div>
				</form>
			</div>
		{/if}

		<PageSection>
			{#if data.submissions.length === 0}
				<div class="py-20 text-center">
					<div class="mb-4 text-5xl opacity-20">✅</div>
					<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-2`}>Semua sudah dinilai!</h3>
					<p class={`text-sm ${COLOR.textMuted}`}>Tidak ada submission yang menunggu penilaian.</p>
				</div>
			{:else}
				<div class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder}`}>
					<table class="w-full border-collapse text-left">
						<thead>
							<tr class={`border-b ${COLOR.cardBorder} bg-zinc-50/70 dark:bg-zinc-800/50`}>
								<th class="px-4 py-3">
									<input
										type="checkbox"
										checked={allSelected}
										onchange={toggleAll}
										class="accent-blue-600"
										aria-label="Pilih semua"
									/>
								</th>
								<th class={`px-4 py-3 text-xs font-semibold ${COLOR.textMuted} uppercase`}
									>Student</th
								>
								<th class={`px-4 py-3 text-xs font-semibold ${COLOR.textMuted} uppercase`}
									>Kursus</th
								>
								<th class={`px-4 py-3 text-xs font-semibold ${COLOR.textMuted} uppercase`}
									>Lesson</th
								>
								<th class={`px-4 py-3 text-xs font-semibold ${COLOR.textMuted} uppercase`}
									>Tanggal</th
								>
								<th class={`px-4 py-3 text-xs font-semibold ${COLOR.textMuted} uppercase`}>Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
							{#each data.submissions as sub}
								<tr class={`${TRANSITION.colors} hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30`}>
									<td class="px-4 py-3">
										<input
											type="checkbox"
											checked={selectedIds.has(sub.id)}
											onchange={() => toggleOne(sub.id)}
											class="accent-blue-600"
											aria-label="Pilih submission {sub.id}"
										/>
									</td>
									<td class="px-4 py-3">
										<p class={`text-sm font-semibold ${COLOR.textPrimary}`}>
											{sub.studentName || sub.studentUsername}
										</p>
										<p class={`text-xs ${COLOR.textMuted}`}>@{sub.studentUsername}</p>
									</td>
									<td class={`px-4 py-3 text-sm ${COLOR.textSecondary}`}>{sub.courseTitle}</td>
									<td class={`px-4 py-3 text-sm ${COLOR.textMuted}`}>{sub.lessonTitle || '—'}</td>
									<td class={`px-4 py-3 text-xs ${COLOR.textMuted}`}>{formatDate(sub.createdAt)}</td
									>
									<td class="px-4 py-3">
										<a
											href="/app/organizations/{data.membership?.orgId}/mentor/grading/{sub.id}"
											class={`inline-flex items-center px-3 py-1.5 text-xs font-semibold ${RADIUS.small} ${COLOR.accentBg} text-white ${TRANSITION.colors} hover:bg-blue-700`}
										>
											Grade
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</PageSection>
	</div>
</PageWrapper>
