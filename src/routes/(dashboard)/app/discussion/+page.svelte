<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toastStore';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, SPACING } from '$lib/config/design';
	import { fade, fly } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	let showCreateModal = $state(false);
	let searchQuery = $state('');

	const filteredDiscussions = $derived(
		data.discussions.filter(
			(d: any) =>
				d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				d.content.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Forum Diskusi - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Discussion Hub"
		description="Join the conversation, ask questions, and share insights with the community."
	>
		<Button variant="primary" onclick={() => (showCreateModal = true)}>
			<Icon name="plus" size={16} class="mr-2" /> Start Discussion
		</Button>
	</PageHeader>

	<div class="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
		<!-- Sidebar Filters -->
		<aside class="space-y-6 lg:col-span-3">
			<div class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} border p-6 shadow-sm`}>
				<h3 class="mb-4 text-xs font-black tracking-widest text-zinc-400 uppercase">Search</h3>
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search threads..."
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 px-4 py-2 text-sm outline-none focus:border-blue-500 dark:bg-zinc-900`}
					/>
				</div>
			</div>

			<div class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} border p-6 shadow-sm`}>
				<h3 class="mb-4 text-xs font-black tracking-widest text-zinc-400 uppercase">
					Course Topics
				</h3>
				<nav class="space-y-1">
					<a
						href="/app/discussion"
						class={`flex items-center justify-between px-3 py-2 text-sm font-medium ${RADIUS.button} transition-colors ${!data.currentCourseId ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
					>
						<span>General Topics</span>
						<Icon name="hash" size={14} />
					</a>
					{#each data.enrolledCourses as course}
						<a
							href={`/app/discussion?courseId=${course.id}`}
							class={`flex items-center justify-between px-3 py-2 text-sm font-medium ${RADIUS.button} transition-colors ${data.currentCourseId === course.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
						>
							<span class="truncate pr-2">{course.title}</span>
							<Icon name="book" size={14} />
						</a>
					{/each}
				</nav>
			</div>
		</aside>

		<!-- Main Content - Discussion List -->
		<main class="space-y-6 lg:col-span-9">
			{#if filteredDiscussions.length === 0}
				<div
					class={`${RADIUS.card} border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/50`}
				>
					<div
						class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-4xl dark:bg-zinc-800"
					>
						💬
					</div>
					<h3 class="text-xl font-black text-zinc-900 dark:text-white">No discussions found</h3>
					<p class="mt-2 text-xs font-medium text-zinc-500">
						Start a new thread to get the conversation going!
					</p>
				</div>
			{:else}
				<div class="grid gap-4">
					{#each filteredDiscussions as discussion}
						<a
							href={`/app/discussion/${discussion.id}`}
							class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} flex items-start gap-5 border p-6 transition-all ${ELEVATION.cardHover} group hover:-translate-y-0.5`}
							in:fly={{ y: 20, duration: 500 }}
						>
							<div
								class="flex min-w-[64px] flex-col items-center gap-1 border-r border-zinc-100 pr-5 dark:border-zinc-800"
							>
								<span class="text-lg font-black text-blue-600">▲</span>
								<span class="text-sm font-black text-zinc-900 dark:text-white"
									>{discussion.upvotes || 0}</span
								>
								<span class="text-[9px] font-black tracking-tighter text-zinc-400 uppercase"
									>Votes</span
								>
							</div>

							<div class="min-w-0 flex-1">
								<div class="mb-1 flex items-center gap-2">
									{#if discussion.isPinned}
										<span
											class="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-amber-600 uppercase dark:bg-amber-900/20"
										>
											<Icon name="pin" size={10} /> Pinned
										</span>
									{/if}
									<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase">
										Post by {discussion.user.fullName || discussion.user.username} • {formatDate(
											discussion.createdAt
										)}
									</span>
								</div>
								<h3
									class="mb-2 text-lg font-black tracking-tight text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white"
								>
									{discussion.title}
								</h3>
								<p class="line-clamp-2 text-sm leading-relaxed text-zinc-500">
									{discussion.content}
								</p>
							</div>

							<div class="flex flex-col items-end gap-3 self-center">
								<div class="flex -space-x-2">
									<!-- Participants placeholders -->
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-xs dark:border-zinc-900"
									>
										👤
									</div>
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs text-blue-600 dark:border-zinc-900"
									>
										M
									</div>
								</div>
								<span
									class="shrink-0 text-[10px] font-black tracking-widest text-zinc-300 uppercase"
									>Open Thread</span
								>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</main>
	</div>
</PageWrapper>

<!-- Create Discussion Modal -->
<Modal
	isOpen={showCreateModal}
	title="Start New Discussion"
	onClose={() => (showCreateModal = false)}
>
	<form
		method="POST"
		action="?/createDiscussion"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					toast.success('Discussion started successfully');
					showCreateModal = false;
				} else {
					toast.error('Failed to start discussion');
				}
			};
		}}
		class="space-y-4"
	>
		<div class="space-y-2">
			<label for="courseId" class="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
				>Topic Area</label
			>
			<select
				id="courseId"
				name="courseId"
				class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} bg-white p-3 text-sm outline-none focus:border-blue-500 dark:bg-zinc-900`}
			>
				<option value="general">General Topics</option>
				{#each data.enrolledCourses as course}
					<option value={course.id}>{course.title}</option>
				{/each}
			</select>
		</div>

		<Input label="Title" name="title" required placeholder="What's on your mind?" />

		<div class="space-y-2">
			<label for="content" class="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
				>Content</label
			>
			<textarea
				id="content"
				name="content"
				required
				rows="6"
				class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} bg-white p-3 text-sm outline-none focus:border-blue-500 dark:bg-zinc-900`}
				placeholder="Describe your question or insight in detail..."
			></textarea>
		</div>

		<div class="flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
			<Button variant="ghost" onclick={() => (showCreateModal = false)}>Cancel</Button>
			<Button type="submit" variant="primary">Create Thread</Button>
		</div>
	</form>
</Modal>
