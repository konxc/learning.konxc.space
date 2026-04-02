<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toastStore';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, SPACING } from '$lib/config/design';
	import { fade, fly } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date) {
		return new Date(date).toLocaleString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	let replyContent = $state('');
</script>

<svelte:head>
	<title>{data.discussion.title} - Forum Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-4xl space-y-8">
		<!-- Back link -->
		<a
			href="/app/discussion"
			class="inline-flex items-center gap-2 text-xs font-black tracking-widest text-zinc-400 uppercase transition-colors hover:text-blue-600"
		>
			<Icon name="arrow-left" size={14} /> Back to Hub
		</a>

		<!-- Main Post -->
		<article
			class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} relative overflow-hidden border p-8 shadow-sm lg:p-10`}
		>
			<div class="flex items-start gap-8">
				<!-- Upvotes Column -->
				<div class="flex flex-col items-center gap-2 pt-2">
					<form method="POST" action="?/upvote" use:enhance>
						<button
							type="submit"
							class="rounded-xl border bg-zinc-50 p-2 transition-all hover:bg-blue-50 hover:text-blue-600 active:scale-90 dark:bg-zinc-900 {COLOR.cardBorder}"
						>
							<Icon name="thumbs-up" size={24} />
						</button>
					</form>
					<span class="text-xl leading-tight font-black text-zinc-900 dark:text-white"
						>{data.discussion.upvotes || 0}</span
					>
					<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase">Points</span>
				</div>

				<!-- Content Column -->
				<div class="min-w-0 flex-1">
					<div class="mb-4 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-zinc-100 text-xl shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
						>
							{data.discussion.user.role === 'admin' ? '🛡️' : '👤'}
						</div>
						<div>
							<p
								class="mb-1 text-[10px] leading-none font-black tracking-widest text-zinc-900 uppercase dark:text-white"
							>
								{data.discussion.user.fullName || data.discussion.user.username}
							</p>
							<p class="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
								{data.discussion.user.role} • {formatDate(data.discussion.createdAt)}
							</p>
						</div>
					</div>

					<h1 class="mb-6 text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
						{data.discussion.title}
					</h1>

					<div
						class="prose mb-8 max-w-none leading-relaxed text-zinc-600 prose-zinc dark:text-zinc-300 dark:prose-invert"
					>
						{data.discussion.content}
					</div>

					{#if data.discussion.course}
						<div
							class="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 dark:border-blue-900/30 dark:bg-blue-900/10"
						>
							<Icon name="tag" size={12} class="text-blue-600" />
							<span class="text-[10px] font-black tracking-widest text-blue-600 uppercase"
								>Topic: {data.discussion.course.title}</span
							>
						</div>
					{/if}
				</div>
			</div>
		</article>

		<!-- Discussion Stats -->
		<div class="flex items-center gap-8 border-b border-zinc-100 px-4 pb-4 dark:border-zinc-800">
			<h2 class="text-sm font-black tracking-widest text-zinc-400 uppercase">
				Comments & Replies ({data.replies.length})
			</h2>
		</div>

		<!-- Replies Section -->
		<div class="space-y-6">
			{#each data.replies as reply}
				<div
					class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} flex items-start gap-5 border p-6`}
					in:fade
				>
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50 text-xl dark:border-zinc-700 dark:bg-zinc-800"
					>
						{reply.user.role === 'admin' ? '🛡️' : '👤'}
					</div>
					<div class="min-w-0 flex-1">
						<div class="mb-2 flex items-center gap-3">
							<span
								class="text-[10px] font-black tracking-widest text-zinc-900 uppercase dark:text-white"
							>
								{reply.user.fullName || reply.user.username}
							</span>
							<span class="text-[9px] font-bold text-zinc-400">
								{formatDate(reply.createdAt)}
							</span>
						</div>
						<p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
							{reply.content}
						</p>
					</div>
				</div>
			{:else}
				<div
					class="text-center py-12 {RADIUS.card} bg-zinc-50/50 border-2 border-dashed border-zinc-100 dark:bg-zinc-900/10 dark:border-zinc-800"
				>
					<p class="text-xs font-bold text-zinc-400 uppercase tracking-widest">
						No replies yet. Be the first!
					</p>
				</div>
			{/each}
		</div>

		<!-- Add Reply Form -->
		<div
			class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} relative mt-12 overflow-hidden border bg-white p-8 shadow-xl`}
		>
			<div class="absolute top-0 right-0 p-4">
				<Icon name="message-square" size={48} class="-rotate-12 text-zinc-100 dark:text-zinc-800" />
			</div>

			<h3
				class="relative z-10 mb-6 text-sm font-black tracking-widest text-zinc-900 uppercase dark:text-white"
			>
				Add Your Reply
			</h3>

			<form
				method="POST"
				action="?/addReply"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							replyContent = '';
							toast.success('Reply posted successfully');
						} else {
							toast.error('Failed to post reply');
						}
					};
				}}
				class="relative z-10 space-y-4"
			>
				<textarea
					name="content"
					bind:value={replyContent}
					rows="4"
					required
					class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} bg-white p-4 text-sm transition-all outline-none focus:border-blue-500 dark:bg-zinc-900`}
					placeholder="Share your thoughts or answer questions..."
				></textarea>

				<div class="flex justify-end pt-2">
					<Button type="submit" variant="primary" class="px-10">Post Reply</Button>
				</div>
			</form>
		</div>
	</div>
</PageWrapper>
