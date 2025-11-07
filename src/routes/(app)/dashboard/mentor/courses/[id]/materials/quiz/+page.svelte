<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let showCreateQuizForm = $state(false);
	let showAddQuestionForm = $state<string | null>(null);

	// Form states
	let selectedLessonId = $state<string | null>(null);
	let quizTitle = $state('');
	let passingScore = $state(70);

	let selectedQuizId = $state<string | null>(null);
	let questionText = $state('');
	let choicesText = $state('');
	let correctChoice = $state('');
</script>

<svelte:head>
	<title>Manage Quiz - {data.course.title}</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-4xl">
		<div class="mb-6">
			<a
				href="/dashboard/mentor/courses/{data.course.id}/materials"
				class={`mb-2 inline-flex items-center ${TEXT.small} ${COLOR.textMuted} ${TRANSITION.colors} hover:${COLOR.accent} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
			>
				← Back to Materials
			</a>
			<PageHeader title="Manage Quiz: {data.course.title}" />
		</div>

		<PageSection>
			<div class="mb-6 flex items-center justify-between gap-4">
				<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Quizzes</h2>
				<button
					onclick={() => (showCreateQuizForm = true)}
					class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
				>
					+ Create Quiz
				</button>
			</div>

			{#if showCreateQuizForm}
				<div class={`mb-6 ${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
					<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4 font-semibold`}>Create New Quiz</h3>
					<form method="post" action="?/createQuiz" use:enhance class="space-y-4">
						<div class="flex flex-col gap-2">
							<label
								for="create-quiz-lesson"
								class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
							>
								Select Lesson
							</label>
							<select
								id="create-quiz-lesson"
								bind:value={selectedLessonId}
								name="lessonId"
								required
								class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							>
								<option value="">Choose a lesson...</option>
								{#each data.modules as module}
									<optgroup label={module.title}>
										{#each data.lessons as lesson}
											{#if lesson.lesson.moduleId === module.id}
												<option value={lesson.lesson.id}>{lesson.lesson.title}</option>
											{/if}
										{/each}
									</optgroup>
								{/each}
							</select>
						</div>

						<div class="flex flex-col gap-2">
							<label
								for="create-quiz-title"
								class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
							>
								Quiz Title
							</label>
							<input
								id="create-quiz-title"
								type="text"
								bind:value={quizTitle}
								name="title"
								placeholder="e.g. Module 1 Quiz"
								required
								class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
						</div>

						<div class="flex flex-col gap-2">
							<label
								for="create-quiz-passing"
								class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
							>
								Passing Score (0-100)
							</label>
							<input
								id="create-quiz-passing"
								type="number"
								bind:value={passingScore}
								name="passingScore"
								min="0"
								max="100"
								required
								class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
						</div>

						<div class="flex items-center gap-3 pt-2">
							<button
								type="submit"
								class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
							>
								Create Quiz
							</button>
							<button
								type="button"
								onclick={() => (showCreateQuizForm = false)}
								class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-5 py-2.5 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-1`}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			{/if}

			{#if data.quizzes.length === 0}
				<div class="px-10 py-16 text-center">
					<p class={`${TEXT.body} ${COLOR.textMuted}`}>
						No quizzes yet. Create a quiz for your lessons to help students assess their learning.
					</p>
				</div>
			{:else}
				<div class="flex flex-col gap-4">
					{#each data.quizzes as quizItem}
						{@const quiz = quizItem.quiz}
						{@const lesson = quizItem.lesson}
						<div
							class={`${RADIUS.small} ${COLOR.cardBorder} ${COLOR.card} border ${SPACING.cardPadding}`}
						>
							<div class="mb-3 flex items-start justify-between gap-4">
								<div>
									<h3 class={`${TEXT.h4} ${COLOR.textPrimary} mb-1`}>{quiz.title}</h3>
									<p class={`${TEXT.small} ${COLOR.textMuted}`}>{lesson.title}</p>
								</div>
								<button
									onclick={() =>
										(showAddQuestionForm = showAddQuestionForm === quiz.id ? null : quiz.id)}
									class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} border-2 border-blue-600 px-5 py-2.5 ${TEXT.button} font-semibold ${COLOR.accent} ${TRANSITION.all} hover:${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
								>
									+ Add Question
								</button>
							</div>

							<div class={`${TEXT.small} ${COLOR.textMuted} mt-2`}>
								<span>Passing Score: {quiz.passingScore}%</span>
							</div>

							{#if showAddQuestionForm === quiz.id}
								<div class={`mt-4 ${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
									<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4 font-semibold`}>Add Question</h4>
									<form method="post" action="?/addQuestion" use:enhance class="space-y-4">
										<input type="hidden" name="quizId" value={quiz.id} />
										<div class="flex flex-col gap-2">
											<label
												for="add-question-text-{quiz.id}"
												class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
											>
												Question
											</label>
											<textarea
												id="add-question-text-{quiz.id}"
												bind:value={questionText}
												name="question"
												placeholder="Enter your question"
												required
												rows="3"
												class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-y focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
											></textarea>
										</div>

										<div class="flex flex-col gap-2">
											<label
												for="add-question-choices-{quiz.id}"
												class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
											>
												Choices (comma-separated)
											</label>
											<input
												id="add-question-choices-{quiz.id}"
												type="text"
												bind:value={choicesText}
												name="choices"
												placeholder="Option A, Option B, Option C, Option D"
												required
												class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
											/>
										</div>

										<div class="flex flex-col gap-2">
											<label
												for="add-question-correct-{quiz.id}"
												class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
											>
												Correct Answer
											</label>
											<input
												id="add-question-correct-{quiz.id}"
												type="text"
												bind:value={correctChoice}
												name="correctChoice"
												placeholder="Must match one of the choices exactly"
												required
												class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
											/>
										</div>

										<div class="flex items-center gap-3 pt-2">
											<button
												type="submit"
												class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
											>
												Add Question
											</button>
											<button
												type="button"
												onclick={() => (showAddQuestionForm = null)}
												class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-5 py-2.5 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-1`}
											>
												Cancel
											</button>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</PageSection>
	</div>
</PageWrapper>
