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
	<div class="max-w-4xl mx-auto space-y-8">
		<!-- Back link -->
		<a href="/app/discussion" class="inline-flex items-center gap-2 text-xs font-black tracking-widest text-zinc-400 uppercase hover:text-blue-600 transition-colors">
			<Icon name="arrow-left" size={14} /> Back to Hub
		</a>

		<!-- Main Post -->
		<article class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} border overflow-hidden p-8 lg:p-10 shadow-sm relative`}>
			<div class="flex items-start gap-8">
				<!-- Upvotes Column -->
				<div class="flex flex-col items-center gap-2 pt-2">
					<form method="POST" action="?/upvote" use:enhance>
						<button type="submit" class="p-2 rounded-xl bg-zinc-50 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90 dark:bg-zinc-900 border {COLOR.cardBorder}">
							<Icon name="thumbs-up" size={24} />
						</button>
					</form>
					<span class="text-xl font-black text-zinc-900 dark:text-white leading-tight">{data.discussion.upvotes || 0}</span>
					<span class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Points</span>
				</div>

				<!-- Content Column -->
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-3 mb-4">
						<div class="h-10 w-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl shadow-lg border border-white dark:border-zinc-700">
							{data.discussion.user.role === 'admin' ? '🛡️' : data.discussion.user.role === 'mentor' ? '👨‍🏫' : '👤'}
						</div>
						<div>
							<p class="text-[10px] font-black tracking-widest text-zinc-900 dark:text-white uppercase leading-none mb-1">
								{data.discussion.user.fullName || data.discussion.user.username}
							</p>
							<p class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
								{data.discussion.user.role} • {formatDate(data.discussion.createdAt)}
							</p>
						</div>
					</div>

					<h1 class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
						{data.discussion.title}
					</h1>

					<div class="prose prose-zinc dark:prose-invert max-w-none mb-8 leading-relaxed text-zinc-600 dark:text-zinc-300">
						{data.discussion.content}
					</div>

					{#if data.discussion.course}
						<div class="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 dark:border-blue-900/30 dark:bg-blue-900/10">
							<Icon name="tag" size={12} class="text-blue-600" />
							<span class="text-[10px] font-black tracking-widest text-blue-600 uppercase">Topic: {data.discussion.course.title}</span>
						</div>
					{/if}
				</div>
			</div>
		</article>

		<!-- Discussion Stats -->
		<div class="flex items-center gap-8 px-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
			<h2 class="text-sm font-black tracking-widest text-zinc-400 uppercase">Comments & Replies ({data.replies.length})</h2>
		</div>

		<!-- Replies Section -->
		<div class="space-y-6">
			{#each data.replies as reply}
				<div class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} border p-6 flex items-start gap-5`} in:fade>
					<div class="h-10 w-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-xl shrink-0 border border-zinc-100 dark:border-zinc-700">
						{reply.user.role === 'admin' ? '🛡️' : reply.user.role === 'mentor' ? '👨‍🏫' : '👤'}
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-3 mb-2">
							<span class="text-[10px] font-black tracking-widest text-zinc-900 dark:text-white uppercase">
								{reply.user.fullName || reply.user.username}
							</span>
							<span class="text-[9px] font-bold text-zinc-400">
								{formatDate(reply.createdAt)}
							</span>
						</div>
						<p class="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
							{reply.content}
						</p>
					</div>
				</div>
			{:else}
				<div class="text-center py-12 {RADIUS.card} bg-zinc-50/50 border-2 border-dashed border-zinc-100 dark:bg-zinc-900/10 dark:border-zinc-800">
					<p class="text-xs font-bold text-zinc-400 uppercase tracking-widest">No replies yet. Be the first!</p>
				</div>
			{/each}
		</div>

		<!-- Add Reply Form -->
		<div class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} border p-8 shadow-xl mt-12 bg-white relative overflow-hidden`}>
			<div class="absolute top-0 right-0 p-4">
				<Icon name="message-square" size={48} class="text-zinc-100 dark:text-zinc-800 -rotate-12" />
			</div>
			
			<h3 class="text-sm font-black tracking-widest text-zinc-900 dark:text-white uppercase mb-6 relative z-10">Add Your Reply</h3>
			
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
				class="space-y-4 relative z-10"
			>
				<textarea
					name="content"
					bind:value={replyContent}
					rows="4"
					required
					class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} bg-white p-4 text-sm outline-none focus:border-blue-500 dark:bg-zinc-900 transition-all`}
					placeholder="Share your thoughts or answer questions..."
				></textarea>
				
				<div class="flex justify-end pt-2">
					<Button type="submit" variant="primary" class="px-10">Post Reply</Button>
				</div>
			</form>
		</div>
	</div>
</PageWrapper>
