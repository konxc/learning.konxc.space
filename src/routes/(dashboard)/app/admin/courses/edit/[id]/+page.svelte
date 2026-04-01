<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { toast } from '$lib/stores/toastStore';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { RADIUS, COLOR, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	const activeTab = $derived($page.url.searchParams.get('tab') || 'general');

	// Module Modals
	let showAddModule = $state(false);
	let showEditModule = $state(false);
	let selectedModule = $state<any>(null);

	// Lesson Modals
	let showAddLesson = $state(false);
	let selectedModuleIdForLesson = $state('');

	const TABS = [
		{ value: 'general', label: 'General Info', icon: 'settings' },
		{ value: 'curriculum', label: 'Curriculum', icon: 'book-open' }
	];

	function openEditModule(mod: any) {
		selectedModule = mod;
		showEditModule = true;
	}

	function openAddLesson(moduleId: string) {
		selectedModuleIdForLesson = moduleId;
		showAddLesson = true;
	}
</script>

<svelte:head>
	<title>Edit Course: {data.course.title} - Admin</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-5xl">
		<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<PageHeader title={data.course.title} />
				<p class="text-sm text-zinc-500">Edit course settings and curriculum modules</p>
			</div>
			<a href="/app/admin/courses">
				<Button variant="ghost">
					<Icon name="arrow-left" size={16} class="mr-2" /> Back to List
				</Button>
			</a>
		</div>

		<div class="mb-8">
			<Tabs tabs={TABS} />
		</div>

		{#if activeTab === 'general'}
			<PageSection>
				<form
					method="POST"
					action="?/updateCourse"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								toast.success('Course information updated');
							} else {
								toast.error('Failed to update course info');
							}
						};
					}}
					class={`${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} space-y-6 border p-8 shadow-sm`}
				>
					<div class="grid gap-6 md:grid-cols-2">
						<div class="space-y-6">
							<Input label="Course Title *" name="title" value={data.course.title} required />
							<div class="flex flex-col gap-2">
								<label
									for="description"
									class="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
									>Description *</label
								>
								<textarea
									id="description"
									name="description"
									required
									rows="6"
									class={`${RADIUS.input} ${COLOR.cardBorder} bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-zinc-900`}
									placeholder="Describe the course content...">{data.course.description}</textarea
								>
							</div>
						</div>

						<div class="space-y-6">
							<div class="grid grid-cols-2 gap-4">
								<Input
									label="Price (Rp) *"
									name="price"
									type="number"
									value={data.course.price}
									required
								/>
								<Input
									label="Duration (weeks)"
									name="duration"
									type="number"
									value={data.course.duration || ''}
								/>
							</div>

							<div class="space-y-2">
								<label for="status" class="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
									>Status *</label
								>
								<select
									id="status"
									name="status"
									value={data.course.status}
									class={`w-full ${RADIUS.input} ${COLOR.cardBorder} border bg-white p-3 text-sm outline-none focus:border-blue-500 dark:bg-zinc-900`}
								>
									<option value="draft">Draft</option>
									<option value="published">Published</option>
									<option value="archived">Archived</option>
								</select>
							</div>

							<Input
								label="Thumbnail URL"
								name="thumbnailUrl"
								value={data.course.thumbnailUrl || ''}
								placeholder="https://..."
							/>

							<div class="space-y-2">
								<label for="mentorId" class="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
									>Mentor</label
								>
								<select
									id="mentorId"
									name="mentorId"
									class={`w-full ${RADIUS.input} ${COLOR.cardBorder} border bg-white p-3 text-sm outline-none focus:border-blue-500 dark:bg-zinc-900`}
								>
									<option value="none">Set None</option>
									{#each data.users as user}
										<option value={user.id} selected={data.course.mentorId === user.id}>
											{user.fullName || user.username} ({user.role})
										</option>
									{/each}
								</select>
							</div>
						</div>
					</div>

					<div class="flex justify-end border-t border-zinc-100 pt-4 dark:border-zinc-800">
						<Button type="submit" variant="primary" class="px-10">Save Changes</Button>
					</div>
				</form>
			</PageSection>
		{:else if activeTab === 'curriculum'}
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<h3 class="text-xl font-bold tracking-tight uppercase italic">Modules & Lessons</h3>
					<Button variant="primary" onclick={() => (showAddModule = true)}>
						<Icon name="plus" size={16} class="mr-2" /> Add Module
					</Button>
				</div>

				<div class="space-y-4">
					{#if data.modules.length === 0}
						<div
							class={`${RADIUS.card} ${COLOR.card} border-2 border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800`}
						>
							<Icon name="book-open" size={48} class="mx-auto mb-4 text-zinc-300" />
							<p class="font-medium text-zinc-500">No modules created yet. Start by adding one!</p>
						</div>
					{:else}
						{#each data.modules as mod, i}
							<div
								class={`${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} overflow-hidden border shadow-sm`}
							>
								<!-- Module Header -->
								<div
									class="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
								>
									<div class="flex items-center gap-4">
										<div
											class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white"
										>
											{i + 1}
										</div>
										<div>
											<h4 class="text-lg font-bold tracking-tight uppercase italic">{mod.title}</h4>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<Button variant="ghost" size="sm" onclick={() => openEditModule(mod)}>
											<Icon name="edit-2" size={14} />
										</Button>
										<form method="POST" action="?/deleteModule" use:enhance>
											<input type="hidden" name="moduleId" value={mod.id} />
											<Button variant="danger" size="sm" type="submit">
												<Icon name="trash-2" size={14} />
											</Button>
										</form>
									</div>
								</div>

								<!-- Lessons List -->
								<div class="space-y-2 p-4">
									{#each mod.lessons as lesson, j}
										<div
											class="flex items-center justify-between rounded-xl border border-zinc-100 bg-white p-3 transition-colors hover:border-blue-500/50 dark:border-zinc-800 dark:bg-zinc-800/50"
										>
											<div class="flex items-center gap-3">
												<span class="text-xs font-bold text-zinc-400">{i + 1}.{j + 1}</span>
												<Icon name="file-text" size={18} class="text-blue-500" />
												<span class="text-sm font-medium">{lesson.title}</span>
											</div>
											<div class="flex items-center gap-2">
												<form method="POST" action="?/deleteLesson" use:enhance>
													<input type="hidden" name="lessonId" value={lesson.id} />
													<button type="submit" class="p-1 text-zinc-400 hover:text-red-500">
														<Icon name="x" size={14} />
													</button>
												</form>
											</div>
										</div>
									{/each}
									<button
										onclick={() => openAddLesson(mod.id)}
										class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-100 py-3 text-xs font-bold tracking-widest text-zinc-400 uppercase transition-all hover:border-blue-500 hover:text-blue-500 dark:border-zinc-800"
									>
										<Icon name="plus" size={14} /> Add Lesson
									</button>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	</div>
</PageWrapper>

<!-- Add Module Modal -->
<Modal isOpen={showAddModule} title="Add New Module" onClose={() => (showAddModule = false)}>
	<form
		method="POST"
		action="?/addModule"
		use:enhance={() => {
			showAddModule = false;
			return async ({ update }) => await update();
		}}
		class="space-y-4"
	>
		<Input label="Module Title" name="title" required placeholder="e.g. Fundamental Concepts" />
		<Input label="Order" name="order" type="number" value={data.modules.length + 1} />
		<div class="flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
			<Button variant="ghost" onclick={() => (showAddModule = false)}>Cancel</Button>
			<Button type="submit" variant="primary">Create Module</Button>
		</div>
	</form>
</Modal>

<!-- Edit Module Modal -->
<Modal isOpen={showEditModule} title="Edit Module" onClose={() => (showEditModule = false)}>
	{#if selectedModule}
		<form
			method="POST"
			action="?/updateModule"
			use:enhance={() => {
				showEditModule = false;
				return async ({ update }) => await update();
			}}
			class="space-y-4"
		>
			<input type="hidden" name="moduleId" value={selectedModule.id} />
			<Input label="Module Title" name="title" value={selectedModule.title} required />
			<div class="flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
				<Button variant="ghost" onclick={() => (showEditModule = false)}>Cancel</Button>
				<Button type="submit" variant="primary">Update Module</Button>
			</div>
		</form>
	{/if}
</Modal>

<!-- Add Lesson Modal -->
<Modal isOpen={showAddLesson} title="Add New Lesson" onClose={() => (showAddLesson = false)}>
	<form
		method="POST"
		action="?/addLesson"
		use:enhance={() => {
			showAddLesson = false;
			return async ({ update }) => await update();
		}}
		class="space-y-4"
	>
		<input type="hidden" name="moduleId" value={selectedModuleIdForLesson} />
		<Input label="Lesson Title" name="title" required placeholder="e.g. Introduction to Physics" />
		<Input label="Order" name="order" type="number" value={1} />
		<div class="flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
			<Button variant="ghost" onclick={() => (showAddLesson = false)}>Cancel</Button>
			<Button type="submit" variant="primary">Create Lesson</Button>
		</div>
	</form>
</Modal>
