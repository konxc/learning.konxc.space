<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form?: ActionData | null } = $props();

	let showCreateForm = $state(false);
	let replyingTo = $state<string | null>(null);
	let replyContent = $state('');
</script>

<svelte:head>
	<title>Discussions — {data.course.title}</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="💬 Discussions">
		<a
			href="/app/explore/{data.course.id}/learn"
			class={`inline-flex items-center gap-2 ${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.all} hover:bg-gray-50`}
		>
			← Back to Course
		</a>
	</PageHeader>

	{#if form?.error}
		<div
			class="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
		>
			⚠️ {form.error}
		</div>
	{/if}

	{#if form?.success}
		<div
			class="animate-in fade-in mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-bold text-green-700"
		>
			✅ Discussion posted successfully!
		</div>
	{/if}

	<!-- Create Discussion -->
	<div class="mb-6">
		<button
			onclick={() => (showCreateForm = !showCreateForm)}
			class={`${RADIUS.button} ${COLOR.accentBg} px-6 py-3 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg`}
		>
			{showCreateForm ? '✕ Cancel' : '+ New Discussion'}
		</button>
	</div>

	{#if showCreateForm}
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					if (form?.success) showCreateForm = false;
				};
			}}
			class={`mb-8 ${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}
		>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Start a New Discussion</h3>
			<div class="space-y-4">
				<div>
					<label
						for="title"
						class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
					>
						Title <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="title"
						name="title"
						required
						placeholder="What's your question or topic?"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
					/>
				</div>
				<div>
					<label
						for="content"
						class="mb-1.5 block text-xs font-black tracking-widest text-gray-500 uppercase"
					>
						Description <span class="text-red-500">*</span>
					</label>
					<textarea
						id="content"
						name="content"
						rows="4"
						required
						placeholder="Provide details about your question or discussion topic..."
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
					></textarea>
				</div>
				<button
					type="submit"
					class={`${RADIUS.button} ${COLOR.accentBg} px-6 py-2.5 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg`}
				>
					Post Discussion
				</button>
			</div>
		</form>
	{/if}

	<!-- Discussions List -->
	{#if data.discussions.length === 0}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<div class="mb-4 text-5xl">💬</div>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Discussions Yet</h3>
			<p class={`${COLOR.textSecondary} max-w-sm text-sm`}>
				Be the first to start a discussion about this course!
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each data.discussions as discussion}
				<div
					class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${discussion.isPinned ? 'border-amber-200 bg-amber-50/50' : COLOR.cardBorder} p-5`}
				>
					{#if discussion.isPinned}
						<div class="mb-2 text-xs font-bold text-amber-600">📌 Pinned</div>
					{/if}

					<h3 class={`font-bold ${COLOR.textPrimary} mb-2`}>{discussion.title}</h3>
					<p class={`text-sm ${COLOR.textSecondary} mb-4 line-clamp-3`}>{discussion.content}</p>

					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4 text-sm">
							<span class={`${COLOR.textMuted}`}>
								<strong>{discussion.user.fullName || discussion.user.username}</strong>
							</span>
							<span class={`${COLOR.textMuted} text-xs`}>
								{new Date(discussion.createdAt).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'short',
									year: 'numeric'
								})}
							</span>
						</div>

						<div class="flex items-center gap-3">
							<form method="POST" action="?/upvote" use:enhance>
								<input type="hidden" name="discussionId" value={discussion.id} />
								<button
									type="submit"
									class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200"
								>
									👍 {discussion.upvotes}
								</button>
							</form>

							<button
								onclick={() => (replyingTo = replyingTo === discussion.id ? null : discussion.id)}
								class="text-xs font-bold text-blue-600 hover:underline"
							>
								💬 {discussion.replyCount} Replies
							</button>
						</div>
					</div>

					<!-- Reply Form -->
					{#if replyingTo === discussion.id}
						<form
							method="POST"
							action="?/reply"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
									if (form?.success) {
										replyingTo = null;
										replyContent = '';
									}
								};
							}}
							class="mt-4 border-t border-gray-100 pt-4"
						>
							<input type="hidden" name="parentId" value={discussion.id} />
							<textarea
								name="content"
								bind:value={replyContent}
								rows="2"
								placeholder="Write a reply..."
								class={`mb-3 w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
							></textarea>
							<button
								type="submit"
								class={`${RADIUS.button} ${COLOR.accentBg} px-4 py-2 text-xs font-bold text-white`}
							>
								Post Reply
							</button>
						</form>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</PageWrapper>
