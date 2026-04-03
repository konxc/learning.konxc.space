<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { formToast } from '$lib/utils/formEnhance';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let score = $state(data.submission.gradeScore ?? 75);
	let feedback = $state(data.submission.gradeFeedback ?? '');

	const quickScores = [0, 25, 50, 75, 100];

	// Parse payload safely
	let payloadContent = $derived(() => {
		if (!data.submission.payload) return null;
		try {
			return JSON.parse(data.submission.payload) as Record<string, unknown>;
		} catch {
			return { raw: data.submission.payload };
		}
	});

	function formatDate(d: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(d));
	}
</script>

<svelte:head>
	<title>Grade Submission — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-3xl">
		<div class="mb-6">
			<a
				href="/app/organizations/{data.membership?.orgId}/mentor/grading"
				class={`mb-3 inline-flex items-center ${TEXT.small} ${COLOR.accent} font-semibold ${TRANSITION.colors} hover:underline`}
			>
				← Kembali ke Queue
			</a>
			<PageHeader title="Grade Submission" />
		</div>

		<!-- Student & submission info -->
		<div
			class={`mb-6 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} p-6`}
		>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
				<div>
					<p class={`${TEXT.small} ${COLOR.textMuted} mb-1`}>Student</p>
					<p class={`text-sm font-semibold ${COLOR.textPrimary}`}>
						{data.submission.studentName || data.submission.studentUsername}
					</p>
					<p class={`text-xs ${COLOR.textMuted}`}>@{data.submission.studentUsername}</p>
				</div>
				<div>
					<p class={`${TEXT.small} ${COLOR.textMuted} mb-1`}>Kursus</p>
					<p class={`text-sm font-semibold ${COLOR.textPrimary}`}>{data.submission.courseTitle}</p>
				</div>
				<div>
					<p class={`${TEXT.small} ${COLOR.textMuted} mb-1`}>Lesson</p>
					<p class={`text-sm ${COLOR.textSecondary}`}>{data.submission.lessonTitle || '—'}</p>
				</div>
				<div>
					<p class={`${TEXT.small} ${COLOR.textMuted} mb-1`}>Dikirim</p>
					<p class={`text-sm ${COLOR.textSecondary}`}>{formatDate(data.submission.createdAt)}</p>
				</div>
			</div>
		</div>

		<!-- Submission content -->
		<div
			class={`mb-6 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} p-6`}
		>
			<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Konten Submission</h3>
			{#if payloadContent()}
				<div class={`rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50`}>
					{#each Object.entries(payloadContent() ?? {}) as [key, val]}
						<div class="mb-3">
							<p class={`text-xs font-semibold uppercase ${COLOR.textMuted} mb-1`}>{key}</p>
							<p class={`text-sm ${COLOR.textPrimary} whitespace-pre-wrap`}>{String(val)}</p>
						</div>
					{/each}
				</div>
			{:else}
				<p class={`text-sm ${COLOR.textMuted} italic`}>Tidak ada konten submission.</p>
			{/if}
		</div>

		<!-- Grading form -->
		<PageSection>
			<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-6`}>
				{data.submission.gradeId ? 'Update Penilaian' : 'Beri Penilaian'}
			</h3>

			<form
				method="post"
				action="?/grade"
				use:enhance={formToast({ success: 'Penilaian disimpan', error: 'Gagal menyimpan' })}
				class="space-y-6"
			>
				<!-- Score -->
				<div class="flex flex-col gap-3">
					<label for="score-input" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
						Score (0-100)
					</label>
					<div class="flex flex-wrap items-center gap-3">
						<input
							id="score-input"
							type="number"
							name="score"
							bind:value={score}
							min="0"
							max="100"
							required
							class={`w-24 ${RADIUS.input} border ${COLOR.cardBorder} px-3 py-2 text-sm ${COLOR.textPrimary} outline-none ${TRANSITION.colors} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10`}
						/>
						<!-- Quick score buttons -->
						{#each quickScores as qs}
							<button
								type="button"
								onclick={() => (score = qs)}
								class={`px-4 py-2 text-sm font-semibold ${RADIUS.button} ${TRANSITION.colors} ${
									score === qs
										? `${COLOR.accentBg} text-white`
										: `${COLOR.neutral} ${COLOR.textSecondary} hover:bg-zinc-200 dark:hover:bg-zinc-700`
								}`}
							>
								{qs}
							</button>
						{/each}
					</div>
					<!-- Score bar -->
					<div class="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
						<div
							class={`h-full rounded-full ${TRANSITION.all} ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
							style="width: {score}%"
						></div>
					</div>
				</div>

				<!-- Feedback -->
				<div class="flex flex-col gap-2">
					<label for="feedback-input" class={`text-sm font-semibold ${COLOR.textPrimary}`}>
						Feedback
					</label>
					<textarea
						id="feedback-input"
						name="feedback"
						bind:value={feedback}
						rows="5"
						placeholder="Berikan feedback konstruktif untuk student..."
						class={`${RADIUS.input} border ${COLOR.cardBorder} px-4 py-3 text-sm ${COLOR.textPrimary} outline-none ${TRANSITION.colors} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10`}
					></textarea>
				</div>

				<button
					type="submit"
					class={`w-full py-3 text-sm font-semibold ${RADIUS.button} ${COLOR.accentBg} text-white ${TRANSITION.colors} hover:bg-blue-700`}
				>
					{data.submission.gradeId ? 'Update Penilaian' : 'Simpan Penilaian'}
				</button>
			</form>
		</PageSection>
	</div>
</PageWrapper>
