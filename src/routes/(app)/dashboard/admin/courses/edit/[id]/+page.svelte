<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data, form }: { data: PageData; form: any } = $props();
</script>

<svelte:head>
	<title>Edit Course - Admin</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-3xl">
		<div class="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<PageHeader title="Edit Course" />
			<a
				href="/dashboard/admin/courses"
				class={`inline-flex items-center ${RADIUS.button} ${COLOR.neutral} px-5 py-2.5 ${TEXT.button} ${COLOR.textPrimary} font-medium ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-1`}
			>
				← Back to Courses
			</a>
		</div>

		{#if form?.error}
			<PageSection>
				<div class={`${RADIUS.button} ${SPACING.cardPadding} ${COLOR.error} ${ELEVATION.base}`} role="alert">
					{form.error}
				</div>
			</PageSection>
		{/if}

		<PageSection>
			<form method="POST" class="flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<label for="title" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Course Title *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						required
						value={data.course.title}
						placeholder="Enter course title"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="description" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Description *
					</label>
					<textarea
						id="description"
						name="description"
						required
						rows="5"
						placeholder="Enter course description"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-y min-h-[100px] focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					>{data.course.description}</textarea>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="flex flex-col gap-2">
						<label for="price" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							Price (Rp) *
						</label>
						<input
							type="number"
							id="price"
							name="price"
							required
							min="0"
							value={data.course.price}
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label for="duration" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
							Duration (weeks)
						</label>
						<input
							type="number"
							id="duration"
							name="duration"
							min="1"
							value={data.course.duration || ''}
							placeholder="Optional"
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<label for="status" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Status *
					</label>
					<select
						id="status"
						name="status"
						value={data.course.status}
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
						<option value="archived">Archived</option>
					</select>
				</div>

				<div class="flex flex-col gap-2">
					<label for="thumbnailUrl" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Thumbnail URL
					</label>
					<input
						type="url"
						id="thumbnailUrl"
						name="thumbnailUrl"
						value={data.course.thumbnailUrl || ''}
						placeholder="https://example.com/image.jpg"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="mentorId" class={`${TEXT.button} ${COLOR.textPrimary} font-semibold text-sm`}>
						Assign Mentor
					</label>
					<select
						id="mentorId"
						name="mentorId"
						class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
					>
						<option value="none">None</option>
						{#each data.users as user}
							<option value={user.id} selected={data.course.mentorId === user.id}>
								{user.username} ({user.role})
							</option>
						{/each}
					</select>
				</div>

				<div class="flex items-center gap-3 pt-2">
					<button
						type="submit"
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} px-8 py-3.5 ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:-translate-y-0.5 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						Update Course
					</button>
					<a
						href="/dashboard/admin/courses"
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} px-8 py-3.5 ${TEXT.button} font-semibold ${COLOR.card} ${COLOR.textPrimary} ${TRANSITION.all} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						Cancel
					</a>
				</div>
			</form>
		</PageSection>
	</div>
</PageWrapper>

