<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide, fly } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';

	let { lessonId, courseId, user }: { lessonId: string; courseId: string; user: any } = $props();

	let discussions = $state<any[]>([]);
	let loading = $state(true);
	let newComment = $state('');
	let submitting = $state(false);
	let replyingTo = $state<string | null>(null);
	let replyContent = $state('');

	async function fetchDiscussions() {
		loading = true;
		try {
			const res = await fetch(`/api/discussions?lessonId=${lessonId}`);
			const data = await res.json();
			discussions = data.discussions || [];
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}

	async function postComment() {
		if (!newComment.trim()) return;
		submitting = true;
		try {
			const res = await fetch('/api/discussions', {
				method: 'POST',
				body: JSON.stringify({
					lessonId,
					courseId,
					content: newComment,
					title: 'Question' // Default title
				})
			});
			if (res.ok) {
				newComment = '';
				fetchDiscussions();
				toast.success('Question posted');
			}
		} catch (e) {
			toast.error('Failed to post');
		} finally {
			submitting = false;
		}
	}

	async function postReply(parentId: string) {
		if (!replyContent.trim()) return;
		try {
			const res = await fetch('/api/discussions', {
				method: 'POST',
				body: JSON.stringify({
					lessonId,
					courseId,
					parentId,
					content: replyContent
				})
			});
			if (res.ok) {
				replyContent = '';
				replyingTo = null;
				fetchDiscussions();
				toast.success('Reply sent');
			}
		} catch (e) {
			toast.error('Failed to reply');
		}
	}

	$effect(() => {
		if (lessonId) fetchDiscussions();
	});
</script>

<div class="space-y-8">
	<!-- Post Form -->
	<div class={`${COLOR.card} ${RADIUS.card} border-2 border-zinc-100 p-6 dark:border-zinc-800`}>
		<h3 class="mb-4 text-xs font-black tracking-widest text-zinc-400 uppercase italic">
			Ask the Operatives
		</h3>
		<textarea
			bind:value={newComment}
			class={`w-full min-h-[120px] p-4 text-sm font-medium italic ${RADIUS.input} border-2 border-dashed border-zinc-200 bg-zinc-50 outline-none focus:border-blue-500/50 dark:border-zinc-800 dark:bg-zinc-900/50`}
			placeholder="Have a question about this mission node?"
		></textarea>
		<div class="mt-4 flex justify-end">
			<Button variant="primary" size="sm" onclick={postComment} disabled={submitting}>
				{submitting ? 'Transmitting...' : 'Post Question'}
			</Button>
		</div>
	</div>

	<!-- Discussions List -->
	{#if loading}
		<div class="flex justify-center py-10">
			<div class="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
		</div>
	{:else if discussions.length === 0}
		<div class="py-20 text-center opacity-30">
			<Icon name="message-square" size={48} class="mx-auto mb-4" />
			<p class="text-[10px] font-black tracking-widest uppercase italic">Silence in the Node</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each discussions as d (d.id)}
				<div class="space-y-4" in:fade>
					<div class={`${COLOR.card} ${RADIUS.card} border border-zinc-100 p-5 dark:border-zinc-800 ${d.isPinned ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
						<div class="mb-3 flex items-start justify-between">
							<div class="flex items-center gap-3">
								<div class="h-10 w-10 shrink-0 animate-pulse overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
									{#if d.user?.avatarUrl}
										<img src={d.user.avatarUrl} alt="" class="h-full w-full object-cover" />
									{:else}
										<div class="flex h-full w-full items-center justify-center text-sm font-bold bg-blue-500 text-white">
											{d.user?.fullName?.[0] || 'U'}
										</div>
									{/if}
								</div>
								<div>
									<div class="flex items-center gap-2">
										<span class="text-xs font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">
											{d.user?.fullName || d.user?.username || 'Unknown Operative'}
										</span>
										{#if d.user?.role === 'admin' || d.user?.role === 'mentor'}
											<span class="rounded-lg bg-blue-600 px-2 py-0.5 text-[8px] font-black text-white uppercase italic tracking-widest">
												Staff
											</span>
										{/if}
									</div>
									<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase italic">
										{new Date(d.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>
							{#if d.isPinned}
								<Icon name="pin" size={12} class="text-amber-500" />
							{/if}
						</div>
						
						<p class="text-sm font-medium leading-relaxed text-zinc-700 italic dark:text-zinc-300">
							{d.content}
						</p>

						<div class="mt-4 flex items-center gap-4">
							<button class="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-zinc-400 uppercase italic hover:text-blue-600" onclick={() => replyingTo = d.id}>
								<Icon name="message-circle" size={14} /> Reply
							</button>
							<div class="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-zinc-400 uppercase italic">
								<Icon name="arrow-up" size={14} /> {d.upvotes || 0} Intel
							</div>
						</div>
					</div>

					<!-- Replies -->
					<div class="ml-10 space-y-4">
						{#each d.replies || [] as r (r.id)}
							<div class={`${COLOR.card} ${RADIUS.card} border border-zinc-100 p-4 transition-all hover:border-blue-500/20 dark:border-zinc-900`}>
								<div class="mb-2 flex items-center gap-3">
									<div class="h-8 w-8 shrink-0 animate-pulse overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
										{#if r.user?.avatarUrl}
											<img src={r.user.avatarUrl} alt="" class="h-full w-full object-cover" />
										{:else}
											<div class="flex h-full w-full items-center justify-center text-xs font-bold bg-zinc-400 text-white">
												{r.user?.fullName?.[0] || 'U'}
											</div>
										{/if}
									</div>
									<div class="flex items-center gap-2">
										<span class="text-[11px] font-black text-zinc-900 dark:text-white uppercase italic">
											{r.user?.fullName || r.user?.username}
										</span>
										{#if r.user?.role === 'admin' || r.user?.role === 'mentor'}
											<span class="rounded-lg bg-blue-600 px-2 py-0.5 text-[8px] font-black text-white uppercase italic tracking-widest">
												Staff
											</span>
										{/if}
									</div>
								</div>
								<p class="text-xs font-medium italic text-zinc-600 dark:text-zinc-400">
									{r.content}
								</p>
							</div>
						{/each}

						{#if replyingTo === d.id}
							<div class="space-y-3" in:slide>
								<textarea
									bind:value={replyContent}
									class={`w-full min-h-[80px] p-4 text-xs font-medium italic ${RADIUS.input} border-2 border-dashed border-blue-500/20 bg-blue-50/10 outline-none dark:border-blue-900/50 dark:bg-blue-950/10`}
									placeholder="Tactical response..."
								></textarea>
								<div class="flex justify-end gap-2">
									<button class="text-[10px] font-black tracking-widest text-zinc-400 uppercase italic" onclick={() => replyingTo = null}>Abort</button>
									<Button variant="primary" size="sm" onclick={() => postReply(d.id)}>Deploy Intel</Button>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
