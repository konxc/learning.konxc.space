<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let newPostContent = $state('');
	let replyContent = $state('');
	let replyingTo = $state<string | null>(null);
	let isSubmitting = $state(false);

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(date));
	}

	function toggleReply(discussionId: string) {
		replyingTo = replyingTo === discussionId ? null : discussionId;
		replyContent = '';
	}
</script>

<svelte:head>
	<title>Discussion: {data.lesson.title} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-3xl">
		<div class="mb-6">
			<a
				href="/app/explore/{$page.params.courseId}/learn"
				class={`${TEXT.body} ${COLOR.accent} hover:underline`}
			>
				← Back to {data.lesson.title}
			</a>
		</div>

		<div class="mb-8 border-b-2 border-gray-200 pb-5 dark:border-neutral-800">
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>Discussion</h1>
			<p class={`${TEXT.body} ${COLOR.textMuted}`}>{data.lesson.title}</p>
		</div>

		<!-- New Discussion Form -->
		<PageSection>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Start a new discussion</h3>
			<form
				method="post"
				action="?/create"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						newPostContent = '';
						await update();
					};
				}}
			>
				<textarea
					name="content"
					bind:value={newPostContent}
					rows="4"
					placeholder="Ask a question or share your thoughts about this lesson..."
					class={`w-full px-4 py-3 ${RADIUS.small} border ${COLOR.cardBorder} ${COLOR.card} ${TEXT.body} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50`}
					required
				></textarea>
				<div class="mt-3 flex justify-end">
					<button
						type="submit"
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-6 py-2.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.cardHover} disabled:cursor-not-allowed disabled:opacity-50`}
						disabled={isSubmitting || !newPostContent.trim()}
					>
						{isSubmitting ? 'Posting...' : 'Post Discussion'}
					</button>
				</div>
			</form>
		</PageSection>

		<!-- Discussions List -->
		<div class="space-y-4">
			{#each data.discussions as discussion}
				<PageSection>
					<div class="flex gap-4">
						<!-- Upvote Button -->
						<form method="post" action="?/upvote" use:enhance>
							<input type="hidden" name="discussionId" value={discussion.id} />
							<button
								type="submit"
								class={`flex flex-col items-center justify-center px-3 py-2 ${RADIUS.small} ${COLOR.card} ${COLOR.cardBorder} border ${TRANSITION.all} hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20`}
							>
								<span class="text-lg">▲</span>
								<span class={`${TEXT.small} font-semibold ${COLOR.textPrimary}`}
									>{discussion.upvotes}</span
								>
							</button>
						</form>

						<!-- Discussion Content -->
						<div class="flex-1">
							<div class="mb-2 flex items-center gap-2">
								<span class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>
									{discussion.user.fullName || discussion.user.username}
								</span>
								<span class={`${TEXT.small} ${COLOR.textMuted}`}>
									{formatDate(discussion.createdAt)}
								</span>
							</div>
							<p class={`${TEXT.body} ${COLOR.textPrimary} whitespace-pre-wrap`}>
								{discussion.content}
							</p>

							<div class="mt-3 flex items-center gap-4">
								<button
									type="button"
									onclick={() => toggleReply(discussion.id)}
									class={`${TEXT.small} ${COLOR.accent} hover:underline`}
								>
									Reply ({discussion.replyCount})
								</button>
							</div>

							<!-- Reply Form -->
							{#if replyingTo === discussion.id}
								<form
									method="post"
									action="?/reply"
									use:enhance={() => {
										isSubmitting = true;
										return async ({ update }) => {
											isSubmitting = false;
											replyingTo = null;
											replyContent = '';
											await update();
										};
									}}
									class="mt-4"
								>
									<input type="hidden" name="parentId" value={discussion.id} />
									<textarea
										name="content"
										bind:value={replyContent}
										rows="3"
										placeholder="Write your reply..."
										class={`w-full px-4 py-3 ${RADIUS.small} border ${COLOR.cardBorder} ${COLOR.card} ${TEXT.body} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50`}
										required
									></textarea>
									<div class="mt-2 flex justify-end gap-2">
										<button
											type="button"
											onclick={() => toggleReply(discussion.id)}
											class={`px-4 py-2 ${RADIUS.button} ${COLOR.card} ${COLOR.cardBorder} border ${TEXT.button}`}
										>
											Cancel
										</button>
										<button
											type="submit"
											class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-4 py-2 ${TEXT.button} font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50`}
											disabled={isSubmitting || !replyContent.trim()}
										>
											{isSubmitting ? 'Posting...' : 'Reply'}
										</button>
									</div>
								</form>
							{/if}
						</div>
					</div>
				</PageSection>
			{:else}
				<PageSection>
					<div class="py-10 text-center">
						<p class={`${TEXT.body} ${COLOR.textMuted}`}>
							No discussions yet. Be the first to ask a question!
						</p>
					</div>
				</PageSection>
			{/each}
		</div>
	</div>
</PageWrapper>
