<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let answers: Record<string, string> = $state({});
	let isSubmitting = $state(false);
	let showResult = $state(false);
	let result: { score: number; passingScore: number; passed: boolean } | null = $state(null);
	let form = $state<HTMLFormElement | undefined>(undefined);

	import type { SubmitFunction, ActionResult } from '@sveltejs/kit';
	function handleSubmit({ result: actionResult }: Parameters<SubmitFunction>[0]) {
		const resultData = actionResult as ActionResult<{
			score: number;
			passingScore: number;
			passed: boolean;
		}>;
		if (resultData?.type === 'success' && resultData.data) {
			result = {
				score: resultData.data.score,
				passingScore: resultData.data.passingScore,
				passed: resultData.data.passed
			};
			showResult = true;
		}
	}

	function getResultStatus() {
		if (!result) return '';
		return result.passed ? 'passed' : 'failed';
	}
</script>

<svelte:head>
	<title>{data.quiz.title} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-3xl">
		<div class="mb-8 border-b-2 border-gray-200 pb-5 text-center dark:border-neutral-800">
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>{data.quiz.title}</h1>
			<p class={`${TEXT.body} ${COLOR.textMuted}`}>Passing Score: {data.quiz.passingScore}%</p>
		</div>

		{#if data.hasSubmitted && data.submission}
			<PageSection>
				<div class="px-5 py-10 text-center">
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-6`}>Quiz Results</h2>
					<div class="mb-6 flex items-baseline justify-center">
						<span class={`text-7xl leading-none font-bold ${COLOR.accent}`}
							>{data.submission.score}</span
						>
						<span class={`text-4xl ${COLOR.textMuted} ml-2`}>/ 100</span>
					</div>
					<div>
						{#if data.submission.score !== null && data.submission.score >= data.quiz.passingScore}
							<p class={`${TEXT.body} mb-2 text-xl font-semibold ${COLOR.success}`}>
								✓ Congratulations! You passed the quiz.
							</p>
						{:else}
							<p class={`${TEXT.body} mb-2 text-xl font-semibold ${COLOR.error}`}>
								✗ You didn't pass. Keep learning and try again!
							</p>
							<p class={`${TEXT.body} ${COLOR.textMuted}`}>
								You need at least {data.quiz.passingScore}% to pass.
							</p>
						{/if}
					</div>
					<a
						href="/dashboard/courses/{$page.params.courseId}/learn"
						class={`mt-6 inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-6 py-3 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						Continue Learning →
					</a>
				</div>
			</PageSection>
		{:else if showResult && result}
			<PageSection>
				<div class="px-5 py-10 text-center">
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-6`}>Quiz Results</h2>
					<div class="mb-6 flex items-baseline justify-center">
						<span class={`text-7xl leading-none font-bold ${COLOR.accent}`}>{result.score}</span>
						<span class={`text-4xl ${COLOR.textMuted} ml-2`}>/ 100</span>
					</div>
					<div>
						{#if result.passed}
							<p class={`${TEXT.body} mb-2 text-xl font-semibold ${COLOR.success}`}>
								✓ Congratulations! You passed the quiz.
							</p>
						{:else}
							<p class={`${TEXT.body} mb-2 text-xl font-semibold ${COLOR.error}`}>
								✗ You didn't pass. Keep learning and try again!
							</p>
							<p class={`${TEXT.body} ${COLOR.textMuted}`}>
								You need at least {result.passingScore}% to pass.
							</p>
						{/if}
					</div>
					<a
						href="/dashboard/courses/{$page.params.courseId}/learn"
						class={`mt-6 inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-6 py-3 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						Continue Learning →
					</a>
				</div>
			</PageSection>
		{:else}
			<form bind:this={form} method="post" action="?/submitQuiz" use:enhance={handleSubmit}>
				<input type="hidden" name="answers" value={JSON.stringify(answers)} />

				<div class="mb-8 space-y-5">
					{#each data.quiz.questions || [] as question, idx}
						<PageSection>
							<div class="mb-3 flex items-center justify-between">
								<span class={`${TEXT.button} ${COLOR.accent} font-semibold`}>
									Question {idx + 1}
								</span>
							</div>
							<p class={`${TEXT.body} text-lg ${COLOR.textPrimary} mb-4 leading-relaxed`}>
								{question.question}
							</p>
							<div class="flex flex-col gap-3">
								{#each question.choices as choice}
									<label
										class={`flex items-center gap-3 px-3 py-3 ${RADIUS.small} ${COLOR.card} ${COLOR.cardBorder} cursor-pointer border ${TRANSITION.all} focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 hover:border-blue-600 hover:bg-blue-50/50 dark:focus-within:ring-blue-900/50 dark:hover:bg-blue-950/20`}
									>
										<input
											type="radio"
											name="question_{question.id}"
											value={choice.id}
											bind:group={answers[question.id]}
											class="h-5 w-5 cursor-pointer accent-blue-600"
										/>
										<span class={`flex-1 ${TEXT.body} ${COLOR.textPrimary}`}>{choice.text}</span>
									</label>
								{/each}
							</div>
						</PageSection>
					{/each}
				</div>

				<PageSection>
					<div class="border-t-2 border-gray-200 pt-6 text-center dark:border-neutral-800">
						<button
							type="submit"
							class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-12 py-3.5 ${TEXT.button} text-lg font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 ${
								isSubmitting ? 'cursor-not-allowed opacity-60' : ''
							}`}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Submitting...' : 'Submit Quiz'}
						</button>
						<p class={`mt-3 ${TEXT.small} ${COLOR.textMuted}`}>
							Make sure you've answered all questions before submitting.
						</p>
					</div>
				</PageSection>
			</form>
		{/if}
	</div>
</PageWrapper>
