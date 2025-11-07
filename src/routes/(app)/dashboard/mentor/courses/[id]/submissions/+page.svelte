<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let selectedSubmission: any = $state(null);
	let showGradeModal = $state(false);

	function openGradeModal(submission: any) {
		selectedSubmission = submission;
		showGradeModal = true;
	}

	function closeGradeModal() {
		selectedSubmission = null;
		showGradeModal = false;
	}

	const quizSubmissions = data.submissions.filter((s) => s.submission.type === 'quiz');
	const assignmentSubmissions = data.submissions.filter((s) => s.submission.type === 'assignment');
	const pendingSubmissions = data.submissions.filter((s) => s.isPending);

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Submissions - {data.course?.title || 'Course'}</title>
</svelte:head>

<PageWrapper>
	<PageHeader title={`Student Submissions - ${data.course?.title || 'Course'}`}>
		<a
			href="/dashboard/mentor/courses"
			class={`inline-flex items-center ${TEXT.button} ${COLOR.accent} font-semibold ${TRANSITION.colors} hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
		>
			← Back to Courses
		</a>
	</PageHeader>

	<PageSection>
		<div class="mb-6 flex flex-wrap items-center gap-3">
			<a
				href="?type=quiz"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${
					$page.url.searchParams.get('type') === 'quiz'
						? `${COLOR.accentBg} border-transparent text-white`
						: `${COLOR.card} ${COLOR.textPrimary} hover:border-blue-600 hover:text-blue-600`
				} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
			>
				Quiz ({quizSubmissions.length})
			</a>
			<a
				href="?type=assignment"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${
					$page.url.searchParams.get('type') === 'assignment'
						? `${COLOR.accentBg} border-transparent text-white`
						: `${COLOR.card} ${COLOR.textPrimary} hover:border-blue-600 hover:text-blue-600`
				} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
			>
				Assignment ({assignmentSubmissions.length})
			</a>
			<a
				href="?status=pending"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${
					$page.url.searchParams.get('status') === 'pending'
						? `${COLOR.accentBg} border-transparent text-white`
						: `${COLOR.card} ${COLOR.textPrimary} hover:border-blue-600 hover:text-blue-600`
				} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
			>
				Pending ({pendingSubmissions.length})
			</a>
			<a
				href="/dashboard/mentor/courses/{data.course?.id}/submissions"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} font-semibold ${TRANSITION.all} ${COLOR.card} ${COLOR.textPrimary} hover:border-blue-600 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
			>
				All
			</a>
		</div>
	</PageSection>

	{#if data.course}
		<PageSection padding={false} noCard={false}>
			<div class="overflow-x-auto">
				{#if data.submissions.length === 0}
					<div class="px-5 py-16 text-center">
						<p class={COLOR.textSecondary}>No submissions found.</p>
					</div>
				{:else}
					<table class="w-full border-collapse">
						<thead class="bg-gray-50 dark:bg-neutral-800">
							<tr>
								<th
									class={`px-4 py-4 text-left ${TEXT.small} font-semibold tracking-wide uppercase ${COLOR.textPrimary} min-w-[200px]`}
									>Student</th
								>
								<th
									class={`px-4 py-4 text-left ${TEXT.small} font-semibold tracking-wide uppercase ${COLOR.textPrimary}`}
									>Lesson</th
								>
								<th
									class={`px-4 py-4 text-left ${TEXT.small} font-semibold tracking-wide uppercase ${COLOR.textPrimary}`}
									>Type</th
								>
								<th
									class={`px-4 py-4 text-left ${TEXT.small} font-semibold tracking-wide uppercase ${COLOR.textPrimary}`}
									>Score</th
								>
								<th
									class={`px-4 py-4 text-left ${TEXT.small} font-semibold tracking-wide uppercase ${COLOR.textPrimary}`}
									>Status</th
								>
								<th
									class={`px-4 py-4 text-left ${TEXT.small} font-semibold tracking-wide uppercase ${COLOR.textPrimary}`}
									>Submitted</th
								>
								<th
									class={`px-4 py-4 text-left ${TEXT.small} font-semibold tracking-wide uppercase ${COLOR.textPrimary}`}
									>Actions</th
								>
							</tr>
						</thead>
						<tbody>
							{#each data.submissions as submission}
								<tr>
									<td class={`border-t border-gray-200 px-4 py-4 dark:border-neutral-800`}>
										<div class="flex flex-col gap-1">
											<span class={`${TEXT.button} ${COLOR.textPrimary} font-semibold`}>
												{submission.student.fullName || submission.student.username}
											</span>
											<span class={`${TEXT.small} ${COLOR.textMuted}`}
												>{submission.student.email}</span
											>
										</div>
									</td>
									<td
										class={`border-t border-gray-200 px-4 py-4 dark:border-neutral-800 ${COLOR.textPrimary}`}
									>
										{submission.lesson?.title || 'N/A'}
									</td>
									<td class={`border-t border-gray-200 px-4 py-4 dark:border-neutral-800`}>
										<span
											class={`inline-block px-3 py-1 ${RADIUS.badge} ${TEXT.small} font-semibold capitalize ${
												submission.submission.type === 'quiz'
													? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
													: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
											}`}
										>
											{submission.submission.type}
										</span>
									</td>
									<td
										class={`border-t border-gray-200 px-4 py-4 dark:border-neutral-800 ${COLOR.textPrimary}`}
									>
										{#if submission.submission.score !== null}
											<strong>{submission.submission.score}%</strong>
										{:else}
											-
										{/if}
									</td>
									<td class={`border-t border-gray-200 px-4 py-4 dark:border-neutral-800`}>
										<span
											class={`inline-block px-3 py-1 ${RADIUS.badge} ${TEXT.small} font-semibold ${
												submission.isPending ? COLOR.warningBg : COLOR.successBg
											}`}
										>
											{submission.isPending ? 'Pending' : 'Graded'}
										</span>
									</td>
									<td
										class={`border-t border-gray-200 px-4 py-4 dark:border-neutral-800 ${COLOR.textPrimary}`}
									>
										{formatDate(submission.submission.createdAt)}
									</td>
									<td class={`border-t border-gray-200 px-4 py-4 dark:border-neutral-800`}>
										{#if submission.isPending && submission.submission.type === 'assignment'}
											<button
												class={`inline-flex items-center ${RADIUS.small} ${COLOR.accentBg} ${SPACING.button} ${TEXT.small} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
												onclick={() => openGradeModal(submission)}
												type="button"
											>
												Grade
											</button>
										{:else if submission.submission.type === 'quiz'}
											<button
												class={`inline-flex items-center ${RADIUS.small} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.small} font-semibold ${COLOR.accent} ${COLOR.card} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
												onclick={() => openGradeModal(submission)}
												type="button"
											>
												View
											</button>
										{:else}
											<button
												class={`inline-flex items-center ${RADIUS.small} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.small} font-semibold ${COLOR.accent} ${COLOR.card} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
												onclick={() => openGradeModal(submission)}
												type="button"
											>
												View Grade
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</PageSection>

		{#if showGradeModal && selectedSubmission}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
				onclick={closeGradeModal}
				role="presentation"
			>
			<div
				class={`relative max-h-[90vh] w-full max-w-2xl overflow-y-auto ${RADIUS.card} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card}`}
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') {
						closeGradeModal();
					}
				}}
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				tabindex="-1"
			>
					<button
						class={`absolute top-4 right-4 ${RADIUS.badge} p-1.5 ${COLOR.textMuted} ${TRANSITION.all} hover:${COLOR.textPrimary} hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:hover:bg-neutral-800`}
						onclick={closeGradeModal}
						type="button"
						aria-label="Close modal"
					>
						✕
					</button>

					<h2 id="modal-title" class={`${TEXT.h2} ${COLOR.textPrimary} mb-6`}>
						{#if selectedSubmission.submission.type === 'quiz'}
							Quiz Submission
						{:else}
							Grade Assignment
						{/if}
					</h2>

					<div class={`flex flex-col ${SPACING.relaxed}`}>
						<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
							<p class={`mb-2 ${TEXT.body} ${COLOR.textPrimary}`}>
								<strong>Student:</strong>
								{selectedSubmission.student.fullName || selectedSubmission.student.username}
							</p>
							<p class={`mb-2 ${TEXT.body} ${COLOR.textPrimary}`}>
								<strong>Lesson:</strong>
								{selectedSubmission.lesson?.title || 'N/A'}
							</p>
							<p class={`mb-2 ${TEXT.body} ${COLOR.textPrimary}`}>
								<strong>Type:</strong>
								{selectedSubmission.submission.type}
							</p>
							<p class={`${TEXT.body} ${COLOR.textPrimary}`}>
								<strong>Submitted:</strong>
								{formatDate(selectedSubmission.submission.createdAt)}
							</p>
						</div>

						{#if selectedSubmission.submission.type === 'quiz'}
							<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
								<p class={`mb-2 ${TEXT.body} ${COLOR.textPrimary}`}>
									<strong>Score:</strong>
									{selectedSubmission.submission.score}%
								</p>
								{#if selectedSubmission.quiz}
									<p class={`mb-2 ${TEXT.body} ${COLOR.textPrimary}`}>
										<strong>Passing Score:</strong>
										{selectedSubmission.quiz.passingScore}%
										{#if selectedSubmission.submission.score >= selectedSubmission.quiz.passingScore}
											<span class={`ml-2 ${COLOR.success}`}>✓ Passed</span>
										{:else}
											<span class={`ml-2 ${COLOR.error}`}>✗ Failed</span>
										{/if}
									</p>
								{/if}
								{#if selectedSubmission.submission.payload}
									{@const payload = JSON.parse(selectedSubmission.submission.payload)}
									<p class={`${TEXT.body} ${COLOR.textPrimary}`}>
										<strong>Correct Answers:</strong>
										{payload.correctCount} / {payload.totalQuestions}
									</p>
								{/if}
							</div>
						{:else if selectedSubmission.submission.type === 'assignment' && selectedSubmission.isPending}
							<form method="post" action="?/gradeAssignment" use:enhance class="space-y-4">
								<input type="hidden" name="submissionId" value={selectedSubmission.submission.id} />

								<div>
									<label
										for="score"
										class={`block ${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}
									>
										Score (0-100)
									</label>
									<input
										type="number"
										id="score"
										name="score"
										min="0"
										max="100"
										required
										class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
									/>
								</div>

								<div>
									<label
										for="feedback"
										class={`block ${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}
									>
										Feedback (optional)
									</label>
									<textarea
										id="feedback"
										name="feedback"
										rows="4"
										placeholder="Add feedback for the student..."
										class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-y focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
									></textarea>
								</div>

								<div class="flex items-center justify-end gap-3 pt-2">
									<button
										type="submit"
										class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:opacity-90 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
									>
										Submit Grade
									</button>
									<button
										type="button"
										onclick={closeGradeModal}
										class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
									>
										Cancel
									</button>
								</div>
							</form>
						{:else if selectedSubmission.grade}
							<div class={`${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
								<p class={`mb-2 ${TEXT.body} ${COLOR.textPrimary}`}>
									<strong>Score:</strong>
									{selectedSubmission.grade.score}%
								</p>
								{#if selectedSubmission.grade.feedback}
									<div class="mb-2">
										<p class={`mb-2 ${TEXT.button} ${COLOR.textPrimary} font-semibold`}>
											Feedback:
										</p>
										<div
											class={`${RADIUS.small} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base}`}
										>
											{selectedSubmission.grade.feedback}
										</div>
									</div>
								{/if}
								<p class={`${TEXT.small} ${COLOR.textMuted} mt-2`}>
									Graded on {formatDate(selectedSubmission.grade.gradedAt)}
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{/if}
</PageWrapper>
