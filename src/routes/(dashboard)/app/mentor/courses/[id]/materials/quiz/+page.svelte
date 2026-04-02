<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { formToast } from '$lib/utils/formEnhance';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let showCreateQuizForm = $state(false);
	let showAddQuestionForm = $state<string | null>(null);
	let isPreview = $state(false);

	// Form states
	let selectedLessonId = $state<string | null>(null);
	let quizTitle = $state('');
	let passingScore = $state(70);

	let selectedQuizId = $state<string | null>(null);
	let questionText = $state('');
	let questionType = $state<'mcq' | 'multi-select' | 'free-text'>('mcq');
	let choices = $state<string[]>(['', '']);
	let correctChoice = $state('');

	function addChoice() {
		choices = [...choices, ''];
	}

	function removeChoice(i: number) {
		choices = choices.filter((_, idx) => idx !== i);
	}

	function updateChoice(i: number, val: string) {
		const next = [...choices];
		next[i] = val;
		choices = next;
	}

	// Build comma-separated choices string for form submission
	const choicesValue = $derived(choices.filter((c) => c.trim()).join(','));
</script>

<svelte:head>
	<title>Manage Quiz - {data.course.title}</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-4xl">
		<div class="mb-6">
			<a
				href="/app/mentor/courses/{data.course.id}/materials"
				class={`mb-2 inline-flex items-center ${TEXT.small} ${COLOR.textMuted} ${TRANSITION.colors} hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
			>
				← Back to Materials
			</a>
			<div class="flex items-center justify-between gap-4">
				<PageHeader title="Manage Quiz: {data.course.title}" />
				<!-- Preview toggle -->
				<button
					onclick={() => (isPreview = !isPreview)}
					class={`inline-flex items-center gap-2 ${RADIUS.button} border px-4 py-2 text-sm font-semibold ${TRANSITION.colors} ${
						isPreview
							? `${COLOR.accentBg} border-transparent text-white`
							: `${COLOR.cardBorder} ${COLOR.textSecondary} hover:border-blue-500/50 hover:text-blue-600`
					}`}
					aria-pressed={isPreview}
				>
					{isPreview ? '✏️ Edit Mode' : '👁 Preview'}
				</button>
			</div>
		</div>

		<PageSection>
			{#if isPreview}
				<!-- Preview mode: render quiz as student view -->
				<div class="space-y-8">
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Preview Mode</h2>
					{#if data.quizzes.length === 0}
						<p class={`${TEXT.body} ${COLOR.textMuted} py-10 text-center`}>Belum ada quiz.</p>
					{:else}
						{#each data.quizzes as quizItem}
							{@const quiz = quizItem.quiz}
							{@const lesson = quizItem.lesson}
							<div
								class={`${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} p-8`}
							>
								<div class="mb-6">
									<p class={`${TEXT.small} mb-1 text-blue-600`}>{lesson.title}</p>
									<h3 class={`${TEXT.h3} ${COLOR.textPrimary}`}>{quiz.title}</h3>
									<p class={`text-sm ${COLOR.textMuted} mt-1`}>
										Passing score: {quiz.passingScore}%
									</p>
								</div>
								<p class={`text-sm ${COLOR.textMuted} italic`}>
									(Pertanyaan akan ditampilkan saat student mengerjakan quiz)
								</p>
							</div>
						{/each}
					{/if}
				</div>
			{:else}
				<!-- Edit mode -->
				<div class="mb-6 flex items-center justify-between gap-4">
					<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Quizzes</h2>
					<button
						onclick={() => (showCreateQuizForm = true)}
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
					>
						+ Create Quiz
					</button>
				</div>

				{#if showCreateQuizForm}
					<div class={`mb-6 ${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
						<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4 font-semibold`}>Create New Quiz</h3>
						<form
							method="post"
							action="?/createQuiz"
							use:enhance={formToast({
								success: 'Kuis berhasil dibuat',
								error: 'Gagal membuat kuis',
								onSuccess: () => (showCreateQuizForm = false)
							})}
							class="space-y-4"
						>
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
									class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
								>
									Create Quiz
								</button>
								<button
									type="button"
									onclick={() => (showCreateQuizForm = false)}
									class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-5 py-2.5 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none`}
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
										<p class={`${TEXT.small} ${COLOR.textMuted} mt-1`}>
											Passing: {quiz.passingScore}%
										</p>
									</div>
									<button
										onclick={() =>
											(showAddQuestionForm = showAddQuestionForm === quiz.id ? null : quiz.id)}
										class={`inline-flex items-center ${RADIUS.button} border-2 border-blue-600 px-5 py-2.5 ${TEXT.button} font-semibold ${COLOR.accent} ${TRANSITION.all} hover:bg-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
									>
										+ Add Question
									</button>
								</div>

								{#if showAddQuestionForm === quiz.id}
									<div class={`mt-4 ${RADIUS.small} ${COLOR.neutral} ${SPACING.cardPadding}`}>
										<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4 font-semibold`}>
											Add Question
										</h4>
										<form
											method="post"
											action="?/addQuestion"
											use:enhance={formToast({
												success: 'Pertanyaan berhasil ditambahkan',
												error: 'Gagal menambahkan pertanyaan',
												onSuccess: () => {
													questionText = '';
													choices = ['', ''];
													correctChoice = '';
													questionType = 'mcq';
												}
											})}
											class="space-y-4"
										>
											<input type="hidden" name="quizId" value={quiz.id} />
											<input type="hidden" name="choices" value={choicesValue} />

											<!-- Question type selector -->
											<div class="flex flex-col gap-2">
												<label
													for="q-type-{quiz.id}"
													class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
												>
													Question Type
												</label>
												<select
													id="q-type-{quiz.id}"
													bind:value={questionType}
													name="questionType"
													class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
												>
													<option value="mcq">Multiple Choice (MCQ)</option>
													<option value="multi-select">Multi-Select</option>
													<option value="free-text">Free Text</option>
												</select>
											</div>

											<!-- Question text -->
											<div class="flex flex-col gap-2">
												<label
													for="q-text-{quiz.id}"
													class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
												>
													Question
												</label>
												<textarea
													id="q-text-{quiz.id}"
													bind:value={questionText}
													name="question"
													placeholder="Enter your question"
													required
													rows="3"
													class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-y focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
												></textarea>
											</div>

											<!-- Dynamic choices (MCQ / multi-select only) -->
											{#if questionType === 'mcq' || questionType === 'multi-select'}
												<div class="flex flex-col gap-2">
													<span class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}>
														Choices
													</span>
													<div class="space-y-2">
														{#each choices as choice, i}
															<div class="flex items-center gap-2">
																<input
																	type="text"
																	value={choice}
																	oninput={(e) =>
																		updateChoice(i, (e.target as HTMLInputElement).value)}
																	placeholder="Choice {i + 1}"
																	class={`flex-1 ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
																/>
																{#if choices.length > 2}
																	<button
																		type="button"
																		onclick={() => removeChoice(i)}
																		class="text-sm text-red-500 hover:text-red-700"
																		aria-label="Hapus pilihan {i + 1}">✕</button
																	>
																{/if}
															</div>
														{/each}
													</div>
													<button
														type="button"
														onclick={addChoice}
														class={`self-start text-sm font-semibold ${COLOR.accent} ${TRANSITION.colors} hover:underline`}
													>
														+ Tambah Pilihan
													</button>
												</div>

												{#if questionType === 'mcq'}
													<div class="flex flex-col gap-2">
														<label
															for="q-correct-{quiz.id}"
															class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
														>
															Correct Answer
														</label>
														<input
															id="q-correct-{quiz.id}"
															type="text"
															bind:value={correctChoice}
															name="correctChoice"
															placeholder="Must match one of the choices exactly"
															required
															class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
														/>
													</div>
												{/if}
											{/if}

											<div class="flex items-center gap-3 pt-2">
												<button
													type="submit"
													class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-5 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1`}
												>
													Add Question
												</button>
												<button
													type="button"
													onclick={() => (showAddQuestionForm = null)}
													class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-5 py-2.5 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none`}
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
			{/if}
		</PageSection>
	</div>
</PageWrapper>
